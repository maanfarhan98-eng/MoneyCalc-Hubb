import React from 'react';
import { ArrowUp } from 'lucide-react';
import { CATEGORIES } from '../data/calculators';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-xs p-1.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-white">
                  <rect width="16" height="20" x="4" y="2" rx="2" />
                  <line x1="8" x2="16" y1="6" y2="6" />
                  <line x1="16" x2="16" y1="14" y2="18" />
                  <path d="M16 10h.01" />
                  <path d="M12 10h.01" />
                  <path d="M8 10h.01" />
                  <path d="M12 14h.01" />
                  <path d="M8 14h.01" />
                  <path d="M12 18h.01" />
                  <path d="M8 18h.01" />
                </svg>
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors">
                MoneyCalc Hub
              </span>
            </a>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Simple Calculators. Clear Answers. Free, fast, and mobile-friendly calculators designed for everyday money, business pricing, loans, interest, and investment forecasting.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              Disclaimer: All calculations provided on MoneyCalc Hub are estimates for educational and planning purposes only and do not constitute certified financial, tax, or legal advice.
            </p>
          </div>

          {/* Calculator Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {CATEGORIES.map((cat) => {
                const anchorPath = `/#${cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                return (
                  <li key={cat.name}>
                    <a
                      href={anchorPath}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(anchorPath);
                      }}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left block"
                    >
                      {cat.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Popular Calculators */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Featured Tools
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a
                  href="/percentage-calculator/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/percentage-calculator/');
                  }}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block"
                >
                  Percentage Calculator
                </a>
              </li>
              <li>
                <a
                  href="/loan-calculator/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/loan-calculator/');
                  }}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block"
                >
                  Loan Calculator
                </a>
              </li>
              <li>
                <a
                  href="/salary-calculator/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/salary-calculator/');
                  }}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block"
                >
                  Salary Calculator
                </a>
              </li>
              <li>
                <a
                  href="/compound-interest-calculator/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/compound-interest-calculator/');
                  }}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block"
                >
                  Compound Interest
                </a>
              </li>
              <li>
                <a
                  href="/profit-margin-calculator/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/profit-margin-calculator/');
                  }}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block"
                >
                  Profit Margin Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Trust */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a
                  href="/about/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/about/');
                  }}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/contact/');
                  }}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block"
                >
                  Contact & Feedback
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/privacy-policy/');
                  }}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/terms/');
                  }}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/disclaimer/');
                  }}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block"
                >
                  Financial Disclaimer
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} MoneyCalc Hub. All rights reserved.
          </div>
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
