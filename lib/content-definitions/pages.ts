import { defineCollection, s } from "velite";

import { status } from "./status";

export const pages = defineCollection({
  name: "Page",
  pattern: "pages/**/*.mdx",
  schema: s
    .object({
      path: s.path(),
      raw: s.raw(),
      title: s.string().max(99),
      description: s.string().max(999).optional(),
      lastUpdatedDate: s.isodate().optional(),
      status: status,
      locale: s.string(),
      metadata: s.metadata(),
      excerpt: s.excerpt(),
      body: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      slug: data.path.replace(/^[^/]+\/([^/.]+)(?:\.\w+)?$/, '$1'),
    })),
});
