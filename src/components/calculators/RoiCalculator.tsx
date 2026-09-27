import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../CurrencySelector';
import { FinalResultCard } from '../FinalResultCard';
import { formatPercent } from '../../utils/formatters';

export function RoiCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [initialInvestment, setInitialInvestment] = useState<string>('20000');
  const [finalValue, setFinalValue] = useState<string>('28000');
  const [years, setYears] = useState<string>('3');
  const [, setCalcKey] = useState<number>(0);

  const initial = parseFloat(initialInvestment) || 0;
  const finalVal = parseFloat(finalValue) || 0;
  const periodYears = parseFloat(years) || 0;

  const netReturn = finalVal - initial;
  const totalRoi = initial > 0 ? (netReturn / initial) * 100 : 0;
  
  // Annualized return (CAGR)
  let annualizedRoi = 0;
  if (initial > 0 && finalVal > 0 && periodYears > 0) {
    annualizedRoi = (Math.pow(finalVal / initial, 1 / periodYears) - 1) * 100;
  }

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const handleReset = () => {
    setInitialInvestment('20000');
    setFinalValue('28000');
    setYears('3');
    triggerCalculate();
  };

  const copyText = `Initial Investment: ${formatMoney(initial)} | Final Value: ${formatMoney(finalVal)} | Net Gain: ${netReturn >= 0 ? '+' : ''}${formatMoney(netReturn)} | Total ROI: ${totalRoi >= 0 ? '+' : ''}${formatPercent(totalRoi)}` + (periodYears > 0 ? ` | Annualized: ${formatPercent(annualizedRoi)}` : '');

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Currency Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Investment Parameters
        </span>
        <CurrencySelector />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Initial Investment ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="500"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="20000"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Final Value / Return ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="500"
              value={finalValue}
              onChange={(e) => setFinalValue(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="28000"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Investment Period (Years)
          </label>
          <input
            type="number"
            step="0.5"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
            placeholder="3"
          />
        </div>
      </div>

      {/* Calculate Button */}
      <div className="mt-5">
        <button
          type="button"
          onClick={triggerCalculate}
          className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <CalcIcon className="w-4 h-4" />
          <span>Calculate</span>
        </button>
      </div>

      {/* Final Result Card */}
      <FinalResultCard
        title="Final Result"
        primaryLabel="Total Return on Investment (ROI)"
        primaryValue={`${totalRoi >= 0 ? '+' : ''}${formatPercent(totalRoi)}`}
        primaryHighlight={totalRoi >= 0 ? 'emerald' : 'rose'}
        copyText={copyText}
        breakdown={[
          { label: 'Total Profit / Gain', value: formatMoney(netReturn), highlight: netReturn >= 0 ? 'emerald' : 'rose' },
          { label: 'Annualized ROI (CAGR)', value: periodYears > 0 ? formatPercent(annualizedRoi) : 'N/A' },
          { label: 'Capital Multiplier', value: `${initial > 0 ? (finalVal / initial).toFixed(2) : 0}x` },
          { label: 'Initial Investment', value: formatMoney(initial) },
          { label: 'Ending Value', value: formatMoney(finalVal) },
        ]}
      />

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset to default values
        </button>
      </div>
    </div>
  );
}
