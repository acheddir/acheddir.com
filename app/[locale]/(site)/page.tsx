/* eslint-disable react-hooks/rules-of-hooks */
import Image from 'next/image';
import Link from 'next/link';
import AvatarHome from '@/public/avatar-home.png';
import { pages, posts } from '#site/content';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { defaultAuthor, siteMetadata } from '@/lib/metadata';
import { withLineBreaks } from '@/lib/tsx-utils';
import { sortByDate } from '@/lib/utils';
import { HeroSimple } from '@/components/hero-simple';
import { Sidebar } from '@/components/home-sidebar';
import { Mdx } from '@/components/mdx';
import NewsletterSubscribe from '@/components/newsletter-subscribe';
import PostPreview from '@/components/post-preview';
import { useTranslation } from '@/app/i18n';
import i18next from '@/app/i18n/i18next';

async function getAboutPage(locale: string) {
  const aboutPage = pages.find((page) => page.slug === 'about' && page.locale === locale);

  if (!aboutPage) {
    null;
  }

  return aboutPage;
}

export default async function Home(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;

  const { t: tc } = await useTranslation(locale, 'common');
  const { t: th } = await useTranslation(locale, 'home');

  const isRtl = i18next.dir(locale) === 'rtl';

  const aboutPage = await getAboutPage(locale);

  const localizedPosts = posts
    .filter((post) => post.status === 'published' && post.locale === locale)
    .sort(sortByDate)
    .slice(0, siteMetadata.postsOnHomePage);

  return (
    <div className="pb-10">
      <HeroSimple locale={locale} title={th('hero.title')} subtitle={th('hero.subtitle')} />
      <div className="container mt-12 max-w-6xl">
        <div className="grid grid-cols-1 place-items-start justify-between gap-12 lg:grid-cols-3">
          <div className="col-span-1 w-full lg:col-span-2">
            <div className="grid grid-flow-row gap-2">
              {localizedPosts.map((post) => (
                <PostPreview locale={locale} key={post.path} post={post} />
              ))}
            </div>
            <Link
              href={`/${locale}/posts`}
              className="mt-10 flex items-center py-2 text-sm text-accent-foreground underline-offset-4 hover:text-muted-foreground hover:underline"
            >
              {th('posts.seeall')}{' '}
              {isRtl ? <ArrowLeft className="ml-2 h-4 w-4" /> : <ArrowRight className="mr-2 h-4 w-4" />}
            </Link>
          </div>
          <aside className="w-full">
            <Sidebar locale={locale} />
          </aside>
        </div>
      </div>
      {siteMetadata.newsletterUrl && (
        <NewsletterSubscribe
          title={th('newsletter.title')}
          description={`${th('newsletter.description')}\n${th('newsletter.cta')}\n${th('newsletter.unsubscribe')}`}
          buttonText="Subscribe"
        />
      )}
      {aboutPage && (
        <div className="container max-w-6xl">
          <h2 className="mb-8 font-heading text-4xl font-bold">{th('about.whois')}</h2>
          <div className="grid grid-cols-1 place-items-start justify-between gap-12 lg:grid-cols-3">
            <div className="col-span-1 mx-auto flex flex-col items-center justify-center">
              {/* TODO: put avatar here */}
              <div className="text-center">
                <h1 className="font-heading text-2xl font-bold">{tc(defaultAuthor.name)}</h1>
                <p className="text-muted-foreground">{defaultAuthor.jobTitle}</p>
                <p dir="ltr" className="text-muted-foreground">
                  <Link className="text-red-800 underline" href={defaultAuthor.company?.website}>
                    {defaultAuthor.company?.name}
                  </Link>
                </p>
              </div>
            </div>
            <div className="col-span-1 lg:col-span-2">
              <article className="prose mx-auto max-w-5xl dark:prose-invert prose-headings:mb-3 prose-headings:mt-8 prose-headings:font-heading prose-headings:font-bold prose-headings:leading-tight hover:prose-a:text-accent-foreground prose-a:prose-headings:no-underline">
                <Mdx code={aboutPage.body} />
                <Link
                  href="/now"
                  className="mt-10 flex items-center py-2 text-sm text-accent-foreground underline-offset-4 hover:text-muted-foreground hover:underline"
                >
                  See what I&apos;m up to now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </article>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
