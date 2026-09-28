import { useEffect } from 'react';
import { CalculatorMeta } from '../data/calculators';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath: string;
  calculator?: CalculatorMeta;
  isLegalOrHome?: boolean;
}

export function SEOHead({ title, description, canonicalPath, calculator, isLegalOrHome }: SEOProps) {
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

    // Standard description
    setMeta('name', 'description', description);

    // OpenGraph
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', isLegalOrHome ? 'website' : 'article');
    // Canonical production origin
    const origin = 'https://moneycalchub.online';
    const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
    const fullCanonicalUrl = `${origin}${cleanPath}`;
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

    // Schema.org JSON-LD scripts
    // Remove existing dynamic jsonld scripts
    const oldScripts = document.querySelectorAll('script[data-seo-jsonld]');
    oldScripts.forEach(s => s.remove());

    const schemas: object[] = [];

    // WebApplication schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': calculator ? calculator.h1 : 'MoneyCalc Hub',
      'url': fullCanonicalUrl,
      'applicationCategory': 'FinanceApplication',
      'operatingSystem': 'All',
      'description': description,
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    });

    // BreadcrumbList schema
    if (calculator) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': `${origin}/`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': calculator.category,
            'item': `${origin}/#${calculator.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': calculator.h1,
            'item': fullCanonicalUrl
          }
        ]
      });

      // FAQPage schema
      if (calculator.faq && calculator.faq.length > 0) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': calculator.faq.map(item => ({
            '@type': 'Question',
            'name': item.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': item.answer
            }
          }))
        });
      }
    }

    // Append new JSON-LD scripts
    schemas.forEach(schemaData => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-jsonld', 'true');
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);
    });

    return () => {
      // Cleanup on unmount
      const cleanupScripts = document.querySelectorAll('script[data-seo-jsonld]');
      cleanupScripts.forEach(s => s.remove());
    };
  }, [title, description, canonicalPath, calculator, isLegalOrHome]);

  return null;
}
