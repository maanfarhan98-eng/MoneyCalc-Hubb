import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../CurrencySelector';
import { FinalResultCard } from '../FinalResultCard';
import { formatPercent } from '../../utils/formatters';

export function CompoundInterestCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [initialPrincipal, setInitialPrincipal] = useState<string>('10000');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('100');
  const [interestRate, setInterestRate] = useState<string>('7.0');
  const [years, setYears] = useState<string>('10');
  const [compoundFrequency, setCompoundFrequency] = useState<string>('12'); // 12 = monthly
  const [, setCalcKey] = useState<number>(0);

  const P = parseFloat(initialPrincipal) || 0;
  const PMT = parseFloat(monthlyContribution) || 0;
  const r = (parseFloat(interestRate) || 0) / 100;
  const t = parseFloat(years) || 0;
  const n = parseFloat(compoundFrequency) || 12;

  const fvPrincipal = P * Math.pow(1 + r / n, n * t);

  const totalMonths = Math.round(t * 12);
  let fvDeposits = 0;
  if (PMT > 0 && totalMonths > 0) {
    if (r === 0) {
      fvDeposits = PMT * totalMonths;
    } else {
      const rMonthly = r / 12;
      fvDeposits = PMT * ((Math.pow(1 + rMonthly, totalMonths) - 1) / rMonthly);
    }
  }

  const finalBalance = fvPrincipal + (PMT > 0 ? fvDeposits : 0);
  const totalDeposited = P + (PMT * totalMonths);
  const totalInterestEarned = Math.max(0, finalBalance - totalDeposited);

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const handleReset = () => {
    setInitialPrincipal('10000');
    setMonthlyContribution('100');
    setInterestRate('7.0');
    setYears('10');
    setCompoundFrequency('12');
    triggerCalculate();
  };

  const copyText = `Initial: ${formatMoney(P)} | Monthly Deposit: ${formatMoney(PMT)} | Interest Rate: ${interestRate}% | Compound Growth: ${formatMoney(totalInterestEarned)} | Final Balance: ${formatMoney(finalBalance)} (${years} yrs)`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Currency Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Compound Growth Parameters
        </span>
        <CurrencySelector />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Initial Principal ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="500"
              value={initialPrincipal}
              onChange={(e) => setInitialPrincipal(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="10000"
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
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Annual Interest Rate (%)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="7.0"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 font-mono">%</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Time Horizon (Years)
          </label>
          <input
            type="number"
            step="1"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
            placeholder="10"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Compounding Frequency
          </label>
          <select
            value={compoundFrequency}
            onChange={(e) => {
              setCompoundFrequency(e.target.value);
              triggerCalculate();
            }}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base"
          >
            <option value="12">Compounded Monthly (12/yr)</option>
            <option value="365">Compounded Daily (365/yr)</option>
            <option value="4">Compounded Quarterly (4/yr)</option>
            <option value="2">Compounded Semi-Annually (2/yr)</option>
            <option value="1">Compounded Annually (1/yr)</option>
          </select>
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
        primaryLabel="Final Compound Balance"
        primaryValue={formatMoney(finalBalance)}
        copyText={copyText}
        breakdown={[
          { label: 'Total Interest Earned', value: `+${formatMoney(totalInterestEarned)}`, highlight: 'emerald' },
          { label: 'Total Cash Deposited', value: formatMoney(totalDeposited) },
          { label: 'Interest Share', value: formatPercent(finalBalance > 0 ? (totalInterestEarned / finalBalance) * 100 : 0) },
          { label: 'Horizon', value: `${years} Years (${totalMonths} mos)` },
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
