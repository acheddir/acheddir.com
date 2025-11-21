'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, MapPin, Pencil } from 'lucide-react';

import { siteMetadata, defaultAuthor } from '@/lib/metadata';
import { projects } from '@/lib/projects-data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/app/i18n/client';
import i18next from '@/app/i18n/i18next';

import Casablanca from '@/public/casablanca.jpg';
import ProjectPejobs from '@/public/project-pejobs.png';

type CardProps = React.ComponentProps<typeof Card>;

interface SidebarProps extends CardProps {
  locale: string;
}

export const Sidebar = ({ className, locale, ...props }: SidebarProps) => {
  const { t } = useTranslation(locale, 'home');
  const isRtl = i18next.dir(locale) === 'rtl';

  return (
    <>
      <Card className={cn('mb-4', className)} {...props}>
        <CardHeader>
          <CardTitle>{t('sidebar.location.title')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center rounded-md pl-2 hover:bg-background/40 hover:backdrop-blur-lg">
            <MapPin />
            <p
              className={cn('text-sm font-medium leading-none', {
                'ml-2 mr-auto': !isRtl,
                'ml-auto mr-2': isRtl,
              })}
            >
              {t(defaultAuthor.location.city)}
            </p>
            <Image
              src={Casablanca}
              alt={t(defaultAuthor.location.city)}
              width={56}
              height={56}
              className="h-16 w-16 rounded-md object-cover"
            />
          </div>
        </CardContent>
        {/* <Separator />
        <CardFooter>
          <Button variant="ghost" className="w-full" disabled>
            Digital Nomad diaries {isRtl ? <ArrowLeft className="ml-2 h-4 w-4" /> : <ArrowRight className="mr-2 h-4 w-4" />}
          </Button>
        </CardFooter> */}
      </Card>
      <Card className={cn(className)} {...props}>
        <CardHeader>
          <CardTitle>{t('sidebar.workingon.title')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {projects.slice(0, siteMetadata.projectsOnHomePage).map((project) => (
            <Link
              href={project.href}
              target="_blank"
              key={project.title.trim()}
              className="flex items-center rounded-md pl-2 hover:bg-background/40 hover:backdrop-blur-lg"
            >
              <Pencil />
              <p
                className={cn('text-sm font-medium leading-none', {
                  'ml-2 mr-auto': !isRtl,
                  'ml-auto mr-2': isRtl,
                })}
              >
                {project.title}
              </p>
              {project.mediaType === 'video' ? (
                <video autoPlay loop muted playsInline className="h-16 w-16 rounded-md object-cover">
                  <source src="/project-garden.webm" type="video/webm" />
                  <source src="/project-garden.mp4" type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={ProjectPejobs}
                  alt={project.title}
                  width={56}
                  height={56}
                  className="h-16 w-16 rounded-md object-cover"
                />
              )}
            </Link>
          ))}
        </CardContent>
        <Separator />
        <CardFooter>
          <Button variant="ghost" className="w-full" asChild>
            <Link href={`/${locale}/projects`}>
              {t('sidebar.workingon.allprojects')}{' '}
              {isRtl ? <ArrowLeft className="ml-2 h-4 w-4" /> : <ArrowRight className="mr-2 h-4 w-4" />}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
