'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen } from 'lucide-react';

interface CategoryNode {
  name: string;
  posts: Array<{
    title: string;
    slug: string;
    locale: string;
  }>;
  children: Map<string, CategoryNode>;
}

interface CategoriesTreeProps {
  categoryTree: CategoryNode;
  uncategorizedPosts: Array<{
    title: string;
    slug: string;
    locale: string;
  }>;
  locale: string;
  otherLabel: string;
}

interface CategoryTreeNodeProps {
  node: CategoryNode;
  locale: string;
  level?: number;
}

function CategoryTreeNode({ node, locale, level = 0 }: CategoryTreeNodeProps) {
  const isRoot = level === 0;
  // Root is always expanded (it's invisible), other categories start collapsed
  const [isExpanded, setIsExpanded] = useState(isRoot);
  const hasChildren = node.children.size > 0;
  const hasPosts = node.posts.length > 0;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={isRoot ? '' : 'ml-6'}>
      {!isRoot && (
        <div
          className="mb-2 flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80"
          onClick={toggleExpand}
        >
          {/* Folder icon - always use folder for categories */}
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Folder className="h-4 w-4 text-muted-foreground" />
          )}

          {/* Category name */}
          <span className="font-semibold text-foreground">{node.name}</span>

          {/* Post count */}
          {hasPosts && <span className="text-xs text-muted-foreground">({node.posts.length})</span>}

          {/* Chevron */}
          {(hasChildren || hasPosts) && (
            <div className="ml-auto">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform" />
              )}
            </div>
          )}
        </div>
      )}

      {/* Expandable content with animation */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            {/* Render posts at this level */}
            {hasPosts && (
              <div className={`space-y-1 ${!isRoot ? 'mb-3 ml-6' : 'mb-3'}`}>
                {node.posts.map((post) => (
                  <div key={post.slug} className="flex items-center gap-2">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <Link
                      href={`/${locale}/posts/${post.slug}`}
                      className="text-sm text-foreground transition-colors hover:text-accent-foreground hover:underline"
                    >
                      {post.title}
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Render child categories */}
            {hasChildren && (
              <div className="space-y-3">
                {Array.from(node.children.values()).map((child) => (
                  <CategoryTreeNode key={child.name} node={child} locale={locale} level={level + 1} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CategoriesTree({ categoryTree, uncategorizedPosts, locale, otherLabel }: CategoriesTreeProps) {
  const [isOtherExpanded, setIsOtherExpanded] = useState(false);
  const hasCategories = categoryTree.children.size > 0;
  const hasUncategorized = uncategorizedPosts.length > 0;

  return (
    <>
      {/* Categorized posts */}
      {hasCategories && <CategoryTreeNode node={categoryTree} locale={locale} />}

      {/* Uncategorized posts under "Other" */}
      {hasUncategorized && (
        <div className={`space-y-3 ${hasCategories ? 'mt-3' : ''}`}>
          <div className="ml-6">
            <div
              className="mb-2 flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80"
              onClick={() => setIsOtherExpanded(!isOtherExpanded)}
            >
              {isOtherExpanded ? (
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Folder className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="font-semibold text-foreground">{otherLabel}</span>
              <span className="text-xs text-muted-foreground">({uncategorizedPosts.length})</span>
              <div className="ml-auto">
                {isOtherExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform" />
                )}
              </div>
            </div>

            <AnimatePresence initial={false}>
              {isOtherExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="mb-3 ml-6 space-y-1">
                    {uncategorizedPosts.map((post) => (
                      <div key={post.slug} className="flex items-center gap-2">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <Link
                          href={`/${locale}/posts/${post.slug}`}
                          className="text-sm text-foreground transition-colors hover:text-accent-foreground hover:underline"
                        >
                          {post.title}
                        </Link>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  );
}
