import { Metadata } from "next";
import { posts } from "#site/content";

import { defaultAuthor } from "@/lib/metadata";
import { sortByDate } from "@/lib/utils";
import PostPreview from "@/components/post-preview";
import { useTranslation } from "@/app/i18n";

interface BlogProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Posts",
    description: `Posts by ${defaultAuthor.name}`,
  };
}

export default async function Blog(props: BlogProps) {
  const { locale } = await props.params;
  const { t } = await useTranslation(locale, "posts");

  const publishedPosts = posts
    .filter((post) => post.status === "published" && post.locale === locale)
    .sort(sortByDate);

  return (
    <div className="container mb-4">
      <div className="prose mx-auto max-w-5xl dark:prose-invert prose-headings:font-heading prose-headings:font-bold prose-headings:leading-tight hover:prose-a:text-accent-foreground prose-a:prose-headings:no-underline">
        <h1 className="mt-0">{t("posts.latest")}</h1>
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
