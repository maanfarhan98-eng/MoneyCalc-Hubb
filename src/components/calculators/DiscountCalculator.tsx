import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../CurrencySelector';
import { FinalResultCard } from '../FinalResultCard';
import { formatPercent } from '../../utils/formatters';

export function DiscountCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [price, setPrice] = useState<string>('100.00');
  const [discountPercent, setDiscountPercent] = useState<string>('20');
  const [taxPercent, setTaxPercent] = useState<string>('0');
  const [additionalDiscount, setAdditionalDiscount] = useState<string>('0');
  const [, setCalcKey] = useState<number>(0);

  const orig = parseFloat(price) || 0;
  const disc1 = parseFloat(discountPercent) || 0;
  const disc2 = parseFloat(additionalDiscount) || 0;
  const tax = parseFloat(taxPercent) || 0;

  // Primary discount
  const savings1 = orig * (disc1 / 100);
  const priceAfterDisc1 = orig - savings1;

  // Additional secondary discount
  const savings2 = priceAfterDisc1 * (disc2 / 100);
  const priceAfterDisc2 = priceAfterDisc1 - savings2;

  const totalSavings = savings1 + savings2;
  const taxAmount = priceAfterDisc2 * (tax / 100);
  const finalPrice = priceAfterDisc2 + taxAmount;
  const effectiveDiscountPercent = orig > 0 ? (totalSavings / orig) * 100 : 0;

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const handleReset = () => {
    setPrice('100.00');
    setDiscountPercent('20');
    setTaxPercent('0');
    setAdditionalDiscount('0');
    triggerCalculate();
  };

  // Copy Result text format
  const copyText = tax > 0 || disc2 > 0
    ? `Original Price: ${formatMoney(orig)} | Discount: ${formatMoney(totalSavings)} | Tax: ${formatMoney(taxAmount)} | Final Price: ${formatMoney(finalPrice)}`
    : `Discount: ${formatMoney(totalSavings)} | Final Price: ${formatMoney(finalPrice)}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Top Bar with Currency Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Discount Settings
        </span>
        <CurrencySelector />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Original Price ({currency.symbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="100.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Discount Percentage (%)
          </label>
          <div className="relative">
            <input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="20"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 font-mono">%</span>
          </div>
          {/* Quick preset buttons */}
          <div className="flex gap-1.5 mt-2">
            {['10', '15', '20', '25', '30', '50'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setDiscountPercent(preset)}
                className={`px-2 py-1 text-xs rounded border cursor-pointer ${
                  discountPercent === preset
                    ? 'bg-emerald-500 text-white border-emerald-500 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Sales Tax (%) (Optional)
          </label>
          <div className="relative">
            <input
              type="number"
              value={taxPercent}
              onChange={(e) => setTaxPercent(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="0"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 font-mono">%</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Extra Discount (%) (Optional)
          </label>
          <div className="relative">
            <input
              type="number"
              value={additionalDiscount}
              onChange={(e) => setAdditionalDiscount(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
              placeholder="0"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 font-mono">%</span>
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
        primaryLabel="Final Price (After Discount)"
        primaryValue={formatMoney(finalPrice)}
        copyText={copyText}
        breakdown={[
          { label: 'Discount Amount', value: formatMoney(totalSavings) },
          { label: 'Final Price', value: formatMoney(finalPrice) },
          { label: 'Original Price', value: formatMoney(orig) },
          { label: 'Effective Discount', value: formatPercent(effectiveDiscountPercent) },
          ...(tax > 0 ? [{ label: `Sales Tax (${tax}%)`, value: formatMoney(taxAmount) }] : []),
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
