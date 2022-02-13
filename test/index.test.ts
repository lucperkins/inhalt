import { assert, test } from "vitest";

import { Document, documents, File, Files, glob } from "../src";

test("globs", async () => {
  const expected: File[] = [
    {
      dir: "test/_files",
      path: "test/_files/index.md",
      extension: ".md",
      slug: "test/_files/index",
      raw: "# The documentation\n\nWelcome to the documentation!\n",
    },
    {
      dir: "test/_files/nested",
      path: "test/_files/nested/getting-started.mdx",
      extension: ".mdx",
      slug: "test/_files/nested/getting-started",
      raw: "---\ntitle: Getting started\n---\n\nThis is how you get started.\n",
    },
  ];

  const mdFiles: Files = await glob("test/_files/**/*.{md,mdx}");
  assert.sameDeepMembers(mdFiles.files, expected);
});

test("markdown", async () => {
  const expected: Document[] = [
    {
      dir: "test/_docs",
      path: "test/_docs/index.md",
      extension: ".md",
      slug: "test/_docs/index",
      raw: "# Welcome to the docs!\n",
      html: "<h1>Welcome to the docs!</h1>",
    },
  ];

  const docs: Document[] = await documents("test/_docs/**/*.{md,mdx}");
  assert.sameDeepMembers(docs, expected);
});
