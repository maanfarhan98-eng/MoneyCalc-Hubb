import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, Calculator } from 'lucide-react';
import { searchCalculators, CALCULATORS, CalculatorMeta } from '../data/calculators';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCalculator: (path: string) => void;
}

export function SearchModal({ isOpen, onClose, onSelectCalculator }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CalculatorMeta[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults(CALCULATORS.slice(0, 6)); // default initial popular items
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(CALCULATORS.filter(c => c.popular).slice(0, 8));
    } else {
      setResults(searchCalculators(query));
    }
  }, [query]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center items-start">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a calculator (e.g. loan, profit, percentage, salary, age)..."
            className="w-full py-4 pl-3 pr-10 text-sm text-slate-900 dark:text-white bg-transparent focus:outline-none placeholder-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {query.trim() ? `Search Results (${results.length})` : 'Popular Calculators'}
              </div>
              {results.map((calc) => (
                <button
                  key={calc.id}
                  onClick={() => {
                    onSelectCalculator(calc.path);
                    onClose();
                  }}
                  className="w-full flex items-start gap-3 p-3 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                        {calc.h1}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                        {calc.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {calc.shortIntro}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all self-center shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                No calculators found matching "{query}"
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Try searching for percentage, discount, salary, mortgage, break-even, or compound interest.
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono text-[10px]">Esc</kbd> to exit</span>
          <span>{CALCULATORS.length} Free Calculators Available</span>
        </div>
      </div>
    </div>
  );
}
