import type { CategoryContent, PageType, FAQItem } from '@/lib/category-landing-data';

interface CategoryJsonLdProps {
  category: CategoryContent;
  pageType: PageType;
  lang: 'en' | 'he';
}

export default function CategoryJsonLd({ category, pageType, lang }: CategoryJsonLdProps) {
  const content = category[pageType][lang];
  const faqItems = content.faq;

  // FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item: FAQItem) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  // Service Schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: content.h1,
    description: content.metaDescription,
    provider: {
      '@type': 'Organization',
      name: 'Talentr',
      url: 'https://talentr.co.il',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Israel',
    },
    serviceType: pageType === 'book' ? 'Event Entertainment Booking' : 'Performer Registration',
    category: category.slug,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}
