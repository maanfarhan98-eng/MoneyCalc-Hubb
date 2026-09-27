import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';
import { FinalResultCard } from '../FinalResultCard';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../CurrencySelector';

type Mode = 'of_number' | 'increase' | 'decrease' | 'change' | 'difference' | 'of_percentage';

export function PercentageCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [isCurrencyMode, setIsCurrencyMode] = useState<boolean>(false);
  const [mode, setMode] = useState<Mode>('of_number');
  const [, setCalcKey] = useState<number>(0);

  // States
  // 1. Of number: What is P% of X?
  const [p1, setP1] = useState<string>('15');
  const [v1, setV1] = useState<string>('80');

  // 2. Increase: From A by P%
  const [incBase, setIncBase] = useState<string>('100');
  const [incPercent, setIncPercent] = useState<string>('20');

  // 3. Decrease: From A by P%
  const [decBase, setDecBase] = useState<string>('100');
  const [decPercent, setDecPercent] = useState<string>('20');

  // 4. Change: From A to B
  const [chgFrom, setChgFrom] = useState<string>('50');
  const [chgTo, setChgTo] = useState<string>('75');

  // 5. Difference: Between A and B
  const [diffA, setDiffA] = useState<string>('80');
  const [diffB, setDiffB] = useState<string>('100');

  // 6. Percentage of a percentage: P1% of P2% of Z
  const [popP1, setPopP1] = useState<string>('20');
  const [popP2, setPopP2] = useState<string>('50');
  const [popVal, setPopVal] = useState<string>('1000');

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const renderCalculation = () => {
    switch (mode) {
      case 'of_number': {
        const percent = parseFloat(p1) || 0;
        const total = parseFloat(v1) || 0;
        const result = (percent / 100) * total;
        const formattedRes = isCurrencyMode ? formatMoney(result) : formatNumber(result, 4).replace(/\.?0+$/, '');
        const formattedTotal = isCurrencyMode ? formatMoney(total) : `${total}`;
        const copyText = `${percent}% of ${formattedTotal} = ${formattedRes}`;

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Percentage (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={p1}
                    onChange={(e) => setP1(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
                    placeholder="e.g. 15"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-mono">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {isCurrencyMode ? `Base Amount (${currency.symbol.trim()})` : 'Of Number'}
                </label>
                <div className="relative">
                  {isCurrencyMode && (
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
                  )}
                  <input
                    type="number"
                    value={v1}
                    onChange={(e) => setV1(e.target.value)}
                    className={`w-full ${isCurrencyMode ? 'pl-9 pr-4' : 'px-4'} py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums`}
                    placeholder="e.g. 80"
                  />
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              type="button"
              onClick={triggerCalculate}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <CalcIcon className="w-4 h-4" />
              <span>Calculate</span>
            </button>

            {/* Final Result Card */}
            <FinalResultCard
              title="Final Result"
              primaryLabel={`Calculated Value (${percent}% of ${formattedTotal})`}
              primaryValue={formattedRes}
              copyText={copyText}
              note={`Formula: (${percent} / 100) × ${formattedTotal} = ${formattedRes}`}
              breakdown={[
                { label: 'Percentage', value: `${percent}%` },
                { label: isCurrencyMode ? 'Base Amount' : 'Total Number', value: formattedTotal },
                { label: 'Result', value: formattedRes },
              ]}
            />
          </div>
        );
      }

      case 'increase': {
        const base = parseFloat(incBase) || 0;
        const pct = parseFloat(incPercent) || 0;
        const added = base * (pct / 100);
        const result = base + added;
        const formattedRes = isCurrencyMode ? formatMoney(result) : formatNumber(result, 4).replace(/\.?0+$/, '');
        const formattedAdded = isCurrencyMode ? formatMoney(added) : formatNumber(added, 4).replace(/\.?0+$/, '');
        const formattedBase = isCurrencyMode ? formatMoney(base) : `${base}`;
        const copyText = `Initial Value: ${formattedBase} | Increase: ${pct}% (+${formattedAdded}) | Final Value: ${formattedRes}`;

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {isCurrencyMode ? `Initial Amount (${currency.symbol.trim()})` : 'Initial Value'}
                </label>
                <div className="relative">
                  {isCurrencyMode && (
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
                  )}
                  <input
                    type="number"
                    value={incBase}
                    onChange={(e) => setIncBase(e.target.value)}
                    className={`w-full ${isCurrencyMode ? 'pl-9 pr-4' : 'px-4'} py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums`}
                    placeholder="e.g. 100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Increase Percentage (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={incPercent}
                    onChange={(e) => setIncPercent(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
                    placeholder="e.g. 20"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-mono">%</span>
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              type="button"
              onClick={triggerCalculate}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <CalcIcon className="w-4 h-4" />
              <span>Calculate</span>
            </button>

            <FinalResultCard
              title="Final Result"
              primaryLabel="Final Increased Value"
              primaryValue={formattedRes}
              copyText={copyText}
              note={`Added amount: +${formattedAdded} (${formattedBase} × ${pct / 100})`}
              breakdown={[
                { label: 'Initial Value', value: formattedBase },
                { label: 'Increase Rate', value: `+${pct}%` },
                { label: 'Added Amount', value: `+${formattedAdded}` },
                { label: 'Final Value', value: formattedRes },
              ]}
            />
          </div>
        );
      }

      case 'decrease': {
        const base = parseFloat(decBase) || 0;
        const pct = parseFloat(decPercent) || 0;
        const subtracted = base * (pct / 100);
        const result = base - subtracted;
        const formattedRes = isCurrencyMode ? formatMoney(result) : formatNumber(result, 4).replace(/\.?0+$/, '');
        const formattedSub = isCurrencyMode ? formatMoney(subtracted) : formatNumber(subtracted, 4).replace(/\.?0+$/, '');
        const formattedBase = isCurrencyMode ? formatMoney(base) : `${base}`;
        const copyText = `Initial Value: ${formattedBase} | Decrease: ${pct}% (-${formattedSub}) | Final Value: ${formattedRes}`;

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {isCurrencyMode ? `Initial Amount (${currency.symbol.trim()})` : 'Initial Value'}
                </label>
                <div className="relative">
                  {isCurrencyMode && (
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
                  )}
                  <input
                    type="number"
                    value={decBase}
                    onChange={(e) => setDecBase(e.target.value)}
                    className={`w-full ${isCurrencyMode ? 'pl-9 pr-4' : 'px-4'} py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums`}
                    placeholder="e.g. 100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Decrease Percentage (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={decPercent}
                    onChange={(e) => setDecPercent(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
                    placeholder="e.g. 20"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-mono">%</span>
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              type="button"
              onClick={triggerCalculate}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <CalcIcon className="w-4 h-4" />
              <span>Calculate</span>
            </button>

            <FinalResultCard
              title="Final Result"
              primaryLabel="Final Decreased Value"
              primaryValue={formattedRes}
              copyText={copyText}
              note={`Reduced amount: -${formattedSub} (${formattedBase} × ${pct / 100})`}
              breakdown={[
                { label: 'Initial Value', value: formattedBase },
                { label: 'Decrease Rate', value: `-${pct}%` },
                { label: 'Reduced Amount', value: `-${formattedSub}` },
                { label: 'Final Value', value: formattedRes },
              ]}
            />
          </div>
        );
      }

      case 'change': {
        const from = parseFloat(chgFrom) || 0;
        const to = parseFloat(chgTo) || 0;
        const diff = to - from;
        const pctChange = from !== 0 ? (diff / from) * 100 : 0;
        const isUp = pctChange > 0;
        const formattedFrom = isCurrencyMode ? formatMoney(from) : `${from}`;
        const formattedTo = isCurrencyMode ? formatMoney(to) : `${to}`;
        const formattedDiff = isCurrencyMode
          ? (diff >= 0 ? `+${formatMoney(diff)}` : `-${formatMoney(Math.abs(diff))}`)
          : `${diff >= 0 ? '+' : ''}${diff}`;
        const copyText = `From: ${formattedFrom} | To: ${formattedTo} | Percentage Change: ${isUp ? '+' : ''}${pctChange.toFixed(2)}% | Absolute Difference: ${formattedDiff}`;

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {isCurrencyMode ? `Original Amount (${currency.symbol.trim()})` : 'Original Value (From)'}
                </label>
                <div className="relative">
                  {isCurrencyMode && (
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
                  )}
                  <input
                    type="number"
                    value={chgFrom}
                    onChange={(e) => setChgFrom(e.target.value)}
                    className={`w-full ${isCurrencyMode ? 'pl-9 pr-4' : 'px-4'} py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums`}
                    placeholder="e.g. 50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {isCurrencyMode ? `New Amount (${currency.symbol.trim()})` : 'New Value (To)'}
                </label>
                <div className="relative">
                  {isCurrencyMode && (
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
                  )}
                  <input
                    type="number"
                    value={chgTo}
                    onChange={(e) => setChgTo(e.target.value)}
                    className={`w-full ${isCurrencyMode ? 'pl-9 pr-4' : 'px-4'} py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums`}
                    placeholder="e.g. 75"
                  />
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              type="button"
              onClick={triggerCalculate}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <CalcIcon className="w-4 h-4" />
              <span>Calculate</span>
            </button>

            <FinalResultCard
              title="Final Result"
              primaryLabel="Percentage Change"
              primaryValue={`${isUp ? '+' : ''}${pctChange.toFixed(2)}%`}
              primaryHighlight={isUp ? 'emerald' : diff < 0 ? 'rose' : 'slate'}
              copyText={copyText}
              note={`Absolute change: ${formattedDiff} | Formula: ((${formattedTo} - ${formattedFrom}) / ${formattedFrom}) × 100`}
              breakdown={[
                { label: 'From Value', value: formattedFrom },
                { label: 'To Value', value: formattedTo },
                { label: 'Difference', value: formattedDiff },
                { label: 'Percentage Change', value: `${isUp ? '+' : ''}${pctChange.toFixed(2)}%` },
              ]}
            />
          </div>
        );
      }

      case 'difference': {
        const a = parseFloat(diffA) || 0;
        const b = parseFloat(diffB) || 0;
        const avg = (a + b) / 2;
        const absDiff = Math.abs(a - b);
        const pctDiff = avg !== 0 ? (absDiff / avg) * 100 : 0;
        const formattedA = isCurrencyMode ? formatMoney(a) : `${a}`;
        const formattedB = isCurrencyMode ? formatMoney(b) : `${b}`;
        const formattedDiff = isCurrencyMode ? formatMoney(absDiff) : `${absDiff}`;
        const copyText = `Value A: ${formattedA} | Value B: ${formattedB} | Percentage Difference: ${pctDiff.toFixed(2)}% | Absolute Difference: ${formattedDiff}`;

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {isCurrencyMode ? `First Amount (${currency.symbol.trim()})` : 'First Value (A)'}
                </label>
                <div className="relative">
                  {isCurrencyMode && (
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
                  )}
                  <input
                    type="number"
                    value={diffA}
                    onChange={(e) => setDiffA(e.target.value)}
                    className={`w-full ${isCurrencyMode ? 'pl-9 pr-4' : 'px-4'} py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums`}
                    placeholder="e.g. 80"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {isCurrencyMode ? `Second Amount (${currency.symbol.trim()})` : 'Second Value (B)'}
                </label>
                <div className="relative">
                  {isCurrencyMode && (
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
                  )}
                  <input
                    type="number"
                    value={diffB}
                    onChange={(e) => setDiffB(e.target.value)}
                    className={`w-full ${isCurrencyMode ? 'pl-9 pr-4' : 'px-4'} py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums`}
                    placeholder="e.g. 100"
                  />
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              type="button"
              onClick={triggerCalculate}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <CalcIcon className="w-4 h-4" />
              <span>Calculate</span>
            </button>

            <FinalResultCard
              title="Final Result"
              primaryLabel="Percentage Difference"
              primaryValue={`${pctDiff.toFixed(2)}%`}
              copyText={copyText}
              note={`Formula: (|${formattedA} - ${formattedB}| / ((${formattedA} + ${formattedB}) / 2)) × 100`}
              breakdown={[
                { label: 'Value A', value: formattedA },
                { label: 'Value B', value: formattedB },
                { label: 'Average', value: isCurrencyMode ? formatMoney(avg) : `${avg}` },
                { label: 'Difference', value: `${pctDiff.toFixed(2)}%` },
              ]}
            />
          </div>
        );
      }

      case 'of_percentage': {
        const pA = parseFloat(popP1) || 0;
        const pB = parseFloat(popP2) || 0;
        const base = parseFloat(popVal) || 0;
        const combinedPercent = (pA / 100) * (pB / 100) * 100;
        const finalValue = (combinedPercent / 100) * base;
        const formattedVal = isCurrencyMode ? formatMoney(finalValue) : formatNumber(finalValue, 2);
        const formattedBase = isCurrencyMode ? formatMoney(base) : `${base}`;
        const copyText = `${pA}% of ${pB}% = ${combinedPercent.toFixed(2)}%` + (base > 0 ? ` | Value of ${formattedBase} = ${formattedVal}` : '');

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  First % (A)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={popP1}
                    onChange={(e) => setPopP1(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
                    placeholder="20"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-mono">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Of Second % (B)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={popP2}
                    onChange={(e) => setPopP2(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums"
                    placeholder="50"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-mono">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {isCurrencyMode ? `Total Amount (${currency.symbol.trim()})` : 'Of Total Number (Optional)'}
                </label>
                <div className="relative">
                  {isCurrencyMode && (
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">{currency.symbol.trim()}</span>
                  )}
                  <input
                    type="number"
                    value={popVal}
                    onChange={(e) => setPopVal(e.target.value)}
                    className={`w-full ${isCurrencyMode ? 'pl-9 pr-4' : 'px-4'} py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base tabular-nums`}
                    placeholder="1000"
                  />
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              type="button"
              onClick={triggerCalculate}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <CalcIcon className="w-4 h-4" />
              <span>Calculate</span>
            </button>

            <FinalResultCard
              title="Final Result"
              primaryLabel="Combined Effective Percentage"
              primaryValue={`${combinedPercent.toFixed(2)}%`}
              copyText={copyText}
              note={`Formula: (${pA}% / 100) × (${pB}% / 100) = ${combinedPercent.toFixed(2)}%`}
              breakdown={[
                { label: 'First %', value: `${pA}%` },
                { label: 'Second %', value: `${pB}%` },
                { label: 'Combined %', value: `${combinedPercent.toFixed(2)}%` },
                ...(base > 0 ? [{ label: `Value of ${formattedBase}`, value: formattedVal }] : []),
              ]}
            />
          </div>
        );
      }
    }
  };

  const resetFields = () => {
    setP1('15');
    setV1('80');
    setIncBase('100');
    setIncPercent('20');
    setDecBase('100');
    setDecPercent('20');
    setChgFrom('50');
    setChgTo('75');
    setDiffA('80');
    setDiffB('100');
    setPopP1('20');
    setPopP2('50');
    setPopVal('1000');
    triggerCalculate();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Top Bar with Currency Selector & Format Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Format:
          </span>
          <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => setIsCurrencyMode(false)}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                !isCurrencyMode
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Plain Numbers
            </button>
            <button
              type="button"
              onClick={() => setIsCurrencyMode(true)}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                isCurrencyMode
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Money ({currency.symbol.trim()})
            </button>
          </div>
        </div>

        <CurrencySelector />
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-6">
        {[
          { id: 'of_number', label: '% of Number' },
          { id: 'increase', label: '% Increase' },
          { id: 'decrease', label: '% Decrease' },
          { id: 'change', label: '% Change' },
          { id: 'difference', label: '% Difference' },
          { id: 'of_percentage', label: '% of a %' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id as Mode)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              mode === tab.id
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderCalculation()}

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button
          onClick={resetFields}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset to default values
        </button>
      </div>
    </div>
  );
}
