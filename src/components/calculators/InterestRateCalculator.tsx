import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../CurrencySelector';
import { FinalResultCard } from '../FinalResultCard';
import { formatPercent } from '../../utils/formatters';

export function InterestRateCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [calculationMode, setCalculationMode] = useState<'amortized' | 'simple'>('amortized');

  // Amortized inputs
  const [loanPrincipal, setLoanPrincipal] = useState<string>('10000');
  const [monthlyPayment, setMonthlyPayment] = useState<string>('310');
  const [loanMonths, setLoanMonths] = useState<string>('36');

  // Simple interest inputs
  const [simplePrincipal, setSimplePrincipal] = useState<string>('5000');
  const [simpleInterestEarned, setSimpleInterestEarned] = useState<string>('750');
  const [simpleYears, setSimpleYears] = useState<string>('3');

  const [, setCalcKey] = useState<number>(0);

  // Amortized APR bisection numerical solver
  const solveAmortizedApr = (P: number, M: number, n: number): number | null => {
    if (P <= 0 || M <= 0 || n <= 0) return null;
    if (M * n <= P) return 0; // 0% or negative interest

    let low = 0.000001;
    let high = 1.0;
    let mid = 0;

    for (let i = 0; i < 100; i++) {
      mid = (low + high) / 2;
      const factor = Math.pow(1 + mid, n);
      const computedM = (P * mid * factor) / (factor - 1);

      if (Math.abs(computedM - M) < 0.00001) {
        break;
      }

      if (computedM < M) {
        low = mid;
      } else {
        high = mid;
      }
    }

    const annualApr = mid * 12 * 100;
    return annualApr;
  };

  const P = parseFloat(loanPrincipal) || 0;
  const M = parseFloat(monthlyPayment) || 0;
  const n = parseFloat(loanMonths) || 0;
  const totalRepaid = M * n;
  const totalFinanceCharge = Math.max(0, totalRepaid - P);

  const solvedApr = solveAmortizedApr(P, M, n);

  // Simple Interest Rate
  const sP = parseFloat(simplePrincipal) || 0;
  const sI = parseFloat(simpleInterestEarned) || 0;
  const sT = parseFloat(simpleYears) || 0;
  const simpleRate = (sP > 0 && sT > 0) ? (sI / (sP * sT)) * 100 : 0;

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const handleReset = () => {
    setLoanPrincipal('10000');
    setMonthlyPayment('310');
    setLoanMonths('36');
    setSimplePrincipal('5000');
    setSimpleInterestEarned('750');
    setSimpleYears('3');
    triggerCalculate();
  };

  const copyText = calculationMode === 'amortized'
    ? `Principal: ${formatMoney(P)} | Monthly Payment: ${formatMoney(M)} | Months: ${n} | Implied APR: ${solvedApr !== null ? formatPercent(solvedApr) : 'N/A'} | Total Finance Charge: ${formatMoney(totalFinanceCharge)}`
    : `Principal: ${formatMoney(sP)} | Total Interest: ${formatMoney(sI)} | Time: ${sT} yrs | Annual Simple Interest Rate: ${formatPercent(simpleRate)}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Top Bar with Currency Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Interest Rate Model
        </span>
        <CurrencySelector />
      </div>

      {/* Sub-mode selector */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => {
            setCalculationMode('amortized');
            triggerCalculate();
          }}
          className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            calculationMode === 'amortized'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Calculate Loan APR from Monthly Payment
        </button>
        <button
          type="button"
          onClick={() => {
            setCalculationMode('simple');
            triggerCalculate();
          }}
          className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            calculationMode === 'simple'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Calculate Simple Interest Rate
        </button>
      </div>

      {calculationMode === 'amortized' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Loan Amount ({currency.symbol.trim()})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
                <input
                  type="number"
                  step="500"
                  value={loanPrincipal}
                  onChange={(e) => setLoanPrincipal(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
                  placeholder="10000"
                />
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
                  step="10"
                  value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
                  placeholder="310"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Total Term (Months)
              </label>
              <input
                type="number"
                step="6"
                value={loanMonths}
                onChange={(e) => setLoanMonths(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
                placeholder="36"
              />
            </div>
          </div>

          {/* Calculate Button */}
          <div>
            <button
              type="button"
              onClick={triggerCalculate}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <CalcIcon className="w-4 h-4" />
              <span>Calculate</span>
            </button>
          </div>

          <FinalResultCard
            title="Final Result"
            primaryLabel="Implied Annual Interest Rate (APR)"
            primaryValue={solvedApr !== null ? formatPercent(solvedApr) : 'Unable to solve'}
            copyText={copyText}
            breakdown={[
              { label: 'Total Finance Charges', value: formatMoney(totalFinanceCharge) },
              { label: 'Total Repayment', value: formatMoney(totalRepaid) },
              { label: 'Monthly Rate', value: solvedApr !== null ? formatPercent(solvedApr / 12) : '0%' },
              { label: 'Loan Principal', value: formatMoney(P) },
            ]}
          />
        </div>
      ) : (
        <div className="space-y-6">
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
                  value={simplePrincipal}
                  onChange={(e) => setSimplePrincipal(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
                  placeholder="5000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Total Interest Paid ({currency.symbol.trim()})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
                <input
                  type="number"
                  step="50"
                  value={simpleInterestEarned}
                  onChange={(e) => setSimpleInterestEarned(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
                  placeholder="750"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Time Period (Years)
              </label>
              <input
                type="number"
                step="0.5"
                value={simpleYears}
                onChange={(e) => setSimpleYears(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
                placeholder="3"
              />
            </div>
          </div>

          {/* Calculate Button */}
          <div>
            <button
              type="button"
              onClick={triggerCalculate}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <CalcIcon className="w-4 h-4" />
              <span>Calculate</span>
            </button>
          </div>

          <FinalResultCard
            title="Final Result"
            primaryLabel="Annual Simple Interest Rate"
            primaryValue={formatPercent(simpleRate)}
            copyText={copyText}
            note={`Formula: (${formatMoney(sI)} / (${formatMoney(sP)} × ${sT})) × 100 = ${formatPercent(simpleRate)}`}
            breakdown={[
              { label: 'Principal', value: formatMoney(sP) },
              { label: 'Interest Paid', value: formatMoney(sI) },
              { label: 'Duration', value: `${sT} years` },
              { label: 'Annual Rate', value: formatPercent(simpleRate) },
            ]}
          />
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
