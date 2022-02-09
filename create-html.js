import fs from 'fs';
import { createFile, shelves, getLines, readFile } from './utils.js'

// Create the requried folders
fs.mkdir(`./public`, () => {});

(async () => {
  let HTML = '';

  Object.keys(shelves).forEach(shelve => {
    const fileContents = readFile(shelve);
    const shelveTitle = shelves[shelve];
    const lines = getLines(fileContents);

    HTML += `<h2 id='${shelve}'>${shelveTitle}</h2>`;

    const years = [];

    for (let i = 0, len = lines.length; i < len; i++) {
      const data = lines[i].split('|');
      const year = data[0];
      const title = data[1];
      const URL = data[2];
      const foundIndex = years.findIndex(y => y.year === year);
      const book = `<li><a href="${URL}" rel="nofollow" title="Goodreads: ${title}">${title}</a></li>`;

      // Not found, add new year
      if (foundIndex === -1) {
        years.push({
          year,
          books: [book]
        })
      } else {
        // Year exists, add book to year
        years[foundIndex].books.push(book);
      }
    }

    years.forEach(year => {
      HTML += year.year ? `<h3>${year.year}</h3>` : '';
      HTML += `<ul>${year.books.reverse().join('\n')}</ul>`;
    });
  });

  createFile('./public/output.html', HTML);
})();