import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation.jsx';
import Footer from './components/Footer.jsx';
import PageTransition from './components/PageTransition.jsx';
import BrandLoading from './components/BrandLoading.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import { memberRoutes } from './data/members.js';
import { departmentRoutes } from './data/hierarchy.js';

/* Route-level code splitting keeps the QR landing pages tiny. */
const Home = lazy(() => import('./pages/Home.jsx'));
const PresentBody = lazy(() => import('./pages/PresentBody.jsx'));
const Patrons = lazy(() => import('./pages/Patrons.jsx'));
const Hierarchy = lazy(() => import('./pages/Hierarchy.jsx'));
const Department = lazy(() => import('./pages/Department.jsx'));
const Person = lazy(() => import('./pages/Person.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

const shell = (node, className = 'page') => (
  <Suspense fallback={<BrandLoading />}>
    <PageTransition className={className}>{node}</PageTransition>
  </Suspense>
);

export default function App() {
  const location = useLocation();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <ScrollToTop />
      <Navigation />

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={shell(<Home />, '')} />
          <Route path="/present-body" element={shell(<PresentBody />)} />
          <Route path="/patrons" element={shell(<Patrons />)} />
          <Route path="/hierarchy" element={shell(<Hierarchy />)} />

          {departmentRoutes.map((slug) => (
            <Route key={slug} path={slug} element={shell(<Department slug={slug} />)} />
          ))}

          {memberRoutes.map((slug) => (
            <Route key={slug} path={slug} element={shell(<Person slug={slug} />)} />
          ))}

          <Route path="*" element={shell(<NotFound />)} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </>
  );
}
