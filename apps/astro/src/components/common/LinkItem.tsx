import { FaGithub, FaGlobe } from 'react-icons/fa';
import type { IconType } from 'react-icons/lib';
import { Stack, Wrap } from 'styled-system/jsx';
import { Enum_Componentutilslink_Type } from '~/graphql/generated/client';
import { Link } from '../ui/link';
import { Text } from '../ui/text';

type LinkData = {
  title?: string | null;
  url?: string | null;
  type?: Enum_Componentutilslink_Type | null;
};

const processUrl = (link: Pick<LinkData, 'url' | 'type'>, openLabel: string) => {
  switch (link.type) {
    case Enum_Componentutilslink_Type.Github:
      return link.url?.split('github.com/').splice(-1)[0];
    default:
      if (!link.url) return link.url;
      try {
        const url = new URL(link.url);
        return `${openLabel} ${url.hostname.replace(/^www\./, '')}`;
      } catch {
        return link.url;
      }
  }
};

const linkIcon = (link: Pick<LinkData, 'type'>) => {
  switch (link.type) {
    case Enum_Componentutilslink_Type.Github:
      return FaGithub;
    case Enum_Componentutilslink_Type.Web:
      return FaGlobe;
    default:
      return null;
  }
};

export const LinkItem = ({
  data,
  Icon: _icon,
  linkText,
  openLabel = 'Open'
}: {
  data: LinkData;
  Icon?: IconType;
  linkText?: string;
  openLabel?: string;
}) => {
  const Icon = _icon ? _icon : linkIcon(data);
  const text = linkText ? linkText : processUrl(data, openLabel);
  return (
    <Wrap
      gap="3"
      justifyContent="space-between"
      alignItems="center"
      border="1px solid"
      borderColor="var(--atelier-line)"
      py="3"
      px="4"
      bg="var(--atelier-bg)"
    >
      <Wrap gap="3" alignItems="center" minW="0">
        <Text as="span" color="var(--atelier-accent)" fontSize="lg">
          {Icon && <Icon />}
        </Text>
        <Stack gap="0" minW="0">
          <Text
            color="var(--atelier-outline)"
            fontSize="10px"
            letterSpacing="0.12em"
            textTransform="uppercase"
          >
            {data.title}
          </Text>
          <Link
            className="amber-link"
            href={data.url ?? ''}
            target="_blank"
            rel="noreferrer"
            fontFamily="var(--font-code)"
            overflowWrap="anywhere"
          >
            {text}
          </Link>
        </Stack>
      </Wrap>
    </Wrap>
  );
};
