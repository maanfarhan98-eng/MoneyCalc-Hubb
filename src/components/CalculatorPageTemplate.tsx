import React, { useState } from 'react';
import { ChevronRight, Calculator, Check, Copy, HelpCircle, ArrowRight, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { CalculatorMeta, CALCULATORS, getCalculatorBySlug } from '../data/calculators';
import { CalculatorDispatcher } from './CalculatorDispatcher';
import { copyToClipboard } from '../utils/formatters';

interface TemplateProps {
  calculator: CalculatorMeta;
  onNavigate: (path: string) => void;
}

export function CalculatorPageTemplate({ calculator, onNavigate }: TemplateProps) {
  const [copiedFormula, setCopiedFormula] = useState(false);
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]); // first FAQ open by default

  const toggleFaq = (index: number) => {
    setOpenFaqIndices(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleCopyFormula = () => {
    copyToClipboard(calculator.formula);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2000);
  };

  // Find related calculators
  const relatedList = calculator.relatedCalculators
    .map(slug => getCalculatorBySlug(slug))
    .filter((c): c is CalculatorMeta => c !== undefined);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      
      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <button
          onClick={() => onNavigate('/')}
          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <button
          onClick={() => onNavigate(`/#${calculator.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`)}
          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
        >
          {calculator.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 dark:text-white font-medium truncate" aria-current="page">
          {calculator.h1}
        </span>
      </nav>

      {/* 2. Header & 3. Short Introduction */}
      <header className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <span>{calculator.category}</span>
          <span>·</span>
          <span>Free Online Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
          {calculator.h1}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed text-pretty">
          {calculator.shortIntro}
        </p>
      </header>

      {/* 4. & 5. Working Calculator & Results (Near the top!) */}
      <section aria-labelledby="calculator-tool-heading" className="scroll-mt-20">
        <h2 id="calculator-tool-heading" className="sr-only">
          {calculator.h1} Interactive Calculator Tool
        </h2>
        <CalculatorDispatcher slug={calculator.slug} />
      </section>

      {/* 6. How It Works */}
      <section aria-labelledby="how-it-works-heading" className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 id="how-it-works-heading" className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          How the {calculator.h1} Works
        </h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          {calculator.howItWorks}
        </p>
      </section>

      {/* 7. Formula */}
      <section aria-labelledby="formula-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="formula-heading" className="text-xl font-bold text-slate-900 dark:text-white">
            Calculation Formula
          </h2>
          <button
            onClick={handleCopyFormula}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
          >
            {copiedFormula ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedFormula ? 'Formula Copied' : 'Copy Formula'}
          </button>
        </div>

        <div className="p-4 sm:p-5 bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-xl font-mono text-sm leading-relaxed overflow-x-auto border border-slate-800">
          <pre className="whitespace-pre-wrap">{calculator.formula}</pre>
        </div>
        {calculator.formulaExplanation && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {calculator.formulaExplanation}
          </p>
        )}
      </section>

      {/* 8. Practical Example */}
      <section aria-labelledby="example-heading" className="space-y-3 p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl">
        <h3 id="example-heading" className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Step-by-Step Example
        </h3>
        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          {calculator.example}
        </p>
      </section>

      {/* 9. When to Use & 10. Important Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* When to use */}
        <section aria-labelledby="when-to-use-heading" className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-xs">
          <h3 id="when-to-use-heading" className="text-base font-bold text-slate-900 dark:text-white">
            When to Use This Calculator
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {calculator.whenToUse.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Limitations */}
        <section aria-labelledby="limitations-heading" className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-xs">
          <h3 id="limitations-heading" className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            Important Considerations
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {calculator.limitations.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 11. Related Calculators (Internal Links) */}
      {relatedList.length > 0 && (
        <section aria-labelledby="related-heading" className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 id="related-heading" className="text-2xl font-bold text-slate-900 dark:text-white">
            Related Calculators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedList.map((rel) => (
              <button
                key={rel.id}
                onClick={() => onNavigate(rel.path)}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-xs transition-all text-left group cursor-pointer"
              >
                <div className="space-y-1 pr-3">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors block">
                    {rel.h1}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {rel.shortIntro}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 12. FAQ Section */}
      {calculator.faq && calculator.faq.length > 0 && (
        <section aria-labelledby="faq-heading" className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 id="faq-heading" className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {calculator.faq.map((item, idx) => {
              const isOpen = openFaqIndices.includes(idx);
              return (
                <div
                  key={idx}
                  className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>
                    <span className="text-lg font-light ml-4 shrink-0 text-slate-400">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}
