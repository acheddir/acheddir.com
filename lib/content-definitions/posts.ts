import { defineCollection, s } from 'velite';

import { Author as author } from './author';
import { series } from './series';
import { status } from './status';

export const posts = defineCollection({
  name: 'Post',
  pattern: 'posts/**/*.mdx',
  schema: s
    .object({
      path: s.path(),
      raw: s.raw(),
      title: s.string().max(99),
      description: s.string().max(999).optional(),
      publishedDate: s.isodate(),
      lastUpdatedDate: s.isodate().optional(),
      categories: s.array(s.string()).default([]),
      tags: s.array(s.string()).default([]),
      series: series.optional(),
      author: author.optional(),
      status: status,
      locale: s.string(),
      toc: s.toc(),
      metadata: s.metadata(),
      excerpt: s.excerpt(),
      content: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      slug: data.path.replace(/^[^/]+\/([^/.]+)(?:\.\w+)?$/, '$1'),
    })),
});
