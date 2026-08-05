import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';

// Design Token Imports
import { DESIGN_TOKENS } from './theme/designSystem';

// Data Source
import { CANDLE_CATEGORIES } from './data/categories';

// Feature Components
import { PromotionalCarousel } from './features/landing/PromotionalCarousel';
import { CollectionsStoryView } from './features/categories/CollectionsStoryView';
import { ScrollInteractiveShowcase } from './features/landing/ScrollInteractiveShowcase';
import { ContactFormWorkflow } from './features/contact/ContactFormWorkflow';

// UI Layout Components
import { Compass, PhoneCall, Home, Moon, Sun } from 'lucide-react';

/* ==========================================================================
   1. NAVIGATION HEADER (Global Luxury Glass Navbar)
   ========================================================================== */
const Navbar: React.FC<{ isDark: boolean; toggleTheme: () => void }> = ({ isDark, toggleTheme }) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 sm:px-12 transition-all duration-300">
      <nav className={`max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5 rounded-full ${DESIGN_TOKENS.glass.floatingBtn}`}>
        <button 
          onClick={() => navigate('/')} 
          className="text-lg font-light tracking-[0.2em] uppercase text-stone-900 dark:text-stone-100 flex items-center gap-2 group"
        >
          <span className="font-semibold text-amber-500">LUMORA</span>
          <span className="font-extralight text-stone-500 dark:text-stone-400 group-hover:text-amber-400 transition-colors">FLAMES</span>
        </button>

        <div className="flex items-center gap-6 text-xs uppercase tracking-widest font-medium text-stone-700 dark:text-stone-300">
          <button onClick={() => navigate('/')} className="hover:text-amber-500 transition-colors flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" /> Home
          </button>
          <button onClick={() => navigate('/collections')} className="hover:text-amber-500 transition-colors flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" /> Collections
          </button>
          <button onClick={() => navigate('/contact')} className="hover:text-amber-500 transition-colors flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5" /> Contact
          </button>
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 text-stone-800 dark:text-stone-200 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
        </button>
      </nav>
    </header>
  );
};

/* ==========================================================================
   2. HOME PAGE WRAPPER
   ========================================================================== */
const HomePage: React.FC = () => {
  //const navigate = useNavigate();

  return (
    <main className={`min-h-screen ${DESIGN_TOKENS.layout.headerOffset} space-y-24 pb-20`}>

      {[...Array(3)].map((_, index) => (
        <section key={index} className={`${DESIGN_TOKENS.layout.maxWidth} mx-auto ${DESIGN_TOKENS.layout.paddingX}`}>
          <PromotionalCarousel />
        </section>
      ))}
      {/* <section className={`${DESIGN_TOKENS.layout.maxWidth} mx-auto ${DESIGN_TOKENS.layout.paddingX}`}>
        <PromotionalCarousel />
      </section>

      <section className={`${DESIGN_TOKENS.layout.maxWidth} mx-auto ${DESIGN_TOKENS.layout.paddingX}`}>
        <PromotionalCarousel />
      </section>

      <section className={`${DESIGN_TOKENS.layout.maxWidth} mx-auto ${DESIGN_TOKENS.layout.paddingX}`}>
        <PromotionalCarousel />
      </section> */}

      {/* <section className="w-full">
        <div className="text-center mb-12 space-y-2">
          <span className={DESIGN_TOKENS.typography.eyebrow}>Curated Masterpieces</span>
          <h2 className={DESIGN_TOKENS.typography.sectionTitle}>Explore The Collections</h2>
        </div>
        
        <CollectionsStoryView 
          onOpenSubCategory={(categoryId) => navigate(`/category/${categoryId}`)} 
        />
      </section> */}
    </main>
  );
};

/* ==========================================================================
   3. SUBCATEGORY EXPERIENCE WRAPPER (/category/:categoryId)
   ========================================================================== */
const SubCategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  // Selected category is passed dynamically to the subcategory viewer
  const selectedCategory = CANDLE_CATEGORIES.find((c) => c.id === categoryId) || CANDLE_CATEGORIES[0];

  return (
    <main className="min-h-screen pt-20">
      <ScrollInteractiveShowcase 
        selectedCategory={selectedCategory}
        onSelectCategory={(id) => navigate(`/category/${id}`)} 
      />
    </main>
  );
};

/* ==========================================================================
   4. CONTACT & OTP VERIFICATION PAGE
   ========================================================================== */
const ContactPage: React.FC = () => {
  return (
    <main className={`min-h-screen ${DESIGN_TOKENS.layout.headerOffset} py-12 px-4`}>
      <ContactFormWorkflow />
    </main>
  );
};

/* ==========================================================================
   5. MASTER APP COMPONENT
   ========================================================================== */
export default function App() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-500 ${isDark ? 'dark bg-stone-950 text-stone-100' : 'bg-stone-50 text-stone-900'}`}>
      <Router>
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/collections" 
            element={
              <main className="pt-20">
                <CollectionsStoryView 
                  onOpenSubCategory={(id) => window.location.href = `/category/${id}`} 
                />
              </main>
            } 
          />
          <Route path="/category/:categoryId" element={<SubCategoryPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </Router>
    </div>
  );
}