import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../CurrencySelector';
import { FinalResultCard } from '../FinalResultCard';
import { formatPercent } from '../../utils/formatters';

export function InvestmentCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [startingAmount, setStartingAmount] = useState<string>('5000');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('400');
  const [expectedReturn, setExpectedReturn] = useState<string>('8.0');
  const [years, setYears] = useState<string>('20');
  const [, setCalcKey] = useState<number>(0);

  const P = parseFloat(startingAmount) || 0;
  const PMT = parseFloat(monthlyContribution) || 0;
  const annualRate = (parseFloat(expectedReturn) || 0) / 100;
  const t = parseFloat(years) || 0;

  const totalMonths = Math.round(t * 12);
  const monthlyRate = annualRate / 12;

  const fvInitial = P * Math.pow(1 + monthlyRate, totalMonths);

  let fvContributions = 0;
  if (monthlyRate === 0) {
    fvContributions = PMT * totalMonths;
  } else if (totalMonths > 0) {
    fvContributions = PMT * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
  }

  const futureValue = fvInitial + fvContributions;
  const totalPrincipalDeposited = P + (PMT * totalMonths);
  const totalGain = Math.max(0, futureValue - totalPrincipalDeposited);
  const gainPercentage = totalPrincipalDeposited > 0 ? (totalGain / totalPrincipalDeposited) * 100 : 0;

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const handleReset = () => {
    setStartingAmount('5000');
    setMonthlyContribution('400');
    setExpectedReturn('8.0');
    setYears('20');
    triggerCalculate();
  };

  const copyText = `Starting: ${formatMoney(P)} | Monthly: ${formatMoney(PMT)} | Expected Return: ${expectedReturn}% | Horizon: ${years} yrs | Total Invested: ${formatMoney(totalPrincipalDeposited)} | Investment Gains: +${formatMoney(totalGain)} | Future Portfolio Value: ${formatMoney(futureValue)}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Top Bar with Currency Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Investment Portfolio Growth
        </span>
        <CurrencySelector />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Starting Capital ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="500"
              value={startingAmount}
              onChange={(e) => setStartingAmount(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="5000"
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
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Expected Return (%/yr)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.5"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="8.0"
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
            placeholder="20"
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
        primaryLabel="Estimated Future Portfolio Value"
        primaryValue={formatMoney(futureValue)}
        copyText={copyText}
        breakdown={[
          { label: 'Total Investment Gains', value: `+${formatMoney(totalGain)}`, highlight: 'emerald' },
          { label: 'Total Capital Invested', value: formatMoney(totalPrincipalDeposited) },
          { label: 'Growth Ratio', value: `+${formatPercent(gainPercentage)}` },
          { label: 'Portfolio Multiple', value: `${totalPrincipalDeposited > 0 ? (futureValue / totalPrincipalDeposited).toFixed(2) : 0}x` },
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
