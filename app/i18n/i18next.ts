import i18next from 'i18next';

// Preserve the original dir method
const originalDir = i18next.dir.bind(i18next);

// Override the dir method
i18next.dir = (locale?: string) => {
  if (locale === 'ma') return 'rtl'; // Force "rtl" for "ma"
  return originalDir(locale); // Fallback to the original behavior
};

// Export the configured instance
export default i18next;
