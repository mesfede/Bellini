export function resolveClinicalImagePath(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  
  // If it's a relative path containing /src/assets/images or static imports
  let normalized = trimmed;
  if (normalized.includes('src/assets/images/')) {
    normalized = normalized.substring(normalized.indexOf('src/assets/images/') + 4); // "/assets/images/..." -> "assets/images/..."
  }
  
  // Make sure it starts with a leading slash
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }
  
  // If it does not start with /assets/ but is a raw filename or relative path
  if (!normalized.startsWith('/assets/')) {
    const filename = normalized.substring(normalized.lastIndexOf('/') + 1);
    normalized = '/assets/images/' + filename;
  }
  
  return normalized;
}
