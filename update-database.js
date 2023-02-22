import fetch from 'node-fetch';
import { parse } from 'arraybuffer-xml-parser';
import { getLines, createFile, readFile, getURL, getYear, shelves } from './utils.js'

const production = true;
const user_profile_id = "104159625";
const rss = `https://www.goodreads.com/review/list_rss/${user_profile_id}?key=&shelf=`;
const encoder = new TextEncoder();

Object.keys(shelves).forEach((shelve, shelveIndex) => {
  let url = production ? rss + shelve : `http://0.0.0.0:8000/mocks/${shelve}.xml`;

  fetch(url)
    .then(response => response.text())
    .then(data => {
      const xmlData = encoder.encode(data);
      const object = parse(xmlData);
      let items = object.rss.channel.item;
      let newBooks = '';
      const fileContents = readFile(shelve);
      const storedBooks = getLines(fileContents).map((element) => {
        const parts = element.split('|');

        return {
          book_id: parts[0],
          year: parts[1],
          title: parts[2],
          URL: parts[3],
          score: parts[4]
        }
      });

      if (!Array.isArray(items)) {
        items = [items];
      }

      items.forEach((item) => {
        const found = storedBooks.findIndex(book => +book.book_id === +item.book_id);

        // Bypass if we're on the currently-reading
        // We don't consider found, just add them all
        if (found === -1 || shelve === 'currently-reading' || shelve === 'to-read') {
          const title = item.title;
          const URL = getURL(item.description);
          const year = shelve === ('currently-reading' || 'to-read') ? '' : getYear(item.pubDate);
          const score = Math.floor(item.user_rating);
          const book = `${item.book_id}|${year}|${title}|${URL}|${score}`;
          newBooks += `\n${book}`;
        }
      });

      if (newBooks !== '') {
        let content = fileContents + newBooks;

        if (shelve === 'currently-reading' || shelve === 'to-read') {
          // Since we delete books from this shelve, we can't simply
          // add the new ones. We need to start clean
          content = newBooks
        }

        createFile(
          `./public/${shelve}.txt`,
          `${content}`
          );
      }
    });
});