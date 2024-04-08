import { FaList, FaTimes } from 'react-icons/fa';
import { Divider, Stack } from 'styled-system/jsx';
import * as Drawer from '~/components/ui/drawer';
import { Languages, languages } from '~/i18n/ui';
import { useTranslations } from '~/i18n/utils';
import { IconButton } from '../ui/icon-button';
import { Link } from '../ui/link';

export const Sidebar = ({ locale = 'en', pathname }: { locale: Languages; pathname: string }) => {
  const t = useTranslations(locale);

  const NAVIGATION_LINKS = [
    { label: t('common.home'), value: '/' },
    { label: t('common.about-me'), value: '/about' },
    { label: t('common.projects'), value: '/projects' },
    { label: t('common.note'), value: '/notes' },
    { label: t('common.contact'), value: '/contact' }
  ];

  const getURLWithLanguage = (value: string) => {
    return `/${locale}${value}`;
  };

  const getCurrentURLWithLanguage = (language: string) => {
    const [, , ...currentPath] = pathname.split('/');
    return `/${language}/${currentPath.join('/')}`;
  };

  return (
    <>
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <IconButton variant="ghost" hideFrom="sm">
            <FaList />
          </IconButton>
        </Drawer.Trigger>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>{t('common.ham')}</Drawer.Title>
              {/* <Drawer.Description></Drawer.Description> */}
              <Drawer.CloseTrigger asChild position="absolute" top="3" right="4">
                <IconButton variant="ghost">
                  <FaTimes />
                </IconButton>
              </Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body>
              <Stack gap="4">
                {NAVIGATION_LINKS.map(({ label, value }) => {
                  return (
                    <Link key={value} href={getURLWithLanguage(value)}>
                      {label}
                    </Link>
                  );
                })}
                <Divider />
                {Object.entries(languages).map((t) => {
                  return (
                    <Link key={t[1]} href={getCurrentURLWithLanguage(t[0])}>
                      {t[1]}
                    </Link>
                  );
                })}
              </Stack>
            </Drawer.Body>
            {/* <Drawer.Footer gap="3">
              <Drawer.CloseTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Drawer.CloseTrigger>
              <Button>Primary</Button>
            </Drawer.Footer> */}
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  );
};
