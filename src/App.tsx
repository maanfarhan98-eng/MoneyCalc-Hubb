/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { CalculatorPageTemplate } from './components/CalculatorPageTemplate';
import { LegalPage, LegalSlug } from './components/LegalPage';
import { NotFoundPage } from './components/NotFoundPage';
import { SearchModal } from './components/SearchModal';
import { SEOHead } from './components/SEOHead';
import { getCalculatorBySlug, CALCULATORS } from './data/calculators';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('moneycalc_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to <html> and <body> elements
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('moneycalc_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('moneycalc_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Listen to popstate (browser back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global keyboard shortcut '/' to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Custom navigation handler
  const handleNavigate = (path: string) => {
    if (path.includes('#')) {
      const [base, hash] = path.split('#');
      const targetBase = base || '/';
      if (window.location.pathname !== targetBase) {
        window.history.pushState(null, '', path);
        setCurrentPath(targetBase);
      } else {
        window.history.pushState(null, '', path);
      }
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
      return;
    }

    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Determine current page
  const cleanPath = currentPath.replace(/^\/|\/$/g, '');

  // 1. Check if Homepage
  const isHome = cleanPath === '' || cleanPath === 'index.html';

  // 2. Check if Calculator Page
  const calculator = getCalculatorBySlug(cleanPath);

  // 3. Check if Legal / Trust Page
  const legalPages: LegalSlug[] = ['about', 'contact', 'privacy-policy', 'terms', 'disclaimer'];
  const isLegal = legalPages.includes(cleanPath as LegalSlug);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      <Header
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1">
        {isHome && (
          <>
            <SEOHead
              title="MoneyCalc Hub — Free Money & Financial Calculators"
              description="Simple Calculators. Clear Answers. Calculate percentages, discounts, profits, salaries, loans, interest, investments, and savings quickly and accurately."
              canonicalPath="/"
              isLegalOrHome={true}
            />
            <HomePage
              onNavigate={handleNavigate}
              onOpenSearch={() => setIsSearchOpen(true)}
            />
          </>
        )}

        {!isHome && calculator && (
          <>
            <SEOHead
              title={calculator.title}
              description={calculator.metaDescription}
              canonicalPath={calculator.path}
              calculator={calculator}
            />
            <CalculatorPageTemplate
              calculator={calculator}
              onNavigate={handleNavigate}
            />
          </>
        )}

        {!isHome && isLegal && (
          <LegalPage
            page={cleanPath as LegalSlug}
            onNavigate={handleNavigate}
          />
        )}

        {!isHome && !calculator && !isLegal && (
          <NotFoundPage
            onNavigate={handleNavigate}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCalculator={handleNavigate}
      />
    </div>
  );
}
