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
      const items = object.rss.channel.item;
      let newBooks = '';
      const fileContents = readFile(shelve);
      const storedBooks = getLines(fileContents).map((element) => {
        const parts = element.split('|');

        return {
          book_id: parts[0],
          year: parts[1],
          title: parts[2],
          URL: parts[3],
        }
      });

      items.forEach((item) => {
        const found = storedBooks.findIndex(book => +book.book_id === +item.book_id);

        if (found === -1) {
          const title = item.title;
          const URL = getURL(item.description);
          const year = shelve === 'currently-reading' ? '' : getYear(item.pubDate);
          const book = `${item.book_id}|${year}|${title}|${URL}`;
          newBooks += `\n${book}`;
        }
      });

      if (newBooks !== '') {
        createFile(
          `./database/${shelve}.txt`,
          `${fileContents}${newBooks}`
          );
      }
    });
});