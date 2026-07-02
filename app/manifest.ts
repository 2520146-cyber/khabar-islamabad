import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Khabar Islamabad',
    short_name: 'Khabar',
    description: "Pakistan's most trusted digital newsroom",
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#C0161D',
    orientation: 'portrait',
    categories: ['news', 'lifestyle'],
    lang: 'en',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-256.png', sizes: '256x256', type: 'image/png' },
      { src: '/icons/icon-384.png', sizes: '384x384', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
