import test from 'ava';

import { File, glob, Markdown, markdown } from './index.js';

test("globs", async (t) => {
  const expected: File[] = [
    {
      dir: "src/test/_docs",
      path: "src/test/_docs/index.md",
      extension: ".md",
      slug: "src/test/_docs/index",
      raw: "# The documentation\n\nWelcome to the documentation!\n",
    },
  ];

  const mdDocs = await glob("src/test/**/*.md");
  t.deepEqual(mdDocs.files, expected);
});

test("markdown", async (t) => {
  const expected: Markdown[] = [
    {
      dir: "src/test/_docs",
      path: "src/test/_docs/index.md",
      extension: ".md",
      slug: "src/test/_docs/index",
      raw: "# The documentation\n\nWelcome to the documentation!\n",
      html: "<h1>The documentation</h1>\n<p>Welcome to the documentation!</p>",
    },
  ];

  const mdDocs = await markdown("src/test/**/*.md");
  t.deepEqual(mdDocs, expected);
});
