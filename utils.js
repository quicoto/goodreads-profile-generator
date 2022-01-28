import fs from 'fs';

/**
 * @param  {string} description
 * @returns  {string}
 */
export function getURL (description) {
  const url = description.match(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"/)[1];

  // Remove query params
  return url.split("?")[0];
}

/**
 * @param  {string} date
 * @returns  {string}
 */
export function getYear (date) {
  return new Date(date).getFullYear();
}

export function createFile(fileName, data) {
  fs.writeFile(fileName, data, (err) => {
    if (!err) {
      console.log('File created: ' + fileName);
    }
  });
}

export const shelves = {
  'currently-reading': '📖 Currently reading',
  'to-read': '📚 Want to read',
  'read': '✅ Read'
}

/**
 * @param  {string} content
 * @returns {array}
 */
export function getLines(content) {
  return content.split(/\r?\n/);
}

export function readFile(path) {
  return fs.readFileSync(path, { encoding:'utf8', flag:'r'});
}