# rehype-mdx-code-src

A rehype plugin that loads code block content from a local source file when the
code block metadata has a `src` attribute.

````md
```tsx filename="app.tsx" src="./src/app.tsx"

```
````

The `src` path is resolved relative to the Markdown or MDX file. Install the
plugin and add it to the rehype plugins used to compile your documents:

```js
import rehypeMdxCodeProps from 'rehype-mdx-code-props';
import rehypeMdxCodeSrc from 'rehype-mdx-code-src';

export default {
  rehypePlugins: [rehypeMdxCodeSrc, rehypeMdxCodeProps],
};
```

When using `rehype-mdx-code-props`, place `rehype-mdx-code-src` before it so the
source is loaded before code block metadata is converted to JSX properties.
