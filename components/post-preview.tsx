import Link from 'next/link';
import { Post } from '#site/content';
import { format, parseISO } from 'date-fns';
import { CalendarDays, Timer } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/app/i18n';
import { getDateLocale } from '@/app/i18n/settings';

type PostPreviewProps = {
  locale: string;
  post: Post;
};

const PostPreview = async ({ locale, post }: PostPreviewProps) => {
  const { t } = await useTranslation(locale, 'posts');

  return (
    <article className="w-full">
      <Link
        href={`/${locale}/posts/${post.slug}`}
        className={cn(
          'select-rounded-md block w-full rounded-md p-4 leading-none no-underline outline-none transition-colors hover:bg-foreground/10 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
        )}
      >
        <h3 className="font-heading my-2 text-2xl font-bold text-foreground">{post.title}</h3>
        <div className="flex gap-2 text-sm leading-snug text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarDays size={16} />
            <time dateTime={post.publishedDate}>
              {format(parseISO(post.publishedDate), 'dd LLLL yyyy', {
                locale: getDateLocale(locale),
              })}
            </time>
          </div>
          <span className="opacity-50">|</span>
          <div className="flex items-center gap-1">
            <Timer size={16} />
            <span>{t('post.minutes', { count: post.metadata.readingTime })}</span>
          </div>
        </div>
        {post?.tags && (
          <ul className="my-4 flex list-none flex-wrap gap-2 p-0">
            {post.tags.map((tag: string) => (
              <li key={tag}>
                <Badge
                  variant="outline"
                  className="inline-block rounded-full border border-muted-foreground/50 bg-muted-foreground/10 px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </Badge>
              </li>
            ))}
          </ul>
        )}
        {post.description && (
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{post.description}</p>
        )}
      </Link>
    </article>
  );
};

export default PostPreview;
