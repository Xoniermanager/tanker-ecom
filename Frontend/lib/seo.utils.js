// lib/seo.utils.js

export async function getSiteSettings() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/site-settings`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch site settings');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}


export async function getPageData(endpoint) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}`, {
      next: { revalidate: revalidateTime },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return null;
  }
}

export function createMetadata(siteData, pageData = {}, options = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const currentPath = options.currentPath || '';
  const canonicalUrl = `${baseUrl}${currentPath}`;

  const title = pageData.seoDetails?.metaTitle || 
                pageData.title || 
                siteData?.seoDetails?.metaTitle || 
                'Tanker Solution';

  const description = pageData.seoDetails?.metaDescription || 
                     pageData.description || 
                     siteData?.seoDetails?.metaDescription || 
                     'Professional ecommerce platform';

  const keywords = pageData.seoDetails?.keywords || 
                  pageData.keywords || 
                  siteData?.seoDetails?.keywords || 
                  'ecommerce, tanker, solution';



  return {
    title: {
      template: options.titleTemplate || '%s | Tanker Solution',
      default: title,
    },
    description,
    keywords,
    authors: [{ name: 'Tanker Solution Team' }],
    creator: 'Tanker Solution',
    publisher: 'Tanker Solution',
    canonical: canonicalUrl,
    
    
    robots: {
      index: pageData.seoDetails?.noIndex ? false : true,
      follow: pageData.seoDetails?.noFollow ? false : true,
    },
    ...(pageData.seoDetails?.structuredData && {
      other: {
        'application/ld+json': JSON.stringify(pageData.seoDetails.structuredData)
      }
    })
  };
}


export async function generatePageMetadata(pageEndpoint, options = {}) {
  const [siteSettingsData, pageData] = await Promise.all([
    getSiteSettings(),
    getPageData(pageEndpoint)
  ]);

  const siteData = siteSettingsData?.data;
  const currentPageData = pageData?.data;
  
  return createMetadata(siteData, currentPageData, options);
}