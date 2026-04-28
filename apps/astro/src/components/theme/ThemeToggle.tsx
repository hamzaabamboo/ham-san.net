import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { IconButton } from '~/components/ui/icon-button';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const isDarkNow = document.documentElement.classList.contains('dark');
    if (isDarkNow) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <IconButton
      variant="ghost"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      size="sm"
      colorPalette="gray"
      border="1px solid"
      borderColor="#524533"
      bg="#131313"
      _hover={{ bg: '#2a2a2a', color: '#ffb000', borderColor: '#ffb000' }}
    >
      {isDark ? <FaSun /> : <FaMoon />}
    </IconButton>
  );
};
