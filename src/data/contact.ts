/**
 * The brand's direct enquiry channels, in one place because they appear in at
 * least two (`AboutStory`'s enquiry panel and `Footer`'s social row) and a
 * number that is right in one and stale in the other is worse than no number.
 *
 * There is no storefront and no checkout — every candle is poured against a
 * specific order — so these links *are* the sales floor. A dead one is a lost
 * enquiry, which is why `assertContactConfigured()` runs below.
 */

/** A social or messaging destination with the handle rendered in copy. */
export interface ContactChannel {
  /** Platform name, used for `aria-label` and `title`. */
  label: string;
  /** What a reader sees, e.g. `@lumoraflames`. */
  handle: string;
  /** Absolute URL. Opened in a new tab by every caller. */
  url: string;
}

/**
 * Instagram profile.
 *
 * Replace `handle` and the tail of `url` together — they are separate fields
 * because the handle is displayed as copy while the URL is followed, and
 * deriving one from the other would break the day the profile moves.
 */
export const INSTAGRAM: ContactChannel = {
  label: 'Instagram',
  handle: '@lumora_flames',
  url: 'https://instagram.com/lumora_flames',
};

/**
 * WhatsApp Business line.
 *
 * `number` must be the full international number as **digits only** — no `+`,
 * no spaces, no dashes, country code first. `wa.me` does not reject a malformed
 * number with an error; it opens WhatsApp on an empty "invalid number" state,
 * so a typo here looks like a working button.
 *
 * `display` is only for showing on screen and may be formatted however reads
 * best. It is currently unused — the enquiry panel links to WhatsApp without
 * printing the number, which keeps it off the page for scrapers. Print it if
 * you would rather people could copy it.
 */
export const WHATSAPP = {
  label: 'WhatsApp',
  /** Digits only, country code first. */
  number: '919873301173',
  /** Human-readable form. Not currently rendered. */
  display: '+91 98733 01173',
  /**
   * Seeded into the chat so the reader is not staring at an empty compose box.
   * Kept short and first-person: the point is to remove the "what do I even
   * say" pause, not to write their enquiry for them.
   */
  prefilledMessage: "Hi Lumora Flames! I'd like to enquire about a custom candle order.",
} as const;

/**
 * Builds the WhatsApp deep link, with the greeting pre-typed.
 *
 * `wa.me` resolves to the app on mobile and WhatsApp Web on desktop, so one
 * href covers both — no user-agent sniffing.
 *
 * @param message Overrides the default greeting, e.g. to name a collection the
 *   reader was looking at.
 * @returns A `https://wa.me/…` URL safe to use as an `href`.
 *
 * @example
 * <a href={whatsappLink()} target="_blank" rel="noreferrer">Message us</a>
 */
export const whatsappLink = (message: string = WHATSAPP.prefilledMessage): string =>
  `https://wa.me/${WHATSAPP.number}?text=${encodeURIComponent(message)}`;

/**
 * Warns in dev while the placeholders above are still in place.
 *
 * Deliberately a warning and not a throw: an unfilled handle is a business
 * problem, not a broken build, and throwing would take the whole site down over
 * copy. It runs at import time so it fires once, not per render, and it is
 * stripped from production bundles along with the `import.meta.env.DEV` branch.
 *
 * The reason it exists at all is that both placeholders *look* functional —
 * `instagram.com/lumoraflames` loads a page and `wa.me` opens WhatsApp — so
 * nothing about clicking them says "not configured yet".
 */
const assertContactConfigured = (): void => {
  if (!import.meta.env.DEV) return;

  if (WHATSAPP.number.includes('0000')) {
    console.warn(
      '[contact] WHATSAPP.number is still the placeholder. Set the real number in src/data/contact.ts — digits only, country code first, no + or spaces.'
    );
  }
  if (!/^\d{8,15}$/.test(WHATSAPP.number)) {
    console.warn(
      `[contact] WHATSAPP.number ("${WHATSAPP.number}") is not 8–15 digits. wa.me will open an "invalid number" screen rather than fail visibly.`
    );
  }
};

assertContactConfigured();
