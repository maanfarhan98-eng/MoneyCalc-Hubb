import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../utils/formatters';

export interface ResultItem {
  label: string;
  value: string;
  isPrimary?: boolean;
  highlight?: 'emerald' | 'rose' | 'slate';
}

interface FinalResultCardProps {
  title?: string;
  primaryLabel: string;
  primaryValue: string;
  primaryHighlight?: 'emerald' | 'rose' | 'slate';
  breakdown?: ResultItem[];
  copyText: string;
  note?: string;
}

export function FinalResultCard({
  title = 'Final Result',
  primaryLabel,
  primaryValue,
  primaryHighlight = 'emerald',
  breakdown = [],
  copyText,
  note,
}: FinalResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Copies ONLY the clean, final calculated output
    const cleanOutput = copyText.trim();
    const success = await copyToClipboard(cleanOutput);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getHighlightColor = (highlight: 'emerald' | 'rose' | 'slate') => {
    switch (highlight) {
      case 'rose':
        return 'text-rose-600 dark:text-rose-400';
      case 'slate':
        return 'text-slate-900 dark:text-white';
      case 'emerald':
      default:
        return 'text-emerald-700 dark:text-emerald-400';
    }
  };

  return (
    <div className="mt-6 p-5 sm:p-6 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl shadow-xs transition-all">
      {/* Top Header Row with Title and Copy Button */}
      <div className="flex items-center justify-between gap-2 border-b border-emerald-200/60 dark:border-emerald-800/40 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-300">
            {title}
          </h3>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 border border-emerald-300 dark:border-emerald-700/80 shadow-xs hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-all cursor-pointer active:scale-95"
          aria-label="Copy final calculated results to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Result copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Result</span>
            </>
          )}
        </button>
      </div>

      {/* Primary Result Headline */}
      <div className="pt-4">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 block">
          {primaryLabel}
        </span>
        <div
          className={`mt-1 text-3xl sm:text-4xl font-bold font-mono tracking-tight tabular-nums ${getHighlightColor(
            primaryHighlight
          )}`}
        >
          {primaryValue}
        </div>
      </div>

      {/* Optional Note / Subtitle */}
      {note && (
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
          {note}
        </p>
      )}

      {/* Breakdown Grid */}
      {breakdown.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-emerald-200/60 dark:border-emerald-800/40 text-xs">
          {breakdown.map((item, index) => (
            <div key={index} className="space-y-0.5">
              <span className="text-slate-500 dark:text-slate-400 block truncate">
                {item.label}
              </span>
              <span
                className={`font-semibold font-mono text-sm tabular-nums block ${getHighlightColor(
                  item.highlight || 'slate'
                )}`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Prominent Copy Result Action Section */}
      <div className="mt-5 pt-4 border-t border-emerald-200/60 dark:border-emerald-800/40 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs transition-all cursor-pointer active:scale-95"
          aria-label="Copy final calculated results to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-100" />
              <span>Result copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Result</span>
            </>
          )}
        </button>

        {copied ? (
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 animate-pulse">
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Result copied!
          </span>
        ) : (
          <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
            Copies only final output values
          </span>
        )}
      </div>
    </div>
  );
}
