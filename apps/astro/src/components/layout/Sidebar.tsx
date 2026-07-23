import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BrandMark } from '~/components/brand/BrandMark';
import { Languages, languages } from '~/i18n/ui';
import { useTranslations } from '~/i18n/utils';
import { localizePath } from '~/i18n/path';

const ICONS: Record<string, string> = {
  '/projects': 'work',
  '/notes': 'description',
  '/hobbies': 'photo_camera',
  '/events': 'event',
  '/about': 'person',
  '/contact': 'mail'
};

export const Sidebar = ({
  locale = 'en',
  pathname,
  search,
  links
}: {
  locale: Languages;
  pathname: string;
  search: string;
  links: { label: string; value: string }[];
}) => {
  const t = useTranslations(locale);
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const bodyChildren = Array.from(document.body.children);
    const hiddenState = bodyChildren.map((element) => ({
      element,
      ariaHidden: element.getAttribute('aria-hidden'),
      inert: element.hasAttribute('inert')
    }));

    document.documentElement.classList.add('shell-drawer-open');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    bodyChildren.forEach((element) => {
      if (element.classList.contains('shell-drawer-portal')) return;
      element.setAttribute('aria-hidden', 'true');
      element.setAttribute('inert', '');
    });

    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const dialog = document.querySelector('.shell-drawer-portal');
      if (!dialog) return;
      const tabbables = Array.from(
        dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]):not([tabindex="-1"])')
      );
      if (tabbables.length === 0) return;
      const first = tabbables[0];
      const last = tabbables[tabbables.length - 1];
      const active = document.activeElement;
      if (!event.shiftKey && (active === last || !dialog.contains(active))) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault();
        last.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.documentElement.classList.remove('shell-drawer-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);

      hiddenState.forEach(({ element, ariaHidden, inert }) => {
        if (ariaHidden === null) {
          element.removeAttribute('aria-hidden');
        } else {
          element.setAttribute('aria-hidden', ariaHidden);
        }

        if (!inert) {
          element.removeAttribute('inert');
        }
      });

      triggerRef.current?.focus();
    };
  }, [open]);

  const getURLWithLanguage = (value: string) => {
    return `/${locale}${value}`;
  };

  const getCurrentURLWithLanguage = (language: string) => {
    return localizePath(pathname, language, search);
  };

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        className="shell-drawer-trigger"
        aria-label={t('common.menu-open')}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: '1.25rem' }}
          aria-hidden="true"
        >
          menu
        </span>
      </button>

      {open &&
        createPortal(
          <div
            className="shell-drawer-portal"
            role="dialog"
            aria-modal="true"
            aria-label={t('common.menu')}
          >
            <button
              className="shell-drawer-overlay"
              onClick={() => setOpen(false)}
              aria-label={t('common.menu-close')}
              tabIndex={-1}
            />
            <div className="shell-drawer">
              <div className="shell-drawer-header">
                <BrandMark />
                <button
                  ref={closeButtonRef}
                  onClick={() => setOpen(false)}
                  className="shell-drawer-close"
                  aria-label={t('common.menu-close')}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    close
                  </span>
                </button>
              </div>

              <nav className="shell-drawer-nav" aria-label={t('common.menu')}>
                {links.map(({ label, value }) => {
                  const fullPath = getURLWithLanguage(value);
                  const isCurrent =
                    value === '/' ? pathname === fullPath : pathname.startsWith(fullPath);
                  const icon = ICONS[value] || 'link';

                  return (
                    <a
                      key={value}
                      href={fullPath}
                      className="shell-drawer-link"
                      data-active={isCurrent ? 'true' : 'false'}
                      data-astro-reload
                    >
                      <span
                        className="material-symbols-outlined shell-sidebar-link-icon"
                        aria-hidden="true"
                      >
                        {icon}
                      </span>
                      <span className="shell-sidebar-link-label">{label}</span>
                    </a>
                  );
                })}
              </nav>

              <div className="shell-drawer-locale">
                <span className="shell-drawer-locale-label">{t('common.language')}</span>
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
          </div>,
          document.body
        )}
    </>
  );
};
