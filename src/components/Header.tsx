import React, { useState } from 'react';
import { Search, Sun, Moon, Menu, X, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../data/calculators';
import { CurrencySelector } from './CurrencySelector';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function Header({ currentPath, onNavigate, onOpenSearch, isDarkMode, onToggleTheme }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  const navLinks = [
    { name: 'Calculators', path: '/#all-calculators' },
    { name: 'Money', path: '/#everyday-money' },
    { name: 'Business', path: '/#business' },
    { name: 'Salary', path: '/#salary-&-pay' },
    { name: 'Loans', path: '/#loans-&-interest' },
    { name: 'Investment', path: '/#investment-&-savings' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Wordmark & Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold font-mono text-base shadow-xs group-hover:bg-emerald-700 transition-colors">
                M
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight block leading-tight">
                  MoneyCalc Hub
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase block -mt-0.5">
                  Simple Calculators · Clear Answers
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.path)}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer py-1"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Search, Currency Selector, Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Currency Selector (hidden on mobile, inside drawer on mobile) */}
            <div className="hidden sm:block">
              <CurrencySelector compact label="" />
            </div>

            {/* Search Trigger Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-lg transition-colors cursor-pointer"
              title="Search calculators (Press /)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden xl:inline px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-400">
                /
              </kbd>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none flex items-center justify-center"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fadeIn">
          {/* Mobile Currency Picker */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <CurrencySelector label="Currency:" className="justify-between" />
          </div>

          {/* Mobile Theme Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Theme:
            </span>
            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer shadow-xs"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Categories
          </div>
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.path)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left cursor-pointer"
            >
              <span>{link.name}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search All 23 Calculators</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

