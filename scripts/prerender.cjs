const fs = require('fs');
const path = require('path');

// 1. Read dist/index.html
const distDir = path.resolve(__dirname, '../dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('dist/index.html not found! Run vite build first.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

// 2. Load calculators data from src/data/calculators.ts
// We can extract CALCULATORS and CATEGORIES using regex or an evaluation helper
const dataContent = fs.readFileSync(path.resolve(__dirname, '../src/data/calculators.ts'), 'utf8');

// Simple parser for CALCULATORS array
// Or we can evaluate in node by importing if compiled, or regex extraction
function extractCalculators() {
  const calcs = [];
  // Match each object inside CALCULATORS
  const regex = /id:\s*'([^']+)',[\s\S]*?slug:\s*'([^']+)',[\s\S]*?path:\s*'([^']+)',[\s\S]*?title:\s*'([^']+)',[\s\S]*?metaDescription:\s*'([^']+)',[\s\S]*?h1:\s*'([^']+)',[\s\S]*?category:\s*'([^']+)',[\s\S]*?shortIntro:\s*'([^']+)',/g;
  let match;
  while ((match = regex.exec(dataContent)) !== null) {
    const id = match[1];
    // Find the block for this id to extract howItWorks, formula, example, faq, relatedCalculators
    const blockStart = match.index;
    const nextBlock = dataContent.indexOf('  {', blockStart + 10);
    const block = nextBlock !== -1 ? dataContent.slice(blockStart, nextBlock) : dataContent.slice(blockStart);

    const getField = (field) => {
      const m = block.match(new RegExp(`${field}:\\s*'([\\s\\S]*?)',`));
      return m ? m[1].replace(/\\'/g, "'").replace(/\\n/g, '\n') : '';
    };

    const getArray = (field) => {
      const m = block.match(new RegExp(`${field}:\\s*\\[([\\s\\S]*?)\\]`));
      if (!m) return [];
      const items = [];
      const itemRegex = /'([\s\S]*?)'/g;
      let im;
      while ((im = itemRegex.exec(m[1])) !== null) {
        items.push(im[1].replace(/\\'/g, "'"));
      }
      return items;
    };

    // Extract FAQs
    const faqs = [];
    const faqSectionMatch = block.match(/faq:\s*\[([\s\S]*?)\]\s*(?:,\s*popular|,\s*\}|\})/);
    if (faqSectionMatch) {
      const faqItemRegex = /question:\s*'([\s\S]*?)',\s*answer:\s*'([\s\S]*?)'/g;
      let fm;
      while ((fm = faqItemRegex.exec(faqSectionMatch[1])) !== null) {
        faqs.push({
          question: fm[1].replace(/\\'/g, "'"),
          answer: fm[2].replace(/\\'/g, "'")
        });
      }
    }

    calcs.push({
      id,
      slug: match[2],
      path: match[3],
      title: match[4].replace(/\\'/g, "'"),
      metaDescription: match[5].replace(/\\'/g, "'"),
      h1: match[6].replace(/\\'/g, "'"),
      category: match[7],
      shortIntro: match[8].replace(/\\'/g, "'"),
      howItWorks: getField('howItWorks'),
      formula: getField('formula'),
      formulaExplanation: getField('formulaExplanation'),
      example: getField('example'),
      whenToUse: getArray('whenToUse'),
      limitations: getArray('limitations'),
      relatedCalculators: getArray('relatedCalculators'),
      faq: faqs
    });
  }
  return calcs;
}

const calculators = extractCalculators();
console.log(`Extracted ${calculators.length} calculators for pre-rendering.`);

// Helper to escape HTML characters
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const BASE_URL = 'https://moneycalchub.online';

// 3. Pre-render each calculator
calculators.forEach((calc) => {
  const canonicalUrl = `${BASE_URL}${calc.path}`;

  // Build JSON-LD structured data
  const jsonLdSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': calc.h1,
      'url': canonicalUrl,
      'applicationCategory': 'FinanceApplication',
      'operatingSystem': 'All',
      'description': calc.metaDescription,
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': `${BASE_URL}/`
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': calc.category,
          'item': `${BASE_URL}/#${calc.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': calc.h1,
          'item': canonicalUrl
        }
      ]
    }
  ];

  if (calc.faq && calc.faq.length > 0) {
    jsonLdSchemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': calc.faq.map(item => ({
        '@type': 'Question',
        'name': item.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.answer
        }
      }))
    });
  }

  const jsonLdHtml = jsonLdSchemas.map(s => 
    `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(s)}</script>`
  ).join('\n    ');

  // Build semantic content for <div id="root">
  const categoryAnchor = `/#${calc.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  const relatedHtml = calc.relatedCalculators.map(slug => {
    const rel = calculators.find(c => c.slug === slug);
    if (!rel) return '';
    return `
      <a href="${rel.path}" class="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 hover:shadow-xs transition-all text-left group">
        <div class="space-y-1 pr-3">
          <span class="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors block">${escapeHtml(rel.h1)}</span>
          <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">${escapeHtml(rel.shortIntro)}</p>
        </div>
        <span class="text-slate-400 group-hover:text-blue-600">&rarr;</span>
      </a>
    `;
  }).filter(Boolean).join('');

  const faqHtml = calc.faq.map((item, idx) => `
    <details class="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4" ${idx === 0 ? 'open' : ''}>
      <summary class="font-semibold text-sm text-slate-900 dark:text-white cursor-pointer hover:text-blue-600">${escapeHtml(item.question)}</summary>
      <div class="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">${escapeHtml(item.answer)}</div>
    </details>
  `).join('');

  const whenToUseHtml = calc.whenToUse.map(item => `<li class="flex items-start gap-2"><span>&bull;</span><span>${escapeHtml(item)}</span></li>`).join('');
  const limitationsHtml = calc.limitations.map(item => `<li class="flex items-start gap-2"><span>&bull;</span><span>${escapeHtml(item)}</span></li>`).join('');

  const preRenderedBody = `
  <div class="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <header class="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="/" class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-xs p-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-white">
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
        <nav class="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="/#everyday-money" class="hover:text-blue-600">Money</a>
          <a href="/#business" class="hover:text-blue-600">Business</a>
          <a href="/#salary-&-pay" class="hover:text-blue-600">Salary</a>
          <a href="/#loans-&-interest" class="hover:text-blue-600">Loans</a>
          <a href="/#investment-&-savings" class="hover:text-blue-600">Investment</a>
        </nav>
      </div>
    </header>

    <main class="flex-1">
      <article class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        <nav aria-label="Breadcrumbs" class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <a href="/" class="hover:text-blue-600">Home</a>
          <span>/</span>
          <a href="${categoryAnchor}" class="hover:text-blue-600">${escapeHtml(calc.category)}</a>
          <span>/</span>
          <span class="text-slate-900 dark:text-white font-medium truncate" aria-current="page">${escapeHtml(calc.h1)}</span>
        </nav>

        <header class="space-y-3">
          <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <span>${escapeHtml(calc.category)}</span>
            <span>·</span>
            <span>Free Online Tool</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">${escapeHtml(calc.h1)}</h1>
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">${escapeHtml(calc.shortIntro)}</p>
        </header>

        <div id="calculator-mount-point" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <noscript>
            <div class="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-900 dark:text-amber-200 rounded-xl text-sm">
              Please enable JavaScript in your browser to interact with the live ${escapeHtml(calc.h1)} calculation inputs.
            </div>
          </noscript>
        </div>

        ${calc.howItWorks ? `
        <section class="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">How It Works</h2>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">${escapeHtml(calc.howItWorks)}</p>
        </section>
        ` : ''}

        ${calc.formula ? `
        <section class="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Calculation Formula &amp; Logic</h2>
          <div class="p-4 bg-slate-100 dark:bg-slate-900/80 rounded-xl font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap">${escapeHtml(calc.formula)}</div>
          ${calc.formulaExplanation ? `<p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">${escapeHtml(calc.formulaExplanation)}</p>` : ''}
        </section>
        ` : ''}

        ${calc.example ? `
        <section class="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Practical Example</h2>
          <div class="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            ${escapeHtml(calc.example)}
          </div>
        </section>
        ` : ''}

        ${calc.whenToUse && calc.whenToUse.length > 0 ? `
        <section class="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">When to Use This Calculator</h2>
          <ul class="space-y-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">${whenToUseHtml}</ul>
        </section>
        ` : ''}

        ${calc.limitations && calc.limitations.length > 0 ? `
        <section class="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Important Considerations &amp; Limitations</h2>
          <ul class="space-y-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">${limitationsHtml}</ul>
        </section>
        ` : ''}

        ${relatedHtml ? `
        <section class="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Related Calculators</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${relatedHtml}</div>
        </section>
        ` : ''}

        ${faqHtml ? `
        <section class="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <div class="space-y-3">${faqHtml}</div>
        </section>
        ` : ''}
      </article>
    </main>

    <footer class="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-10 mt-16 text-xs text-slate-500 text-center">
      <div class="max-w-7xl mx-auto px-4 space-y-4">
        <p>&copy; ${new Date().getFullYear()} MoneyCalc Hub. All rights reserved. For educational and planning use only.</p>
        <div class="flex justify-center gap-4 text-slate-600 dark:text-slate-400">
          <a href="/about/" class="hover:text-blue-600">About Us</a>
          <a href="/contact/" class="hover:text-blue-600">Contact</a>
          <a href="/privacy-policy/" class="hover:text-blue-600">Privacy Policy</a>
          <a href="/terms/" class="hover:text-blue-600">Terms of Service</a>
          <a href="/disclaimer/" class="hover:text-blue-600">Disclaimer</a>
        </div>
      </div>
    </footer>
  </div>
  `;

  // Inject meta tags into HTML
  let html = template;

  // Replace Title
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(calc.title)}</title>`);

  // Replace Description
  html = html.replace(/<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/, `<meta name="description" content="${escapeHtml(calc.metaDescription)}" />`);

  // Replace Canonical
  html = html.replace(/<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/, `<link rel="canonical" href="${canonicalUrl}" />`);

  // Replace OpenGraph Title & Description & URL
  html = html.replace(/<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/, `<meta property="og:title" content="${escapeHtml(calc.title)}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/, `<meta property="og:description" content="${escapeHtml(calc.metaDescription)}" />`);
  html = html.replace(/<meta\s+property="og:type"\s+content="[\s\S]*?"\s*\/?>/, `<meta property="og:type" content="article" />\n    <meta property="og:url" content="${canonicalUrl}" />`);

  // Replace Twitter Title & Description
  html = html.replace(/<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/, `<meta name="twitter:title" content="${escapeHtml(calc.title)}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/, `<meta name="twitter:description" content="${escapeHtml(calc.metaDescription)}" />`);

  // Inject Schema.org JSON-LD before </head>
  html = html.replace('</head>', `    ${jsonLdHtml}\n  </head>`);

  // Inject pre-rendered body inside <div id="root">
  html = html.replace('<div id="root"></div>', `<div id="root">${preRenderedBody}</div>`);

  // Save to dist/<slug>/index.html
  const outputDir = path.join(distDir, calc.slug);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), html, 'utf8');
  console.log(`Pre-rendered: /${calc.slug}/index.html`);
});

// 4. Pre-render 5 Legal pages
const legalPages = [
  {
    slug: 'about',
    title: 'About Us — MoneyCalc Hub',
    desc: "Learn about MoneyCalc Hub's mission to provide fast, transparent, and accurate financial and mathematical calculators without clutter.",
    h1: 'About MoneyCalc Hub',
    bodyText: 'MoneyCalc Hub was created to provide everyday consumers, entrepreneurs, and finance professionals with fast, transparent, and accessible financial calculators that respect the user’s time.'
  },
  {
    slug: 'contact',
    title: 'Contact Us — MoneyCalc Hub',
    desc: 'Have feedback, a question, or a new calculator suggestion? Reach out to the MoneyCalc Hub team.',
    h1: 'Contact & Feedback',
    bodyText: 'We welcome feedback, suggestions for new calculation tools, and user inquiries. Please reach out to our team at support@moneycalchub.online.'
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy — MoneyCalc Hub',
    desc: 'Read MoneyCalc Hub’s privacy policy. All calculation logic runs locally in your browser. We never sell or collect your financial data.',
    h1: 'Privacy Policy',
    bodyText: 'At MoneyCalc Hub, your privacy is paramount. All financial calculations occur locally in your web browser. We never collect, transmit, or store your private monetary calculations on our servers.'
  },
  {
    slug: 'terms',
    title: 'Terms of Service — MoneyCalc Hub',
    desc: 'Review the terms and conditions for using MoneyCalc Hub financial calculation tools and educational content.',
    h1: 'Terms of Service',
    bodyText: 'By accessing or using MoneyCalc Hub, you agree to be bound by these Terms of Service. All calculators are provided for general educational and informational purposes only.'
  },
  {
    slug: 'disclaimer',
    title: 'Financial Disclaimer — MoneyCalc Hub',
    desc: 'Important disclosure: MoneyCalc Hub calculations are estimates and do not constitute personalized financial, tax, or legal advice.',
    h1: 'Financial Disclaimer',
    bodyText: 'All calculations provided on MoneyCalc Hub represent mathematical estimates based on user-supplied numbers and standard mathematical equations. They do not constitute personalized investment, legal, tax, or credit advice.'
  }
];

legalPages.forEach(page => {
  const canonicalUrl = `${BASE_URL}/${page.slug}/`;
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
  html = html.replace(/<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/, `<meta name="description" content="${escapeHtml(page.desc)}" />`);
  html = html.replace(/<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/, `<link rel="canonical" href="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/, `<meta property="og:title" content="${escapeHtml(page.title)}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/, `<meta property="og:description" content="${escapeHtml(page.desc)}" />`);

  const pageBody = `
    <div class="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header class="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 max-w-7xl mx-auto w-full">
        <a href="/" class="font-bold text-lg text-slate-900 dark:text-white">MoneyCalc Hub</a>
      </header>
      <main class="flex-1 max-w-3xl mx-auto px-4 py-12 space-y-6">
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">${escapeHtml(page.h1)}</h1>
        <p class="text-base text-slate-600 dark:text-slate-300 leading-relaxed">${escapeHtml(page.bodyText)}</p>
      </main>
      <footer class="py-8 border-t border-slate-200 text-center text-xs text-slate-500">
        <a href="/" class="hover:underline">Home</a> · &copy; ${new Date().getFullYear()} MoneyCalc Hub
      </footer>
    </div>
  `;

  html = html.replace('<div id="root"></div>', `<div id="root">${pageBody}</div>`);

  const outputDir = path.join(distDir, page.slug);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), html, 'utf8');
  console.log(`Pre-rendered legal: /${page.slug}/index.html`);
});

console.log('All 29 static pages pre-rendered successfully!');
