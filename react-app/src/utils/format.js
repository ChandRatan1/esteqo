export function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Minimal Markdown renderer for blog bodies — headings, bold, bullet lists
 * and paragraphs. Deliberately not a full parser: posts are authored in-house
 * and this avoids shipping a Markdown library (and dangerouslySetInnerHTML).
 */
export function parseMarkdown(markdown = '') {
  const blocks = [];
  let list = null;

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim();

    if (!line) {
      if (list) {
        blocks.push(list);
        list = null;
      }
      continue;
    }

    if (line.startsWith('- ')) {
      list = list || { type: 'ul', items: [] };
      list.items.push(line.slice(2));
      continue;
    }

    if (list) {
      blocks.push(list);
      list = null;
    }

    if (line.startsWith('### ')) blocks.push({ type: 'h3', text: line.slice(4) });
    else if (line.startsWith('## ')) blocks.push({ type: 'h2', text: line.slice(3) });
    else blocks.push({ type: 'p', text: line });
  }

  if (list) blocks.push(list);
  return blocks;
}

/** Splits **bold** runs into React-renderable segments. */
export function splitBold(text = '') {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part) =>
    part.startsWith('**') && part.endsWith('**')
      ? { bold: true, text: part.slice(2, -2) }
      : { bold: false, text: part }
  );
}
