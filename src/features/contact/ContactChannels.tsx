import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import {
  ArrowUpRight,
  CalendarDays,
  Camera,
  Clock,
  Hourglass,
  MapPin,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

import {
  BRIEF_PROMPTS,
  INSTAGRAM,
  PLACEHOLDER,
  STUDIO,
  buildBriefMessage,
  whatsappLink,
} from '../../data/contact';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';
import { DESIGN_TOKENS } from '../../theme/designSystem';
import { revealUp, settleInstantly } from '../../lib/animations';

/**
 * Router state set by `SubCategoryShowcase`'s "Commission this" CTA, via
 * `navigate('/contact', { state: { categoryTitle } })`.
 *
 * Optional because `/contact` is also reachable from the navbar with no context.
 * Read defensively — router state is `unknown` at the type level and survives a
 * back-navigation, but is `null` on a fresh page load.
 */
interface ContactRouteState {
  categoryTitle?: string;
}

/**
 * Focus ring shared by both channel cards.
 *
 * Extracted because the ring *offset* colour has to be restated per theme, and
 * getting it wrong on one card is invisible until somebody tabs to it.
 */
const FOCUS_RING = cn(
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
  'focus-visible:ring-offset-4 focus-visible:ring-offset-stone-50 dark:focus-visible:ring-offset-stone-950'
);

/**
 * Studio facts paired with an icon, in reading order.
 *
 * Module-level because `STUDIO` is a frozen constant — rebuilding this array per
 * render would allocate for nothing. lucide v1 ships no brand icons, so these
 * are all generic glyphs; they are decorative here because every row has a
 * visible `<dt>`, hence `aria-hidden` at the call site.
 */
const STUDIO_ROWS = [
  { icon: Clock, label: 'Replies', value: STUDIO.replyWindow },
  { icon: CalendarDays, label: 'Hours', value: STUDIO.hours },
  { icon: MapPin, label: 'Based in', value: STUDIO.city },
  { icon: Hourglass, label: 'Bespoke lead time', value: STUDIO.leadTime },
] as const;

/**
 * The `/contact` page: direct messaging channels, the brief worth preparing, and
 * the studio's operating facts.
 *
 * Replaces the three-step OTP inquiry wizard. There is no form and no backend —
 * the conversion path is a deep link that opens WhatsApp with the brief already
 * typed, so the studio receives a usable enquiry without a server, a database,
 * or a verification step standing between the reader and the message.
 */
export const ContactChannels: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // `state` is typed loosely by react-router; narrow it once, here.
  const { state } = useLocation() as { state: ContactRouteState | null };
  const subject = state?.categoryTitle;

  const briefMessage = buildBriefMessage(subject);

  // Drop rows the brand has not filled in yet, rather than printing the
  // sentinel. If every row is unfilled the whole panel is omitted below.
  const studioRows = STUDIO_ROWS.filter((row) => row.value !== PLACEHOLDER);

  useGSAP(
    () => {
      // Selector strings resolve inside `scope`, so `.contact-reveal` cannot
      // reach another component's elements.
      if (prefersReducedMotion) {
        // clearProps, not a zero-duration tween: leaves no inline transform
        // behind, so nothing is stranded mid-tween or invisible.
        settleInstantly('.contact-reveal');
        return;
      }

      revealUp('.contact-reveal', { y: 24 });
    },
    { scope: rootRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <div ref={rootRef} className="mx-auto w-full max-w-4xl space-y-14 sm:space-y-20">
      <header className="contact-reveal space-y-4">
        <span className={cn(DESIGN_TOKENS.typography.eyebrow, 'inline-flex items-center gap-2')}>
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Made to order
        </span>

        {/*
          The heading names the collection when the reader arrived from a
          "Commission this" CTA. Without it, every commission click lands on the
          same generic page and the reader has to restate what they were looking
          at — which is exactly the context the CTA already knew.
        */}
        <h1
          className={cn(DESIGN_TOKENS.typography.sectionTitle, 'text-stone-900 dark:text-stone-100')}
        >
          {subject ? `Let's talk about ${subject}` : 'Commission a candle'}
        </h1>

        <p
          className={cn(
            DESIGN_TOKENS.typography.body,
            'max-w-2xl text-stone-600 dark:text-stone-400'
          )}
        >
          Nothing here sits on a shelf — every piece is poured after you ask for it, so the vessel,
          the scent and the size are all still open. Send us a message and we&apos;ll shape it with
          you.
        </p>
      </header>

      {/*
        Two channels, ranked. WhatsApp leads because it lands instantly and the
        brief travels with it; Instagram answers "what does this actually look
        like poured" better than any copy on this page can.

        Both are real `<a>` elements rather than buttons with click handlers —
        they leave the site, so middle-click, long-press and "copy link address"
        all have to work, and only an anchor gives that for free.
      */}
      <div className="contact-reveal grid gap-4 sm:grid-cols-2">
        <a
          href={whatsappLink(briefMessage)}
          target="_blank"
          rel="noreferrer"
          className={cn(
            'group flex flex-col gap-8 rounded-3xl bg-amber-500 p-7 text-stone-950 shadow-lg',
            'transition-colors hover:bg-amber-400',
            FOCUS_RING
          )}
        >
          {/*
            No `dark:` counterparts on this card on purpose: amber-500 is a fixed
            brand surface in both themes, so stone-950 text stays correct. The
            outlined card below *does* invert, and does declare them.
          */}
          <span className="inline-flex items-center gap-2.5">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            <span className={DESIGN_TOKENS.typography.button}>WhatsApp</span>
          </span>

          <span className="flex-1 space-y-1.5">
            <span className="block text-xl font-light tracking-tight">Message the studio</span>
            <span className="block text-xs font-light leading-relaxed text-stone-950/70">
              Fastest reply, and the brief arrives pre-typed.
            </span>
          </span>

          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </a>

        <a
          href={INSTAGRAM.url}
          target="_blank"
          rel="noreferrer"
          className={cn(
            'group flex flex-col gap-8 rounded-3xl border p-7 transition-colors',
            'border-stone-300 text-stone-800 hover:border-amber-500 hover:text-amber-600',
            'dark:border-stone-700 dark:text-stone-200 dark:hover:border-amber-400 dark:hover:text-amber-400',
            FOCUS_RING
          )}
        >
          <span className="inline-flex items-center gap-2.5">
            <Camera className="h-5 w-5" aria-hidden="true" />
            <span className={DESIGN_TOKENS.typography.button}>Instagram</span>
          </span>

          <span className="flex-1 space-y-1.5">
            <span className="block text-xl font-light tracking-tight">{INSTAGRAM.handle}</span>
            <span className="block text-xs font-light leading-relaxed text-stone-500 dark:text-stone-400">
              Work in progress, and what a blend looks like poured.
            </span>
          </span>

          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </a>
      </div>

      {/*
        What the pre-typed message asks for, stated plainly. This is the whole
        replacement for the retired form's fields: the reader sees the three
        things worth having ready before opening the chat, which recovers most of
        what the form bought us at none of its cost.
      */}
      <section aria-labelledby="brief-heading" className="contact-reveal space-y-5">
        <h2
          id="brief-heading"
          className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-500"
        >
          Worth having ready
        </h2>

        <ul className="grid gap-3 sm:grid-cols-3">
          {BRIEF_PROMPTS.map((prompt) => (
            <li
              key={prompt}
              className="rounded-2xl border border-stone-200 px-5 py-4 dark:border-stone-800"
            >
              <span
                className={cn(DESIGN_TOKENS.typography.body, 'text-stone-700 dark:text-stone-300')}
              >
                {prompt}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/*
        Omitted entirely while unconfigured — an empty bordered box reads as a
        loading failure. `assertContactConfigured` is what tells you it is
        missing; the visitor should never see the gap.
      */}
      {studioRows.length > 0 && (
        <section
          aria-labelledby="studio-heading"
          className={cn('contact-reveal rounded-[2rem] p-8 sm:p-10', DESIGN_TOKENS.glass.card)}
        >
          <h2 id="studio-heading" className={cn(DESIGN_TOKENS.typography.eyebrow, 'mb-7 block')}>
            The studio
          </h2>

          {/* `dl` because each row is genuinely a term and its value. */}
          <dl className="grid gap-7 sm:grid-cols-2">
            {studioRows.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
                  aria-hidden="true"
                />
                <div className="space-y-1">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-500">
                    {label}
                  </dt>
                  <dd
                    className={cn(
                      DESIGN_TOKENS.typography.body,
                      'text-stone-800 dark:text-stone-200'
                    )}
                  >
                    {value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
};
