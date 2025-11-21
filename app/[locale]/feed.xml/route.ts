/* eslint-disable react-hooks/rules-of-hooks */
import { NextRequest, NextResponse } from "next/server";
import { posts } from "#site/content";
import RSS from "rss";

import { siteMetadata, BASE_URL, defaultAuthor } from "@/lib/metadata";
import { useTranslation } from "@/app/i18n";

export async function GET(
  req: NextRequest,
) {
  const params = req.nextUrl.searchParams;
  const locale = params.get('locale') || "en";
  const { t } = await useTranslation(locale, "common");

  const feed = new RSS({
    title: t(siteMetadata.title.default, { name: t(defaultAuthor.name) }),
    description: siteMetadata.description,
    site_url: BASE_URL,
    feed_url: `${BASE_URL}/${locale}/feed.xml`,
    copyright: `© 2024 ${t(defaultAuthor.name)}`,
    language: "en-US",
    pubDate: new Date(),
  });

  posts
    .filter((post) => post.status === "published" && post.locale === locale)
    .map((post) => {
      feed.item({
        title: post.title,
        guid: `${BASE_URL}/${locale}/posts/${post.slug}`,
        url: `${BASE_URL}/${locale}/posts/${post.slug}`,
        date: post.lastUpdatedDate as string,
        description: post.description || "",
        author: t(defaultAuthor.name),
        categories: post?.tags?.map((tag) => tag) || [],
      });
    });

  return new NextResponse(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
