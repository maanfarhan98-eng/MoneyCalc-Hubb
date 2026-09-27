import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../CurrencySelector';
import { FinalResultCard } from '../FinalResultCard';

export function LoanPayoffCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [balance, setBalance] = useState<string>('20000');
  const [interestRate, setInterestRate] = useState<string>('7.0');
  const [monthlyPayment, setMonthlyPayment] = useState<string>('300');
  const [extraPayment, setExtraPayment] = useState<string>('100');
  const [, setCalcKey] = useState<number>(0);

  const P = parseFloat(balance) || 0;
  const annualRate = parseFloat(interestRate) || 0;
  const regularM = parseFloat(monthlyPayment) || 0;
  const extraM = parseFloat(extraPayment) || 0;

  const r = (annualRate / 100) / 12;

  const simulatePayoff = (principal: number, monthlyRate: number, pmt: number) => {
    if (principal <= 0 || pmt <= 0) return { months: 0, totalInterest: 0, possible: false };
    const firstMonthInterest = principal * monthlyRate;
    if (pmt <= firstMonthInterest) {
      return { months: 0, totalInterest: 0, possible: false };
    }

    let curBal = principal;
    let months = 0;
    let totalInterest = 0;

    while (curBal > 0.01 && months < 600) {
      months++;
      const interest = curBal * monthlyRate;
      totalInterest += interest;
      const principalPaid = Math.min(curBal, pmt - interest);
      curBal -= principalPaid;
    }

    return { months, totalInterest, possible: true };
  };

  const standardPlan = simulatePayoff(P, r, regularM);
  const acceleratedPlan = simulatePayoff(P, r, regularM + extraM);

  const monthsSaved = Math.max(0, standardPlan.months - acceleratedPlan.months);
  const interestSaved = Math.max(0, standardPlan.totalInterest - acceleratedPlan.totalInterest);

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const handleReset = () => {
    setBalance('20000');
    setInterestRate('7.0');
    setMonthlyPayment('300');
    setExtraPayment('100');
    triggerCalculate();
  };

  const copyText = standardPlan.possible
    ? `Interest Saved: ${formatMoney(interestSaved)} | Time Saved: ${monthsSaved} months (${(monthsSaved / 12).toFixed(1)} yrs) | Accelerated Payoff: ${acceleratedPlan.months} months vs Original: ${standardPlan.months} months`
    : '';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Top Bar with Currency Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Payoff Acceleration
        </span>
        <CurrencySelector />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Remaining Balance ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="500"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="20000"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Interest Rate (% APR)
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
            Monthly Payment ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="25"
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="300"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Extra Payment / Month ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="25"
              value={extraPayment}
              onChange={(e) => setExtraPayment(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="100"
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
      {standardPlan.possible ? (
        <FinalResultCard
          title="Final Result"
          primaryLabel="Total Interest Dollars Saved"
          primaryValue={formatMoney(interestSaved)}
          note={`You will be debt-free ${monthsSaved} months sooner!`}
          copyText={copyText}
          breakdown={[
            { label: 'Accelerated Payoff', value: `${acceleratedPlan.months} months (${(acceleratedPlan.months / 12).toFixed(1)} yrs)` },
            { label: 'Original Payoff', value: `${standardPlan.months} months (${(standardPlan.months / 12).toFixed(1)} yrs)` },
            { label: 'Accelerated Interest', value: formatMoney(acceleratedPlan.totalInterest) },
            { label: 'Original Interest', value: formatMoney(standardPlan.totalInterest) },
          ]}
        />
      ) : (
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300">
          Monthly payment of {formatMoney(regularM)} is not high enough to cover initial monthly interest of {formatMoney(P * r)}. Please increase monthly payment.
        </div>
      )}

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
