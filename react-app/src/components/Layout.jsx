import { useCallback, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import OfferPopup from './OfferPopup';
import QuizPopup from './QuizPopup';
import SkinQuiz from './SkinQuiz';
import FloatingContact from './FloatingContact';
import { useContactLinks } from '../context/SiteContext';
import { useScrollToTop } from '../hooks/useApi';

function StickyBar() {
  const links = useContactLinks();
  return (
    <div className="sticky-bar">
      <a href={links.tel}>Call</a>
      <a href={links.whatsapp} target="_blank" rel="noreferrer">
        WhatsApp
      </a>
      <Link to="/appointment">Book</Link>
    </div>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  useScrollToTop(pathname);

  // The quiz lives here rather than on the home page, so it can be opened
  // from any page — by the prompt below, or by a page passing openQuiz on.
  const [quizOpen, setQuizOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);

  const openQuiz = useCallback(() => setQuizOpen(true), []);
  const closeQuiz = useCallback(() => setQuizOpen(false), []);

  return (
    <>
      <a href="#main" className="sr-only">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Outlet context={{ openQuiz }} />
      </main>
      <Footer />
      <StickyBar />
      <FloatingContact />

      <OfferPopup onOpenChange={setOfferOpen} />

      {/* Held back while the offer dialog or the quiz itself is showing, so
          two dialogs never stack on top of each other. */}
      <QuizPopup onTakeQuiz={openQuiz} blocked={offerOpen || quizOpen} />

      {quizOpen && <SkinQuiz onClose={closeQuiz} />}
    </>
  );
}
