import { FaGithub, FaGlobe } from 'react-icons/fa';
import { HStack } from 'styled-system/jsx';
import { ComponentUtilsLink } from '~/graphql/generated/client';
import { Link } from '../ui/link';
import { Text } from '../ui/text';

const processUrl = (link: ComponentUtilsLink) => {
  switch (link.type) {
    case 'github':
      return link.url?.split('github.com/').splice(-1)[0];
    default:
      return link.url;
  }
};

const linkIcon = (link: ComponentUtilsLink) => {
  switch (link.type) {
    case 'github':
      return FaGithub;
    case 'web':
      return FaGlobe;
    default:
      return null;
  }
};

export const LinkItem = ({ data }: { data: ComponentUtilsLink }) => {
  const Icon = linkIcon(data);
  const text = processUrl(data);
  return (
    <HStack gap="2">
      {Icon && (
        <>
          <Icon />
          <Text>:</Text>
        </>
      )}

      <Link href={data.url ?? ''} target="_blank">
        {text}
      </Link>
    </HStack>
  );
};
