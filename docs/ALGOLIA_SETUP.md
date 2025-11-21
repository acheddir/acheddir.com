# Algolia Search Integration

This document explains how to set up and use Algolia search in your Velite-powered Next.js blog.

## Overview

The site integrates Algolia to provide fast, typo-tolerant search across all your blog posts and pages. Search results appear in the command palette (⌘K / Ctrl+K) and are automatically filtered by locale.

## Setup Instructions

### 1. Create an Algolia Account

1. Go to [Algolia](https://www.algolia.com/) and sign up for a free account
2. Create a new application in the Algolia dashboard

### 2. Get Your Algolia Credentials

From your Algolia dashboard, navigate to **Settings > API Keys** and copy:

- **Application ID**
- **Search-Only API Key** (safe to expose publicly)
- **Admin API Key** (keep secret!)

### 3. Configure Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Algolia Configuration
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id_here
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_api_key_here
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=acheddir_blog
ALGOLIA_ADMIN_API_KEY=your_admin_api_key_here
```

**Important:** Never commit `.env.local` to version control! It's already in `.gitignore`.

### 4. Create an Algolia Index

In your Algolia dashboard:

1. Go to **Search > Indices**
2. Create a new index with the name you specified in `NEXT_PUBLIC_ALGOLIA_INDEX_NAME`

### 5. Build and Index Your Content

Run these commands to generate content and push it to Algolia:

```bash
# Build your Next.js site (this generates .velite content)
pnpm build

# This will automatically push content to Algolia via the postbuild script
# Or you can manually run:
pnpm algolia:push
```

## How It Works

### Content Indexing

1. **Build Time**: When you run `pnpm build`, Velite processes your MDX files and generates `.velite/posts.json` and `.velite/pages.json`

2. **Post-Build**: The `postbuild` script automatically runs `scripts/algolia-push.ts`, which:
   - Reads the generated JSON files
   - Transforms posts and pages into Algolia records
   - Removes markdown syntax for cleaner search results
   - Pushes records to your Algolia index
   - Configures index settings for optimal search

### Search Implementation

The search is integrated into the existing command palette:

- **Hook**: `lib/hooks/use-algolia-search.ts` - Manages Algolia search API calls
- **Component**: `components/command-dialog.tsx` - Displays search results in the command palette
- **Features**:
  - Real-time search as you type
  - Locale-aware filtering (only shows content in current language)
  - Displays title, description, and publication date
  - Different icons for posts vs pages

### Algolia Record Structure

Each record contains:

```typescript
{
  objectID: string;          // Unique identifier (e.g., "post-slug-en")
  title: string;             // Post/page title
  description?: string;      // Optional description
  content: string;           // Cleaned content (markdown removed)
  excerpt: string;           // Content excerpt
  slug: string;              // URL slug
  locale: string;            // Language code (e.g., "en", "ar")
  type: 'post' | 'page';    // Content type
  tags?: string[];           // Post tags (only for posts)
  publishedDate?: string;    // Publication date (only for posts)
  url: string;               // Full URL path
}
```

## Usage

### For Users

1. Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) to open the command palette
2. Start typing to search across all content
3. Search results appear at the top, filtered by your current language
4. Press Enter or click to navigate to the selected result

### Manual Indexing

To manually push content to Algolia (useful after adding new posts):

```bash
# Make sure .velite content is generated first
pnpm build

# Push to Algolia
pnpm algolia:push
```

### CI/CD Integration

The `postbuild` script gracefully handles missing credentials, so your CI/CD won't fail if Algolia credentials aren't configured. If you want to index in CI/CD:

1. Add the environment variables to your deployment platform (Vercel, Netlify, etc.)
2. The indexing will run automatically after each build

## Index Configuration

The search is configured with:

- **Searchable Attributes**: title, description, content, tags (in order of importance)
- **Attributes to Snippet**: content (20 words)
- **Facets**: locale, type, tags
- **Custom Ranking**: Most recent posts first (by publishedDate)
- **Highlighting**: Results are highlighted with `<mark>` tags

## Troubleshooting

### Search doesn't work

1. Check that environment variables are set correctly in `.env.local`
2. Verify the Algolia index exists and has records
3. Check browser console for errors
4. Ensure you've run `pnpm build` and `pnpm algolia:push`

### No results found

1. Make sure content is published (status: "published" in frontmatter)
2. Check that content matches your current locale
3. Try searching for simpler terms

### Indexing fails

1. Verify your Algolia Admin API Key is correct
2. Check that `.velite/` directory exists and contains JSON files
3. Run `pnpm build` first to generate content

## Cost Considerations

Algolia's free tier includes:
- 10,000 search requests/month
- 1,000,000 records

This should be more than sufficient for most personal blogs. Monitor usage in the Algolia dashboard.

## Future Enhancements

Potential improvements:
- Add search analytics tracking
- Implement autocomplete suggestions
- Add search result snippets with highlighted keywords
- Support searching across multiple locales simultaneously
- Add filters for content type, tags, and date ranges
