import type { Metadata } from 'next';
import { site } from './site';

export function makeMetadata(title: string, description: string, path = '/'): Metadata {
  const fullTitle = `${title} | ${site.name}`;
  const url = new URL(path, site.domain).toString();

  return {
    title: fullTitle,
    description,
    keywords: site.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      locale: 'pt_BR',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description
    }
  };
}
