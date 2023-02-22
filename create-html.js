import fs from 'fs';
import { createFile, shelves, getLines, readFile } from './utils.js'

(async () => {
  let HTML = '';

  function sortByYear( a, b ) {
    if ( +a.year < +b.year ){
      return 1;
    }
    if ( +a.year > +b.year ){
      return -1;
    }
    return 0;
  }

  Object.keys(shelves).forEach(shelve => {
    const fileContents = readFile(shelve);
    const shelveTitle = shelves[shelve];
    const lines = getLines(fileContents);

    HTML += `<h2 id='${shelve}'>${shelveTitle}</h2>`;

    const years = [];

    for (let i = 0, len = lines.length; i < len; i++) {
      const data = lines[i].split('|');
      const book_id = data[0];
      const year = data[1];
      const title = data[2];
      const URL = data[3];
      const score = +data[4] ? new Array(+data[4] + 1).join('⭐️') : '';
      const foundIndex = years.findIndex(y => y.year === year);
      const book = `<li><a data-book-id="${book_id}" href="${URL}" rel="nofollow" title="Goodreads: ${title}">${title}</a> ${score}</li>`;

      // Not found, add new year
      if (foundIndex === -1) {
        title && years.push({
          year,
          books: [book]
        })
      } else {
        // Year exists, add book to year
        title && years[foundIndex].books.push(book);
      }
    }

    years.sort( sortByYear )

    years.forEach(year => {
      HTML += year.year ? `<h3>${year.year}</h3>` : '';
      HTML += `<ul>${year.books.reverse().join('\n')}</ul>`;
    });
  });

  createFile('./public/output.html', HTML);
})();