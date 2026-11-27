import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CALCULATORS, CATEGORIES, HOMEPAGE_FAQS } from '../src/data/calculators.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.moneycalchub.online';
const TODAY_ISO = new Date().toISOString().slice(0, 10);

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function safeJsonLd(schemaObj) {
  return JSON.stringify(schemaObj).replace(/<\/script/gi, '<\\/script');
}

function replaceOrThrow(html, pattern, replacement, label) {
  const found = typeof pattern === 'string' ? html.includes(pattern) : pattern.test(html);
  if (!found) {
    throw new Error(`Expected HTML pattern not found during prerender: ${label}`);
  }
  return html.replace(pattern, () => replacement);
}

function ensureTrailingSlash(routePath) {
  if (!routePath || routePath === '/') return '/';
  const withLeading = routePath.startsWith('/') ? routePath : `/${routePath}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

function readExistingSitemapLastmods(sitemapPath) {
  const map = new Map();
  if (!fs.existsSync(sitemapPath)) return map;
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const urlBlocks = xml.matchAll(/<url>([\s\S]*?)<\/url>/g);
  for (const match of urlBlocks) {
    const loc = match[1].match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
    const lastmod = match[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim();
    if (loc && lastmod) {
      map.set(loc, lastmod);
    }
  }
  return map;
}

function validateCatalog(calculators) {
  const slugs = new Set();
  const paths = new Set();
  const titles = new Set();
  const descriptions = new Set();
  const h1s = new Set();

  for (const calc of calculators) {
    if (!calc.slug || !calc.path || !calc.title || !calc.metaDescription || !calc.h1) {
      throw new Error(`Calculator entry missing required SEO fields: ${calc.id || calc.slug}`);
    }
    const expectedPath = calc.slug === 'percentage-calculator2'
      ? '/percentage-calculator2'
      : `/${calc.slug}/`;
    if (calc.path !== expectedPath) {
      throw new Error(`Calculator "${calc.slug}" path "${calc.path}" must equal "${expectedPath}".`);
    }
    if (slugs.has(calc.slug)) throw new Error(`Duplicate calculator slug: ${calc.slug}`);
    if (paths.has(calc.path)) throw new Error(`Duplicate calculator path: ${calc.path}`);
    if (titles.has(calc.title)) throw new Error(`Duplicate calculator SEO title: ${calc.title}`);
    if (descriptions.has(calc.metaDescription)) throw new Error(`Duplicate calculator meta description on ${calc.slug}`);
    if (h1s.has(calc.h1)) throw new Error(`Duplicate calculator H1: ${calc.h1}`);

    slugs.add(calc.slug);
    paths.add(calc.path);
    titles.add(calc.title);
    descriptions.add(calc.metaDescription);
    h1s.add(calc.h1);

    for (const relSlug of calc.relatedCalculators || []) {
      if (!calculators.some(c => c.slug === relSlug)) {
        throw new Error(`Broken relatedCalculators reference "${relSlug}" on "${calc.slug}".`);
      }
    }
  }
}

function applyPageMetadata(template, { title, description, canonicalUrl, ogType, robots = 'index, follow', jsonLdSchemas = [] }) {
  let html = template;

  html = replaceOrThrow(
    html,
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(title)}</title>`,
    '<title>'
  );
  html = replaceOrThrow(
    html,
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    'meta[name="description"]'
  );
  html = replaceOrThrow(
    html,
    /<meta\s+name="robots"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="robots" content="${escapeHtml(robots)}" />`,
    'meta[name="robots"]'
  );
  html = replaceOrThrow(
    html,
    /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    'link[rel="canonical"]'
  );
  html = replaceOrThrow(
    html,
    /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    'meta[property="og:title"]'
  );
  html = replaceOrThrow(
    html,
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    'meta[property="og:description"]'
  );
  html = replaceOrThrow(
    html,
    /<meta\s+property="og:type"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta property="og:type" content="${escapeHtml(ogType)}" />`,
    'meta[property="og:type"]'
  );
  html = replaceOrThrow(
    html,
    /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
    'meta[property="og:url"]'
  );
  html = replaceOrThrow(
    html,
    /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    'meta[name="twitter:title"]'
  );
  html = replaceOrThrow(
    html,
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    'meta[name="twitter:description"]'
  );

  if (jsonLdSchemas.length > 0) {
    const jsonLdHtml = jsonLdSchemas
      .map(s => `<script type="application/ld+json" data-seo-jsonld="true">${safeJsonLd(s)}</script>`)
      .join('\n    ');
    html = replaceOrThrow(html, '</head>', `    ${jsonLdHtml}\n  </head>`, '</head>');
  }

  return html;
}

function renderHeader() {
  return `
    <header class="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="/" class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-xs p-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-white" aria-hidden="true">
              <rect width="16" height="20" x="4" y="2" rx="2"></rect>
              <line x1="8" x2="16" y1="6" y2="6"></line>
              <line x1="16" x2="16" y1="14" y2="18"></line>
              <path d="M16 10h.01"></path>
              <path d="M12 10h.01"></path>
              <path d="M8 10h.01"></path>
              <path d="M12 14h.01"></path>
              <path d="M8 14h.01"></path>
              <path d="M12 18h.01"></path>
              <path d="M8 18h.01"></path>
            </svg>
          </div>
          <div>
            <span class="font-bold text-lg text-slate-900 dark:text-white tracking-tight block leading-tight">MoneyCalc Hub</span>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase block">Simple Calculators · Clear Answers</span>
          </div>
        </a>
        <nav class="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300" aria-label="Primary Navigation">
          <a href="/#everyday-money" class="hover:text-blue-600">Money</a>
          <a href="/#business" class="hover:text-blue-600">Business</a>
          <a href="/#salary---pay" class="hover:text-blue-600">Salary</a>
          <a href="/#loans---interest" class="hover:text-blue-600">Loans</a>
          <a href="/#investment---savings" class="hover:text-blue-600">Investment</a>
        </nav>
      </div>
    </header>
  `;
}

function renderFooter() {
  return `
    <footer class="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-10 mt-16 text-xs text-slate-500 text-center">
      <div class="max-w-7xl mx-auto px-4 space-y-4">
        <div class="flex flex-wrap justify-center gap-4 text-slate-600 dark:text-slate-400">
          <a href="/" class="hover:text-blue-600">Home</a>
          <a href="/percentage-calculator2" class="hover:text-blue-600">Percentage Calculator</a>
          <a href="/discount-calculator/" class="hover:text-blue-600">Discount Calculator</a>
          <a href="/loan-calculator/" class="hover:text-blue-600">Loan Calculator</a>
          <a href="/salary-calculator/" class="hover:text-blue-600">Salary Calculator</a>
          <a href="/compound-interest-calculator/" class="hover:text-blue-600">Compound Interest</a>
          <a href="/profit-margin-calculator/" class="hover:text-blue-600">Profit Margin</a>
        </div>
        <div class="flex flex-wrap justify-center gap-4 text-slate-600 dark:text-slate-400">
          <a href="/about/" class="hover:text-blue-600">About Us</a>
          <a href="/contact/" class="hover:text-blue-600">Contact</a>
          <a href="/privacy-policy/" class="hover:text-blue-600">Privacy Policy</a>
          <a href="/terms/" class="hover:text-blue-600">Terms of Service</a>
          <a href="/disclaimer/" class="hover:text-blue-600">Disclaimer</a>
        </div>
        <p>&copy; ${new Date().getFullYear()} MoneyCalc Hub. All rights reserved. For educational and planning use only.</p>
      </div>
    </footer>
  `;
}

function main() {
  const distDir = path.resolve(__dirname, '../dist');
  const publicDir = path.resolve(__dirname, '../public');
  const templatePath = path.join(distDir, 'index.html');
  const publicSitemapPath = path.join(publicDir, 'sitemap.xml');

  if (!fs.existsSync(templatePath)) {
    console.error('dist/index.html not found! Run vite build first.');
    process.exit(1);
  }

  validateCatalog(CALCULATORS);
  const existingLastmods = readExistingSitemapLastmods(publicSitemapPath);
  const template = fs.readFileSync(templatePath, 'utf8');
  console.log(`Loaded ${CALCULATORS.length} calculators and ${CATEGORIES.length} categories for pre-rendering.`);

  // Ensure no stale directory exists for migrated/slashless calculator routes
  fs.rmSync(path.join(distDir, 'percentage-calculator'), { recursive: true, force: true });
  fs.rmSync(path.join(distDir, 'percentage-calculator2'), { recursive: true, force: true });

  // 1. Pre-render all calculator routes
  for (const calc of CALCULATORS) {
    const normalizedPath = calc.path.startsWith('/') ? calc.path : `/${calc.path}`;
    const canonicalUrl = `${BASE_URL}${normalizedPath}`;
    const categoryAnchorSlug = calc.category.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const categoryAnchor = `/#${categoryAnchorSlug}`;

    const jsonLdSchemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: calc.h1,
        url: canonicalUrl,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'All',
        description: calc.metaDescription,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${BASE_URL}/`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: calc.category,
            item: `${BASE_URL}${categoryAnchor}`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: calc.h1,
            item: canonicalUrl
          }
        ]
      }
    ];

    if (calc.faq && calc.faq.length > 0) {
      jsonLdSchemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: calc.faq.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      });
    }

    const relatedHtml = (calc.relatedCalculators || [])
      .map(slug => {
        const rel = CALCULATORS.find(c => c.slug === slug);
        if (!rel) return '';
        const relPath = rel.path.startsWith('/') ? rel.path : `/${rel.path}`;
        return `
          <a href="${escapeHtml(relPath)}" class="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 hover:shadow-xs transition-all text-left group">
            <div class="space-y-1 pr-3">
              <span class="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors block">${escapeHtml(rel.h1)}</span>
              <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">${escapeHtml(rel.shortIntro)}</p>
            </div>
            <span class="text-slate-400 group-hover:text-blue-600">&rarr;</span>
          </a>
        `;
      })
      .filter(Boolean)
      .join('');

    const howToUseHtml = calc.howToUse && calc.howToUse.length > 0
      ? `
        <div class="pt-2 space-y-2.5">
          <h3 class="text-base font-semibold text-slate-900 dark:text-white">How to Use This Calculator</h3>
          <ol class="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            ${calc.howToUse.map((step, idx) => `
              <li class="flex items-start gap-3">
                <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold text-xs shrink-0 mt-0.5">${idx + 1}</span>
                <span class="leading-relaxed">${escapeHtml(step)}</span>
              </li>
            `).join('')}
          </ol>
        </div>
      `
      : '';

    const examplesHtml = calc.examples && calc.examples.length > 0
      ? `
        <div class="grid grid-cols-1 gap-4">
          ${calc.examples.map(ex => `
            <div class="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
              <h3 class="text-base font-bold text-slate-900 dark:text-white">${escapeHtml(ex.title)}</h3>
              <p class="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">${escapeHtml(ex.scenario)}</p>
            </div>
          `).join('')}
        </div>
      `
      : `
        <div class="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <p class="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">${escapeHtml(calc.example)}</p>
        </div>
      `;

    const faqHtml = (calc.faq || [])
      .map((item, idx) => `
        <details class="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4" ${idx === 0 ? 'open' : ''}>
          <summary class="font-semibold text-sm text-slate-900 dark:text-white cursor-pointer hover:text-blue-600">${escapeHtml(item.question)}</summary>
          <div class="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">${escapeHtml(item.answer)}</div>
        </details>
      `)
      .join('');

    const whenToUseHtml = (calc.whenToUse || [])
      .map(item => `<li class="flex items-start gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2"></span><span>${escapeHtml(item)}</span></li>`)
      .join('');

    const limitationsHtml = (calc.limitations || [])
      .map(item => `<li class="flex items-start gap-2"><span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2"></span><span>${escapeHtml(item)}</span></li>`)
      .join('');

    const preRenderedBody = `
      <div class="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        ${renderHeader()}
        <main class="flex-1">
          <article class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
            <nav aria-label="Breadcrumbs" class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <a href="/" class="hover:text-blue-600">Home</a>
              <span>/</span>
              <a href="${escapeHtml(categoryAnchor)}" class="hover:text-blue-600">${escapeHtml(calc.category)}</a>
              <span>/</span>
              <span class="text-slate-900 dark:text-white font-medium truncate" aria-current="page">${escapeHtml(calc.h1)}</span>
            </nav>

            <header class="space-y-3">
              <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <span>${escapeHtml(calc.category)}</span>
                <span>&middot;</span>
                <span>Free Online Tool</span>
              </div>
              <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">${escapeHtml(calc.h1)}</h1>
              <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">${escapeHtml(calc.shortIntro)}</p>
            </header>

            <section aria-labelledby="calculator-tool-heading" class="scroll-mt-20">
              <h2 id="calculator-tool-heading" class="sr-only">${escapeHtml(calc.h1)} Interactive Calculator Tool</h2>
              <div id="calculator-mount-point" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-2">
                <p class="text-sm font-medium text-slate-700 dark:text-slate-200">${escapeHtml(calc.h1)} — Interactive Online Calculator</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">All calculations run privately in your browser with instant results and transparent formulas below.</p>
                <noscript>
                  <div class="p-4 mt-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-900 dark:text-amber-200 rounded-xl text-sm">
                    Please enable JavaScript in your browser to interact with the live ${escapeHtml(calc.h1)} calculation inputs.
                  </div>
                </noscript>
              </div>
            </section>

            <section aria-labelledby="how-it-works-heading" class="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h2 id="how-it-works-heading" class="text-2xl font-bold text-slate-900 dark:text-white">How the ${escapeHtml(calc.h1)} Works</h2>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">${escapeHtml(calc.howItWorks)}</p>
              ${howToUseHtml}
            </section>

            <section aria-labelledby="formula-heading" class="space-y-4">
              <h2 id="formula-heading" class="text-xl font-bold text-slate-900 dark:text-white">Calculation Formula</h2>
              <div class="p-4 sm:p-5 bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-xl font-mono text-sm leading-relaxed overflow-x-auto border border-slate-800">
                <pre class="whitespace-pre-wrap">${escapeHtml(calc.formula)}</pre>
              </div>
              ${calc.formulaExplanation ? `<p class="text-xs text-slate-500 dark:text-slate-400">${escapeHtml(calc.formulaExplanation)}</p>` : ''}
            </section>

            <section aria-labelledby="example-heading" class="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h2 id="example-heading" class="text-2xl font-bold text-slate-900 dark:text-white">Practical Worked Examples</h2>
              ${examplesHtml}
            </section>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section aria-labelledby="when-to-use-heading" class="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-xs">
                <h3 id="when-to-use-heading" class="text-base font-bold text-slate-900 dark:text-white">When to Use This Calculator</h3>
                <ul class="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">${whenToUseHtml}</ul>
              </section>
              <section aria-labelledby="limitations-heading" class="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-xs">
                <h3 id="limitations-heading" class="text-base font-bold text-slate-900 dark:text-white">Important Considerations</h3>
                <ul class="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">${limitationsHtml}</ul>
              </section>
            </div>

            ${relatedHtml ? `
            <section aria-labelledby="related-heading" class="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <h2 id="related-heading" class="text-2xl font-bold text-slate-900 dark:text-white">Related Calculators</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${relatedHtml}</div>
            </section>
            ` : ''}

            ${faqHtml ? `
            <section aria-labelledby="faq-heading" class="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <h2 id="faq-heading" class="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
              <div class="space-y-3">${faqHtml}</div>
            </section>
            ` : ''}
          </article>
        </main>
        ${renderFooter()}
      </div>
    `;

    let html = applyPageMetadata(template, {
      title: calc.title,
      description: calc.metaDescription,
      canonicalUrl,
      ogType: 'article',
      robots: 'index, follow',
      jsonLdSchemas
    });
    html = replaceOrThrow(html, '<div id="root"></div>', `<div id="root">${preRenderedBody}</div>`, '<div id="root"></div>');

    if (normalizedPath.endsWith('/')) {
      const outputDir = path.join(distDir, calc.slug);
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(path.join(outputDir, 'index.html'), html, 'utf8');
      console.log(`Pre-rendered: /${calc.slug}/index.html`);
    } else {
      const pagesDir = path.join(distDir, '_pages');
      fs.mkdirSync(pagesDir, { recursive: true });
      fs.writeFileSync(path.join(pagesDir, `${calc.slug}.html`), html, 'utf8');
      console.log(`Pre-rendered (slashless rewrite target): /_pages/${calc.slug}.html -> ${normalizedPath}`);
    }
  }

  // 2. Pre-render 5 Legal pages into dist/<slug>/index.html
  const legalPages = [
    {
      slug: 'about',
      title: 'About Us — MoneyCalc Hub',
      desc: "Learn about MoneyCalc Hub's mission to provide fast, transparent, and accurate financial and mathematical calculators without clutter.",
      h1: 'About MoneyCalc Hub',
      subtitle: 'Simple Calculators. Clear Answers.',
      sections: [
        {
          paragraphs: [
            'MoneyCalc Hub was created to provide everyday consumers, entrepreneurs, and finance professionals with fast, transparent, and accessible financial calculators that respect the user’s time.'
          ]
        },
        {
          heading: 'Our Core Principles',
          bullets: [
            'Zero Bloat: We eliminate obstructive popups, auto-playing media, and fake reviews. When you visit a calculator, the interactive tool is front and center.',
            'Transparent Mathematics: Every calculator discloses its underlying formula, variable definitions, and concrete walk-through examples so you can verify our results independently.',
            'Privacy First: All calculation logic executes client-side within your browser. None of your confidential financial inputs, income numbers, or debt balances are ever transmitted to or stored on our servers.',
            'Mobile Optimization: Clean layouts built for touchscreen keyboards, tablets, and desktop workstations alike.'
          ]
        }
      ]
    },
    {
      slug: 'contact',
      title: 'Contact Us — MoneyCalc Hub',
      desc: 'Have feedback, a calculation question, or a new financial calculator suggestion? Contact the MoneyCalc Hub editorial team online.',
      h1: 'Contact MoneyCalc Hub',
      subtitle: 'Have a question, detected an issue with a calculation, or want to suggest a new tool? We value your feedback.',
      sections: [
        {
          heading: 'Get in Touch',
          paragraphs: [
            'We welcome user suggestions for new financial calculators, formula clarifications, and accessibility feedback across all MoneyCalc Hub tools.',
            'Direct inquiries can also be sent via our website feedback form once loaded or by contacting our editorial team regarding calculation methodology and corrections.'
          ]
        }
      ]
    },
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy — MoneyCalc Hub',
      desc: 'Our privacy policy explains how MoneyCalc Hub protects user data by running all financial calculations locally in your browser.',
      h1: 'Privacy Policy',
      subtitle: 'Last updated: September 26, 2026',
      sections: [
        {
          paragraphs: [
            'Your privacy is paramount to MoneyCalc Hub. This Privacy Policy details our practices concerning data collection, client-side processing, and transparency.'
          ]
        },
        {
          heading: '1. Client-Side Financial Computations',
          paragraphs: [
            'MoneyCalc Hub is built so that financial inputs (including loan amounts, salary information, profits, and interest rates) are computed entirely client-side using JavaScript in your browser. We do not store, log, harvest, or transmit your individual calculation inputs to remote servers.'
          ]
        },
        {
          heading: '2. Local Storage',
          paragraphs: [
            'We utilize your device’s local browser storage (localStorage) exclusively to remember your aesthetic preferences, such as your Light/Dark mode preference. No personally identifiable financial data is saved.'
          ]
        },
        {
          heading: '3. Third-Party Services and Analytics',
          paragraphs: [
            'We may utilize standard web analytics or privacy-respecting advertising networks to sustain free operations. These services may use standard browser cookies or log basic IP routing data.'
          ]
        }
      ]
    },
    {
      slug: 'terms',
      title: 'Terms of Service — MoneyCalc Hub',
      desc: 'Read the MoneyCalc Hub Terms of Service covering educational calculator usage, warranty disclaimers, and liability limits.',
      h1: 'Terms of Service',
      subtitle: 'Last updated: September 26, 2026',
      sections: [
        {
          paragraphs: [
            'By accessing or using MoneyCalc Hub, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of the website.'
          ]
        },
        {
          heading: '1. Informational & Educational Use Only',
          paragraphs: [
            'All tools, equations, calculators, and informational materials on MoneyCalc Hub are provided strictly for general educational and planning purposes. They do not constitute certified financial, tax, investment, accounting, or legal advice.'
          ]
        },
        {
          heading: '2. Disclaimer of Warranties',
          paragraphs: [
            'The services and calculations are provided on an "as-is" and "as-available" basis. While we strive for extreme mathematical precision across all calculators, MoneyCalc Hub makes no warranties or representations regarding absolute completeness or accuracy.'
          ]
        },
        {
          heading: '3. Limitation of Liability',
          paragraphs: [
            'In no event shall MoneyCalc Hub or its operators be held liable for any financial decisions, lending choices, contractual obligations, or damages arising out of your use of or reliance on our calculation tools.'
          ]
        }
      ]
    },
    {
      slug: 'disclaimer',
      title: 'Financial Disclaimer — MoneyCalc Hub',
      desc: 'Important disclosure: MoneyCalc Hub calculations are estimates and do not constitute personalized financial, tax, or legal advice.',
      h1: 'Financial Disclaimer',
      subtitle: 'Important information regarding our calculation tools and advice boundaries.',
      sections: [
        {
          heading: 'Not Personalized Financial Advice',
          paragraphs: [
            'MoneyCalc Hub is not a bank, licensed broker, certified financial planner (CFP), or tax advisory firm. All calculations and estimations provided by our tools are for informational and self-service educational purposes only.'
          ]
        },
        {
          heading: 'Estimates & Real-World Variables',
          paragraphs: [
            'Calculations displayed on this website represent mathematical estimates based on user-supplied numbers and standard accounting formulas. Actual loan agreements, investment returns, tax obligations, and payroll paychecks involve individual factors that our generic tools cannot anticipate:'
          ],
          bullets: [
            'Individual credit scores, debt-to-income ratios, and lender-specific fee structures',
            'Federal, state, and municipal marginal income tax brackets and payroll deductions',
            'Market volatility, fee expense drag, and inflation fluctuations in investment assets',
            'Prepayment penalty clauses, compounding calendar rules, and balloon payment contingencies'
          ]
        },
        {
          paragraphs: [
            'Before entering into binding loan contracts, mortgage applications, major corporate capital expenditures, or tax filings, always consult with a licensed financial advisor, Certified Public Accountant (CPA), or qualified legal professional.'
          ]
        }
      ]
    }
  ];

  for (const page of legalPages) {
    const canonicalUrl = `${BASE_URL}/${page.slug}/`;
    const jsonLdSchemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: page.h1,
        url: canonicalUrl,
        description: page.desc
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${BASE_URL}/`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.h1,
            item: canonicalUrl
          }
        ]
      }
    ];

    const sectionsHtml = page.sections
      .map(sec => {
        const h2 = sec.heading ? `<h2 class="text-xl font-bold text-slate-900 dark:text-white pt-4">${escapeHtml(sec.heading)}</h2>` : '';
        const paras = (sec.paragraphs || []).map(p => `<p class="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">${escapeHtml(p)}</p>`).join('');
        const bullets = sec.bullets
          ? `<ul class="space-y-2 list-disc pl-5 text-sm sm:text-base text-slate-700 dark:text-slate-300">${sec.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>`
          : '';
        return `${h2}${paras}${bullets}`;
      })
      .join('');

    const pageBody = `
      <div class="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        ${renderHeader()}
        <main class="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6 w-full">
          <nav aria-label="Breadcrumbs" class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <a href="/" class="hover:text-blue-600">Home</a>
            <span>/</span>
            <span class="text-slate-900 dark:text-white font-medium" aria-current="page">${escapeHtml(page.h1)}</span>
          </nav>
          <header class="space-y-2">
            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">${escapeHtml(page.h1)}</h1>
            <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300">${escapeHtml(page.subtitle)}</p>
          </header>
          <div class="space-y-4">
            ${sectionsHtml}
          </div>
        </main>
        ${renderFooter()}
      </div>
    `;

    let html = applyPageMetadata(template, {
      title: page.title,
      description: page.desc,
      canonicalUrl,
      ogType: 'website',
      robots: 'index, follow',
      jsonLdSchemas
    });
    html = replaceOrThrow(html, '<div id="root"></div>', `<div id="root">${pageBody}</div>`, '<div id="root"></div>');

    const outputDir = path.join(distDir, page.slug);
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'index.html'), html, 'utf8');
    console.log(`Pre-rendered legal: /${page.slug}/index.html`);
  }

  // 3. Pre-render 404 page into dist/404.html (so unknown routes return HTTP 404 + noindex)
  {
    const notFoundBody = `
      <div class="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        ${renderHeader()}
        <main class="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center space-y-6">
          <div class="text-6xl font-bold font-mono text-emerald-600 dark:text-emerald-400">404</div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Page Not Found</h1>
          <p class="text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            The page you are looking for does not exist or may have moved.
          </p>
          <div class="pt-4">
            <a href="/" class="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-colors">
              Back to Home
            </a>
          </div>
        </main>
        ${renderFooter()}
      </div>
    `;

    let notFoundHtml = applyPageMetadata(template, {
      title: 'Page Not Found — MoneyCalc Hub',
      description: 'The calculator page you are looking for does not exist or may have moved.',
      canonicalUrl: `${BASE_URL}/404/`,
      ogType: 'website',
      robots: 'noindex, nofollow'
    });
    notFoundHtml = replaceOrThrow(notFoundHtml, '<div id="root"></div>', `<div id="root">${notFoundBody}</div>`, '<div id="root"></div>');
    fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf8');
    console.log('Pre-rendered 404 page: /404.html');
  }

  // 4. Pre-render Homepage into dist/index.html
  const homeCanonicalUrl = `${BASE_URL}/`;
  const homeTitle = 'MoneyCalc Hub — Free Money & Financial Calculators';
  const homeDescription = 'Simple Calculators. Clear Answers. Calculate percentages, discounts, profits, salaries, loans, interest, investments, and savings quickly and accurately.';

  const popularCalculators = CALCULATORS.filter(c => c.popular);

  const popularCardsHtml = popularCalculators
    .map(calc => {
      const calcPath = calc.path.startsWith('/') ? calc.path : `/${calc.path}`;
      return `
        <a href="${escapeHtml(calcPath)}" class="flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 hover:shadow-xs transition-all text-left group">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">${escapeHtml(calc.category)}</span>
              <span class="text-[10px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full">Popular</span>
            </div>
            <h3 class="font-semibold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">${escapeHtml(calc.h1)}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">${escapeHtml(calc.shortIntro)}</p>
          </div>
          <div class="flex items-center gap-1 text-xs font-medium text-blue-600 pt-4 mt-2">
            <span>Open calculator</span>
            <span>&rarr;</span>
          </div>
        </a>
      `;
    })
    .join('');

  const categorySectionsHtml = CATEGORIES.map(cat => {
    const anchor = cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const catCalcs = CALCULATORS.filter(c => c.category === cat.name);
    const cardsHtml = catCalcs
      .map(calc => {
        const calcPath = calc.path.startsWith('/') ? calc.path : `/${calc.path}`;
        return `
          <a href="${escapeHtml(calcPath)}" class="flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 hover:shadow-xs transition-all text-left group">
            <div class="space-y-2">
              <h3 class="font-semibold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">${escapeHtml(calc.h1)}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">${escapeHtml(calc.shortIntro)}</p>
            </div>
            <div class="flex items-center gap-1 text-xs font-medium text-blue-600 pt-4 mt-2">
              <span>Use tool</span>
              <span>&rarr;</span>
            </div>
          </a>
        `;
      })
      .join('');

    return `
      <section id="${escapeHtml(anchor)}" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-20">
        <div class="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">${escapeHtml(cat.name)}</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${escapeHtml(cat.description)}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${cardsHtml}
        </div>
      </section>
    `;
  }).join('');

  const homeBody = `
    <div class="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      ${renderHeader()}
      <main class="flex-1 space-y-16 py-8 sm:py-12">
        <section class="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
            Free Money &amp; Financial Calculators
          </h1>
          <p class="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Calculate percentages, discounts, profits, salaries, loans, interest, investments, savings, and more quickly and accurately.
          </p>
        </section>

        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div>
            <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Popular Calculators</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">Most visited tools for daily calculations, budgeting, and financial analysis.</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${popularCardsHtml}
          </div>
        </section>

        <div id="all-calculators" class="space-y-16">
          ${categorySectionsHtml}
        </div>

        <section class="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-slate-200 dark:border-slate-800 space-y-8">
          <div class="text-center space-y-2">
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Why Use MoneyCalc Hub?</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">Transparent mathematics, private in-browser processing, and clean online calculation tools.</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 class="font-bold text-base text-slate-900 dark:text-white">100% Free &amp; Private</h3>
              <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">No accounts, sign-ups, or subscriptions. All calculations run strictly in your browser without saving your personal financial data.</p>
            </div>
            <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 class="font-bold text-base text-slate-900 dark:text-white">Verified Formulas</h3>
              <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Every calculator clearly displays the mathematical formula, logic, and practical examples so you understand exactly how your results are generated.</p>
            </div>
            <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 class="font-bold text-base text-slate-900 dark:text-white">Fast &amp; Mobile-Optimized</h3>
              <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Designed with responsive layouts, large touch targets, and instant real-time results on smartphones, tablets, and desktops.</p>
            </div>
          </div>
        </section>

        <section class="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white text-center">Frequently Asked Questions</h2>
          <div class="space-y-3">
            ${HOMEPAGE_FAQS.map((faq, idx) => `
              <details class="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4" ${idx === 0 ? 'open' : ''}>
                <summary class="font-semibold text-sm text-slate-900 dark:text-white cursor-pointer hover:text-blue-600">${escapeHtml(faq.question)}</summary>
                <div class="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">${escapeHtml(faq.answer)}</div>
              </details>
            `).join('')}
          </div>
        </section>
      </main>
      ${renderFooter()}
    </div>
  `;

  const homeJsonLdSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'MoneyCalc Hub',
      url: homeCanonicalUrl,
      description: homeDescription,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${homeCanonicalUrl}?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      },
      publisher: {
        '@type': 'Organization',
        name: 'MoneyCalc Hub',
        url: homeCanonicalUrl,
        logo: `${homeCanonicalUrl}favicon-192x192.png`
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'MoneyCalc Hub',
      url: homeCanonicalUrl,
      logo: `${homeCanonicalUrl}favicon-192x192.png`
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: HOMEPAGE_FAQS.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    }
  ];

  let homeHtml = applyPageMetadata(template, {
    title: homeTitle,
    description: homeDescription,
    canonicalUrl: homeCanonicalUrl,
    ogType: 'website',
    robots: 'index, follow',
    jsonLdSchemas: homeJsonLdSchemas
  });
  homeHtml = replaceOrThrow(homeHtml, '<div id="root"></div>', `<div id="root">${homeBody}</div>`, '<div id="root"></div>');
  fs.writeFileSync(templatePath, homeHtml, 'utf8');
  console.log('Pre-rendered homepage: /index.html');

  // 5. Generate synchronized sitemap.xml into both public/sitemap.xml and dist/sitemap.xml
  // Preserve existing lastmod unless explicitly updated or newly discovered
  const resolveLastmod = (loc, explicitDate) => explicitDate || existingLastmods.get(loc) || TODAY_ISO;

  const sitemapUrls = [
    {
      loc: `${BASE_URL}/`,
      lastmod: resolveLastmod(`${BASE_URL}/`),
      changefreq: 'weekly',
      priority: '1.0'
    },
    ...CALCULATORS.map(c => {
      const loc = `${BASE_URL}${c.path.startsWith('/') ? c.path : `/${c.path}`}`;
      return {
        loc,
        lastmod: resolveLastmod(loc, c.lastUpdated),
        changefreq: 'monthly',
        priority: c.popular ? '0.9' : '0.8'
      };
    }),
    ...legalPages.map(p => {
      const loc = `${BASE_URL}/${p.slug}/`;
      return {
        loc,
        lastmod: resolveLastmod(loc),
        changefreq: 'yearly',
        priority: p.slug === 'privacy-policy' || p.slug === 'terms' ? '0.4' : '0.5'
      };
    })
  ];

  const sitemapXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapUrls.map(u => [
      '  <url>',
      `    <loc>${escapeHtml(u.loc)}</loc>`,
      `    <lastmod>${escapeHtml(u.lastmod)}</lastmod>`,
      `    <changefreq>${u.changefreq}</changefreq>`,
      `    <priority>${u.priority}</priority>`,
      '  </url>'
    ].join('\n')),
    '</urlset>',
    ''
  ].join('\n');

  fs.writeFileSync(publicSitemapPath, sitemapXml, 'utf8');
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
  console.log(`Generated sitemap.xml with ${sitemapUrls.length} canonical URLs.`);
  console.log(`All ${sitemapUrls.length} indexable static pages + 404.html pre-rendered successfully!`);
}

try {
  main();
} catch (err) {
  console.error('Prerender failed:', err);
  process.exit(1);
}
