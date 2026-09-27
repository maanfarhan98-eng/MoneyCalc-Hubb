import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../CurrencySelector';
import { FinalResultCard } from '../FinalResultCard';
import { formatPercent } from '../../utils/formatters';

export function ProfitMarginCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [calculationMode, setCalculationMode] = useState<'from_cost_price' | 'from_cost_margin'>('from_cost_price');
  const [cost, setCost] = useState<string>('60.00');
  const [revenue, setRevenue] = useState<string>('100.00');
  const [targetMargin, setTargetMargin] = useState<string>('40');
  const [, setCalcKey] = useState<number>(0);

  const costVal = parseFloat(cost) || 0;
  const revVal = parseFloat(revenue) || 0;
  const targetMarginVal = parseFloat(targetMargin) || 0;

  let computedRevenue = revVal;
  let computedMargin = 0;
  let computedProfit = 0;
  let computedMarkup = 0;

  if (calculationMode === 'from_cost_price') {
    computedProfit = revVal - costVal;
    computedMargin = revVal > 0 ? (computedProfit / revVal) * 100 : 0;
    computedMarkup = costVal > 0 ? (computedProfit / costVal) * 100 : 0;
  } else {
    // Solve price for target margin: Price = Cost / (1 - Margin/100)
    const factor = 1 - (targetMarginVal / 100);
    computedRevenue = factor > 0 ? costVal / factor : 0;
    computedProfit = computedRevenue - costVal;
    computedMargin = targetMarginVal;
    computedMarkup = costVal > 0 ? (computedProfit / costVal) * 100 : 0;
  }

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const handleReset = () => {
    setCost('60.00');
    setRevenue('100.00');
    setTargetMargin('40');
    triggerCalculate();
  };

  const copyText = calculationMode === 'from_cost_price'
    ? `Revenue: ${formatMoney(computedRevenue)} | Cost: ${formatMoney(costVal)} | Profit: ${formatMoney(computedProfit)} | Profit Margin: ${formatPercent(computedMargin)} | Markup: ${formatPercent(computedMarkup)}`
    : `Required Price: ${formatMoney(computedRevenue)} | Cost: ${formatMoney(costVal)} | Target Margin: ${formatPercent(computedMargin)} | Profit: ${formatMoney(computedProfit)}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Top Bar with Currency Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Profit Margin Mode
        </span>
        <CurrencySelector />
      </div>

      {/* Sub-mode selector */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => {
            setCalculationMode('from_cost_price');
            triggerCalculate();
          }}
          className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            calculationMode === 'from_cost_price'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Calculate Margin from Cost & Price
        </button>
        <button
          type="button"
          onClick={() => {
            setCalculationMode('from_cost_margin');
            triggerCalculate();
          }}
          className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            calculationMode === 'from_cost_margin'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Calculate Selling Price from Target Margin
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Unit Cost ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="60.00"
            />
          </div>
        </div>

        {calculationMode === 'from_cost_price' ? (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Selling Price ({currency.symbol.trim()})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
              <input
                type="number"
                step="0.01"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
                placeholder="100.00"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Target Profit Margin (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                value={targetMargin}
                onChange={(e) => setTargetMargin(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
                placeholder="40"
              />
              <span className="absolute right-3 top-2.5 text-slate-400 font-mono">%</span>
            </div>
          </div>
        )}
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
        primaryLabel={calculationMode === 'from_cost_price' ? 'Gross Profit Margin' : 'Required Selling Price'}
        primaryValue={calculationMode === 'from_cost_price' ? formatPercent(computedMargin) : formatMoney(computedRevenue)}
        copyText={copyText}
        breakdown={[
          { label: 'Selling Price', value: formatMoney(computedRevenue) },
          { label: 'Unit Cost', value: formatMoney(costVal) },
          { label: 'Gross Profit ($)', value: formatMoney(computedProfit) },
          { label: 'Profit Margin', value: formatPercent(computedMargin) },
          { label: 'Markup on Cost', value: formatPercent(computedMarkup) },
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
