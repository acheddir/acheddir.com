import { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts, Post } from "#site/content";

import { sortByDate } from "@/lib/utils";
import PostPreview from "@/components/post-preview";
import { useTranslation } from "@/app/i18n";

// Get sorted articles from the contentlayer
async function getSortedArticles(): Promise<Post[]> {
  let articles = await posts;

  articles = articles.filter((article: Post) => article.status === "published");

  return articles.sort((a: Post, b: Post) => {
    if (a.publishedDate && b.publishedDate) {
      return (
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime()
      );
    }
    return 0;
  });
}

// Dynamic metadata for the page
export async function generateMetadata(props: {
  params: Promise<{ locale: string, slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await props.params;

  const { t } = await useTranslation(locale, 'tags');

  return {
    title: t('tags.postsin', { tag: slug }),
    description: t('tags.postsin', { tag: slug }),
  };
}

export default async function TagPage(props: {
  params: Promise<{ locale: string, slug: string }>;
}) {
  const { locale, slug } = await props.params;

  const { t } = await useTranslation(locale, 'tags');

  const publishedPosts = posts
    .filter((post) => post.status === "published" && post.locale === locale)
    .filter((post) => post.tags?.includes(slug))
    .sort(sortByDate);

  if (!posts) {
    notFound();
  }

  return (
    <div className="container mb-4">
      <div className="prose mx-auto max-w-5xl dark:prose-invert prose-headings:font-heading prose-headings:font-bold prose-headings:leading-tight hover:prose-a:text-accent-foreground prose-a:prose-headings:no-underline">
        <h1 className="mt-0">{t('tags.postsin', { tag: slug })}</h1>
        <hr className="my-4" />
        <div className="grid grid-flow-row gap-2">
          {publishedPosts.map((post) => (
            <PostPreview locale={locale} post={post} key={post.path} />
          ))}
        </div>
      </div>
    </div>
  );
}
