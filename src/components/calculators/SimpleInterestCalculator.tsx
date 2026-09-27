import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../CurrencySelector';
import { FinalResultCard } from '../FinalResultCard';

export function SimpleInterestCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [principal, setPrincipal] = useState<string>('5000');
  const [rate, setRate] = useState<string>('5');
  const [timeUnit, setTimeUnit] = useState<'years' | 'months' | 'days'>('years');
  const [timeValue, setTimeValue] = useState<string>('3');
  const [, setCalcKey] = useState<number>(0);

  const p = parseFloat(principal) || 0;
  const r = parseFloat(rate) || 0;
  const tVal = parseFloat(timeValue) || 0;

  // Convert time to years
  let tInYears = tVal;
  if (timeUnit === 'months') {
    tInYears = tVal / 12;
  } else if (timeUnit === 'days') {
    tInYears = tVal / 365;
  }

  const interestEarned = p * (r / 100) * tInYears;
  const totalAmount = p + interestEarned;

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const handleReset = () => {
    setPrincipal('5000');
    setRate('5');
    setTimeUnit('years');
    setTimeValue('3');
    triggerCalculate();
  };

  const copyText = `Principal: ${formatMoney(p)} | Interest Rate: ${r}% | Time: ${tVal} ${timeUnit} | Simple Interest: ${formatMoney(interestEarned)} | Final Total: ${formatMoney(totalAmount)}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Currency Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Interest Settings
        </span>
        <CurrencySelector />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Principal Amount ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="100"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="5000"
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
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="5"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 font-mono">%</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Duration
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="1"
              value={timeValue}
              onChange={(e) => setTimeValue(e.target.value)}
              className="w-1/2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="3"
            />
            <select
              value={timeUnit}
              onChange={(e) => {
                setTimeUnit(e.target.value as 'years' | 'months' | 'days');
                triggerCalculate();
              }}
              className="w-1/2 px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
            >
              <option value="years">Years</option>
              <option value="months">Months</option>
              <option value="days">Days</option>
            </select>
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
        primaryLabel="Total Accumulated Balance"
        primaryValue={formatMoney(totalAmount)}
        copyText={copyText}
        breakdown={[
          { label: 'Simple Interest', value: formatMoney(interestEarned) },
          { label: 'Initial Principal', value: formatMoney(p) },
          { label: 'Interest Rate', value: `${r}%` },
          { label: 'Time Elapsed', value: `${tInYears.toFixed(2)} yrs (${tVal} ${timeUnit})` },
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
