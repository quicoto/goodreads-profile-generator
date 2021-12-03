<?php

//======================================================================
// Output preference?
//======================================================================

// Comment out this line if you want to have rendered HTML
// Leaving this line will make it easier for you to copy and paste the resulting HTML
header("Content-Type: text/plain");

//======================================================================
// Define shelves and order of rendering
//======================================================================

$shelves_ids = ['currently-reading', 'to-read', 'read'];

// To be used as section title output
$shelves_title = ['📖 Currently reading', '📚 Want to read', '✅ Read'];

//======================================================================
// Define your user profile
//======================================================================

$user_profile_id = "104159625";

//======================================================================
// RSS lists
//======================================================================
// Note: it seems API key might not be necessary if you're logged in on the site.
$profile_rss = 'https://www.goodreads.com/review/list_rss/' . $user_profile_id .'?key=&shelf=';

//======================================================================
// The danger zone
//======================================================================
$i = 0;
foreach ($shelves_ids as $shelf) {
  // Construct the shelf feed and fetch it
  $feed = simplexml_load_file($profile_rss.$shelf);

  // Print the shelf heading
  echo "<h2 id='" . $shelves_title[$i] . "'>" . $shelves_title[$i] . "</h2>";

  // We will group the books by year on each shelf
  $years = [];

  // Create the year groups
  foreach ($feed->channel->item as $item) {
    $years[date('Y', strtotime($item->pubDate))][] = $item;
  }

  foreach ($years as $key => $year) {
    // On a personal preference I only separate by year
    // the read books. The others go together, even if I have added them
    // during different years.
    if ($shelf === 'read') {
      echo "<h3 id='" . $key . "'>" . $key . "</h3>";
    }

    // Create the list markup
    echo "<ul>";

    foreach ($year as $item) {
      // Access the RSS object
      $link = $item->link;
      $rating = $item->user_rating;
      $title = $item->title;
    ?>
      <li><?php
        echo '<a href="' .$link . '" rel="nofollow" title="Goodreads: ' . $title . '">'. $title .' ';

        // Output the rating with stars emoji, only for the read books
        if ($shelf === 'read' && $rating) {
          for ($i=0; $i < intval($rating); $i++) {
            echo "⭐️";
          }
        }

        echo '</a>';
      ?></li>
      <?php
      } // end item loop

      // I read in the API docs to not do more than 1 request per second
      // Just in case, we'll wait 1 second in between shelves.
      sleep(1);
    ?>
    </ul>
    <?php
     } // end year loop

  $i++;
} // end foreach shelves
