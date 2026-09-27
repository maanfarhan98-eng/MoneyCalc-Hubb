import React from 'react';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';

interface CurrencySelectorProps {
  label?: string;
  className?: string;
  compact?: boolean;
}

export function CurrencySelector({ label = 'Currency:', className = '', compact = false }: CurrencySelectorProps) {
  const { currency, setCurrencyCode } = useCurrency();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 whitespace-nowrap">
          {label}
        </span>
      )}
      <div className="relative inline-block w-full sm:w-auto">
        <select
          value={currency.code}
          onChange={(e) => setCurrencyCode(e.target.value)}
          className={`w-full sm:w-auto appearance-none pl-3 pr-8 py-1.5 text-xs sm:text-sm font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs`}
          aria-label="Select preferred currency"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {compact ? `${c.code} (${c.symbol.trim()})` : `${c.code} — ${c.name} (${c.symbol.trim()})`}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
