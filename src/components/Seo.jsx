import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CLUB, BRANDING, asset } from '../data/site.js';

const upsertMeta = (attr, key, content) => {
  if (!content) return;
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const upsertCanonical = (href) => {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

/**
 * Document metadata per route.
 * Kept dependency-free: no helmet, no extra bundle weight on QR landings.
 */
export default function Seo({ title, description, image, noindex = false }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title
      ? title.includes(CLUB.name)
        ? title
        : `${title} | ${CLUB.name}`
      : `${CLUB.name}, ${CLUB.tenure}`;
    const desc = description || CLUB.description;
    const ogImage = asset(image || BRANDING.ogImage);
    const url = `${window.location.origin}${window.location.pathname}`;

    document.title = fullTitle;
    document.documentElement.lang = 'en';

    upsertMeta('name', 'description', desc);
    upsertMeta('name', 'robots', noindex ? 'noindex' : 'index,follow');

    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', desc);
    upsertMeta('name', 'twitter:image', ogImage);

    upsertCanonical(url);
  }, [title, description, image, noindex, pathname]);

  return null;
}
