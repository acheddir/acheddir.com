import { MetadataRoute } from "next";
import { pages, posts } from "#site/content";

import { BASE_URL } from "@/lib/metadata";

import { locales } from "../i18n/settings";

const generateAlternates = (url: string) => {
  const languages: Record<string, string> = {};
  locales.forEach((locale) => {
    languages[locale] = `${BASE_URL}/${locale}${url === BASE_URL ? "" : url}`;
  });
  return { languages };
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const publishedPosts = posts.filter((post) => post.status === "published");
  const postTags = [...new Set(publishedPosts.flatMap((post) => post.tags ?? []))];

  const tags = postTags.map((tag) => ({
    url: `${BASE_URL}/tags/${tag}`,
    lastModified: now,
    alternates: generateAlternates(`/tags/${tag}`),
  }));

  const loadedPosts = publishedPosts.map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: post.lastUpdatedDate || post.publishedDate,
    alternates: generateAlternates(`/posts/${post.slug}`),
  }));

  const loadedPages = pages
    .filter((page) => page.status === "published")
    .map((page) => ({
      url: `${BASE_URL}/${page.slug.split("/pages")}`,
      lastModified: page.lastUpdatedDate,
      alternates: generateAlternates(`/${page.slug.split("/pages")}`),
    }));

  return [
    {
      url: `${BASE_URL}`,
      lastModified: now,
      alternates: generateAlternates(""),
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: now,
      alternates: generateAlternates("/projects"),
    },
    {
      url: `${BASE_URL}/social`,
      lastModified: now,
      alternates: generateAlternates("/social"),
    },
    ...loadedPages,
    {
      url: `${BASE_URL}/posts`,
      lastModified: now,
      alternates: generateAlternates("/posts"),
    },
    ...loadedPosts,
    {
      url: `${BASE_URL}/tags`,
      lastModified: now,
      alternates: generateAlternates("/tags"),
    },
    ...tags,
  ];
}
