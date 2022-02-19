import { assert, expect, test } from "vitest";

import { Document, Documents, documents, File, Files, files } from "../src";
import * as Lib from "../src";

test("exports", () => {
  expect(typeof Lib).to.equal("object");
  Object.keys(Lib).forEach((key) => {
    expect(Boolean(Lib[key])).toBe(true);
  });
});

test("globs", async () => {
  const expectedFiles: File[] = [
    {
      name: "index",
      dir: "test/_files",
      path: "test/_files/index.md",
      extension: ".md",
      raw: "# The documentation\n\nWelcome to the documentation!\n",
    },
    {
      name: "getting-started",
      dir: "test/_files/nested",
      path: "test/_files/nested/getting-started.mdx",
      extension: ".mdx",
      raw: "---\ntitle: Getting started\n---\n\nThis is how you get started.\n",
    },
  ];

  const mdFiles: Files = await files("test/_files/**/*.{md,mdx}");
  assert.sameDeepMembers(mdFiles.all(), expectedFiles);

  const expectedPaths: string[] = [
    "test/_files/index.md",
    "test/_files/nested/getting-started.mdx",
  ];
  assert.sameDeepMembers(mdFiles.paths(), expectedPaths);

  const expectedDocs: Document[] = [
    {
      name: "index",
      dir: "test/_files",
      path: "test/_files/index.md",
      extension: ".md",
      raw: "# The documentation\n\nWelcome to the documentation!\n",
      slug: "test/_files/index",
      html: "<h1>The documentation</h1>\n<p>Welcome to the documentation!</p>",
    },
    {
      name: "getting-started",
      dir: "test/_files/nested",
      path: "test/_files/nested/getting-started.mdx",
      extension: ".mdx",
      raw: "---\ntitle: Getting started\n---\n\nThis is how you get started.\n",
      slug: "test/_files/nested/getting-started",
      html: "<hr>\n<h2>title: Getting started</h2>\n<p>This is how you get started.</p>",
    },
  ];
  assert.sameDeepMembers(await mdFiles.documents(), expectedDocs);
});

test("markdown", async () => {
  const expectedDocs: Document[] = [
    {
      name: "index",
      dir: "test/_docs",
      path: "test/_docs/index.md",
      extension: ".md",
      slug: "test/_docs/index",
      raw: "# Welcome to the docs!\n",
      html: "<h1>Welcome to the docs!</h1>",
    },
  ];

  const docs: Documents = await documents("test/_docs/**/*.{md,mdx}");
  assert.sameDeepMembers(docs.all(), expectedDocs);

  const expectedSlugs: string[] = ["test/_docs/index"];
  assert.sameDeepMembers(docs.slugs(), expectedSlugs);
});
