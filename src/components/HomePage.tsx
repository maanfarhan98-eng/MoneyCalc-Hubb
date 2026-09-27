import React, { useState } from 'react';
import { Search, ArrowRight, CheckCircle2, Calculator, Percent, Briefcase, Wallet, Landmark, TrendingUp, HelpCircle } from 'lucide-react';
import { CALCULATORS, CATEGORIES, Category, CalculatorMeta } from '../data/calculators';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export function HomePage({ onNavigate, onOpenSearch }: HomePageProps) {
  const [inlineQuery, setInlineQuery] = useState('');
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndices(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const popularCalculators = CALCULATORS.filter(c => c.popular);

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case 'Everyday Money':
        return <Percent className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Business':
        return <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Salary & Pay':
        return <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Loans & Interest':
        return <Landmark className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Investment & Savings':
        return <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  const filteredCalculators = inlineQuery.trim()
    ? CALCULATORS.filter(c =>
        c.h1.toLowerCase().includes(inlineQuery.toLowerCase()) ||
        c.shortIntro.toLowerCase().includes(inlineQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(inlineQuery.toLowerCase()) ||
        c.secondaryKeywords.some(k => k.toLowerCase().includes(inlineQuery.toLowerCase()))
      )
    : null;

  const homepageFaqs = [
    {
      question: 'Are all calculators on MoneyCalc Hub completely free to use?',
      answer: 'Yes, 100% free. There are no paywalls, registration gates, credit card requirements, or locked features. Every calculator is freely available to individuals, small business owners, and professionals.'
    },
    {
      question: 'Is my personal or financial information stored or tracked?',
      answer: 'No. All calculations are executed client-side directly within your browser. None of your entered numbers, salaries, or financial figures are sent to or stored on any remote server.'
    },
    {
      question: 'How accurate are the financial calculation formulas?',
      answer: 'Our calculators employ standard mathematical formulas and verified financial equations (including standard monthly amortization annuity equations, compound interest models, and bisection solvers for APR). However, results are estimates for planning purposes and do not replace certified financial or legal counsel.'
    },
    {
      question: 'Can I use MoneyCalc Hub on mobile phones and tablets?',
      answer: 'Yes. The entire platform is built with a responsive mobile-first architecture, large touch-friendly buttons, and zero horizontal scrolling on Android and iOS devices.'
    }
  ];

  return (
    <div className="space-y-16 py-8 sm:py-12">
      
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
          Free Money & Financial Calculators
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed text-pretty">
          Calculate percentages, discounts, profits, salaries, loans, interest, investments, savings, and more quickly and accurately.
        </p>

        {/* Prominent Calculator Search */}
        <div className="max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center shadow-xs rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
            <input
              type="text"
              value={inlineQuery}
              onChange={(e) => setInlineQuery(e.target.value)}
              placeholder="Search for a calculator..."
              className="w-full py-4 pl-3 pr-4 text-base text-slate-900 dark:text-white bg-transparent focus:outline-none placeholder-slate-400"
            />
            {inlineQuery && (
              <button
                onClick={() => setInlineQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-4 font-mono px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filtered Search Results (if user types in inline search) */}
      {filteredCalculators && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Search Results ({filteredCalculators.length})
            </h2>
            <button
              onClick={() => setInlineQuery('')}
              className="text-xs text-emerald-600 hover:underline cursor-pointer"
            >
              Reset search
            </button>
          </div>
          {filteredCalculators.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCalculators.map((calc) => (
                <button
                  key={calc.id}
                  onClick={() => onNavigate(calc.path)}
                  className="flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-xs transition-all text-left group cursor-pointer"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {calc.category}
                    </span>
                    <h3 className="font-semibold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {calc.h1}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {calc.shortIntro}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-4 mt-2">
                    <span>Calculate now</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400">No calculators found matching your search term.</p>
            </div>
          )}
        </section>
      )}

      {/* Popular Calculators */}
      {!filteredCalculators && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Popular Calculators
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Most visited tools for daily calculations, budgeting, and financial analysis.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularCalculators.map((calc) => (
              <button
                key={calc.id}
                onClick={() => onNavigate(calc.path)}
                className="flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-xs transition-all text-left group cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {calc.category}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  </div>
                  <h3 className="font-semibold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {calc.h1}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {calc.shortIntro}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-4 mt-2">
                  <span>Open calculator</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Category Sections */}
      {!filteredCalculators && (
        <div id="all-calculators" className="space-y-16">
          {CATEGORIES.map((cat) => {
            const catCalculators = CALCULATORS.filter(c => c.category === cat.name);
            const anchorId = cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

            return (
              <section
                key={cat.name}
                id={anchorId}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-20"
              >
                <div className="flex items-start gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 mt-1">
                    {getCategoryIcon(cat.name)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {cat.name}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catCalculators.map((calc) => (
                    <button
                      key={calc.id}
                      onClick={() => onNavigate(calc.path)}
                      className="flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-xs transition-all text-left group cursor-pointer"
                    >
                      <div className="space-y-2">
                        <h3 className="font-semibold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {calc.h1}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {calc.shortIntro}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-4 mt-2">
                        <span>Use tool</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Why Use MoneyCalc Hub? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">
              Why Use MoneyCalc Hub?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Designed for real people, entrepreneurs, and savers who need fast, accurate numbers without bloated pages or hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 pt-4 border-t border-slate-800 text-sm">
            <div className="space-y-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-base">Free to use</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero paywalls or subscriptions. All calculations are completely free.
              </p>
            </div>

            <div className="space-y-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-base">No account required</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No signups, passwords, or emails. Open the page and compute instantly.
              </p>
            </div>

            <div className="space-y-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-base">Fast calculations</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant real-time updates as you type with zero server roundtrips.
              </p>
            </div>

            <div className="space-y-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-base">Easy-to-understand results</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clear breakdowns, step-by-step math formulas, and practical examples.
              </p>
            </div>

            <div className="space-y-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-base">Mobile friendly</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fluid responsive layouts tailored for iPhones, Androids, and tablets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Homepage FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Common questions regarding our calculation accuracy and privacy standards.
          </p>
        </div>

        <div className="space-y-3">
          {homepageFaqs.map((faq, idx) => {
            const isOpen = openFaqIndices.includes(idx);
            return (
              <div
                key={idx}
                className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className="text-xl font-light ml-4 shrink-0 text-slate-400">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
