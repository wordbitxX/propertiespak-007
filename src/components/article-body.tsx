import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Renders an article body stored as `string[]` blocks.
 *
 * Plain paragraphs (every legacy article) render exactly as before. Newer
 * articles can use a tiny markdown subset so answers are structured for
 * search and AI engines: `## h2` / `### h3`, `- ` and `1. ` lists, `> ` tip
 * callouts, `| a | b |` tables, `**bold**` and `[label](/href)` links.
 */

export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/\*\*|\[|\]\([^)]*\)/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

/** H2 headings (for the table of contents). */
export function extractHeadings(body: string[]) {
  return body
    .filter((block) => block.startsWith("## "))
    .map((block) => {
      const text = stripInline(block.slice(3));
      return { id: slugifyHeading(text), text };
    });
}

export function stripInline(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
}

/** Plain-text word count across all blocks (used for structured data). */
export function countWords(body: string[]) {
  return body
    .map((block) => stripInline(block).replace(/[|#>*-]/g, " "))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${index++}`;
    if (match[1] !== undefined) {
      // Bold may itself contain a link: **[Mall](/malls/x)**
      nodes.push(
        <strong key={key} className="font-semibold text-navy-900">
          {renderInline(match[1], key)}
        </strong>,
      );
    } else {
      const href = match[3];
      const label = match[2];
      nodes.push(
        href.startsWith("/") ? (
          <Link key={key} href={href} className="article-link">
            {label}
          </Link>
        ) : (
          <a key={key} href={href} className="article-link" rel="noopener" target="_blank">
            {label}
          </a>
        ),
      );
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function splitRow(line: string) {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());
}

function Block({ block, index }: { block: string; index: number }) {
  const key = `b${index}`;
  if (block.startsWith("### ")) {
    const text = block.slice(4);
    return (
      <h3 id={slugifyHeading(stripInline(text))} className="article-h3">
        {renderInline(text, key)}
      </h3>
    );
  }
  if (block.startsWith("## ")) {
    const text = block.slice(3);
    return (
      <h2 id={slugifyHeading(stripInline(text))} className="article-h2">
        {renderInline(text, key)}
      </h2>
    );
  }

  const lines = block.split("\n").filter((line) => line.trim() !== "");

  if (lines.length > 0 && lines.every((line) => line.trim().startsWith("|"))) {
    const rows = lines.filter((line) => !/^\|?\s*:?-{3,}/.test(line.trim()));
    const [head, ...bodyRows] = rows.map(splitRow);
    return (
      <div className="article-table-wrap">
        <table className="article-table">
          <thead>
            <tr>
              {head.map((cell, cellIndex) => (
                <th key={cellIndex} scope="col">
                  {renderInline(cell, `${key}h${cellIndex}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{renderInline(cell, `${key}r${rowIndex}c${cellIndex}`)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (lines.length > 0 && lines.every((line) => line.startsWith("- "))) {
    return (
      <ul className="article-ul">
        {lines.map((line, lineIndex) => (
          <li key={lineIndex}>{renderInline(line.slice(2), `${key}l${lineIndex}`)}</li>
        ))}
      </ul>
    );
  }

  if (lines.length > 0 && lines.every((line) => /^\d+\.\s/.test(line))) {
    return (
      <ol className="article-ol">
        {lines.map((line, lineIndex) => (
          <li key={lineIndex}>{renderInline(line.replace(/^\d+\.\s/, ""), `${key}o${lineIndex}`)}</li>
        ))}
      </ol>
    );
  }

  if (block.startsWith("> ")) {
    return (
      <aside className="article-callout" role="note">
        {renderInline(block.slice(2), key)}
      </aside>
    );
  }

  return <p className="text-[1.0125rem] leading-[1.8] text-ink">{renderInline(block, key)}</p>;
}

export function ArticleBody({ body }: { body: string[] }) {
  return (
    <div className="article-body mt-8 space-y-5">
      {body.map((block, index) => (
        <Block key={index} block={block} index={index} />
      ))}
    </div>
  );
}
