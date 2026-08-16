import type { Metadata } from 'next';
import config from '@/config';

// NEXT_PUBLIC_SITE_URL > VERCEL_PROJECT_PRODUCTION_URL > VERCEL_URL > domainName > localhost
const getBaseURL = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NODE_ENV !== 'development') return `https://${config.domainName}`;
  return 'http://localhost:3000';
};
export const BASE_URL = getBaseURL();

export const getSEOTags = ({
  title,
  description,
  keywords,
  openGraph,
  canonicalUrlRelative,
  extraTags,
}: Metadata & {
  canonicalUrlRelative?: string;
  extraTags?: Record<string, any>;
} = {}): Metadata => {
  return {
    title: title || config.appName,
    description: description || config.appDescription,
    keywords: keywords || [config.appName],
    applicationName: config.appName,
    manifest: '/manifest.webmanifest',
    metadataBase: new URL(BASE_URL),

    openGraph: {
      title: openGraph?.title || title || config.appName,
      description: openGraph?.description || description || config.appDescription,
      url: openGraph?.url || BASE_URL,
      siteName: config.appName,
      images: openGraph?.images ?? [
        {
          url: '/images/home.png',
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_US',
      type: 'website' as const,
    },

    twitter: {
      title: openGraph?.title || title || config.appName,
      description: openGraph?.description || description || config.appDescription,
      card: 'summary_large_image',
      creator: '@ThalerFinance',
    },

    ...(canonicalUrlRelative && {
      alternates: { canonical: canonicalUrlRelative },
    }),

    ...extraTags,
  };
};

// Spec: https://developers.google.com/search/docs/appearance/structured-data/software-app
// Validator: https://search.google.com/test/rich-results
// Ratings must be real — Google penalises fake/placeholder values.
type SchemaTagsProps = {
  name?: string;
  description?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  datePublished?: string;
  offers?: { price: number | string; priceCurrency?: string };
  aggregateRating?: {
    ratingValue: number | string;
    ratingCount?: number | string;
    reviewCount?: number | string;
    bestRating?: number | string;
    worstRating?: number | string;
  };
};

export const renderSchemaTags = ({
  name = config.appName,
  description = config.appDescription,
  applicationCategory = 'FinanceApplication',
  operatingSystem = 'Web',
  datePublished,
  offers = { price: 0 },
  aggregateRating,
}: SchemaTagsProps = {}) => {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    image: `${BASE_URL}/images/home.png`,
    url: `${BASE_URL}/`,
    author: {
      '@type': 'Organization',
      name: 'ThalerFinance',
      url: `${BASE_URL}/`,
      logo: `${BASE_URL}/logo.svg`,
      sameAs: [
        config.socials.discord,
        // xTwitter may be a bare handle ("@Thaler") or a full URL — normalise both.
        config.socials.xTwitter &&
          (/^https?:\/\//.test(config.socials.xTwitter)
            ? config.socials.xTwitter
            : `https://x.com/${config.socials.xTwitter.replace(/^@/, '')}`),
      ].filter(Boolean),
    },
    applicationCategory,
    operatingSystem,
    offers: {
      '@type': 'Offer',
      ...offers,
    },
  };

  if (datePublished) schema.datePublished = datePublished;
  if (aggregateRating) {
    schema.aggregateRating = { '@type': 'AggregateRating', ...aggregateRating };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
