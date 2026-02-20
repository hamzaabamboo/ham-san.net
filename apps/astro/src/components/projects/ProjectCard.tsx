import { FaGithub, FaGlobe, FaPhotoVideo } from 'react-icons/fa';
import { Box, Center, Stack, styled, Wrap } from 'styled-system/jsx';
import { formatMonthYear, parseDate } from 'utils/date';
import { getMediaUrl } from 'utils/media';
import { Enum_Componentutilslink_Type, ProjectPreviewFragment } from '~/graphql/generated/client';
import { Languages } from '~/i18n/ui';
import { IconButton } from '../ui/icon-button';
import { Link } from '../ui/link';
import { Text } from '../ui/text';

export const ProjectCard = (props: { data: ProjectPreviewFragment; locale: Languages }) => {
  const { data, locale } = props;
  const { title, description, slug, banner, media, date, category, links } = data;
  const image = banner ?? media?.[0];
  const link = links?.find((l) => l?.type === Enum_Componentutilslink_Type.Web);
  const ghLink = links?.find((l) => l?.type === Enum_Componentutilslink_Type.Github);

  return (
    <Stack h="full">
      <Link href={`/${locale}/projects/${slug}`} data-astro-prefetch="hover" flex={1}>
        <Stack gap="0.5" h="full">
          <Box borderRadius="l2" backgroundColor="bg.muted" overflow="hidden">
            {image ? (
              <styled.img
                src={getMediaUrl(image.url, {}, import.meta.env.PUBLIC_API_URL) ?? ''}
                alt={image.name}
                style={{
                  viewTransitionName: `project-image-${slug}`
                }}
                aspectRatio="4 / 3"
                objectPosition="center"
                objectFit="contain"
                width="full"
              />
            ) : (
              <Center aspectRatio="4 / 3" color="fg.subtle" fontSize="xl">
                <FaPhotoVideo />
              </Center>
            )}
          </Box>
          <Text
            style={{
              viewTransitionName: `project-title-${slug}`
            }}
            fontWeight="bold"
          >
            {title}
          </Text>
          <Wrap gap="1" rowGap="0.5" color="fg.subtle" fontSize="sm">
            <Text>{category?.name}</Text> <Text>|</Text>
            <Text>{formatMonthYear(parseDate(date), locale)}</Text>
          </Wrap>
          <Text fontSize="sm">{description}</Text>
        </Stack>
      </Link>
      <Wrap w="full">
        {link?.url && (
          <Link href={link?.url} target="_blank">
            <IconButton size="xs" variant="subtle">
              <FaGlobe />
            </IconButton>
          </Link>
        )}
        {ghLink?.url && (
          <Link href={ghLink.url} target="_blank">
            <IconButton size="xs" variant="subtle">
              <FaGithub />
            </IconButton>
          </Link>
        )}
      </Wrap>
    </Stack>
  );
};
