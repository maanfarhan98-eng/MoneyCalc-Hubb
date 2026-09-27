import React, { useState } from 'react';
import { Mail, Shield, FileText, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { SEOHead } from './SEOHead';

export type LegalSlug = 'about' | 'contact' | 'privacy-policy' | 'terms' | 'disclaimer';

interface LegalPageProps {
  page: LegalSlug;
  onNavigate: (path: string) => void;
}

export function LegalPage({ page, onNavigate }: LegalPageProps) {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  switch (page) {
    case 'about':
      return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          <SEOHead
            title="About Us — MoneyCalc Hub"
            description="Learn about MoneyCalc Hub's mission to provide fast, transparent, and accurate financial and mathematical calculators without clutter."
            canonicalPath="/about/"
            isLegalOrHome={true}
          />
          <header className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              About MoneyCalc Hub
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Simple Calculators. Clear Answers.
            </p>
          </header>

          <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-5 text-slate-700 dark:text-slate-300">
            <p>
              MoneyCalc Hub was created to provide everyday consumers, entrepreneurs, and finance professionals with fast, transparent, and accessible financial calculators that respect the user’s time.
            </p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">Our Core Principles</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>Zero Bloat:</strong> We eliminate obstructive popups, auto-playing media, and fake reviews. When you visit a calculator, the interactive tool is front and center.</li>
              <li><strong>Transparent Mathematics:</strong> Every calculator discloses its underlying formula, variable definitions, and concrete walk-through examples so you can verify our results independently.</li>
              <li><strong>Privacy First:</strong> All calculation logic executes client-side within your browser. None of your confidential financial inputs, income numbers, or debt balances are ever transmitted to or stored on our servers.</li>
              <li><strong>Mobile Optimization:</strong> Clean layouts built for touchscreen keyboards, tablets, and desktop workstations alike.</li>
            </ul>
          </div>
        </div>
      );

    case 'contact':
      return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          <SEOHead
            title="Contact Us — MoneyCalc Hub"
            description="Have feedback, a question, or a new calculator suggestion? Reach out to the MoneyCalc Hub team."
            canonicalPath="/contact/"
            isLegalOrHome={true}
          />
          <header className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Contact MoneyCalc Hub
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Have a question, detected an issue with a calculation, or want to suggest a new tool? We value your feedback.
            </p>
          </header>

          {contactSubmitted ? (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-200">Thank you for your message!</h3>
                <p className="text-sm text-emerald-800 dark:text-emerald-300">
                  Your feedback has been received. Our team reviews suggestions regularly to continually improve MoneyCalc Hub.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="Feedback / Calculator Suggestion"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="How can we help or improve?"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      );

    case 'privacy-policy':
      return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          <SEOHead
            title="Privacy Policy — MoneyCalc Hub"
            description="Our privacy policy explains how MoneyCalc Hub protects user data by running all financial calculations locally in your browser."
            canonicalPath="/privacy-policy/"
            isLegalOrHome={true}
          />
          <header className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Last updated: September 26, 2026
            </p>
          </header>

          <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-5 text-slate-700 dark:text-slate-300">
            <p>
              Your privacy is paramount to MoneyCalc Hub. This Privacy Policy details our practices concerning data collection, client-side processing, and transparency.
            </p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">1. Client-Side Financial Computations</h2>
            <p>
              MoneyCalc Hub is built so that financial inputs (including loan amounts, salary information, profits, and interest rates) are computed entirely client-side using JavaScript in your browser. We do not store, log, harvest, or transmit your individual calculation inputs to remote servers.
            </p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">2. Local Storage</h2>
            <p>
              We utilize your device’s local browser storage (<code>localStorage</code>) exclusively to remember your aesthetic preferences, such as your Light/Dark mode preference. No personally identifiable financial data is saved.
            </p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">3. Third-Party Services and Analytics</h2>
            <p>
              We may utilize standard web analytics or privacy-respecting advertising networks to sustain free operations. These services may use standard browser cookies or log basic IP routing data.
            </p>
          </div>
        </div>
      );

    case 'terms':
      return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          <SEOHead
            title="Terms of Service — MoneyCalc Hub"
            description="Read the terms of service governing use of MoneyCalc Hub and its free online financial calculation tools."
            canonicalPath="/terms/"
            isLegalOrHome={true}
          />
          <header className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Terms of Service
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Last updated: September 26, 2026
            </p>
          </header>

          <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-5 text-slate-700 dark:text-slate-300">
            <p>
              By accessing or using MoneyCalc Hub, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of the website.
            </p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">1. Informational & Educational Use Only</h2>
            <p>
              All tools, equations, calculators, and informational materials on MoneyCalc Hub are provided strictly for general educational and planning purposes. They do not constitute certified financial, tax, investment, accounting, or legal advice.
            </p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">2. Disclaimer of Warranties</h2>
            <p>
              The services and calculations are provided on an "as-is" and "as-available" basis. While we strive for extreme mathematical precision across all calculators, MoneyCalc Hub makes no warranties or representations regarding absolute completeness or accuracy.
            </p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">3. Limitation of Liability</h2>
            <p>
              In no event shall MoneyCalc Hub or its operators be held liable for any financial decisions, lending choices, contractual obligations, or damages arising out of your use of or reliance on our calculation tools.
            </p>
          </div>
        </div>
      );

    case 'disclaimer':
      return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          <SEOHead
            title="Financial Disclaimer — MoneyCalc Hub"
            description="Important disclosure: MoneyCalc Hub calculations are estimates and do not constitute personalized financial, tax, or legal advice."
            canonicalPath="/disclaimer/"
            isLegalOrHome={true}
          />
          <header className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Financial Disclaimer
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Important information regarding our calculation tools and advice boundaries.
            </p>
          </header>

          <div className="p-5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h2 className="font-semibold text-amber-900 dark:text-amber-200 text-base">Not Personalized Financial Advice</h2>
              <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                MoneyCalc Hub is not a bank, licensed broker, certified financial planner (CFP), or tax advisory firm. All calculations and estimations provided by our tools are for informational and self-service educational purposes only.
              </p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-5 text-slate-700 dark:text-slate-300">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Estimates & Real-World Variables</h2>
            <p>
              Calculations displayed on this website represent mathematical estimates based on user-supplied numbers and standard accounting formulas. Actual loan agreements, investment returns, tax obligations, and payroll paychecks involve individual factors that our generic tools cannot anticipate:
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li>Individual credit scores, debt-to-income ratios, and lender-specific fee structures</li>
              <li>Federal, state, and municipal marginal income tax brackets and payroll deductions</li>
              <li>Market volatility, fee expense drag, and inflation fluctuations in investment assets</li>
              <li>Prepayment penalty clauses, compounding calendar rules, and balloon payment contingencies</li>
            </ul>
            <p>
              Before entering into binding loan contracts, mortgage applications, major corporate capital expenditures, or tax filings, always consult with a licensed financial advisor, Certified Public Accountant (CPA), or qualified legal professional.
            </p>
          </div>
        </div>
      );
  }
}
