import FeedParser from 'feedparser';
import fetch from 'node-fetch';
import { getURL } from './utils.js'

const production = false;
const user_profile_id = "104159625";
const rss = `https://www.goodreads.com/review/list_rss/${user_profile_id}?key=&shelf=`;
// const shelves_ids = ['currently-reading', 'to-read', 'read'];
const shelves_ids = ['currently-reading'];
const shelves_titles = ['📖 Currently reading', '📚 Want to read', '✅ Read'];
const feedparser = new FeedParser();

shelves_ids.forEach((shelve, index) => {
  let url = production ? rss + shelve : `http://0.0.0.0:8000/mocks/${shelve}.xml`;

  fetch(url).then(function (res) {
    if (res.status !== 200) {
      throw new Error('Bad status code');
    }
    else {
      // The response `body` -- res.body -- is a stream
      res.body.pipe(feedparser);
    }
  }, function (err) {
    // handle any request errors
    // eslint-disable-next-line no-console
    console.log('Error:', err)
  });

  feedparser.on('error', function (error) {
    // always handle errors
    // eslint-disable-next-line no-console
    console.log('Error:', error)
  });

  feedparser.on('readable', function () {
    // This is where the action is!
    const stream = this; // `this` is `feedparser`, which is a stream
    const meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
    let item = null;

    while (item = stream.read()) {
      let database_item = '';

      switch (index) {
        case 0: // Currently Reading
          database_item = `${item.title}|${getURL(item.description)}`;
          break;
        case 1: // To Read
          database_item = `${item.year}|${item.title}|${item.title}`;
          break;
        case 2: // Read
          database_item = `${item.year}|${item.title}|${item.title}`;
          break;
      }

      // eslint-disable-next-line no-console
      console.log(database_item)

    }
  });
});