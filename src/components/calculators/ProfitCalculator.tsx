import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../CurrencySelector';
import { FinalResultCard } from '../FinalResultCard';
import { formatPercent } from '../../utils/formatters';

export function ProfitCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [revenue, setRevenue] = useState<string>('50000');
  const [cogs, setCogs] = useState<string>('20000');
  const [operatingExpenses, setOperatingExpenses] = useState<string>('12000');
  const [, setCalcKey] = useState<number>(0);

  const rev = parseFloat(revenue) || 0;
  const directCost = parseFloat(cogs) || 0;
  const opex = parseFloat(operatingExpenses) || 0;

  const totalCosts = directCost + opex;
  const grossProfit = rev - directCost;
  const netProfit = rev - totalCosts;

  const grossProfitMargin = rev > 0 ? (grossProfit / rev) * 100 : 0;
  const netProfitMargin = rev > 0 ? (netProfit / rev) * 100 : 0;
  const markupOnTotalCost = totalCosts > 0 ? (netProfit / totalCosts) * 100 : 0;

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const handleReset = () => {
    setRevenue('50000');
    setCogs('20000');
    setOperatingExpenses('12000');
    triggerCalculate();
  };

  const copyText = `Revenue: ${formatMoney(rev)} | Total Costs: ${formatMoney(totalCosts)} | Profit: ${formatMoney(netProfit)} | Profit Margin: ${formatPercent(netProfitMargin)}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Currency Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Profit Analysis
        </span>
        <CurrencySelector />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Total Revenue ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="500"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="50000"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Cost of Goods (COGS) ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="500"
              value={cogs}
              onChange={(e) => setCogs(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="20000"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Operating Expenses ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="500"
              value={operatingExpenses}
              onChange={(e) => setOperatingExpenses(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="12000"
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
        primaryLabel="Net Business Profit"
        primaryValue={formatMoney(netProfit)}
        primaryHighlight={netProfit >= 0 ? 'emerald' : 'rose'}
        copyText={copyText}
        breakdown={[
          { label: 'Revenue', value: formatMoney(rev) },
          { label: 'Total Costs', value: formatMoney(totalCosts) },
          { label: 'Net Profit', value: formatMoney(netProfit), highlight: netProfit >= 0 ? 'emerald' : 'rose' },
          { label: 'Profit Margin', value: formatPercent(netProfitMargin), highlight: netProfitMargin >= 0 ? 'emerald' : 'rose' },
          { label: 'Gross Profit', value: formatMoney(grossProfit) },
          { label: 'Markup on Cost', value: formatPercent(markupOnTotalCost) },
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
