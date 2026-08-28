import { describe, it, expect } from 'vitest';
import { WHATSAPP, buildBriefMessage, whatsappLink } from './contact';

/**
 * These assert the contact link, because it is the site's entire conversions
 * path and it fails *silently* - a malformed number makes `wa.me` open an
 * "invalid number" screen rather than erroring, so a typo looks like a working
 * button. CI is the only thing that would catch it.
 */

describe('WhatsApp deep link', () => {
    it('holds a wa.me-usable number: 8-15 digits, no + or space', () => {
        expect(WHATSAPP.number).toMatch(/^d{8,15}$/);
    });

    it('encodes newlines so the brief survives the query string', () => {
        const url = whatsappLink(buildBriefMessage('Festive Urlis'));
        expect(url).toContain('%0A');           // literal newlines would truncate it
        expect(url).toContain('Festive%20Urlis');
    });

  it('names the collection when given one, and falls back when not', () => {
        expect(buildBriefMessage('Diyas')).toContain('Diyas');
        expect(buildBriefMessage()).toBe(
        [WHATSAPP.prefilledMessage, '', 'Occasion: ', 'Quantity: ', 'Fragrance notes: '].join('\n')
        );
    });
})