import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../CurrencySelector';
import { FinalResultCard } from '../FinalResultCard';

export function SalaryCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [inputType, setInputType] = useState<'hourly' | 'annual'>('hourly');
  const [hourlyWage, setHourlyWage] = useState<string>('32.00');
  const [annualWage, setAnnualWage] = useState<string>('66560');
  const [hoursPerWeek, setHoursPerWeek] = useState<string>('40');
  const [weeksPerYear, setWeeksPerYear] = useState<string>('52');
  const [, setCalcKey] = useState<number>(0);

  const hours = parseFloat(hoursPerWeek) || 40;
  const weeks = parseFloat(weeksPerYear) || 52;
  const totalWorkHours = hours * weeks;

  let computedAnnual = 0;
  let computedHourly = 0;

  if (inputType === 'hourly') {
    computedHourly = parseFloat(hourlyWage) || 0;
    computedAnnual = computedHourly * totalWorkHours;
  } else {
    computedAnnual = parseFloat(annualWage) || 0;
    computedHourly = totalWorkHours > 0 ? computedAnnual / totalWorkHours : 0;
  }

  const computedMonthly = computedAnnual / 12;
  const computedSemiMonthly = computedAnnual / 24;
  const computedBiWeekly = computedAnnual / 26;
  const computedWeekly = weeks > 0 ? computedAnnual / weeks : 0;
  const computedDaily = hours > 0 ? (computedWeekly / 5) : 0;

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const handleReset = () => {
    setHourlyWage('32.00');
    setAnnualWage('66560');
    setHoursPerWeek('40');
    setWeeksPerYear('52');
    triggerCalculate();
  };

  const copyText = `Hourly: ${formatMoney(computedHourly)} | Weekly: ${formatMoney(computedWeekly)} | Bi-Weekly: ${formatMoney(computedBiWeekly)} | Monthly: ${formatMoney(computedMonthly)} | Annual Salary: ${formatMoney(computedAnnual)}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Top Bar with Currency Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Salary Frequency
        </span>
        <CurrencySelector />
      </div>

      {/* Mode toggle */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => {
            setInputType('hourly');
            triggerCalculate();
          }}
          className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            inputType === 'hourly'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Enter Hourly Wage
        </button>
        <button
          type="button"
          onClick={() => {
            setInputType('annual');
            triggerCalculate();
          }}
          className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            inputType === 'annual'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Enter Annual Salary
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {inputType === 'hourly' ? (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Hourly Wage ({currency.symbol.trim()})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
              <input
                type="number"
                step="0.5"
                value={hourlyWage}
                onChange={(e) => setHourlyWage(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
                placeholder="32.00"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Annual Salary ({currency.symbol.trim()})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
              <input
                type="number"
                step="1000"
                value={annualWage}
                onChange={(e) => setAnnualWage(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
                placeholder="66560"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Hours per Week
          </label>
          <input
            type="number"
            step="1"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
            placeholder="40"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Weeks per Year
          </label>
          <input
            type="number"
            step="1"
            value={weeksPerYear}
            onChange={(e) => setWeeksPerYear(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
            placeholder="52"
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
        primaryLabel={inputType === 'hourly' ? 'Equivalent Annual Salary' : 'Equivalent Hourly Rate'}
        primaryValue={inputType === 'hourly' ? formatMoney(computedAnnual) : formatMoney(computedHourly)}
        copyText={copyText}
        breakdown={[
          { label: 'Hourly Rate', value: formatMoney(computedHourly) },
          { label: 'Weekly Pay', value: formatMoney(computedWeekly) },
          { label: 'Bi-Weekly Pay', value: formatMoney(computedBiWeekly) },
          { label: 'Monthly Pay', value: formatMoney(computedMonthly) },
          { label: 'Semi-Monthly', value: formatMoney(computedSemiMonthly) },
          { label: 'Annual Salary', value: formatMoney(computedAnnual) },
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
