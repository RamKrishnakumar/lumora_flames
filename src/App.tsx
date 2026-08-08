import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';

// Theme
import { ThemeProvider } from './context';

// Design Token Imports
import { DESIGN_TOKENS } from './theme/designSystem';

// Data Source
import { CANDLE_CATEGORIES } from './data/categories';

// Feature Components
import { LandingHero } from './features/landing/LandingHero';
import { CollectionsStoryView } from './features/categories/CollectionsStoryView';
import { CollectionsView } from './features/categories/CollectionsView';
import { CategoryDetail } from './features/categories/CategoryDetail';
import { ScrollInteractiveShowcase } from './features/landing/ScrollInteractiveShowcase';
import { ContactFormWorkflow } from './features/contact/ContactFormWorkflow';

// UI Layout Components
import { Navbar } from './components/layout/Navbar';
import { AmbientFlameGlow } from './components/ui/AmbientFlameGlow';

/* ==========================================================================
   1. HOME PAGE (/)
   ========================================================================== */
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className={`min-h-screen ${DESIGN_TOKENS.layout.headerOffset} pb-20`}>
      <div className={`${DESIGN_TOKENS.layout.maxWidth} mx-auto ${DESIGN_TOKENS.layout.paddingX}`}>
        <LandingHero onSelectCategory={(id) => navigate(`/category/${id}`)} />
      </div>
    </main>
  );
};

/* ==========================================================================
   2. SCROLL STORY COLLECTIONS (/collections)
   ========================================================================== */
const CollectionsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen pt-20">
      <CollectionsStoryView onOpenSubCategory={(id) => navigate(`/category/${id}`)} />
    </main>
  );
};

/* ==========================================================================
   3. SEARCHABLE CATALOG (/catalog)
   ========================================================================== */
const CatalogPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className={`min-h-screen ${DESIGN_TOKENS.layout.headerOffset} pb-20`}>
      <div className={`${DESIGN_TOKENS.layout.maxWidth} mx-auto ${DESIGN_TOKENS.layout.paddingX}`}>
        <CollectionsView onSelectCategory={(id) => navigate(`/category/${id}`)} />
      </div>
    </main>
  );
};

/* ==========================================================================
   4. SCROLL-PINNED CATEGORY EXPERIENCE (/category/:categoryId)
   ========================================================================== */
const SubCategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const selectedCategory = CANDLE_CATEGORIES.find((c) => c.id === categoryId);

  // Unknown slug: fall back to the catalog rather than silently showing collection #1.
  if (!selectedCategory) return <Navigate to="/catalog" replace />;

  return (
    <main className="min-h-screen pt-20">
      <ScrollInteractiveShowcase
        selectedCategory={selectedCategory}
        onSelectCategory={(id) => navigate(`/category/${id}/details`)}
      />
    </main>
  );
};

/* ==========================================================================
   5. CATEGORY DETAIL BREAKDOWN (/category/:categoryId/details)
   ========================================================================== */
const CategoryDetailPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const category = CANDLE_CATEGORIES.find((c) => c.id === categoryId);

  if (!category) return <Navigate to="/catalog" replace />;

  return (
    <main className={`min-h-screen ${DESIGN_TOKENS.layout.headerOffset} pb-20`}>
      <div className={`${DESIGN_TOKENS.layout.maxWidth} mx-auto ${DESIGN_TOKENS.layout.paddingX}`}>
        <CategoryDetail
          category={category}
          onBack={() => navigate('/catalog')}
          onOrderCustom={(categoryTitle) => navigate('/contact', { state: { categoryTitle } })}
        />
      </div>
    </main>
  );
};

/* ==========================================================================
   6. CONTACT & OTP VERIFICATION PAGE (/contact)
   ========================================================================== */
const ContactPage: React.FC = () => (
  <main className={`min-h-screen ${DESIGN_TOKENS.layout.headerOffset} py-12 px-4`}>
    <ContactFormWorkflow />
  </main>
);

/* ==========================================================================
   7. MASTER APP COMPONENT
   ========================================================================== */
export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="relative w-full min-h-screen transition-colors duration-500 bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
          <AmbientFlameGlow />

          <div className="relative z-10">
            <Navbar />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/category/:categoryId" element={<SubCategoryPage />} />
              <Route path="/category/:categoryId/details" element={<CategoryDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}
