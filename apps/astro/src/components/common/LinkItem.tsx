import { FaGithub, FaGlobe } from 'react-icons/fa';
import type { IconType } from 'react-icons/lib';
import { Wrap } from 'styled-system/jsx';
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
    <Wrap gap="1" alignItems="center">
      <Text as="span" fontSize="lg">
        {Icon && <Icon />}
      </Text>
      {data.title}
      <Text>:</Text>
      <Link href={data.url ?? ''} target="_blank">
        {text}
      </Link>
    </Wrap>
  );
};
