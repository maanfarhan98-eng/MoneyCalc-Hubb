import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../CurrencySelector';
import { FinalResultCard } from '../FinalResultCard';
import { formatPercent } from '../../utils/formatters';

export function ReturnOnInvestmentCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [initialInvestment, setInitialInvestment] = useState<string>('50000');
  const [finalValue, setFinalValue] = useState<string>('68000');
  const [interimIncome, setInterimIncome] = useState<string>('6000');
  const [, setCalcKey] = useState<number>(0);

  const initial = parseFloat(initialInvestment) || 0;
  const ending = parseFloat(finalValue) || 0;
  const cashFlow = parseFloat(interimIncome) || 0;

  const totalReturn = ending + cashFlow - initial;
  const roiPercent = initial > 0 ? (totalReturn / initial) * 100 : 0;
  const capitalMultiple = initial > 0 ? (ending + cashFlow) / initial : 0;

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const handleReset = () => {
    setInitialInvestment('50000');
    setFinalValue('68000');
    setInterimIncome('6000');
    triggerCalculate();
  };

  const copyText = `Initial Investment: ${formatMoney(initial)} | Final Value: ${formatMoney(ending)} | Dividends/Income: ${formatMoney(cashFlow)} | Net Profit: ${totalReturn >= 0 ? '+' : ''}${formatMoney(totalReturn)} | ROI: ${roiPercent >= 0 ? '+' : ''}${formatPercent(roiPercent)} | Multiple: ${capitalMultiple.toFixed(2)}x`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Top Bar with Currency Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          ROI Asset Calculation
        </span>
        <CurrencySelector />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Initial Investment Cost ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="1000"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="50000"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Ending Value / Sale Price ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="1000"
              value={finalValue}
              onChange={(e) => setFinalValue(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="68000"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Interim Cash Flow / Dividends ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="500"
              value={interimIncome}
              onChange={(e) => setInterimIncome(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="6000"
            />
          </div>
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
        primaryLabel="Return on Investment (ROI)"
        primaryValue={`${roiPercent >= 0 ? '+' : ''}${formatPercent(roiPercent)}`}
        primaryHighlight={roiPercent >= 0 ? 'emerald' : 'rose'}
        copyText={copyText}
        breakdown={[
          { label: 'Total Net Gain', value: `${totalReturn >= 0 ? '+' : ''}${formatMoney(totalReturn)}`, highlight: totalReturn >= 0 ? 'emerald' : 'rose' },
          { label: 'Capital Multiple', value: `${capitalMultiple.toFixed(2)}x` },
          { label: 'Interim Dividends', value: formatMoney(cashFlow) },
          { label: 'Original Cost', value: formatMoney(initial) },
          { label: 'Ending Value', value: formatMoney(ending) },
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
