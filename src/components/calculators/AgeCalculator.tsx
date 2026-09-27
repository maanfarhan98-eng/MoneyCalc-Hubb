import React, { useState } from 'react';
import { RotateCcw, Calculator as CalcIcon } from 'lucide-react';
import { FinalResultCard } from '../FinalResultCard';

export function AgeCalculator() {
  const todayStr = new Date().toISOString().split('T')[0];
  const [birthDate, setBirthDate] = useState<string>('1995-03-15');
  const [asOfDate, setAsOfDate] = useState<string>(todayStr);
  const [, setCalcKey] = useState<number>(0);

  // Calculate chronological difference
  const calculateAge = () => {
    if (!birthDate) return null;
    const b = new Date(birthDate + 'T00:00:00');
    const a = new Date(asOfDate + 'T00:00:00');

    if (isNaN(b.getTime()) || isNaN(a.getTime()) || a < b) {
      return null;
    }

    let years = a.getFullYear() - b.getFullYear();
    let months = a.getMonth() - b.getMonth();
    let days = a.getDate() - b.getDate();

    if (days < 0) {
      // borrow from previous month
      months -= 1;
      const prevMonth = new Date(a.getFullYear(), a.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total milliseconds elapsed
    const diffMs = a.getTime() - b.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;

    // Next birthday calculation
    let nextBday = new Date(a.getFullYear(), b.getMonth(), b.getDate());
    if (nextBday < a) {
      nextBday = new Date(a.getFullYear() + 1, b.getMonth(), b.getDate());
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      daysToNextBday,
    };
  };

  const age = calculateAge();

  const triggerCalculate = () => {
    setCalcKey((k) => k + 1);
  };

  const handleReset = () => {
    setBirthDate('1995-03-15');
    setAsOfDate(todayStr);
    triggerCalculate();
  };

  const copyText = age
    ? `Age: ${age.years} years, ${age.months} months, ${age.days} days | Total Days: ${age.totalDays.toLocaleString()} | Next Birthday in: ${age.daysToNextBday} days`
    : '';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Age as of Date
          </label>
          <input
            type="date"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base"
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
      {age ? (
        <FinalResultCard
          title="Final Result"
          primaryLabel="Exact Chronological Age"
          primaryValue={`${age.years} yrs, ${age.months} mos, ${age.days} days`}
          copyText={copyText}
          breakdown={[
            { label: 'Total Days', value: age.totalDays.toLocaleString() },
            { label: 'Total Weeks', value: age.totalWeeks.toLocaleString() },
            { label: 'Total Hours', value: age.totalHours.toLocaleString() },
            { label: 'Next Birthday', value: `In ${age.daysToNextBday} days` },
          ]}
        />
      ) : (
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300">
          Please select a valid birth date that precedes the evaluation date.
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
