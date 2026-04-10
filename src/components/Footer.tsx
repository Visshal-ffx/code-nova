import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="bg-primary p-1.5 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Legalize<span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Making the law accessible to everyone. We use advanced AI to simplify legal jargon and protect you from hidden risks.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Product</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Analyzer</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link to="/help" className="hover:text-primary transition-colors">Help & FAQ</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">Our Mission</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2026 LegalizeAI. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Built with ❤️ for a more transparent world.</p>
        </div>
      </div>
    </footer>
  );
}
