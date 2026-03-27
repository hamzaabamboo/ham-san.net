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

const processUrl = (link: Pick<LinkData, 'url' | 'type'>) => {
  switch (link.type) {
    case Enum_Componentutilslink_Type.Github:
      return link.url?.split('github.com/').splice(-1)[0];
    default:
      return link.url;
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
  linkText
}: {
  data: LinkData;
  Icon?: IconType;
  linkText?: string;
}) => {
  const Icon = _icon ? _icon : linkIcon(data);
  const text = linkText ? linkText : processUrl(data);
  return (
    <Wrap
      gap="3"
      justifyContent="space-between"
      alignItems="center"
      border="1px solid"
      borderColor="border.subtle"
      py="3"
      px="4"
      bg="bg.default"
    >
      <Wrap gap="3" alignItems="center">
        <Text as="span" color="amber.500" fontSize="lg">
          {Icon && <Icon />}
        </Text>
        <Stack gap="0">
          <Text color="fg.subtle" fontSize="10px" letterSpacing="0.12em" textTransform="uppercase">
            {data.title}
          </Text>
          <Link href={data.url ?? ''} target="_blank" fontFamily="JetBrains Mono, monospace">
            {text}
          </Link>
        </Stack>
      </Wrap>
    </Wrap>
  );
};
