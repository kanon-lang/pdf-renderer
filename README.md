# PDF Renderer for Chinese Markdown

This project provides a command-line tool to convert Markdown documents to PDF with proper support for Traditional Chinese characters. It uses **markdown-it** to convert Markdown to HTML and **Playwright (Chromium)** to render the HTML to a PDF with embedded Chinese fonts.

## Usage

1. Install dependencies:

```bash
pnpm add markdown-it playwright
pnpm add -D @types/markdown-it
pnpm exec playwright install chromium
```

2. Run the renderer on a Markdown file:

```bash
pnpm exec tsx scripts/render-md-to-pdf.ts --input path/to/input.md --output path/to/output.pdf
```

The script will ensure the output directory exists and produce a PDF that correctly renders Traditional Chinese characters.

## Files

- `scripts/render-md-to-pdf.ts` — The TypeScript script that performs the conversion.

## License

MIT
