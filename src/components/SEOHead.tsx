import { useEffect } from 'react';
import { CalculatorMeta, HOMEPAGE_FAQS } from '../data/calculators';

export type SEOPageType = 'home' | 'calculator' | 'legal' | 'notFound';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath: string;
  calculator?: CalculatorMeta;
  isLegalOrHome?: boolean;
  pageType?: SEOPageType;
  robots?: string;
  pageName?: string;
}

export function SEOHead({
  title,
  description,
  canonicalPath,
  calculator,
  isLegalOrHome,
  pageType,
  robots = 'index, follow',
  pageName,
}: SEOProps) {
  const resolvedPageType: SEOPageType =
    pageType ??
    (robots.includes('noindex')
      ? 'notFound'
      : calculator
        ? 'calculator'
        : isLegalOrHome && canonicalPath !== '/'
          ? 'legal'
          : 'home');

  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Helper to set or create meta tag
    const setMeta = (attrName: string, attrVal: string, content: string) => {
      let meta = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrVal);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Standard description & robots directive
    setMeta('name', 'description', description);
    setMeta('name', 'robots', robots);

    // OpenGraph
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', resolvedPageType === 'calculator' ? 'article' : 'website');

    // Canonical production origin
    const origin = 'https://moneycalchub.online';
    const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
    const normalizedPath = cleanPath === '/' ? '/' : cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
    const fullCanonicalUrl = `${origin}${normalizedPath}`;
    setMeta('property', 'og:url', fullCanonicalUrl);
    setMeta('property', 'og:site_name', 'MoneyCalc Hub');

    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

    // Canonical link tag
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', fullCanonicalUrl);

    // Schema.org JSON-LD scripts (synchronized with static prerender output)
    const oldScripts = document.querySelectorAll('script[data-seo-jsonld]');
    oldScripts.forEach(s => s.remove());

    const schemas: object[] = [];

    if (resolvedPageType === 'home') {
      schemas.push(
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'MoneyCalc Hub',
          url: fullCanonicalUrl,
          description,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${fullCanonicalUrl}?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'MoneyCalc Hub',
          url: fullCanonicalUrl,
          logo: `${origin}/favicon-192x192.png`,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: HOMEPAGE_FAQS.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      );
    } else if (resolvedPageType === 'calculator' && calculator) {
      schemas.push(
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: calculator.h1,
          url: fullCanonicalUrl,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'All',
          description,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${origin}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: calculator.category,
              item: `${origin}/#${calculator.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: calculator.h1,
              item: fullCanonicalUrl,
            },
          ],
        }
      );

      if (calculator.faq && calculator.faq.length > 0) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: calculator.faq.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        });
      }
    } else if (resolvedPageType === 'legal') {
      const legalName = pageName || title.replace(/\s+—\s+MoneyCalc Hub$/, '');
      schemas.push(
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: legalName,
          url: fullCanonicalUrl,
          description,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${origin}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: legalName,
              item: fullCanonicalUrl,
            },
          ],
        }
      );
    }

    schemas.forEach(schemaData => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-jsonld', 'true');
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);
    });

    return () => {
      const cleanupScripts = document.querySelectorAll('script[data-seo-jsonld]');
      cleanupScripts.forEach(s => s.remove());
    };
  }, [title, description, canonicalPath, calculator, resolvedPageType, robots, pageName]);

  return null;
}
