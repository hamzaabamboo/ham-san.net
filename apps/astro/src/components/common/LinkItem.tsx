import { FaGithub, FaGlobe } from 'react-icons/fa';
import { HStack } from 'styled-system/jsx';
import { ComponentUtilsLink } from '~/graphql/generated/client';
import { Link } from '../ui/link';
import { Text } from '../ui/text';

const processUrl = (link: Pick<ComponentUtilsLink, 'url' | 'type'>) => {
  switch (link.type) {
    case 'github':
      return link.url?.split('github.com/').splice(-1)[0];
    default:
      return link.url;
  }
};

const linkIcon = (link: Pick<ComponentUtilsLink, 'type'>) => {
  switch (link.type) {
    case 'github':
      return FaGithub;
    case 'web':
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
  data: Omit<ComponentUtilsLink, 'id'>;
  Icon?: React.FunctionComponent;
  linkText?: string;
}) => {
  const Icon = _icon ? _icon : linkIcon(data);
  const text = linkText ? linkText : processUrl(data);
  return (
    <HStack gap="2">
      {Icon && <Icon />}
      {data.title}
      <Text>:</Text>
      <Link href={data.url ?? ''} target="_blank">
        {text}
      </Link>
    </HStack>
  );
};
