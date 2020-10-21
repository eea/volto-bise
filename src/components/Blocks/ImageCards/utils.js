/**
 * @param {string} url
 */
export const getImageUrlFromValue = (url) => {
  return url.replace(/\@\@images(.*)$/, '@@images/image');
}