import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Send, KeyRound, CheckCircle2, ShieldCheck, Mail, Smartphone, Loader2 } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';
import { DESIGN_TOKENS } from '../../theme/designSystem';
import { EASE, DURATION } from '../../lib/animations';
import {
  IS_MOCK_VERIFICATION,
  OTP_LENGTH,
  verificationProvider,
  type InquiryDraft,
  type VerificationChannel,
  type VerificationSession,
} from '../../lib/verification';

/** Steps in the inquiry workflow. Order is enforced by the state machine below. */
type Step = 'FORM' | 'OTP_VERIFY' | 'SUCCESS';

/** Field-level validation messages, keyed by field name. */
type FieldErrors = Partial<Record<'fullName' | 'email' | 'phone', string>>;

/** Matches `local@domain.tld`. Deliberately permissive — the OTP is the real check. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Accepts 10–15 digits with optional `+` and separators. */
const PHONE_PATTERN = /^\+?[\d\s-]{10,17}$/;

/** Shared input styling. */
const INPUT_CLASS =
  'w-full rounded-xl border bg-white/80 px-4 py-3.5 text-sm text-stone-900 outline-none transition-all ' +
  'placeholder:text-stone-400 focus:ring-2 focus:ring-amber-500 dark:bg-stone-950/80 dark:text-stone-100';

/**
 * Validates the draft for the chosen channel.
 *
 * @param draft The captured inquiry.
 * @param channel Where the code will be sent — determines whether phone is required.
 * @returns Field errors; empty when the draft is valid.
 */
function validate(draft: InquiryDraft, channel: VerificationChannel): FieldErrors {
  const errors: FieldErrors = {};

  if (draft.fullName.trim().length < 2) errors.fullName = 'Please tell us your name.';
  if (!EMAIL_PATTERN.test(draft.email.trim())) errors.email = 'That email address looks incomplete.';
  if (channel === 'phone' && !PHONE_PATTERN.test((draft.phone ?? '').trim())) {
    errors.phone = 'Enter a mobile number including country code.';
  }

  return errors;
}

/**
 * ContactFormWorkflow is the bespoke concierge inquiry: capture → verify → save.
 *
 * Nothing is persisted until a one-time code is confirmed — the ordering is
 * enforced inside {@link verificationProvider}, which owns both the code check
 * and the write, so no caller can accidentally save an unverified inquiry. The
 * visitor chooses email or SMS delivery, and both paths run through the same
 * provider contract.
 *
 * When arriving from a "Commission this" CTA, the originating collection or
 * variety is read from router state and travels with the inquiry, so the studio
 * sees what prompted it.
 */
export const ContactFormWorkflow: React.FC = () => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const successIconRef = useRef<HTMLDivElement>(null);

  /**
   * Prefilled subject from the referring page. `categoryTitle` is the key the
   * showcase CTAs push; anything else is ignored rather than trusted.
   */
  const referringSubject =
    typeof (location.state as { categoryTitle?: unknown } | null)?.categoryTitle === 'string'
      ? (location.state as { categoryTitle: string }).categoryTitle
      : undefined;

  const [step, setStep] = useState<Step>('FORM');
  const [channel, setChannel] = useState<VerificationChannel>('email');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const [session, setSession] = useState<VerificationSession | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const draft: InquiryDraft = {
    fullName,
    email,
    phone: phone || undefined,
    message,
    subject: referringSubject,
  };

  // Animate each step in as it mounts, so advancing feels like one continuous
  // card rather than three screens swapping.
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      gsap.fromTo(
        '.step-field',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: DURATION.base, stagger: 0.07, ease: EASE.enter }
      );
    },
    { scope: cardRef, dependencies: [step, prefersReducedMotion] }
  );

  // Success moment: the seal scales in with an overshoot, then a ring expands out
  // of it like light spreading. The one flourish on the page, so it lands.
  useGSAP(
    () => {
      if (step !== 'SUCCESS' || prefersReducedMotion || !successIconRef.current) return;

      const tl = gsap.timeline();

      tl.fromTo(
        successIconRef.current,
        { scale: 0.4, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.8)' }
      ).fromTo(
        '.success-ring',
        { scale: 0.6, opacity: 0.7 },
        { scale: 2.1, opacity: 0, duration: 1.1, ease: 'power2.out' },
        0.15
      );
    },
    { scope: cardRef, dependencies: [step, prefersReducedMotion] }
  );

  /** Step 1 → 2: validate locally, then ask the provider for a code. */
  const handleRequestCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    const errors = validate(draft, channel);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSending(true);
    try {
      setSession(await verificationProvider.requestCode(draft, channel));
      setOtpCode('');
      setStep('OTP_VERIFY');
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'We could not send a code just now. Please retry.'
      );
    } finally {
      setIsSending(false);
    }
  };

  /** Step 2 → 3: confirm the code. The provider persists only on success. */
  const handleConfirm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session) return;

    setFormError('');
    setIsVerifying(true);
    try {
      const result = await verificationProvider.confirmAndPersist(session, otpCode, draft);
      if (result.ok) {
        setStep('SUCCESS');
      } else {
        setFormError(result.error);
      }
    } catch {
      setFormError('Verification failed unexpectedly. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  /** Resets everything for a second inquiry. */
  const handleReset = () => {
    setStep('FORM');
    setFullName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setOtpCode('');
    setSession(null);
    setFieldErrors({});
    setFormError('');
  };

  /** Renders a labelled input with its inline validation message. */
  const renderField = (
    id: keyof FieldErrors,
    label: string,
    node: React.ReactNode,
    hint?: string
  ) => (
    <div className="step-field space-y-2">
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400"
      >
        {label}
      </label>
      {node}
      {fieldErrors[id] ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600 dark:text-red-400">
          {fieldErrors[id]}
        </p>
      ) : (
        hint && <p className="text-xs font-light text-stone-500 dark:text-stone-500">{hint}</p>
      )}
    </div>
  );

  /** Border colour reflects validity, so errors read without hunting for text. */
  const borderFor = (id: keyof FieldErrors) =>
    fieldErrors[id]
      ? 'border-red-400 dark:border-red-500/70'
      : 'border-stone-300 dark:border-stone-800';

  return (
    <div ref={cardRef} className={cn('mx-auto max-w-xl rounded-3xl p-8 sm:p-12', DESIGN_TOKENS.glass.card)}>
      {step === 'FORM' && (
        <form onSubmit={handleRequestCode} noValidate className="space-y-6">
          <div className="step-field space-y-2">
            <span className={DESIGN_TOKENS.typography.eyebrow}>Bespoke Concierge</span>
            <h1 className={cn(DESIGN_TOKENS.typography.sectionTitle, 'text-stone-900 dark:text-stone-100')}>
              Custom Order Inquiry
            </h1>
            {referringSubject && (
              <p className="pt-1 text-sm font-light text-stone-600 dark:text-stone-400">
                About <span className="font-medium text-amber-600 dark:text-amber-400">{referringSubject}</span>
              </p>
            )}
          </div>

          {renderField(
            'fullName',
            'Full Name *',
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              aria-invalid={Boolean(fieldErrors.fullName)}
              aria-describedby={fieldErrors.fullName ? 'fullName-error' : undefined}
              placeholder="e.g. Eleanor Vance"
              className={cn(INPUT_CLASS, borderFor('fullName'))}
            />
          )}

          {renderField(
            'email',
            'Email Address *',
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              placeholder="eleanor@example.com"
              className={cn(INPUT_CLASS, borderFor('email'))}
            />
          )}

          {/* Delivery channel. Both routes run through the same provider. */}
          <fieldset className="step-field space-y-2">
            <legend className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
              Send my verification code by
            </legend>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { value: 'email', label: 'Email', icon: Mail },
                  { value: 'phone', label: 'SMS', icon: Smartphone },
                ] as const
              ).map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setChannel(value);
                    setFieldErrors({});
                  }}
                  aria-pressed={channel === value}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-xl border py-3.5 transition-colors',
                    DESIGN_TOKENS.typography.button,
                    channel === value
                      ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'border-stone-300 text-stone-600 hover:border-amber-500/50 dark:border-stone-800 dark:text-stone-400'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          {channel === 'phone' &&
            renderField(
              'phone',
              'Mobile Number *',
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-invalid={Boolean(fieldErrors.phone)}
                aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                placeholder="+91 98765 43210"
                className={cn(INPUT_CLASS, borderFor('phone'))}
              />,
              'Include your country code.'
            )}

          <div className="step-field space-y-2">
            <label
              htmlFor="message"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400"
            >
              Custom Label or Scents Request
            </label>
            <textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your event theme, custom names, or fragrance notes..."
              className={cn(INPUT_CLASS, 'resize-none border-stone-300 dark:border-stone-800')}
            />
          </div>

          {formError && (
            <p role="alert" className="text-xs text-red-600 dark:text-red-400">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSending}
            className={cn(
              'step-field flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-4 text-stone-950 shadow-lg transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60',
              DESIGN_TOKENS.typography.button
            )}
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending code…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Request verification code
              </>
            )}
          </button>
        </form>
      )}

      {step === 'OTP_VERIFY' && (
        <form onSubmit={handleConfirm} className="space-y-6 py-4 text-center">
          <div className="step-field inline-flex rounded-full bg-amber-500/10 p-3 text-amber-500">
            <ShieldCheck className="h-8 w-8" />
          </div>

          <div className="step-field space-y-2">
            <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
              Confirm it&apos;s you
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              We sent a {OTP_LENGTH}-digit code to{' '}
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                {session?.maskedDestination}
              </span>
              .
            </p>
            {IS_MOCK_VERIFICATION && (
              <p className="text-xs font-light text-stone-500 dark:text-stone-500">
                Verification is not live yet — enter <span className="font-mono">123456</span> to
                continue.
              </p>
            )}
          </div>

          <div className="step-field mx-auto max-w-xs">
            <label htmlFor="otp" className="sr-only">
              Verification code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={OTP_LENGTH}
              required
              value={otpCode}
              // Digits only, so a pasted "123 456" doesn't silently fail.
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full rounded-xl border border-stone-300 bg-white/80 py-3.5 text-center font-mono text-2xl tracking-[0.5em] text-stone-900 outline-none focus:ring-2 focus:ring-amber-500 dark:border-stone-800 dark:bg-stone-950/80 dark:text-stone-100"
            />
          </div>

          {formError && (
            <p role="alert" className="text-xs text-red-600 dark:text-red-400">
              {formError}
            </p>
          )}

          <div className="step-field flex gap-3">
            <button
              type="button"
              onClick={() => {
                setStep('FORM');
                setFormError('');
              }}
              className={cn(
                'w-1/2 rounded-xl border border-stone-300 py-3.5 text-stone-700 transition-colors hover:border-amber-500 dark:border-stone-800 dark:text-stone-300',
                DESIGN_TOKENS.typography.button
              )}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isVerifying || otpCode.length < OTP_LENGTH}
              className={cn(
                'flex w-1/2 items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-stone-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60',
                DESIGN_TOKENS.typography.button
              )}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" /> Verify &amp; send
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {step === 'SUCCESS' && (
        <div className="space-y-5 py-8 text-center">
          <div className="relative inline-flex">
            {/* Expanding ring — pure decoration, hence aria-hidden. */}
            <span
              aria-hidden="true"
              className="success-ring absolute inset-0 rounded-full border-2 border-amber-500"
            />
            <div ref={successIconRef} className="rounded-full bg-amber-500/10 p-4 text-amber-500">
              <CheckCircle2 className="h-12 w-12" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            Verified &amp; sent
          </h1>

          <p className="mx-auto max-w-sm text-sm leading-relaxed text-stone-600 dark:text-stone-400">
            Thank you, <span className="font-semibold">{fullName}</span>. Your inquiry is with the
            studio and someone will reply within two working days.
          </p>

          <button
            type="button"
            onClick={handleReset}
            className={cn(
              'mt-4 rounded-full bg-amber-500 px-6 py-3 text-stone-950 transition-colors hover:bg-amber-400',
              DESIGN_TOKENS.typography.button
            )}
          >
            Submit another request
          </button>
        </div>
      )}
    </div>
  );
};
