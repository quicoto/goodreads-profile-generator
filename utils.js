/**
 * @param  {string} description
 * @returns  {string}
 */
export function getURL (description) {
  return description.match(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"/)[1]
}
