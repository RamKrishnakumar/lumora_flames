import React, { useState } from 'react';
import { Send, KeyRound, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DESIGN_TOKENS } from '../../theme/designSystem';

type Step = 'FORM' | 'OTP_VERIFY' | 'SUCCESS';

export const ContactFormWorkflow: React.FC = () => {
  const [step, setStep] = useState<Step>('FORM');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  /**
   * Step 1: Submit Form & Trigger OTP Code Generation
   */
  const handleInitiateOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) return;
    setErrorMsg('');
    // Mock OTP trigger (Plug Firebase Auth / Supabase Auth here)
    setStep('OTP_VERIFY');
  };

  /**
   * Step 2: Verify OTP Code and Insert Entry into DB
   */
  const handleVerifyAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setErrorMsg('');

    try {
      // Mock validation rule: standard test OTP is '123456'
      if (otpCode.trim() !== '123456') {
        throw new Error('Invalid verification code. Please check your inbox and try again.');
      }

      // TODO: Replace with real Supabase / Firebase DB call:
      // await supabase.from('inquiries').insert({ full_name: fullName, email, message });

      setStep('SUCCESS');
    } catch (err) {
      setErrorMsg(err.message || 'Verification failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className={`max-w-xl mx-auto p-8 sm:p-12 rounded-3xl ${DESIGN_TOKENS.glass.card}`}>
      {step === 'FORM' && (
        <form onSubmit={handleInitiateOTP} className="space-y-6">
          <div className="space-y-2">
            <span className={DESIGN_TOKENS.typography.eyebrow}>Bespoke Concierge</span>
            <h2 className={DESIGN_TOKENS.typography.sectionTitle}>Custom Order Inquiry</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-stone-950/80 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 text-sm outline-none transition-all"
              placeholder="e.g. Eleanor Vance"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-stone-950/80 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 text-sm outline-none transition-all"
              placeholder="eleanor@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2">
              Custom Label or Scents Request
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-stone-950/80 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 text-sm outline-none transition-all resize-none"
              placeholder="Tell us about your event theme, custom names, or fragrance notes..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Send className="w-4 h-4" /> Request Security Verification Code
          </button>
        </form>
      )}

      {step === 'OTP_VERIFY' && (
        <form onSubmit={handleVerifyAndSave} className="space-y-6 text-center py-4">
          <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-500">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
              Verify Email Security OTP
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              We sent a 6-digit passcode to <span className="font-semibold text-amber-500">{email}</span>. Enter code <span className="font-mono underline">123456</span> to authorize.
            </p>
          </div>

          <div className="max-w-xs mx-auto">
            <input
              type="text"
              maxLength={6}
              required
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full text-center text-2xl tracking-[0.5em] font-mono py-3 rounded-xl bg-white/80 dark:bg-stone-950/80 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="000000"
            />
          </div>

          {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep('FORM')}
              className="w-1/2 py-3 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold uppercase tracking-wider"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="w-1/2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" /> {isVerifying ? 'Verifying...' : 'Authorize & Save'}
            </button>
          </div>
        </form>
      )}

      {step === 'SUCCESS' && (
        <div className="text-center py-8 space-y-4">
          <div className="inline-flex p-4 rounded-full bg-amber-500/10 text-amber-500">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            Verified & Submitted
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
            Thank you, <span className="font-semibold">{fullName}</span>. Your security verification succeeded and your bespoke inquiry has been logged.
          </p>
          <button
            onClick={() => setStep('FORM')}
            className="mt-4 px-6 py-2.5 rounded-full bg-amber-500 text-stone-950 font-semibold text-xs uppercase tracking-wider"
          >
            Submit Another Request
          </button>
        </div>
      )}
    </div>
  );
};