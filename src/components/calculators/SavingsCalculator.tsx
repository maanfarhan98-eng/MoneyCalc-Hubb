import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../CurrencySelector';
import { FinalResultCard } from '../FinalResultCard';

export function SavingsCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [initialDeposit, setInitialDeposit] = useState<string>('1000');
  const [monthlyDeposit, setMonthlyDeposit] = useState<string>('250');
  const [apy, setApy] = useState<string>('4.5');
  const [years, setYears] = useState<string>('5');
  const [, setCalcKey] = useState<number>(0);

  const P = parseFloat(initialDeposit) || 0;
  const PMT = parseFloat(monthlyDeposit) || 0;
  const annualApy = (parseFloat(apy) || 0) / 100;
  const t = parseFloat(years) || 0;

  const totalMonths = Math.round(t * 12);
  const monthlyRate = annualApy / 12;

  const fvPrincipal = P * Math.pow(1 + monthlyRate, totalMonths);
  let fvDeposits = 0;
  if (monthlyRate === 0) {
    fvDeposits = PMT * totalMonths;
  } else if (totalMonths > 0) {
    fvDeposits = PMT * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
  }

  const finalBalance = fvPrincipal + fvDeposits;
  const totalContributed = P + (PMT * totalMonths);
  const totalInterestEarned = Math.max(0, finalBalance - totalContributed);

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const handleReset = () => {
    setInitialDeposit('1000');
    setMonthlyDeposit('250');
    setApy('4.5');
    setYears('5');
    triggerCalculate();
  };

  const copyText = `Initial Deposit: ${formatMoney(P)} | Monthly Contribution: ${formatMoney(PMT)} | APY: ${apy}% | Duration: ${years} yrs | Total Cash Deposited: ${formatMoney(totalContributed)} | Interest Earned: +${formatMoney(totalInterestEarned)} | Final Savings: ${formatMoney(finalBalance)}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Top Bar with Currency Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Savings Plan Options
        </span>
        <CurrencySelector />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Initial Deposit ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="100"
              value={initialDeposit}
              onChange={(e) => setInitialDeposit(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="1000"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Monthly Contribution ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="50"
              value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="250"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Interest Rate / APY (%)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={apy}
              onChange={(e) => setApy(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="4.5"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 font-mono">%</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Savings Duration (Years)
          </label>
          <input
            type="number"
            step="1"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
            placeholder="5"
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
        primaryLabel="Total Accumulated Savings"
        primaryValue={formatMoney(finalBalance)}
        copyText={copyText}
        breakdown={[
          { label: 'Interest Earned', value: `+${formatMoney(totalInterestEarned)}`, highlight: 'emerald' },
          { label: 'Total Cash Deposited', value: formatMoney(totalContributed) },
          { label: 'Monthly Deposit', value: `${formatMoney(PMT)} / mo` },
          { label: 'Timeline', value: `${totalMonths} months (${years} yrs)` },
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
