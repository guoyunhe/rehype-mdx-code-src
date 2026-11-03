import { readFile } from 'node:fs/promises';
import path from 'node:path';

const sourceAttributePattern = /(?:^|\s)src\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s]+))/;

function visit(node, visitor) {
  visitor(node);
  node.children?.forEach((child) => visit(child, visitor));
}

export default function rehypeMdxCodeSrc() {
  return async (tree, file) => {
    const codeBlocks = [];
    visit(tree, (node) => {
      if (
        node.type === 'element' &&
        node.tagName === 'code' &&
        typeof node.data?.meta === 'string'
      ) {
        codeBlocks.push(node);
      }
    });

    await Promise.all(
      codeBlocks.map(async (code) => {
        const match = code.data.meta.match(sourceAttributePattern);
        if (!match) return;

        const src = match[1] ?? match[2] ?? match[3];
        if (!src) throw new Error('Code block src attribute must not be empty.');
        if (!file.path)
          throw new Error(`Cannot resolve code block src "${src}" without a file path.`);

        code.children = [
          {
            type: 'text',
            value: await readFile(path.resolve(path.dirname(file.path), src), 'utf8'),
          },
        ];
      }),
    );
  };
}
