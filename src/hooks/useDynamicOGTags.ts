import { useEffect } from 'react';

interface OGTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const useDynamicOGTags = ({ title, description, image, url }: OGTagsProps) => {
  useEffect(() => {
    if (!title && !description && !image) return;

    // Store original meta tags
    const originalTags = {
      'og:title': document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
      'og:description': document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
      'og:image': document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
      'og:url': document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
      'twitter:title': document.querySelector('meta[name="twitter:title"]')?.getAttribute('content'),
      'twitter:description': document.querySelector('meta[name="twitter:description"]')?.getAttribute('content'),
      'twitter:image': document.querySelector('meta[name="twitter:image"]')?.getAttribute('content'),
      'title': document.title
    };

    // Update meta tags
    if (title) {
      document.title = title;
      updateMetaTag('property', 'og:title', title);
      updateMetaTag('name', 'twitter:title', title);
    }

    if (description) {
      updateMetaTag('property', 'og:description', description);
      updateMetaTag('name', 'twitter:description', description);
    }

    if (image) {
      // Ensure the image URL is absolute
      const absoluteImageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;
      updateMetaTag('property', 'og:image', absoluteImageUrl);
      updateMetaTag('name', 'twitter:image', absoluteImageUrl);
    }

    if (url) {
      const absoluteUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
      updateMetaTag('property', 'og:url', absoluteUrl);
    }

    // Cleanup function to restore original tags
    return () => {
      if (originalTags.title) {
        document.title = originalTags.title;
      }
      
      Object.entries(originalTags).forEach(([key, value]) => {
        if (value && key !== 'title') {
          if (key.startsWith('og:')) {
            updateMetaTag('property', key, value);
          } else if (key.startsWith('twitter:')) {
            updateMetaTag('name', key, value);
          }
        }
      });
    };
  }, [title, description, image, url]);
};

const updateMetaTag = (attribute: 'property' | 'name', key: string, content: string) => {
  let meta = document.querySelector(`meta[${attribute}="${key}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
};