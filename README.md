## Project Overview

A multilingual personal portfolio/blog website built with Next.js 15, featuring English and Moroccan Arabic (ma) localization. Content is managed via MDX files processed by Velite, with styling powered by Tailwind CSS and shadcn/ui components.

## Development Commands

### Core Commands
- `pnpm dev` - Start development server at http://localhost:3000
- `pnpm build` - Build for production (runs Velite content generation automatically)
- `pnpm start` - Run production build
- `pnpm lint` - Run ESLint checks

### Additional Commands
- `npx prettier --write .` - Format code with Prettier
- `npx shadcn@latest add [component-name]` - Add shadcn/ui components
- `pnpm install` - Install dependencies (uses pnpm 10.22.0)

## Architecture

### Route Structure
The app uses Next.js App Router with internationalized routing via `[locale]` dynamic segments:
- `/app/[locale]/(site)` - Main site routes (route group, no URL segment)
  - `/` - Home page
  - `/posts` - Blog listing
  - `/posts/[slug]` - Individual blog post
  - `/projects` - Projects showcase
  - `/tags` - Tag listing
  - `/tags/[slug]` - Posts by tag
  - `/[slug]` - Static pages (about, uses, etc.)
- `/app/[locale]/(social)` - Social media routes (route group)
- `/app/[locale]/newsletter` - API route for newsletter subscriptions
- `/app/[locale]/feed.xml` - RSS feed generation

### Internationalization (i18n)
- Supported locales: `en` (English), `ma` (Moroccan Arabic)
- Locale detection via `accept-language` package and cookies
- Cookie name: `i18next` (defined in `app/i18n/settings.ts`)
- Translation files: `app/i18n/locales/{locale}/{namespace}.json`
- Server-side translations: Use `useTranslation(locale, namespace)` from `app/i18n`
- RTL support: Automatic via `i18next.dir(locale)`
- Middleware handles locale detection, redirection, and cookie persistence

### Content Management with Velite
Velite generates static content from MDX files at build time:
- Content source: `/content` directory
  - `/content/posts` - Blog posts with locale suffixes (e.g., `slug.en.mdx`, `slug.ma.mdx`)
  - `/content/pages` - Static pages with locale suffixes
- Generated output: `/.velite` directory (gitignored)
- Content definitions: `/lib/content-definitions/` (posts.ts, pages.ts, etc.)
- Import generated content: `import { posts, pages } from '#site/content'`
- Auto-generation: Velite runs during `dev` and `build` via `next.config.mjs`

#### Post Schema
Required frontmatter for blog posts:
```yaml
title: string (max 99 chars)
publishedDate: ISO date
tags: string[] (optional)
status: 'draft' | 'published'
locale: 'en' | 'ma'
description: string (max 999 chars, optional)
lastUpdatedDate: ISO date (optional)
series: { title: string, order: number } (optional)
author: { name: string, url: string } (optional)
```

#### Generated Fields
- `slug` - Extracted from file path (e.g., `posts/my-post.en.mdx` → `my-post`)
- `toc` - Table of contents from headings
- `metadata` - Reading time calculation
- `excerpt` - Auto-generated preview text
- `content` - Compiled MDX content

### Styling
- **Tailwind CSS v4** with custom configuration
- **shadcn/ui** components in `/components/ui`
- **Path aliases**: `@/*` (root), `#site/content` (Velite output)
- **Theme system**: `next-themes` with dark/light modes
- **Typography**: `@tailwindcss/typography` for prose content
- **CSS Variable Prefix**: `--shiki-` for syntax highlighting

### MDX Processing
Remark plugins (markdown processing):
- `remark-gfm` - GitHub Flavored Markdown
- `remark-math` - Math notation support
- `remark-emoji` - Emoji support

Rehype plugins (HTML processing):
- `rehype-katex` - Math rendering
- `rehype-slug` - Heading IDs
- `rehype-autolink-headings` - Heading anchor links
- `@shikijs/rehype` - Syntax highlighting with Catppuccin themes

Custom transformer: `transformerCodeMetadata()` in `lib/utils.ts` extracts code block metadata (language, title) for display.

### Component Architecture
- `/components` - Shared React components
  - `/ui` - shadcn/ui base components (Button, Card, Dialog, etc.)
  - `/mdx` - MDX-specific components for content rendering
- Server Components by default (Next.js 15)
- Client components marked with `'use client'` directive

### API Routes and Server Actions
- Newsletter subscription: `/app/[locale]/newsletter/route.ts`
  - Integrates with MailerLite API
  - Requires environment variables: `EMAIL_API_BASE`, `EMAIL_API_KEY`, `EMAIL_GROUP_ID`
- RSS feed generation: `/app/[locale]/feed.xml/route.ts`

## Working with Content

### Creating a Blog Post
1. Create MDX files in `/content/posts/`:
   - `post-slug.en.mdx` (English)
   - `post-slug.ma.mdx` (Arabic)
2. Include required frontmatter (see Post Schema above)
3. Velite auto-generates content on next build/dev

### Adding Static Pages
Same process as posts but in `/content/pages/` directory.

### Content Debugging
- Check `/.velite` for generated output
- Clear `.velite` directory if content seems stale
- Velite logs appear during `pnpm dev` or `pnpm build`

### Series Posts
To create a post series:
1. Add `series` frontmatter to related posts:
   ```yaml
   series:
     title: "Series Name"
     order: 1
   ```
2. Velite automatically groups and sorts series posts by order
3. Series navigation renders via `PostSeriesBox` component

## Code Style and Formatting

### Prettier Configuration
- 120 character line width
- Single quotes for JS/TS, double quotes for JSX
- Tailwind class sorting via `prettier-plugin-tailwindcss`
- Import sorting via `@ianvs/prettier-plugin-sort-imports`

### Import Order (Auto-sorted)
1. React imports
2. Next.js imports
3. Built-in Node modules
4. Third-party packages
5. Types
6. Internal modules (`@/env`, `@/types`, `@/config`, `@/lib`, etc.)
7. Relative imports

### TypeScript
- Strict mode enabled
- Target: ES2017
- JSX: react-jsx (React 19 transform)
- Path aliases configured in `tsconfig.json`

## Environment Variables

Required in `.env.local`:
- `EMAIL_API_BASE` - MailerLite API base URL
- `EMAIL_API_KEY` - MailerLite API token
- `EMAIL_GROUP_ID` - MailerLite subscriber group ID

## Comments System

The blog uses [Utterances](https://utteranc.es/) for comments, which stores comments as GitHub issues in the repository. Utterances is configured with:
- Repository: `acheddir/acheddir.com`
- Theme: Automatically syncs with the site's dark/light theme (using `next-themes`)
- Issue mapping: `pathname` (creates issues based on the post URL path)

The Utterances component detects theme changes and dynamically updates the comment box theme in real-time.

To enable comments, install the Utterances app on your GitHub repository at https://github.com/apps/utterances

## Key Implementation Patterns

### Accessing Locale in Server Components
```typescript
const { locale } = await props.params;
const { t } = await useTranslation(locale, 'namespace');
```

### Filtering Content by Locale
```typescript
import { posts } from '#site/content';
const localizedPosts = posts.filter(post => post.locale === locale);
```

### Date Formatting with Locale
```typescript
import { format, parseISO } from 'date-fns';
import { getDateLocale } from '@/app/i18n/settings';

format(parseISO(date), 'd LLLL yyyy', {
  locale: getDateLocale(locale),
});
```

### Static Params Generation
For dynamic routes with multiple locales:
```typescript
export async function generateStaticParams() {
  return posts.map(post => ({
    locale: post.locale,
    slug: post.slug,
  }));
}
```

## Deployment Notes

- Images unoptimized for static hosting (`unoptimized: true`)
- All routes prefixed with locale (`/en/...`, `/ma/...`)
- Content pre-built at build time via Velite
- Newsletter API requires server environment (not static export)
X components should be placed in `components/mdx/`
