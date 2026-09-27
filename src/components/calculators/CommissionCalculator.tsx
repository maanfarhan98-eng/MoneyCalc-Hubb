import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../CurrencySelector';
import { FinalResultCard } from '../FinalResultCard';
import { formatPercent } from '../../utils/formatters';

export function CommissionCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [salesAmount, setSalesAmount] = useState<string>('50000');
  const [commissionRate, setCommissionRate] = useState<string>('8');
  const [baseSalary, setBaseSalary] = useState<string>('2500');
  const [, setCalcKey] = useState<number>(0);

  const sales = parseFloat(salesAmount) || 0;
  const rate = parseFloat(commissionRate) || 0;
  const base = parseFloat(baseSalary) || 0;

  const commissionEarned = sales * (rate / 100);
  const totalPayout = base + commissionEarned;
  const effectiveRate = sales > 0 ? (totalPayout / sales) * 100 : 0;

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const handleReset = () => {
    setSalesAmount('50000');
    setCommissionRate('8');
    setBaseSalary('2500');
    triggerCalculate();
  };

  const copyText = base > 0
    ? `Commission Earned: ${formatMoney(commissionEarned)} (${rate}%) | Base Pay: ${formatMoney(base)} | Total Payout: ${formatMoney(totalPayout)}`
    : `Commission Earned: ${formatMoney(commissionEarned)} (${rate}%) on ${formatMoney(sales)} Sales`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Currency Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Sales Commission Settings
        </span>
        <CurrencySelector />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Total Sales Volume ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="100"
              value={salesAmount}
              onChange={(e) => setSalesAmount(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="50000"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Commission Rate (%)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="8"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 font-mono">%</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Base Salary ({currency.symbol.trim()}) (Optional)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="100"
              value={baseSalary}
              onChange={(e) => setBaseSalary(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="0"
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
        primaryLabel="Total Payout Earnings"
        primaryValue={formatMoney(totalPayout)}
        copyText={copyText}
        breakdown={[
          { label: 'Commission Earned', value: formatMoney(commissionEarned) },
          { label: 'Base Pay', value: formatMoney(base) },
          { label: 'Sales Volume', value: formatMoney(sales) },
          { label: 'Effective Rate', value: formatPercent(effectiveRate) },
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
