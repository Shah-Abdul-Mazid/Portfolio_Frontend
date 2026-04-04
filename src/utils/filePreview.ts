export const isPdfUrl = (url: string) => /\.pdf(\?|#|$)/i.test(url);

export const isImageUrl = (url: string) =>
  /\.(jpg|jpeg|png|webp|avif|gif)(\?|#|$)/i.test(url);

export const getPdfViewerUrl = (url: string) => {
  if (!url) return url;
  return url.includes("#")
    ? `${url}&toolbar=0&navpanes=0&scrollbar=1&view=FitH`
    : `${url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;
};