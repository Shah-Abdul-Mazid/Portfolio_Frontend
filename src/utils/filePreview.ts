export const isPdfUrl = (url: string) => {
  if (!url) return false;
  // Match .pdf at end of path, or followed by ? or #
  return /\.pdf(\?|#|$)/i.test(url) || url.toLowerCase().includes('res.cloudinary.com') && url.toLowerCase().includes('.pdf');
};

export const isImageUrl = (url: string) => {
  if (!url) return false;
  return /\.(jpg|jpeg|png|webp|avif|gif)(\?|#|$)/i.test(url);
};

export const getPdfViewerUrl = (url: string) => {
  if (!url) return url;
  
  // Use Google Docs Viewer to ensure multi-page support and bypass CORS/iframe restrictions
  // This works even if Cloudinary serves it as an 'image' resource type.
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
};