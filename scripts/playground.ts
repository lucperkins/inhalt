import { Heading, Root } from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";

const md = `# Title

## Subtitle

Here is some content.

### Sub-subtitle

Here is some more content.

## Up again

Now a bit further up the tree.`;

type Record = {
  objectID: string;
  level: number;
};

const main = async () => {
  const tree: Root = fromMarkdown(md);

  const records: Record[] = Array.from(
    tree.children
      .filter((child) => child.type === "heading")
      .map((child) => {
        const { depth } = child as Heading;

        return { objectID: "foo", level: depth };
      })
  );

  records.forEach(() => {});
};

main().catch((err) => {
  console.error(err);
});
