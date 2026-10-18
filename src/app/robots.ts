import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/don-hang/'],
      },
    ],
    sitemap: 'https://nammochuong.com/sitemap.xml',
  };
}
