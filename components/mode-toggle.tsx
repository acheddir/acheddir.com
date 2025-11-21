'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

export function ModeToggle() {
  const [isDarkMode, setDarkMode] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setDarkMode(theme === 'dark');
  }, [theme]);

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className="mx-2">
      <DarkModeSwitch moonColor='#3686A0' sunColor='#E6BB00' checked={isDarkMode} onChange={toggleDarkMode} size={20} />
    </div>
  );
}
