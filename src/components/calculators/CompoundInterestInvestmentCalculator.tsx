import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../CurrencySelector';
import { FinalResultCard } from '../FinalResultCard';

export function CompoundInterestInvestmentCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [initialInvestment, setInitialInvestment] = useState<string>('15000');
  const [recurringContribution, setRecurringContribution] = useState<string>('300');
  const [annualRate, setAnnualRate] = useState<string>('9.0');
  const [compoundingFreq, setCompoundingFreq] = useState<string>('4'); // 4 = quarterly
  const [years, setYears] = useState<string>('15');
  const [, setCalcKey] = useState<number>(0);

  const P = parseFloat(initialInvestment) || 0;
  const PMT = parseFloat(recurringContribution) || 0;
  const r = (parseFloat(annualRate) || 0) / 100;
  const n = parseFloat(compoundingFreq) || 4;
  const t = parseFloat(years) || 0;

  const totalMonths = Math.round(t * 12);

  const fvPrincipal = P * Math.pow(1 + r / n, n * t);

  let fvDeposits = 0;
  if (PMT > 0 && totalMonths > 0) {
    if (r === 0) {
      fvDeposits = PMT * totalMonths;
    } else {
      const rMonthly = r / 12;
      fvDeposits = PMT * ((Math.pow(1 + rMonthly, totalMonths) - 1) / rMonthly);
    }
  }

  const finalValue = fvPrincipal + (PMT > 0 ? fvDeposits : 0);
  const totalPrincipalDeposited = P + (PMT * totalMonths);
  const totalCompoundEarnings = Math.max(0, finalValue - totalPrincipalDeposited);
  const multiple = totalPrincipalDeposited > 0 ? finalValue / totalPrincipalDeposited : 0;

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const handleReset = () => {
    setInitialInvestment('15000');
    setRecurringContribution('300');
    setAnnualRate('9.0');
    setCompoundingFreq('4');
    setYears('15');
    triggerCalculate();
  };

  const copyText = `Initial Investment: ${formatMoney(P)} | Monthly Deposit: ${formatMoney(PMT)} | Expected Return: ${annualRate}% (${compoundingFreq}x/yr) | Duration: ${years} yrs | Total Invested: ${formatMoney(totalPrincipalDeposited)} | Compound Growth: +${formatMoney(totalCompoundEarnings)} | Final Portfolio Valuation: ${formatMoney(finalValue)}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Top Bar with Currency Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Compound Investment Setup
        </span>
        <CurrencySelector />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              placeholder="15000"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Monthly Addition ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="50"
              value={recurringContribution}
              onChange={(e) => setRecurringContribution(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="300"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Annual Return Rate (%)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="9.0"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 font-mono">%</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Investment Horizon (Years)
          </label>
          <input
            type="number"
            step="1"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
            placeholder="15"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Compounding Frequency
          </label>
          <select
            value={compoundingFreq}
            onChange={(e) => {
              setCompoundingFreq(e.target.value);
              triggerCalculate();
            }}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base"
          >
            <option value="4">Compounded Quarterly (4 times / year)</option>
            <option value="12">Compounded Monthly (12 times / year)</option>
            <option value="365">Compounded Daily (365 times / year)</option>
            <option value="2">Compounded Semi-Annually (2 times / year)</option>
            <option value="1">Compounded Annually (1 time / year)</option>
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
        primaryLabel="Estimated Future Investment Valuation"
        primaryValue={formatMoney(finalValue)}
        copyText={copyText}
        breakdown={[
          { label: 'Compound Growth', value: `+${formatMoney(totalCompoundEarnings)}`, highlight: 'emerald' },
          { label: 'Total Invested Principal', value: formatMoney(totalPrincipalDeposited) },
          { label: 'Growth Multiplier', value: `${multiple.toFixed(2)}x` },
          { label: 'Holding Period', value: `${years} yrs (${totalMonths} mos)` },
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
