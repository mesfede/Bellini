const imageModules = import.meta.glob('/src/assets/images/*', { eager: true });

export function resolveClinicalImagePath(url: string | null | undefined): string {
  if (!url) return '';
  
  let trimmed = url.trim();
  
  // Convert Google Drive viewer links to direct download links
  const driveRegex = /(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=)([a-zA-Z0-9_-]+)/i;
  const match = trimmed.match(driveRegex);
  if (match && match[1]) {
    // Return direct export URL for <img> tags
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  
  // If it's an absolute HTTP/HTTPS or inline data, return as-is
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  
  // Try direct match in eagerly loaded image modules
  if (imageModules[trimmed]) {
    return (imageModules[trimmed] as any).default;
  }
  
  let cleanPath = trimmed;
  if (cleanPath.startsWith('@/')) {
    cleanPath = cleanPath.substring(1);
  }
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }
  
  // Normalize '/assets/images/...' to '/src/assets/images/...' to match our glob keys
  if (cleanPath.startsWith('/assets/images/')) {
    cleanPath = '/src' + cleanPath;
  }
  
  if (imageModules[cleanPath]) {
    return (imageModules[cleanPath] as any).default;
  }
  
  // Try matching by filename
  const filename = trimmed.substring(trimmed.lastIndexOf('/') + 1).toLowerCase();
  if (filename) {
    const matchedKey = Object.keys(imageModules).find(key => 
      key.toLowerCase().endsWith(`/${filename}`)
    );
    if (matchedKey) {
      return (imageModules[matchedKey] as any).default;
    }
  }
  
  // Fallback to the original path, normalized to be under /assets/images/
  let fallback = trimmed;
  if (fallback.includes('src/assets/images/')) {
    fallback = fallback.substring(fallback.indexOf('src/assets/images/') + 4);
  }
  if (!fallback.startsWith('/')) {
    fallback = '/' + fallback;
  }
  if (!fallback.startsWith('/assets/')) {
    const fn = fallback.substring(fallback.lastIndexOf('/') + 1);
    fallback = '/assets/images/' + fn;
  }
  
  return fallback;
}
