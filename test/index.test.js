import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import rehypeMdxCodeSrc from '../index.js';

test('loads code block content from a path relative to the document', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'rehype-mdx-code-src-'));
  const source = 'export const value = "loaded";';
  const code = {
    type: 'element',
    tagName: 'code',
    data: { meta: 'filename="example.ts" src="./src/example.ts"' },
    children: [{ type: 'text', value: '' }],
  };
  const tree = {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'pre',
        children: [code],
      },
    ],
  };

  try {
    await mkdir(path.join(root, 'src'));
    await writeFile(path.join(root, 'src', 'example.ts'), source);
    await rehypeMdxCodeSrc()(tree, { path: path.join(root, 'guide.mdx') });

    assert.equal(code.children[0].value, source);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('reports an empty src attribute', async () => {
  const tree = {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'code',
        data: { meta: 'src=""' },
        children: [],
      },
    ],
  };

  await assert.rejects(rehypeMdxCodeSrc()(tree, { path: '/docs/guide.mdx' }), {
    message: 'Code block src attribute must not be empty.',
  });
});
