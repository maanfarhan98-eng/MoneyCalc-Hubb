# MoneyCalc Hub

> **Simple Calculators. Clear Answers.**
> Professional, fast, mobile-first suite of free calculators for money, business, salary, loans, interest, investments, savings, and dates.

---

## 🚀 Features

- **23 Dedicated Financial & Utility Calculators**:
  1. Percentage Calculator (`/percentage-calculator/`)
  2. Discount Calculator (`/discount-calculator/`)
  3. Tip Calculator (`/tip-calculator/`)
  4. Age Calculator (`/age-calculator/`)
  5. Commission Calculator (`/commission-calculator/`)
  6. Markup Calculator (`/markup-calculator/`)
  7. Profit Calculator (`/profit-calculator/`)
  8. Profit Margin Calculator (`/profit-margin-calculator/`)
  9. Break-Even Calculator (`/break-even-calculator/`)
  10. ROI Calculator (`/roi-calculator/`)
  11. Salary Calculator (`/salary-calculator/`)
  12. Overtime Pay Calculator (`/overtime-pay-calculator/`)
  13. Pay Raise Calculator (`/pay-raise-calculator/`)
  14. Loan Calculator (`/loan-calculator/`)
  15. Simple Interest Calculator (`/simple-interest-calculator/`)
  16. Compound Interest Calculator (`/compound-interest-calculator/`)
  17. Monthly Payment Calculator (`/monthly-payment-calculator/`)
  18. Interest Rate Calculator (`/interest-rate-calculator/`)
  19. Loan Payoff Calculator (`/loan-payoff-calculator/`)
  20. Investment Calculator (`/investment-calculator/`)
  21. Savings Calculator (`/savings-calculator/`)
  22. Compound Interest Investment Calculator (`/compound-interest-investment-calculator/`)
  23. Return on Investment Calculator (`/return-on-investment-calculator/`)

- **Comprehensive Legal & Information Pages**:
  - About Us (`/about/`)
  - Contact & Feedback (`/contact/`)
  - Privacy Policy (`/privacy-policy/`)
  - Terms of Service (`/terms/`)
  - Financial Disclaimer (`/disclaimer/`)

- **Technical SEO & Core Web Vitals**:
  - Unique Title and Meta Description per page
  - Canonical URLs on every route
  - OpenGraph & Twitter/X Social Card tags
  - Schema.org JSON-LD structured data (`WebApplication`, `BreadcrumbList`, and `FAQPage`)
  - `sitemap.xml` and `robots.txt`
  - High performance, responsive layout, zero layout shifts, tabular numerals (`tabular-nums`)

- **Light & Dark Theme**:
  - Accessible contrast (WCAG AA compliant)
  - Persistent theme stored in `localStorage`

- **Site-Wide Instant Search**:
  - Search any calculator by keywords, concepts, and synonyms (e.g. "loan", "profit", "margin", "bonus", "mortgage", "apr").

---

## 🛠️ Deploying to Vercel

MoneyCalc Hub includes a pre-configured `vercel.json` rewrite file:

```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Deploy using Vercel CLI
vercel --prod
```

Or connect the repository to your Vercel Dashboard with build command `npm run build` and output directory `dist`. Direct URL refreshes (e.g., `/percentage-calculator/`) will serve `index.html` seamlessly via the SPA rewrite rule.

---

## 📑 Ad & Verification Script Placement

To integrate verification tags and third-party advertising networks, open `/index.html`:

### 1. Google Search Console Verification
Place the verification meta tag inside the `<head>` of `/index.html`:
```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" />
```

### 2. Google AdSense
Add your script inside the `<head>` of `/index.html`:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
```

### 3. Google Analytics (GA4)
Place the gtag script in `<head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 4. Adsterra or Other Ad Networks
Place your popunder or banner script tags right where indicated inside `/index.html` or before the closing `</body>` tag.

---

## 🛡️ License
SPDX-License-Identifier: MIT
