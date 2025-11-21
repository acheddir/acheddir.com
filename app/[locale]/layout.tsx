import "../styles/globals.css";
import "../styles/devicon.min.css";

import {
  bouazziMaghribi,
  fustat,
  ibmPlexSansArabic,
  inter,
  spaceGrotesk,
} from "@/fonts/fonts";

import { BASE_URL, defaultAuthor, siteMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@/components/analytics";
import { BackTopButton } from "@/components/back-to-top";
import { ThemeProvider } from "@/components/theme-provider";

import { useTranslation } from "../i18n";
import i18next from "../i18n/i18next";
import { locales } from "../i18n/settings";
import Head from "next/head";

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata(props: RootLayoutProps) {
  const { locale } = await props.params;

  const { t } = await useTranslation(locale, "common");

  return {
    metadataBase: new URL(BASE_URL),
    title: t(siteMetadata.title.default, { name: t(defaultAuthor.name) }),
    description: siteMetadata.description,
    authors: [{ name: t(defaultAuthor.name), url: defaultAuthor.website }],
    alternates: {
      canonical: "./",
      types: {
        "application/rss+xml": `${BASE_URL}/feed.xml`,
      },
    },
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout(props: RootLayoutProps) {
  const { locale } = await props.params;

  const { children } = props;

  const isRtl = i18next.dir(locale) === "rtl";

  return (
    <html
      lang={locale === "ma" ? "ar-MA" : locale}
      dir={i18next.dir(locale)}
      className={cn(`scroll-pt-[3.5rem] ${spaceGrotesk.variable} ${inter.variable}`, {
        [`${fustat.variable} ${ibmPlexSansArabic.variable} ${bouazziMaghribi.variable}`]:
          isRtl,
        [`${spaceGrotesk.variable} ${inter.variable}`]: !isRtl,
      })}
      suppressHydrationWarning={true}
    >
      <body className="min-h-screen bg-gradient-to-b from-slate-100 to-white text-slate-900 antialiased dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 dark:text-slate-50">
        <ThemeProvider
          attribute="class"
          defaultTheme={siteMetadata.defaultTheme}
          enableSystem
        >
          {children}
          <BackTopButton />
          <Toaster />
        </ThemeProvider>
      </body>
      <Analytics />
    </html>
  );
}
