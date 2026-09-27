import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../CurrencySelector';
import { FinalResultCard } from '../FinalResultCard';
import { formatNumber, formatPercent } from '../../utils/formatters';

export function BreakEvenCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [fixedCosts, setFixedCosts] = useState<string>('15000');
  const [unitPrice, setUnitPrice] = useState<string>('50');
  const [variableCost, setVariableCost] = useState<string>('20');
  const [, setCalcKey] = useState<number>(0);

  const fixed = parseFloat(fixedCosts) || 0;
  const price = parseFloat(unitPrice) || 0;
  const variable = parseFloat(variableCost) || 0;

  const contributionMargin = price - variable;
  const contributionRatio = price > 0 ? (contributionMargin / price) * 100 : 0;
  const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fixed / contributionMargin) : 0;
  const breakEvenRevenue = breakEvenUnits * price;

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const handleReset = () => {
    setFixedCosts('15000');
    setUnitPrice('50');
    setVariableCost('20');
    triggerCalculate();
  };

  const copyText = `Break-Even Units: ${formatNumber(breakEvenUnits)} units | Break-Even Revenue: ${formatMoney(breakEvenRevenue)} | Contribution Margin: ${formatMoney(contributionMargin)}/unit (${formatPercent(contributionRatio)})`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Currency Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Cost & Pricing Parameters
        </span>
        <CurrencySelector />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Total Fixed Costs ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="100"
              value={fixedCosts}
              onChange={(e) => setFixedCosts(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="15000"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Unit Selling Price ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="1"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Variable Cost per Unit ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="1"
              value={variableCost}
              onChange={(e) => setVariableCost(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="20"
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
        primaryLabel="Break-Even Volume Required"
        primaryValue={`${formatNumber(breakEvenUnits)} units (${formatMoney(breakEvenRevenue)})`}
        copyText={copyText}
        note={`Required Sales Revenue: ${formatMoney(breakEvenRevenue)}`}
        breakdown={[
          { label: 'Break-Even Units', value: `${formatNumber(breakEvenUnits)} units` },
          { label: 'Break-Even Revenue', value: formatMoney(breakEvenRevenue) },
          { label: 'Contribution Margin', value: `${formatMoney(contributionMargin)} / unit` },
          { label: 'Contribution Ratio', value: formatPercent(contributionRatio) },
          { label: 'Fixed Costs', value: formatMoney(fixed) },
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
