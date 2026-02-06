import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getAllCategorySlugs } from '@/lib/category-landing-data';
import CategoryLandingTemplate from '@/components/category/CategoryLandingTemplate';
import CategoryJsonLd from '@/components/category/CategoryJsonLd';

interface PageProps {
  params: Promise<{ category: string }>;
}

// Generate static params for all categories
export async function generateStaticParams() {
  const slugs = getAllCategorySlugs();
  return slugs.map((slug) => ({ category: slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) return {};

  const en = category.become.en;

  return {
    title: en.title,
    description: en.metaDescription,
    alternates: {
      canonical: `/become/${slug}`,
      languages: {
        en: `/become/${slug}`,
        he: `/become/${slug}`,
      },
    },
    openGraph: {
      title: en.title,
      description: en.metaDescription,
      url: `https://talentr.co.il/become/${slug}`,
      siteName: 'Talentr',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: en.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: en.title,
      description: en.metaDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BecomeCategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <>
      <CategoryJsonLd category={category} pageType="become" lang="en" />
      <CategoryLandingTemplate category={category} pageType="become" />
    </>
  );
}
