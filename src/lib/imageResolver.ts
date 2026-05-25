const imageModules = import.meta.glob('/src/assets/images/*', { eager: true });

export function resolveClinicalImagePath(url: string | null | undefined): string {
  if (!url) return '';
  
  const trimmed = url.trim();
  
  // If it's an absolute HTTP/HTTPS URL, return as-is
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  // Try direct match in eagerly loaded image modules
  if (imageModules[trimmed]) {
    return (imageModules[trimmed] as any).default;
  }
  
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  if (imageModules[withLeadingSlash]) {
    return (imageModules[withLeadingSlash] as any).default;
  }
  
  if (imageModules[`/src${withLeadingSlash}`]) {
    return (imageModules[`/src${withLeadingSlash}`] as any).default;
  }
  
  // If the URL has "assets/images" somewhere inside, search by filename
  if (trimmed.includes('assets/images/')) {
    const filename = trimmed.substring(trimmed.lastIndexOf('/') + 1);
    const matchedKey = Object.keys(imageModules).find(key => 
      key.toLowerCase().endsWith(`/${filename.toLowerCase()}`)
    );
    if (matchedKey) {
      return (imageModules[matchedKey] as any).default;
    }
  }
  
  // Fallback to the original URL
  return trimmed;
}
