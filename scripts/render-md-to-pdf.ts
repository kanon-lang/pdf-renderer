import fs from "fs/promises";
import path from "path";
import MarkdownIt from "markdown-it";
import { chromium } from "playwright";

/**
 * Parses command-line arguments and extracts values for the given keys.
 * @param {string} name - The name of the argument (e.g. "input" or "output").
 * @returns {string | undefined} - The value of the argument or undefined.
 */
function getArg(name: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

async function main() {
  const input = getArg("input");
  const output = getArg("output");
  if (!input || !output) {
    console.error(
      "Usage: tsx scripts/render-md-to-pdf.ts --input report.md --output report.pdf"
    );
    process.exit(1);
  }

  // Read the Markdown file
  const mdText = await fs.readFile(input, "utf-8");
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    breaks: true,
  });
  const body = md.render(mdText);

  // Construct the HTML template with font fallbacks for Traditional Chinese.
  const html = `
<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8" />
<style>
  body {
    font-family: "Microsoft JhengHei", "Noto Sans TC", "Noto Sans CJK TC", "PingFang TC", sans-serif;
    font-size: 14px;
    line-height: 1.7;
    color: #111;
    padding: 32px;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 6px 8px;
  }
  th {
    background: #f3f3f3;
  }
  code, pre {
    font-family: Consolas, "Microsoft JhengHei", monospace;
  }
</style>
</head>
<body>${body}</body>
</html>
`;

  // Ensure the output directory exists.
  await fs.mkdir(path.dirname(output), { recursive: true });

  // Launch Chromium using Playwright and render the HTML to PDF.
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.pdf({
    path: output,
    format: "A4",
    printBackground: true,
    margin: {
      top: "16mm",
      right: "14mm",
      bottom: "16mm",
      left: "14mm",
    },
  });

  await browser.close();
  console.log(`PDF created: ${output}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
