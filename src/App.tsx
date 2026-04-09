/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AboutPage from './pages/AboutPage';
import SignupPage from './pages/SignupPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import HelpPage from './pages/HelpPage';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-mesh relative">
        {/* Animated Background Blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-blob" />
          <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-accent/5 rounded-full blur-[100px] animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-primary/5 rounded-full blur-[130px] animate-blob animation-delay-4000" />
          <div className="absolute inset-0 bg-grid opacity-50" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/help" element={<HelpPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}


