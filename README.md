# Goodreads Profile Generator

This small PHP script will read the profile RSS list of shelves and output the books in each one.

It will group the read books into years (you could group the other shelves too).

Please read the source code as it is well documented, feel free to fork and customize it.

Enjoy!

## To Do

- [ ] Update 3 txt files as database from the RSS
  - [ ] Currently reading: should be cleaned on each fetch
  - [ ] Want To Read: should be cleaned on each fetch
  - [ ] Read: should not delete but only update if not found
- [ ] Update the files with the found books (year, title, link, score)
- [ ] Process for creating the HTML output based on the txt files

## How to build?

Use the Github action with the manual trigger to create the output.html artifact.

## Example

This how it looks like [on my site](https://ricard.blog/books/) when pasting the generated HTML profile into a WordPress page:

![Screenshot](https://cloudup.com/cJj5yNol5rD+)
