import test from 'ava';

import { hello } from '.';

test("hello", async (t) => {
  t.deepEqual(await hello(), "Hello");
});
