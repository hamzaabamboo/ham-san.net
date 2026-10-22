import { FaGithub, FaGlobe, FaLink } from 'react-icons/fa';
import { css } from 'styled-system/css';
import type { IconType } from 'react-icons/lib';
import { Box, HStack, Stack } from 'styled-system/jsx';
import { Enum_Componentutilslink_Type } from '~/graphql/generated/client';
import { formatBareUrlLabel } from '~/utils/link-label';
import { Link } from '../ui/link';
import { Text } from '../ui/text';

type LinkData = {
  title?: string | null;
  url?: string | null;
  type?: Enum_Componentutilslink_Type | null;
};

const toHref = (link: Pick<LinkData, 'url' | 'type'>) => {
  const url = link.url?.trim();
  if (!url) return undefined;
  if (/^[a-z][a-z\d+.-]*:/i.test(url) || /^[/#?]/.test(url)) return url;
  if (link.type === Enum_Componentutilslink_Type.Github && !/github\.com/i.test(url)) {
    return `https://github.com/${url.replace(/^\/+/, '')}`;
  }
  return `https://${url}`;
};

const processUrl = (link: Pick<LinkData, 'url' | 'type'>, withHost: (host: string) => string) => {
  const href = toHref(link);
  if (!href) return undefined;
  switch (link.type) {
    case Enum_Componentutilslink_Type.Github:
      return withHost(`GitHub · ${href.split('github.com/').splice(-1)[0]}`);
    default:
      return withHost(formatBareUrlLabel(href, 32));
  }
};

const linkIcon = (link: Pick<LinkData, 'type'>) => {
  switch (link.type) {
    case Enum_Componentutilslink_Type.Github:
      return FaGithub;
    case Enum_Componentutilslink_Type.Web:
      return FaGlobe;
    default:
      return FaLink;
  }
};

export const LinkItem = ({
  data,
  Icon: _icon,
  linkText,
  eyebrow,
  formatOpen = (host: string) => `Open ${host}`,
  newTabLabel = '(opens in a new tab)'
}: {
  data: LinkData;
  Icon?: IconType;
  linkText?: string;
  eyebrow?: string | null;
  formatOpen?: (host: string) => string;
  newTabLabel?: string;
}) => {
  const href = toHref(data);
  if (!href) return null;
  const Icon = _icon ? _icon : linkIcon(data);
  const label = eyebrow === undefined ? data.title : eyebrow;
  const text = linkText ? linkText : processUrl(data, formatOpen);
  return (
    <Box
      position="relative"
      border="1px solid"
      borderColor="var(--atelier-line)"
      py="3"
      px="4"
      bg="var(--atelier-bg)"
      _focusWithin={{ outline: '2px solid var(--atelier-accent)', outlineOffset: '2px' }}
      _hover={{ borderColor: 'var(--atelier-accent)' }}
    >
      <HStack gap="3" alignItems="start" minW="0">
        <Text
          as="span"
          aria-hidden="true"
          flexShrink="0"
          mt="3"
          color="var(--atelier-accent)"
          fontSize="lg"
          lineHeight="1"
        >
          {Icon && <Icon />}
        </Text>
        <Stack flex="1" gap="0" minW="0">
          {label && (
            <Text
              className="mono-label"
              color="var(--atelier-outline)"
              fontSize="10px"
              letterSpacing="0.12em"
              textTransform="uppercase"
            >
              {label}
            </Text>
          )}
          <Link
            className="amber-link"
            href={href}
            target="_blank"
            rel="noreferrer"
            display="inline-flex"
            alignItems="center"
            minH="44px"
            fontFamily="var(--font-code)"
            overflowWrap="anywhere"
            _after={{ content: '""', position: 'absolute', inset: '0' }}
            _focusVisible={{ outline: 'none' }}
          >
            {text}
            <span className={css({ srOnly: true })}> {newTabLabel}</span>
          </Link>
        </Stack>
      </HStack>
    </Box>
  );
};
