import fetch from 'node-fetch';
import { parse } from 'arraybuffer-xml-parser';
import { createFile, getURL, getYear, shelves } from './utils.js'

const production = false;
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
      let content = '';

      items.forEach((item, itemIndex) => {
        switch (shelveIndex) {
          case 0: // Currently Reading
            content += `|${item.title}|${getURL(item.description)}`;
            break;
          case 1: // To Read
            content += `|${item.title}|${getURL(item.description)}`;
            break;
          case 2: // Read
            content += `${getYear(item.pubDate)}|${item.title}|${getURL(item.description)}`;
            break;
        }

        if (itemIndex < items.length - 1) {
          content += '\n';
        }
      });

      createFile(`./database/${shelve}.txt`, content);
    });
});