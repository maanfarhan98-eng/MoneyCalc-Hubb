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
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold font-mono text-sm">
                M
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                MoneyCalc Hub
              </span>
            </div>
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
              {CATEGORIES.map((cat) => (
                <li key={cat.name}>
                  <button
                    onClick={() => onNavigate(`/#${cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`)}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Calculators */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Featured Tools
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('/percentage-calculator/')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Percentage Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/loan-calculator/')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Loan Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/salary-calculator/')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Salary Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/compound-interest-calculator/')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Compound Interest
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/profit-margin-calculator/')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Profit Margin Calculator
                </button>
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
                <button
                  onClick={() => onNavigate('/about/')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact/')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Contact & Feedback
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/privacy-policy/')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/terms/')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/disclaimer/')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Financial Disclaimer
                </button>
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
