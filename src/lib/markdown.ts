import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: false,
});

export async function renderMarkdownToHtml(content: string): Promise<string> {
  const html = await marked.parse(content);
  return typeof html === "string" ? html : String(html);
}
