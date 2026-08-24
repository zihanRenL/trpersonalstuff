# Artwork files

Drop the three illustration files here, named exactly like this:

| File name              | Piece                                        |
| ---------------------- | -------------------------------------------- |
| `in-the-garden.png`    | inTheGarden — 2024.1                          |
| `kaito-2025.png`       | KAITO 2025 birth anniversary — 2025.2.14      |
| `untitled-2023.png`    | untitled — 2023.10                            |

`.jpg`, `.jpeg`, and `.webp` work too — the page tries `.png` first and falls
back through the other extensions automatically. Until a file is present the
gallery shows a labelled placeholder slot instead of a broken image.

To add a new piece: drop the image here, then add one entry to the `ARTWORKS`
array in `assets/js/data.js` (its `file` field is the file name without the
extension). The gallery and the detail pages build themselves from that array.
