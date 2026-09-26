import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BrandMark } from '~/components/brand/BrandMark';
import {
  MdOutlineClose,
  MdOutlineDescription,
  MdOutlineEvent,
  MdOutlineLink,
  MdOutlineMail,
  MdOutlineMenu,
  MdOutlinePerson,
  MdOutlinePhotoCamera,
  MdOutlinePhotoLibrary,
  MdOutlineWeekend,
  MdOutlineWorkOutline
} from 'react-icons/md';
// Value imports from ~/i18n/ui drag all three locales of all ten namespaces into this
// island's chunk. Labels and locale codes arrive resolved from the server instead.
import type { Languages } from '~/i18n/ui';
import { localizePath } from '~/i18n/path';

// Only the icons this drawer can draw, imported directly. The shared map indexes one
// object literal holding all 25, so Rollup cannot tree-shake per icon and the island
// shipped ~12 KB gzip of path data to draw eight.
const ICONS = {
  '/projects': MdOutlineWorkOutline,
  '/notes': MdOutlineDescription,
  '/hobbies': MdOutlinePhotoCamera,
  '/events': MdOutlineEvent,
  '/photos': MdOutlinePhotoLibrary,
  '/room': MdOutlineWeekend,
  '/about': MdOutlinePerson,
  '/contact': MdOutlineMail
} as const;

export const Sidebar = ({
  locale = 'en',
  pathname,
  search,
  links,
  locales,
  labels
}: {
  locale: Languages;
  pathname: string;
  search: string;
  links: { label: string; value: string }[];
  locales: string[];
  labels: { menu: string; menuOpen: string; menuClose: string; language: string };
}) => {
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
        aria-label={labels.menuOpen}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <MdOutlineMenu aria-hidden="true" style={{ fontSize: '1.25rem' }} />
      </button>

      {open &&
        createPortal(
          <div
            className="shell-drawer-portal"
            role="dialog"
            aria-modal="true"
            aria-label={labels.menu}
          >
            <button
              className="shell-drawer-overlay"
              onClick={() => setOpen(false)}
              aria-label={labels.menuClose}
              tabIndex={-1}
            />
            <div className="shell-drawer">
              <div className="shell-drawer-header">
                <BrandMark />
                <button
                  ref={closeButtonRef}
                  onClick={() => setOpen(false)}
                  className="shell-drawer-close"
                  aria-label={labels.menuClose}
                >
                  <MdOutlineClose aria-hidden="true" />
                </button>
              </div>

              <nav className="shell-drawer-nav" aria-label={labels.menu}>
                {links.map(({ label, value }) => {
                  const fullPath = getURLWithLanguage(value);
                  const isCurrent =
                    value === '/' ? pathname === fullPath : pathname.startsWith(fullPath);
                  const LinkIcon = ICONS[value as keyof typeof ICONS] ?? MdOutlineLink;

                  return (
                    <a
                      key={value}
                      href={fullPath}
                      className="shell-drawer-link"
                      data-active={isCurrent ? 'true' : 'false'}
                      aria-current={isCurrent ? 'page' : undefined}
                      data-astro-reload
                    >
                      <LinkIcon className="shell-sidebar-link-icon" aria-hidden="true" />
                      <span className="shell-sidebar-link-label">{label}</span>
                    </a>
                  );
                })}
              </nav>

              <div className="shell-drawer-locale">
                <span className="shell-drawer-locale-label">{labels.language}</span>
                <div className="shell-drawer-locale-list">
                  {locales.map((code) => (
                    <a
                      key={code}
                      href={getCurrentURLWithLanguage(code)}
                      className="shell-drawer-locale-btn"
                      data-active={code === locale ? 'true' : 'false'}
                      aria-current={code === locale ? 'true' : undefined}
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
