import { assert, test } from 'vitest';

import { File, glob } from '../src';

test("globs", async () => {
  const expected: File[] = [
    {
      dir: "test/_docs",
      path: "test/_docs/index.md",
      extension: ".md",
      slug: "test/_docs/index",
      raw: "# The documentation\n\nWelcome to the documentation!\n",
    },
  ];

  const mdDocs = await glob("test/_docs/**/*.md");
  assert.sameDeepMembers(mdDocs.files, expected);
});
