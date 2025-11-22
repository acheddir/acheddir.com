import { Metadata } from 'next';
import { posts } from '#site/content';

import { CategoriesTree } from '@/components/categories-tree';
import { useTranslation } from '@/app/i18n';

interface CategoriesProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata(props: CategoriesProps): Promise<Metadata> {
  const { locale } = await props.params;
  const { t } = await useTranslation(locale, 'common');

  return {
    title: t('categories.title'),
    description: t('categories.description'),
  };
}

interface CategoryNode {
  name: string;
  posts: Array<{
    title: string;
    slug: string;
    locale: string;
  }>;
  children: Map<string, CategoryNode>;
}

function buildCategoryTree(
  posts: Array<{ title: string; slug: string; categories: string[]; locale: string; status: string }>,
  locale: string
): { tree: CategoryNode; uncategorizedPosts: Array<{ title: string; slug: string; locale: string }> } {
  const root: CategoryNode = {
    name: 'root',
    posts: [],
    children: new Map(),
  };

  const uncategorizedPosts: Array<{ title: string; slug: string; locale: string }> = [];

  // Filter published posts for the current locale
  const publishedPosts = posts.filter((post) => post.status === 'published' && post.locale === locale);

  publishedPosts.forEach((post) => {
    if (post.categories.length === 0) {
      // Posts without categories are collected separately
      uncategorizedPosts.push({
        title: post.title,
        slug: post.slug,
        locale: post.locale,
      });
      return;
    }

    let currentNode = root;

    // Build the hierarchy
    post.categories.forEach((category, index) => {
      if (!currentNode.children.has(category)) {
        currentNode.children.set(category, {
          name: category,
          posts: [],
          children: new Map(),
        });
      }

      currentNode = currentNode.children.get(category)!;

      // If this is the last category in the hierarchy, add the post here
      if (index === post.categories.length - 1) {
        currentNode.posts.push({
          title: post.title,
          slug: post.slug,
          locale: post.locale,
        });
      }
    });
  });

  return { tree: root, uncategorizedPosts };
}

export default async function CategoriesPage(props: CategoriesProps) {
  const { locale } = await props.params;
  const { t } = await useTranslation(locale, 'common');
  const isRtl = locale === 'ma';

  // Build the category tree
  const { tree: categoryTree, uncategorizedPosts } = buildCategoryTree(posts, locale);

  const hasCategories = categoryTree.children.size > 0;
  const hasUncategorized = uncategorizedPosts.length > 0;
  const hasContent = hasCategories || hasUncategorized;

  return (
    <div className="container mb-4">
      <div className="prose mx-auto max-w-5xl dark:prose-invert prose-headings:font-heading prose-headings:font-bold prose-headings:leading-tight">
        <h1 className="mt-0">{t('categories.title')}</h1>
        <hr className="my-4" />

        <div className="not-prose mt-8">
          {hasContent ? (
            <CategoriesTree
              categoryTree={categoryTree}
              uncategorizedPosts={uncategorizedPosts}
              locale={locale}
              otherLabel={t('categories.other')}
              isRtl={isRtl}
            />
          ) : (
            <p className="text-muted-foreground">{t('categories.noPosts')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
