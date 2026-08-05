import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles } from 'lucide-react';
import { CANDLE_CATEGORIES } from '../../data/categories';

/**
 * Props for ContactForm component.
 */
interface ContactFormProps {
  /** Pre-selected category ID if navigating from a category detail view. */
  initialCategory?: string;
}

/**
 * Interface defining shape of contact form state.
 */
interface FormState {
  fullName: string;
  email: string;
  categoryPreference: string;
  fragranceNotes: string;
  customMessage: string;
}

/**
 * ContactForm allows users to request bespoke candle customizations,
 * custom fragrance formulations, or event orders.
 */
export const ContactForm: React.FC<ContactFormProps> = ({ initialCategory }) => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    email: '',
    categoryPreference: initialCategory || CANDLE_CATEGORIES[0].title,
    fragranceNotes: '',
    customMessage: '',
  });

  /**
   * Handles text input changes and updates state safely.
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Mock form submission handler.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto bg-stone-100/80 dark:bg-stone-900/50 p-8 sm:p-12 rounded-3xl border border-stone-200 dark:border-stone-800 backdrop-blur-xl shadow-lg transition-colors duration-500">
      {submitted ? (
        <div className="text-center py-12 space-y-4">
          <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-500 mb-2">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>
          <h3 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            Order Request Received
          </h3>
          <p className="text-stone-600 dark:text-stone-400 text-sm max-w-md mx-auto leading-relaxed">
            Thank you, <span className="font-semibold text-amber-500">{formData.fullName}</span>! Our artisan team will review your custom notes for <span className="font-semibold">{formData.categoryPreference}</span> and reach out within 24 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 px-6 py-2.5 rounded-full bg-amber-500 text-stone-950 font-medium text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              <Sparkles className="w-3.5 h-3.5" /> Bespoke Concierge
            </span>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
              Craft Your Custom Flame
            </h2>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
              Full Name *
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm"
              placeholder="e.g. Eleanor Vance"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm"
              placeholder="eleanor@example.com"
            />
          </div>

          {/* Preferred Category Select */}
          <div>
            <label htmlFor="categoryPreference" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
              Collection Category *
            </label>
            <select
              id="categoryPreference"
              name="categoryPreference"
              value={formData.categoryPreference}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm"
            >
              {CANDLE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          {/* Preferred Fragrance Profile */}
          <div>
            <label htmlFor="fragranceNotes" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
              Preferred Fragrance / Aromas (Optional)
            </label>
            <input
              id="fragranceNotes"
              name="fragranceNotes"
              type="text"
              value={formData.fragranceNotes}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm"
              placeholder="e.g. Lavender & Vanilla, Citrus & Sage, Rose & Sandalwood"
            />
          </div>

          {/* Message / Details */}
          <div>
            <label htmlFor="customMessage" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
              Customization & Labeling Details
            </label>
            <textarea
              id="customMessage"
              name="customMessage"
              rows={4}
              value={formData.customMessage}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm resize-none"
              placeholder="Describe event themes, name labels, or photo print preferences..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
          >
            <Send className="w-4 h-4" />
            Send Custom Request
          </button>
        </form>
      )}
    </div>
  );
};