import React from 'react';
import { Search, Home, Grid } from 'lucide-react';
import { SEOHead } from './SEOHead';

interface NotFoundProps {
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export function NotFoundPage({ onNavigate, onOpenSearch }: NotFoundProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center space-y-6">
      <SEOHead
        title="Page Not Found — MoneyCalc Hub"
        description="The calculator page you are looking for does not exist or may have moved."
        canonicalPath="/404"
        isLegalOrHome={true}
      />
      <div className="text-6xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
        404
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Page Not Found
      </h1>
      <p className="text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
        The page you're looking for doesn't exist or may have moved.
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </button>
        <button
          onClick={() => onNavigate('/#all-calculators')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-sm rounded-xl transition-colors cursor-pointer"
        >
          <Grid className="w-4 h-4" />
          Browse All Calculators
        </button>
        <button
          onClick={onOpenSearch}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-sm rounded-xl transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4" />
          Search Calculators
        </button>
      </div>
    </div>
  );
}
