import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Languages, languages } from '~/i18n/ui';

const ICONS: Record<string, string> = {
  '/projects': 'terminal',
  '/notes': 'description',
  '/hobbies': 'photo_camera',
  '/events': 'event',
  '/about': 'person',
  '/contact': 'mail'
};

export const Sidebar = ({
  locale = 'en',
  pathname,
  links
}: {
  locale: Languages;
  pathname: string;
  links: { label: string; value: string }[];
}) => {
  const [open, setOpen] = useState(false);

  const getURLWithLanguage = (value: string) => {
    return `/${locale}${value}`;
  };

  const getCurrentURLWithLanguage = (language: string) => {
    const [, , ...currentPath] = pathname.split('/');
    return `/${language}/${currentPath.join('/')}`;
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="shell-drawer-trigger"
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>menu</span>
      </button>

      {open && createPortal(
        <>
          <div
            className="shell-drawer-overlay"
            onClick={() => setOpen(false)}
          />
          <div className="shell-drawer">
            <div className="shell-drawer-header">
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, color: '#FFB000', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                Menu
              </span>
              <button
                onClick={() => setOpen(false)}
                className="shell-drawer-close"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav className="shell-drawer-nav">
              {links.map(({ label, value }) => {
                const fullPath = getURLWithLanguage(value);
                const isCurrent =
                  value === '/'
                    ? pathname === fullPath
                    : pathname.startsWith(fullPath);
                const icon = ICONS[value] || 'link';

                return (
                  <a
                    key={value}
                    href={fullPath}
                    className="shell-drawer-link"
                    data-active={isCurrent ? 'true' : 'false'}
                    data-astro-reload
                  >
                    <span className="material-symbols-outlined shell-sidebar-link-icon">{icon}</span>
                    <span className="shell-sidebar-link-label">{label}</span>
                  </a>
                );
              })}
            </nav>

            <div className="shell-drawer-locale">
              <span className="shell-drawer-locale-label">LOCALE</span>
              <div className="shell-drawer-locale-list">
                {Object.keys(languages).map((code) => (
                  <a
                    key={code}
                    href={getCurrentURLWithLanguage(code)}
                    className="shell-drawer-locale-btn"
                    data-active={code === locale ? 'true' : 'false'}
                  >
                    {code}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
};
