/**
 * Normalize image URLs to use the correct backend port
 * Fixes old URLs that might have port 5000 to use port 5001
 */
export const normalizeImageUrl = (url: string | undefined | null): string => {
  if (!url) return '/RideShare/imge/placeholder.png';
  
  // If it's already a full URL, normalize the port
  if (url.startsWith('http://127.0.0.1:5000') || url.startsWith('http://localhost:5000')) {
    return url.replace(':5000', ':5001');
  }
  
  // If it's a relative URL starting with /uploads, make it absolute
  if (url.startsWith('/uploads/')) {
    return `http://localhost:5001${url}`;
  }
  
  // If it's already a full URL with correct port or external URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative path to placeholder, return as is
  if (url.startsWith('/RideShare/')) {
    return url;
  }
  
  // Default: assume it's a relative upload path
  return `http://localhost:5001/uploads/${url}`;
};

/**
 * Normalize an array of image URLs
 */
export const normalizeImageUrls = (urls: (string | undefined | null)[]): string[] => {
  return urls.map(normalizeImageUrl).filter(Boolean) as string[];
};

