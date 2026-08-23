import type { ReactNode } from "react";

function inline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={index}>{part.slice(2, -2)}</strong> : part,
  );
}

export function LessonBody({ body }: { body: string }) {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const nodes: ReactNode[] = [];
  let unorderedList: string[] = [];
  let orderedList: string[] = [];

  const flushLists = () => {
    if (unorderedList.length) {
      nodes.push(<ul key={`list-${nodes.length}`}>{unorderedList.map((item, index) => <li key={index}>{inline(item)}</li>)}</ul>);
      unorderedList = [];
    }
    if (orderedList.length) {
      nodes.push(<ol key={`ordered-list-${nodes.length}`}>{orderedList.map((item, index) => <li key={index}>{inline(item)}</li>)}</ol>);
      orderedList = [];
    }
  };

  lines.forEach((raw, index) => {
    const line = raw.trim();
    if (!line) return;
    if (line.startsWith("- ")) {
      if (orderedList.length) flushLists();
      unorderedList.push(line.slice(2));
      return;
    }
    const orderedItem = line.match(/^\d+\.\s+(.+)$/);
    if (orderedItem) {
      if (unorderedList.length) flushLists();
      orderedList.push(orderedItem[1]);
      return;
    }
    flushLists();
    if (line.startsWith("### ")) nodes.push(<h3 key={index}>{inline(line.slice(4))}</h3>);
    else if (line.startsWith("## ")) nodes.push(<h2 key={index}>{inline(line.slice(3))}</h2>);
    else if (line.startsWith("# ")) nodes.push(<h1 key={index}>{inline(line.slice(2))}</h1>);
    else if (line.startsWith("> ")) nodes.push(<blockquote key={index}>{inline(line.slice(2))}</blockquote>);
    else nodes.push(<p key={index}>{inline(line)}</p>);
  });
  flushLists();

  return <div className="prose-course">{nodes}</div>;
}
