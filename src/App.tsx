import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
  Navigate,
} from 'react-router-dom';

import { ThemeProvider } from './context';
import { DESIGN_TOKENS } from './theme/designSystem';
import { CANDLE_CATEGORIES } from './data/categories';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PageTransition } from './components/layout/PageTransition';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { AmbientFlameGlow } from './components/ui/AmbientFlameGlow';
import { RouteFallback } from './components/ui/RouteFallback';

/*
 * Route components are lazy so each page ships as its own chunk. This matters
 * more here than in a typical app: the collection photography is imported by the
 * data module, so an eagerly-imported route drags several megabytes of PNG into
 * the initial bundle.
 *
 * Named exports are re-mapped to `default` because `lazy` requires a module with
 * a default export, and the house convention is named exports only.
 */
const LandingHero = lazy(() =>
  import('./features/landing/LandingHero').then((m) => ({ default: m.LandingHero }))
);
const CollectionsStoryView = lazy(() =>
  import('./features/categories/CollectionsStoryView').then((m) => ({
    default: m.CollectionsStoryView,
  }))
);
const SubCategoryShowcase = lazy(() =>
  import('./features/categories/SubCategoryShowcase').then((m) => ({
    default: m.SubCategoryShowcase,
  }))
);
const AboutStory = lazy(() =>
  import('./features/about/AboutStory').then((m) => ({ default: m.AboutStory }))
);
const ContactFormWorkflow = lazy(() =>
  import('./features/contact/ContactFormWorkflow').then((m) => ({
    default: m.ContactFormWorkflow,
  }))
);

/** Standard page shell: max width, gutters, and clearance for the fixed navbar. */
const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <main className="min-h-screen">
    <div
      className={`${DESIGN_TOKENS.layout.maxWidth} mx-auto ${DESIGN_TOKENS.layout.paddingX} ${DESIGN_TOKENS.layout.headerOffset}`}
    >
      {children}
    </div>
  </main>
);

/* ==========================================================================
   1. HOME (/)
   Full-bleed like the collections story: the hero fills the viewport and two
   sections run edge-to-edge, so it opts out of PageShell and each contained
   section applies its own gutters.
   ========================================================================== */
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen">
      <LandingHero
        onSelectCategory={(id) => navigate(`/category/${id}`)}
        onOpenCollectionsStory={() => navigate('/collections')}
      />
    </main>
  );
};

/* ==========================================================================
   2. COLLECTIONS STORY (/collections)
   Full-bleed and self-pinning, so it opts out of PageShell's gutters.
   ========================================================================== */
const CollectionsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen">
      <CollectionsStoryView onOpenSubCategory={(id) => navigate(`/category/${id}`)} />
    </main>
  );
};

/* ==========================================================================
   3. SUBCATEGORY EXPERIENCE (/category/:categoryId)
   ========================================================================== */
const SubCategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const category = CANDLE_CATEGORIES.find((c) => c.id === categoryId);

  // Unknown slug: send to the collections story rather than silently showing #1.
  if (!category) return <Navigate to="/collections" replace />;

  return (
    <main className="min-h-screen">
      <SubCategoryShowcase
        category={category}
        onBack={() => navigate('/collections')}
        onOrderCustom={(subject) => navigate('/contact', { state: { categoryTitle: subject } })}
      />
    </main>
  );
};

/* ==========================================================================
   4. BRAND STORY (/about)
   ========================================================================== */
const AboutPage: React.FC = () => (
  <PageShell>
    <AboutStory />
  </PageShell>
);

/* ==========================================================================
   5. CONTACT & OTP VERIFICATION (/contact)
   ========================================================================== */
const ContactPage: React.FC = () => (
  <main className={`min-h-screen ${DESIGN_TOKENS.layout.headerOffset} px-4 pb-24`}>
    <ContactFormWorkflow />
  </main>
);

/* ==========================================================================
   6. MASTER APP
   ========================================================================== */
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <div className="relative min-h-screen w-full bg-stone-50 text-stone-900 transition-colors duration-500 dark:bg-stone-950 dark:text-stone-100">
            <AmbientFlameGlow />

            <div className="relative z-10">
              <Navbar />

              <PageTransition>
                <Suspense fallback={<RouteFallback />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/collections" element={<CollectionsPage />} />
                    <Route path="/category/:categoryId" element={<SubCategoryPage />} />
                    {/*
                      Retired routes. `/catalog` was a searchable card grid that
                      duplicated the home page's layout, and `/category/:id/details`
                      listed the same varieties the subcategory experience now
                      walks through. Both redirect so existing links keep working.
                    */}
                    <Route path="/catalog" element={<Navigate to="/collections" replace />} />
                    <Route
                      path="/category/:categoryId/details"
                      element={<Navigate to="/collections" replace />}
                    />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </PageTransition>

              <Footer />
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
