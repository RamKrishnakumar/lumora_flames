/**
 * Verification and inquiry-persistence seam.
 *
 * The brief requires that an inquiry is **never** written until a one-time code
 * has been verified, and that either phone or email OTP can be plugged in later
 * without reworking the form. Both requirements are met by keeping the contract
 * here and the implementation swappable: the form talks to
 * {@link VerificationProvider} and knows nothing about Firebase or Supabase.
 *
 * The active implementation is {@link mockVerificationProvider} — no code is
 * sent and nothing is persisted. Replace it with a real provider (see the
 * bottom of this file) without touching `ContactFormWorkflow`.
 */

/** Which credential the one-time code is delivered to. */
export type VerificationChannel = 'email' | 'phone';

/** The inquiry as captured by the form, before verification. */
export interface InquiryDraft {
  fullName: string;
  email: string;
  /** E.164 phone number. Required when verifying over `phone`. */
  phone?: string;
  /** Free-text brief: event theme, custom names, fragrance notes. */
  message: string;
  /**
   * Collection or variety the visitor arrived from, when they came via a
   * "Commission this" CTA. Gives the studio context before replying.
   */
  subject?: string;
}

/** Opaque handle tying a verification attempt to its later confirmation. */
export interface VerificationSession {
  /** Provider-issued id, e.g. a Firebase `confirmationResult` key. */
  id: string;
  /** Channel the code was sent over. */
  channel: VerificationChannel;
  /** The masked destination, safe to show in the UI, e.g. `j••@example.com`. */
  maskedDestination: string;
}

/** Result of a verify-and-persist attempt. */
export type VerificationResult =
  | { ok: true; /** Provider id of the stored inquiry. */ inquiryId: string }
  | { ok: false; /** Message safe to render to the visitor. */ error: string };

/**
 * Contract every verification backend must satisfy.
 *
 * Implementations must guarantee the ordering the brief requires: `confirm`
 * persists only after the code validates, and a failed code writes nothing.
 */
export interface VerificationProvider {
  /**
   * Sends a one-time code and opens a session.
   * @throws If the destination is unusable or the provider rejects the send.
   */
  requestCode(draft: InquiryDraft, channel: VerificationChannel): Promise<VerificationSession>;

  /**
   * Validates `code` and, only on success, persists the inquiry.
   * Returns a failure result for a wrong code rather than throwing, since that
   * is an expected outcome the form renders inline.
   */
  confirmAndPersist(
    session: VerificationSession,
    code: string,
    draft: InquiryDraft
  ): Promise<VerificationResult>;
}

/** Length of the codes this app issues and validates. */
export const OTP_LENGTH = 6;

/**
 * Masks a destination for display, keeping just enough to be recognisable.
 *
 * @param value Raw email address or phone number.
 * @returns e.g. `el••••@example.com` or `•••••• 8891`.
 */
export function maskDestination(value: string): string {
  if (value.includes('@')) {
    const [local, domain] = value.split('@');
    const head = local.slice(0, 2);
    return `${head}${'•'.repeat(Math.max(local.length - 2, 2))}@${domain}`;
  }

  const tail = value.slice(-4);
  return `${'•'.repeat(Math.max(value.length - 4, 3))} ${tail}`;
}

/** Code the mock provider accepts. Development convenience only. */
const MOCK_CODE = '123456';

/** Simulated network latency, so loading states are actually exercised. */
const MOCK_LATENCY_MS = 700;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Development stand-in for a real verification backend.
 *
 * Accepts {@link MOCK_CODE}, resolves after a short delay, and **persists
 * nothing** — there is no database yet. Swap it out at {@link verificationProvider}.
 */
export const mockVerificationProvider: VerificationProvider = {
  async requestCode(draft, channel) {
    const destination = channel === 'phone' ? draft.phone ?? '' : draft.email;
    if (!destination) {
      throw new Error(
        channel === 'phone'
          ? 'A mobile number is required to receive a code.'
          : 'An email address is required to receive a code.'
      );
    }

    await wait(MOCK_LATENCY_MS);

    return {
      // Deterministic and dependency-free; a real provider returns its own id.
      id: `mock-${channel}-${destination.length}`,
      channel,
      maskedDestination: maskDestination(destination),
    };
  },

  async confirmAndPersist(_session, code) {
    await wait(MOCK_LATENCY_MS);

    if (code.trim() !== MOCK_CODE) {
      return { ok: false, error: 'That code was not correct. Check the message and try again.' };
    }

    // A real provider inserts here — and only here, after the code validates.
    return { ok: true, inquiryId: 'mock-inquiry' };
  },
};

/**
 * The provider the app uses. Swapping this single binding switches the whole
 * app over to a real backend.
 *
 * TODO: replace with a Supabase or Firebase implementation. Sketch:
 *
 * ```ts
 * export const verificationProvider: VerificationProvider = {
 *   async requestCode(draft, channel) {
 *     const { error } = await supabase.auth.signInWithOtp(
 *       channel === 'phone' ? { phone: draft.phone! } : { email: draft.email }
 *     );
 *     if (error) throw new Error(error.message);
 *     const destination = channel === 'phone' ? draft.phone! : draft.email;
 *     return { id: destination, channel, maskedDestination: maskDestination(destination) };
 *   },
 *   async confirmAndPersist(session, code, draft) {
 *     const { error } = await supabase.auth.verifyOtp({
 *       type: session.channel === 'phone' ? 'sms' : 'email',
 *       token: code,
 *       ...(session.channel === 'phone' ? { phone: session.id } : { email: session.id }),
 *     });
 *     if (error) return { ok: false, error: 'That code was not correct.' };
 *
 *     // Reached only after verification succeeds.
 *     const { data, error: insertError } = await supabase
 *       .from('inquiries')
 *       .insert({ full_name: draft.fullName, email: draft.email, phone: draft.phone,
 *                 message: draft.message, subject: draft.subject })
 *       .select('id')
 *       .single();
 *     if (insertError) return { ok: false, error: 'We could not save your inquiry.' };
 *     return { ok: true, inquiryId: data.id };
 *   },
 * };
 * ```
 */
export const verificationProvider: VerificationProvider = mockVerificationProvider;

/** True when the mock is active, so the UI can show the dev-code hint. */
export const IS_MOCK_VERIFICATION = verificationProvider === mockVerificationProvider;
