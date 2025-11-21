import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PostSeries, PostWithSeries, SeriesItem } from '@/types';
import { posts } from '#site/content';
import { format, parseISO } from 'date-fns';

import { BASE_URL, defaultAuthor } from '@/lib/metadata';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mdx } from '@/components/mdx';
import { PostBreadcrumb } from '@/components/post-breadcrumb';
import { PostSeriesBox } from '@/components/post-series-box';
import { SocialShare } from '@/components/social-share';
import { TableOfContents } from '@/components/table-of-contents';
import { useTranslation } from '@/app/i18n';
import i18next from '@/app/i18n/i18next';
import { getDateLocale } from '@/app/i18n/settings';

interface PostProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

async function getPostFromParams(props: PostProps): Promise<any> {
  const { locale, slug } = await props.params;

  const post = posts.find((post) => post.slug === slug && post.locale === locale);

  if (!post) {
    null;
  }

  if (post?.series) {
    const seriesPosts: SeriesItem[] = posts
      .filter((p) => p.series?.title === post.series?.title)
      .sort((a, b) => Number(a.series!.order) - Number(b.series!.order))
      .map((p) => {
        return {
          title: p.title,
          slug: p.slug,
          status: p.status,
          isCurrent: p.slug === post.slug,
        };
      });
    if (seriesPosts.length > 0) {
      return {
        ...post,
        series: { ...post.series, posts: seriesPosts } as PostSeries,
      };
    }
  }

  return post;
}

export async function generateMetadata(props: PostProps): Promise<Metadata> {
  const post = await getPostFromParams(props);

  if (!post) {
    return {};
  }

  const { locale } = await props.params;

  // Format the date for OG image
  const formattedDate = format(parseISO(post.publishedDate), 'd LLLL yyyy', {
    locale: getDateLocale(locale),
  });

  // Generate OG image URL
  const ogImageUrl = new URL(`${BASE_URL}/api/og`);
  ogImageUrl.searchParams.set('title', post.title);
  ogImageUrl.searchParams.set('date', formattedDate);
  ogImageUrl.searchParams.set('readingTime', post.metadata.readingTime.toString());

  return {
    title: post.title,
    description: post.description,
    authors: [
      {
        name: post?.author?.name || defaultAuthor.name,
        url: defaultAuthor.website,
      },
    ],
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedDate,
      modifiedTime: post.lastUpdatedDate,
      authors: [post?.author?.name || defaultAuthor.name],
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImageUrl.toString()],
    },
  };
}

export async function generateStaticParams(): Promise<PostProps['params'][]> {
  return posts.map((post) =>
    Promise.resolve({
      locale: post.locale,
      slug: post.slug,
    })
  );
}

export default async function PostPage(props: PostProps) {
  const post = await getPostFromParams(props);

  const { locale } = await props.params;

  const { t } = await useTranslation(locale, 'posts');

  const isRtl = i18next.dir(locale) === 'rtl';

  if (!post || (process.env.NODE_ENV === 'development' && post.status !== 'published')) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    name: post?.title,
    description: post?.description,
  };

  return (
    <div className="container max-w-6xl space-y-6 pb-10">
      <PostBreadcrumb categories={post.categories} title={post.title} locale={locale} blogLabel={t('post.blog')} />
      <div className="flex flex-col lg:flex-row">
        <div className="lg:hidden">
          <div className="mb-4 mt-1 text-sm leading-snug text-muted-foreground">
            <p className="mb-2">{t('post.minutes', { count: post.metadata.readingTime })}</p>
            <time dateTime={post.publishedDate}>
              {t('post.publishedon', { date: format(parseISO(post.publishedDate), 'd LLLL yyyy') })}
            </time>
            <br />
            {post.lastUpdatedDate && (
              <time dateTime={post.lastUpdatedDate}>
                {t('post.updatedon', {
                  date: format(parseISO(post.lastUpdatedDate), 'd LLLL yyyy', {
                    locale: getDateLocale(locale),
                  }),
                })}
              </time>
            )}
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="table-of-contents">
              <AccordionTrigger>{t('post.toc')}</AccordionTrigger>
              <AccordionContent>
                <TableOfContents toc={post.toc} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <article
          className={cn(
            'prose max-w-7xl dark:prose-invert hover:prose-a:text-accent-foreground prose-a:prose-headings:mb-3 prose-a:prose-headings:mt-8 prose-a:prose-headings:font-heading prose-a:prose-headings:font-bold prose-a:prose-headings:leading-tight prose-a:prose-headings:no-underline lg:max-w-2xl',
            {
              'lg:mr-auto': !isRtl,
              'lg:ml-auto': isRtl,
            }
          )}
        >
          <h1 className="mb-2 font-heading">{post.title}</h1>
          <hr className="my-4" />
          {post?.series && (
            <div className="not-prose">
              <PostSeriesBox data={post.series} />
            </div>
          )}
          <Mdx code={post.content} />
          <hr className="my-4" />
          <div className="flex flex-row items-center justify-between">
            {post.tags && (
              <ul className="m-0 list-none space-x-2 p-0 text-sm text-muted-foreground">
                {post.tags.map((tag: string) => (
                  <li className="mx-2 inline-block p-0" key={tag}>
                    <Link
                      href={`/${locale}/tags/${tag}`}
                      className="inline-block transition hover:text-muted-foreground/70"
                    >
                      <Badge
                        variant="outline"
                        className="inline-block rounded-full border border-muted-foreground/50 bg-muted-foreground/10 px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {tag}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <SocialShare
              locale={locale}
              text={`${post.title} via ${defaultAuthor.handle}`}
              url={`${BASE_URL}/${locale}/${post.slug}`}
            />
          </div>
        </article>
        <aside className="hidden lg:block">
          <Card
            className={cn('sticky top-28 mb-4', {
              'ml-4': !isRtl,
              'mr-4': isRtl,
            })}
          >
            <CardHeader>
              <CardTitle>{t('post.toc')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <TableOfContents toc={post.toc} />
            </CardContent>
            <Separator />
            <CardFooter>
              <div className="mb-2 mt-4 text-sm leading-snug text-muted-foreground">
                <p className="mb-2">{t('post.minutes', { count: post.metadata.readingTime })}</p>
                <time dateTime={post.publishedDate}>
                  {t('post.publishedon', {
                    date: format(parseISO(post.publishedDate), 'd LLLL yyyy', {
                      locale: getDateLocale(locale),
                    }),
                  })}
                </time>
                <br />
                {post.lastUpdatedDate && (
                  <time dateTime={post.lastUpdatedDate}>
                    {t('post.updatedon', {
                      date: format(parseISO(post.lastUpdatedDate), 'd LLLL yyyy', {
                        locale: getDateLocale(locale),
                      }),
                    })}
                  </time>
                )}
              </div>
            </CardFooter>
          </Card>
        </aside>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
