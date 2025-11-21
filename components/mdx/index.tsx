import React from 'react';
import * as runtime from 'react/jsx-runtime';
import NextImage, { ImageProps } from 'next/image';
import type { TweetProps } from 'react-tweet';
import { Tweet } from 'react-tweet';

import { CodeBlock } from './code-block';
import { NewsletterCTA } from './newsletter-cta';
import { TestImage } from './test-image';
import { ThemeImage } from './theme-image';
import { YouTubeVideo } from './youtube-video';

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

function CustomLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { href } = props;
  const isExternalLink = href && href.startsWith('http');

  if (isExternalLink) {
    return <a target="_blank" href={href} rel="noopener noreferrer" {...props} />;
  }
  return (
    //@ts-expect-error
    <Link href={href} />
  );
}

const components = {
  pre: CodeBlock,
  Image: (props: ImageProps) => <NextImage {...props} />,
  NewsletterCTA,
  YouTubeVideo,
  ThemeImage,
  TestImage,
  // a: CustomLink,
  Tweet: (props: TweetProps) => {
    return (
      <div className="not-prose [&>div]:mx-auto">
        <Tweet {...props} />
      </div>
    );
  }
};

interface MdxProps {
  code: string;
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}
