import Link from 'next/link';
import { Home } from 'lucide-react';

interface PostBreadcrumbProps {
  categories: string[];
  title: string;
  locale: string;
  blogLabel: string;
}

const BreadcrumbSeparator = () => (
  <li className="rtl:rotate-180">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  </li>
);

export function PostBreadcrumb({ categories, title, locale, blogLabel }: PostBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol role="list" className="hidden items-center gap-1 text-sm text-muted-foreground md:flex md:flex-row">
        {/* Home */}
        <li>
          <Link href={`/${locale}`} className="block transition hover:text-muted-foreground/70" aria-label="Go to Home">
            <span className="sr-only">Home</span>
            <Home size={14} />
          </Link>
        </li>

        <BreadcrumbSeparator />

        {/* Blog */}
        <li>
          <Link href={`/${locale}/posts`} className="block transition hover:text-muted-foreground/70">
            {blogLabel}
          </Link>
        </li>

        {/* Categories */}
        {categories.map((category, index) => (
          <div key={`${category}-${index}`} className="contents">
            <BreadcrumbSeparator />
            <li>
              <span className="block text-muted-foreground/70">{category}</span>
            </li>
          </div>
        ))}

        <BreadcrumbSeparator />

        {/* Current Post */}
        <li>
          <span className="block text-muted-foreground/70">{title}</span>
        </li>
      </ol>
    </nav>
  );
}
