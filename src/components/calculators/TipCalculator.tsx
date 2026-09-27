import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../CurrencySelector';
import { FinalResultCard } from '../FinalResultCard';

export function TipCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [bill, setBill] = useState<string>('75.00');
  const [tipRate, setTipRate] = useState<string>('18');
  const [people, setPeople] = useState<string>('2');
  const [roundUp, setRoundUp] = useState<boolean>(false);
  const [, setCalcKey] = useState<number>(0);

  const billAmount = parseFloat(bill) || 0;
  const tipPct = parseFloat(tipRate) || 0;
  const numPeople = Math.max(1, parseInt(people) || 1);

  let rawTip = billAmount * (tipPct / 100);
  let totalBill = billAmount + rawTip;

  if (roundUp && totalBill > 0) {
    const roundedTotal = Math.ceil(totalBill);
    rawTip = roundedTotal - billAmount;
    totalBill = roundedTotal;
  }

  const tipPerPerson = rawTip / numPeople;
  const totalPerPerson = totalBill / numPeople;

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const handleReset = () => {
    setBill('75.00');
    setTipRate('18');
    setPeople('2');
    setRoundUp(false);
    triggerCalculate();
  };

  const copyText = numPeople > 1
    ? `Tip: ${formatMoney(rawTip)} (${tipPct}%) | Total Bill: ${formatMoney(totalBill)} | Share Per Person: ${formatMoney(totalPerPerson)} (${numPeople} people)`
    : `Tip: ${formatMoney(rawTip)} (${tipPct}%) | Total Bill: ${formatMoney(totalBill)}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Currency Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Tip & Bill Options
        </span>
        <CurrencySelector />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Bill Subtotal ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="0.01"
              value={bill}
              onChange={(e) => setBill(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="75.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Tip Percentage (%)
          </label>
          <div className="relative">
            <input
              type="number"
              value={tipRate}
              onChange={(e) => setTipRate(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="18"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 font-mono">%</span>
          </div>
          {/* Quick preset buttons */}
          <div className="flex gap-1.5 mt-2">
            {['10', '15', '18', '20', '25'].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setTipRate(rate)}
                className={`px-2.5 py-1 text-xs rounded border cursor-pointer ${
                  tipRate === rate
                    ? 'bg-emerald-500 text-white border-emerald-500 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Split Between (People)
          </label>
          <input
            type="number"
            min="1"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
            placeholder="1"
          />
        </div>

        <div className="flex items-center sm:pt-6">
          <label className="inline-flex items-center gap-2.5 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={roundUp}
              onChange={(e) => setRoundUp(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            Round up total to nearest whole dollar
          </label>
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
        primaryLabel={numPeople > 1 ? 'Share Per Person' : 'Total Bill with Tip'}
        primaryValue={formatMoney(numPeople > 1 ? totalPerPerson : totalBill)}
        copyText={copyText}
        breakdown={[
          { label: 'Tip Amount', value: formatMoney(rawTip) },
          { label: 'Total Bill', value: formatMoney(totalBill) },
          { label: 'Bill Subtotal', value: formatMoney(billAmount) },
          { label: 'Split Count', value: `${numPeople} ${numPeople === 1 ? 'person' : 'people'}` },
          ...(numPeople > 1 ? [{ label: 'Tip Per Person', value: formatMoney(tipPerPerson) }] : []),
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
