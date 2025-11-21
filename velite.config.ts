import rehypeShiki from '@shikijs/rehype';
import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkEmoji from 'remark-emoji';
import { defineConfig } from 'velite';

import { pages } from './lib/content-definitions/pages';
import { posts } from './lib/content-definitions/posts';
import { transformerCodeMetadata } from './lib/utils';

export const HEADING_LINK_ANCHOR = `anchor-heading-link`;

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { pages, posts },
  mdx: {
    remarkPlugins: [[remarkGfm], [remarkMath], [remarkEmoji]],
    rehypePlugins: [
      [rehypeKatex],
      [rehypeSlug],
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: [HEADING_LINK_ANCHOR],
          },
        },
      ],
      [
        rehypeShiki,
        {
          themes: {
            dark: 'catppuccin-latte',
            light: 'catppuccin-frappe',
          },
          transformers: [
            transformerCodeMetadata(),
            transformerNotationDiff(),
            transformerNotationHighlight(),
            transformerNotationFocus(),
            transformerNotationWordHighlight(),
            transformerMetaHighlight(),
          ],
          cssVariablePrefix: '--shiki-',
        },
      ],
    ],
  },
});
