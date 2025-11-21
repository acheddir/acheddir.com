import { readFileSync } from 'fs';
import { join } from 'path';
import { algoliasearch } from 'algoliasearch';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const adminApiKey = process.env.ALGOLIA_ADMIN_API_KEY;
const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;

if (!appId || !adminApiKey || !indexName) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_ALGOLIA_APP_ID');
  console.error('   - ALGOLIA_ADMIN_API_KEY');
  console.error('   - NEXT_PUBLIC_ALGOLIA_INDEX_NAME');
  process.exit(1);
}

interface Post {
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  publishedDate: string;
  tags?: string[];
  locale: string;
  raw: string;
  metadata?: {
    readingTime?: number;
    wordCount?: number;
  };
}

interface AlgoliaRecord {
  objectID: string;
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  content: string;
  publishedDate: number;
  tags: string[];
  locale: string;
  readingTime: number;
  wordCount: number;
}

async function indexPosts() {
  try {
    console.log('🚀 Starting Algolia indexing...\n');

    // Initialize Algolia client
    const client = algoliasearch(appId!, adminApiKey!);

    // Read posts from .velite
    const postsPath = join(process.cwd(), '.velite', 'posts.json');
    const postsData = readFileSync(postsPath, 'utf-8');
    const posts: Post[] = JSON.parse(postsData);

    // Filter only published posts
    const publishedPosts = posts.filter((post: any) => post.status === 'published');

    console.log(`📚 Found ${publishedPosts.length} published posts`);

    // Transform posts to Algolia records
    const records: AlgoliaRecord[] = publishedPosts.map((post) => ({
      objectID: `${post.slug}-${post.locale}`,
      slug: post.slug,
      title: post.title,
      description: post.description || post.excerpt || '',
      excerpt: post.excerpt || '',
      content: post.raw.substring(0, 5000), // Limit content size
      publishedDate: new Date(post.publishedDate).getTime(),
      tags: post.tags || [],
      locale: post.locale,
      readingTime: post.metadata?.readingTime || 0,
      wordCount: post.metadata?.wordCount || 0,
    }));

    console.log(`📝 Prepared ${records.length} records for indexing\n`);

    // Save objects to Algolia
    console.log(`⬆️  Uploading to index: ${indexName}`);
    await client.saveObjects({
      indexName: indexName!,
      objects: records,
    });

    // Configure index settings
    console.log('⚙️  Configuring index settings...');
    await client.setSettings({
      indexName: indexName!,
      indexSettings: {
        searchableAttributes: ['title', 'description', 'excerpt', 'content', 'tags'],
        attributesForFaceting: ['locale', 'tags'],
        customRanking: ['desc(publishedDate)'],
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
        attributesToSnippet: ['content:50', 'excerpt:30'],
      },
    });

    console.log('\n✅ Successfully indexed all posts to Algolia!');
    console.log(`   - Index: ${indexName}`);
    console.log(`   - Records: ${records.length}`);
  } catch (error) {
    console.error('❌ Error indexing posts:', error);
    process.exit(1);
  }
}

// Run the indexing
indexPosts();
