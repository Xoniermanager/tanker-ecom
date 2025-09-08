
export async function getSiteSettings() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/site-settings`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch site settings');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

export function createMetadata(siteData, pageData = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const currentPath = pageData.currentPath || '';
  const canonicalUrl = `${baseUrl}${currentPath}`;

  return {
    title: {
      template: '%s | Tanker Solution',
      default: siteData?.seoDetails?.metaTitle || 'Tanker Solution',
    },
    description: siteData?.seoDetails?.metaDescription || 'Professional ecommerce platform',
    keywords: siteData?.seoDetails?.keywords || 'ecommerce, tanker, solution',
    authors: [{ name: 'Tanker Solution Team' }],
    creator: 'Tanker Solution',
    publisher: 'Tanker Solution',
    canonical: canonicalUrl
    
    
    
   
    
  };
}
