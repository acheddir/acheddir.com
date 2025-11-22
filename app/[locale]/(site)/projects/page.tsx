import { Metadata } from 'next';
import { format, getDate, parseISO } from 'date-fns';

import { projects } from '@/lib/projects-data';
import { SpotlightCard } from '@/components/spotlight-card';
import { useTranslation } from '@/app/i18n';
import { getDateLocale } from '@/app/i18n/settings';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params;

  return {
    title: 'Projects',
    description: 'My projects',
  };
}

export default async function SocialPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;

  const { t } = await useTranslation(locale, 'projects');

  const lastUpdated = format(parseISO('2024-12-01'), 'LLLL d, yyyy', {
    locale: getDateLocale(locale),
  });

  return (
    <div className="container pb-10">
      <article className="prose mx-auto max-w-5xl dark:prose-invert prose-headings:mb-3 prose-headings:mt-8 prose-headings:font-heading prose-headings:font-bold prose-headings:leading-tight hover:prose-a:text-accent-foreground prose-a:prose-headings:no-underline">
        <h1 className="mt-0">{t('projects.title')}</h1>
        <time className="text-sm text-slate-500">
          {t('projects.lastUpdated', {
            date: lastUpdated,
          })}
        </time>
        <hr className="my-4" />
        <div className="grid items-stretch gap-4 md:grid-cols-2">
          {/*{projects.map((item) => (
            <SpotlightCard key={item.href} {...item} />
          ))}*/}
        </div>
      </article>
    </div>
  );
}
