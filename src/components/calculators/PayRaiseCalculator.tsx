import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../CurrencySelector';
import { FinalResultCard } from '../FinalResultCard';
import { formatPercent } from '../../utils/formatters';

export function PayRaiseCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [payType, setPayType] = useState<'annual' | 'hourly'>('annual');
  const [currentPay, setCurrentPay] = useState<string>('65000');
  const [raiseType, setRaiseType] = useState<'percent' | 'flat'>('percent');
  const [raiseValue, setRaiseValue] = useState<string>('5');
  const [hoursPerWeek, setHoursPerWeek] = useState<string>('40');
  const [, setCalcKey] = useState<number>(0);

  const hours = parseFloat(hoursPerWeek) || 40;
  const annualHours = hours * 52;
  const cur = parseFloat(currentPay) || 0;
  const rVal = parseFloat(raiseValue) || 0;

  const currentAnnual = payType === 'annual' ? cur : cur * annualHours;
  const currentHourly = payType === 'hourly' ? cur : (annualHours > 0 ? cur / annualHours : 0);

  let raiseAmountAnnual = 0;
  let raisePercentage = 0;

  if (raiseType === 'percent') {
    raisePercentage = rVal;
    raiseAmountAnnual = currentAnnual * (rVal / 100);
  } else {
    // Flat dollar amount entered
    if (payType === 'annual') {
      raiseAmountAnnual = rVal;
      raisePercentage = currentAnnual > 0 ? (rVal / currentAnnual) * 100 : 0;
    } else {
      // Flat hourly raise
      raiseAmountAnnual = rVal * annualHours;
      raisePercentage = currentHourly > 0 ? (rVal / currentHourly) * 100 : 0;
    }
  }

  const newAnnual = currentAnnual + raiseAmountAnnual;
  const newHourly = annualHours > 0 ? newAnnual / annualHours : 0;
  const newMonthly = newAnnual / 12;
  const newBiWeekly = newAnnual / 26;

  const extraMonthly = raiseAmountAnnual / 12;
  const extraBiWeekly = raiseAmountAnnual / 26;
  const extraHourly = annualHours > 0 ? raiseAmountAnnual / annualHours : 0;

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const handleReset = () => {
    setCurrentPay('65000');
    setRaiseValue('5');
    setHoursPerWeek('40');
    setPayType('annual');
    setRaiseType('percent');
    triggerCalculate();
  };

  const copyText = `Previous Salary: ${formatMoney(currentAnnual)} | Raise: +${formatMoney(raiseAmountAnnual)} (+${formatPercent(raisePercentage)}) | New Annual Salary: ${formatMoney(newAnnual)} | New Hourly: ${formatMoney(newHourly)}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Top Bar with Currency Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Salary & Raise Configuration
        </span>
        <CurrencySelector />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Pay Frequency
          </label>
          <select
            value={payType}
            onChange={(e) => {
              const next = e.target.value as 'annual' | 'hourly';
              setPayType(next);
              setCurrentPay(next === 'annual' ? '65000' : '31.25');
              triggerCalculate();
            }}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base"
          >
            <option value="annual">Annual Salary</option>
            <option value="hourly">Hourly Wage</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Current Pay ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step={payType === 'annual' ? '1000' : '0.25'}
              value={currentPay}
              onChange={(e) => setCurrentPay(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder={payType === 'annual' ? '65000' : '31.25'}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Raise Type
          </label>
          <select
            value={raiseType}
            onChange={(e) => {
              setRaiseType(e.target.value as 'percent' | 'flat');
              triggerCalculate();
            }}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base"
          >
            <option value="percent">Percentage (%)</option>
            <option value="flat">Fixed Cash ({currency.symbol.trim()})</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            {raiseType === 'percent' ? 'Raise Percentage (%)' : `Raise Amount (${currency.symbol.trim()})`}
          </label>
          <div className="relative">
            {raiseType === 'flat' && <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>}
            <input
              type="number"
              step={raiseType === 'percent' ? '0.5' : '100'}
              value={raiseValue}
              onChange={(e) => setRaiseValue(e.target.value)}
              className={`w-full ${raiseType === 'flat' ? 'pl-9' : 'pl-4'} pr-8 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums`}
              placeholder={raiseType === 'percent' ? '5' : '3000'}
            />
            {raiseType === 'percent' && <span className="absolute right-3 top-2.5 text-slate-400 font-mono">%</span>}
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
        primaryLabel="New Total Annual Salary"
        primaryValue={formatMoney(newAnnual)}
        copyText={copyText}
        note={`Increase: +${formatMoney(raiseAmountAnnual)} / yr (+${formatPercent(raisePercentage)})`}
        breakdown={[
          { label: 'New Hourly', value: `${formatMoney(newHourly)} (+${formatMoney(extraHourly)})` },
          { label: 'New Monthly', value: `${formatMoney(newMonthly)} (+${formatMoney(extraMonthly)})` },
          { label: 'New Bi-Weekly', value: `${formatMoney(newBiWeekly)} (+${formatMoney(extraBiWeekly)})` },
          { label: 'Previous Base', value: formatMoney(currentAnnual) },
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
