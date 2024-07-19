import { FaList, FaTimes } from 'react-icons/fa';
import { Divider, Stack } from 'styled-system/jsx';
import * as Drawer from '~/components/ui/drawer';
import { Languages, languages } from '~/i18n/ui';
import { useTranslations } from '~/i18n/utils';
import { IconButton } from '../ui/icon-button';
import { Link } from '../ui/link';

export const Sidebar = ({
  locale = 'en',
  pathname,
  links
}: {
  locale: Languages;
  pathname: string;
  links: { label: string; value: string }[];
}) => {
  const t = useTranslations(locale);

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
                {links.map(({ label, value }) => {
                  return (
                    <Link key={value} href={getURLWithLanguage(value)} data-astro-reload>
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
