import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../CurrencySelector';
import { FinalResultCard } from '../FinalResultCard';

export function OvertimePayCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [hourlyRate, setHourlyRate] = useState<string>('26.00');
  const [standardHours, setStandardHours] = useState<string>('40');
  const [totalHoursWorked, setTotalHoursWorked] = useState<string>('48');
  const [otMultiplier, setOtMultiplier] = useState<string>('1.5');
  const [, setCalcKey] = useState<number>(0);

  const rate = parseFloat(hourlyRate) || 0;
  const standard = parseFloat(standardHours) || 40;
  const totalHours = parseFloat(totalHoursWorked) || 0;
  const multiplier = parseFloat(otMultiplier) || 1.5;

  const regularHours = Math.min(totalHours, standard);
  const overtimeHours = Math.max(0, totalHours - standard);

  const regularPay = regularHours * rate;
  const overtimeRate = rate * multiplier;
  const overtimePay = overtimeHours * overtimeRate;
  const grossPay = regularPay + overtimePay;

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const handleReset = () => {
    setHourlyRate('26.00');
    setStandardHours('40');
    setTotalHoursWorked('48');
    setOtMultiplier('1.5');
    triggerCalculate();
  };

  const copyText = `Regular Pay: ${formatMoney(regularPay)} (${regularHours} hrs) | Overtime Pay: ${formatMoney(overtimePay)} (${overtimeHours} hrs @ ${multiplier}x) | Total Gross Pay: ${formatMoney(grossPay)}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Currency Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Overtime Wage Settings
        </span>
        <CurrencySelector />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Hourly Rate ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="0.5"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="26.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Total Hours Worked
          </label>
          <input
            type="number"
            step="0.5"
            value={totalHoursWorked}
            onChange={(e) => setTotalHoursWorked(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
            placeholder="48"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Regular Hours Cap
          </label>
          <input
            type="number"
            step="1"
            value={standardHours}
            onChange={(e) => setStandardHours(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
            placeholder="40"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Overtime Multiplier
          </label>
          <select
            value={otMultiplier}
            onChange={(e) => setOtMultiplier(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base"
          >
            <option value="1.5">1.5x (Time and a Half)</option>
            <option value="2.0">2.0x (Double Time)</option>
            <option value="1.25">1.25x</option>
            <option value="2.5">2.5x</option>
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
        primaryLabel="Total Gross Pay (Regular + Overtime)"
        primaryValue={formatMoney(grossPay)}
        copyText={copyText}
        breakdown={[
          { label: 'Regular Pay', value: `${formatMoney(regularPay)} (${regularHours} hrs)` },
          { label: 'Overtime Pay', value: `${formatMoney(overtimePay)} (${overtimeHours} hrs)` },
          { label: 'Overtime Rate', value: `${formatMoney(overtimeRate)} / hr` },
          { label: 'Total Hours', value: `${totalHours} hrs` },
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
