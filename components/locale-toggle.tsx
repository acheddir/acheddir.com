import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import i18next from '@/app/i18n/i18next';
import { getCountryCodes, toggleLocale } from '@/app/i18n/settings';

import { CountryFlag } from './country-flag';

export const LocaleToggle = ({ locale }: { locale: string }) => {
  const pathname = usePathname();
  const localizedPathname = toggleLocale(locale, pathname);

  const isRtl = i18next.dir(locale) === 'rtl';

  const { current, alternate } = getCountryCodes(locale);

  return (
    <div
      className={cn('relative h-[1.5em] w-[1.5em]', {
        'mr-4 sm:mr-0': !isRtl,
        'ml-4 sm:ml-0': isRtl,
      })}
    >
      <Link href={localizedPathname}>
        {/* Motion Wrapper */}
        <motion.div className="relative h-full w-full" whileHover="hover" style={{ display: 'inline-block' }}>
          {/* Current Flag */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            whileHover={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CountryFlag className="h-6 w-6" countryCode={current} />
          </motion.div>
          {/* Alternate Flag */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CountryFlag className="h-6 w-6" countryCode={alternate} />
          </motion.div>
        </motion.div>
      </Link>
    </div>
  );
};
