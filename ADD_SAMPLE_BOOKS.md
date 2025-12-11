# How to Add Sample Books with PDFs

## Quick Setup

To add sample books (including free books with PDFs) to your database, run:

```bash
cd server
npm run seed
```

This will add 8 sample books including:
- The Great Gatsby (Free with PDF)
- Pride and Prejudice (Free with PDF)
- 1984 (Free with PDF)
- Moby Dick (Free with PDF)
- The Art of War (Free with PDF)
- Alice's Adventures in Wonderland (Free with PDF)
- To Kill a Mockingbird (Paid)
- The Catcher in the Rye (Paid)

## Manual Addition via Admin Panel

1. Login as admin (username: `admin`, password: `admin123`)
2. Go to Admin → Books → Add New Book
3. Fill in the form:
   - **Title:** Book title
   - **Author:** Author name
   - **Genre:** Select from dropdown
   - **Price:** Set price (or 0 for free books)
   - **Stock:** Number of copies
   - **Free Book:** Check this for Open Library
   - **PDF URL:** Add a PDF URL (e.g., from Project Gutenberg)
   - **Cover Image URL:** Add a cover image URL
   - **Description:** Book description

## Free PDF Sources

You can use PDFs from:
- **Project Gutenberg:** https://www.gutenberg.org/
- **Internet Archive:** https://archive.org/
- **Open Library:** https://openlibrary.org/

Example PDF URLs:
- The Great Gatsby: `https://www.gutenberg.org/files/64317/64317-pdf.pdf`
- Pride and Prejudice: `https://www.gutenberg.org/files/1342/1342-pdf.pdf`
- 1984: `https://www.gutenberg.org/files/20203/20203-pdf.pdf`

## Notes

- Free books (isFree: true) appear in the Open Library section
- Books with PDF URLs can be read directly in the PDF viewer
- The "Read" button appears on free books with PDFs
- Users can click the book card or "Read" button to open the PDF viewer

