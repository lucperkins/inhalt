import test from 'ava';

import { convert } from './index.js';

test("convert", async (t) => {
  const result: string = await convert("# Hello");
  t.deepEqual(result, "<h1>Hello</h1>");
});
