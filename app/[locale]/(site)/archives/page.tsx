import { Metadata } from 'next';
import Link from 'next/link';
import { posts } from '#site/content';
import { format, parseISO } from 'date-fns';

import { sortByDate } from '@/lib/utils';
import { useTranslation } from '@/app/i18n';
import { getDateLocale } from '@/app/i18n/settings';

interface ArchivesProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata(props: ArchivesProps): Promise<Metadata> {
  const { locale } = await props.params;
  const { t } = await useTranslation(locale, 'common');

  return {
    title: t('navbar.archives'),
    description: t('archives.description'),
  };
}

interface GroupedPosts {
  [year: string]: Array<{
    title: string;
    slug: string;
    publishedDate: string;
  }>;
}

export default async function ArchivesPage(props: ArchivesProps) {
  const { locale } = await props.params;
  const { t } = await useTranslation(locale, 'common');
  const dateLocale = getDateLocale(locale);

  // Filter and sort posts
  const publishedPosts = posts.filter((post) => post.status === 'published' && post.locale === locale).sort(sortByDate);

  // Group posts by year
  const groupedPosts: GroupedPosts = {};

  publishedPosts.forEach((post) => {
    const date = parseISO(post.publishedDate);
    const year = format(date, 'yyyy');

    if (!groupedPosts[year]) {
      groupedPosts[year] = [];
    }

    groupedPosts[year].push({
      title: post.title,
      slug: post.slug,
      publishedDate: post.publishedDate,
    });
  });

  // Sort years in descending order
  const sortedYears = Object.keys(groupedPosts).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="container mb-4">
      <div className="prose mx-auto max-w-5xl dark:prose-invert prose-headings:font-heading prose-headings:font-bold prose-headings:leading-tight">
        <h1 className="mt-0">{t('navbar.archives')}</h1>
        <hr className="my-4" />

        <div className="not-prose relative mt-8">
          {/* Continuous vertical line across all years */}
          <div className="absolute bottom-0 left-[140px] top-0 w-[1px] bg-slate-800 dark:bg-slate-200" />

          {sortedYears.map((year) => {
            const postsInYear = groupedPosts[year];

            return (
              <div key={year} className="mb-12">
                {/* Year Header with Circle */}
                <div className="relative mb-8 flex items-center gap-8">
                  <h2 className="w-32 shrink-0 pr-4 text-right text-2xl font-bold">{year}</h2>

                  {/* Bigger circle for year */}
                  <div className="absolute left-[134px] z-10">
                    <div className="h-3 w-3 rounded-full bg-slate-800 dark:bg-slate-200" />
                  </div>
                </div>

                {/* Posts */}
                <div className="space-y-6">
                  {postsInYear.map((post, postIndex) => {
                    const date = parseISO(post.publishedDate);
                    const day = format(date, 'd', { locale: dateLocale });
                    const month = format(date, 'MMMM', { locale: dateLocale });

                    return (
                      <div key={post.slug} className="relative flex items-center gap-8">
                        {/* Left: Day and Month - Right aligned */}
                        <div className="w-32 shrink-0 pr-4 text-right text-sm">
                          <span className="font-semibold text-foreground">{day}</span>
                          <span className="ml-1 text-muted-foreground">{month}</span>
                        </div>

                        {/* Dot on the line - centered on the vertical line */}
                        <div className="absolute left-[136px] z-10">
                          <div className="h-2 w-2 rounded-full bg-slate-800 dark:bg-slate-200" />
                        </div>

                        {/* Right: Post title */}
                        <div className="ml-6 flex-1">
                          <Link
                            href={`/${locale}/posts/${post.slug}`}
                            className="text-foreground transition-colors hover:text-accent-foreground hover:underline"
                          >
                            {post.title}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
