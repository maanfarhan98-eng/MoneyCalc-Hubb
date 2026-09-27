import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../CurrencySelector';
import { FinalResultCard } from '../FinalResultCard';

export function MonthlyPaymentCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [purchasePrice, setPurchasePrice] = useState<string>('35000');
  const [downPayment, setDownPayment] = useState<string>('5000');
  const [interestRate, setInterestRate] = useState<string>('5.5');
  const [termYears, setTermYears] = useState<string>('4');
  const [, setCalcKey] = useState<number>(0);

  const price = parseFloat(purchasePrice) || 0;
  const down = parseFloat(downPayment) || 0;
  const principal = Math.max(0, price - down);
  const annualRate = parseFloat(interestRate) || 0;
  const years = parseFloat(termYears) || 0;
  const totalMonths = Math.max(1, years * 12);

  const monthlyRate = (annualRate / 100) / 12;

  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = principal / totalMonths;
  } else {
    monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  const totalRepayment = monthlyPayment * totalMonths;
  const totalInterest = Math.max(0, totalRepayment - principal);

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const handleReset = () => {
    setPurchasePrice('35000');
    setDownPayment('5000');
    setInterestRate('5.5');
    setTermYears('4');
    triggerCalculate();
  };

  const copyText = `Price: ${formatMoney(price)} | Down Payment: ${formatMoney(down)} | Amount Financed: ${formatMoney(principal)} | Monthly Payment: ${formatMoney(monthlyPayment)} | Total Interest: ${formatMoney(totalInterest)} | Total Repayment: ${formatMoney(totalRepayment)}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Top Bar with Currency Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Payment Terms
        </span>
        <CurrencySelector />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Purchase Price ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="500"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="35000"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Down Payment ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="500"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="5000"
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
              placeholder="5.5"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 font-mono">%</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Loan Term
          </label>
          <select
            value={termYears}
            onChange={(e) => {
              setTermYears(e.target.value);
              triggerCalculate();
            }}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base"
          >
            <option value="2">2 Years (24 mos)</option>
            <option value="3">3 Years (36 mos)</option>
            <option value="4">4 Years (48 mos)</option>
            <option value="5">5 Years (60 mos)</option>
            <option value="6">6 Years (72 mos)</option>
            <option value="7">7 Years (84 mos)</option>
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
        primaryLabel="Required Monthly Installment"
        primaryValue={formatMoney(monthlyPayment)}
        copyText={copyText}
        breakdown={[
          { label: 'Amount Financed', value: formatMoney(principal) },
          { label: 'Total Finance Charges', value: formatMoney(totalInterest) },
          { label: 'Total Repaid', value: formatMoney(totalRepayment) },
          { label: 'Term Length', value: `${totalMonths} months` },
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
