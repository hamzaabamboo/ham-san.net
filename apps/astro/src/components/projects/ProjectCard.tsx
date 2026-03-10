import { FaGithub, FaGlobe, FaPhotoVideo } from 'react-icons/fa';
import { Box, Center, Stack, styled, Wrap } from 'styled-system/jsx';
import { formatMonthYear, parseDate } from 'utils/date';
import { getMediaUrl } from 'utils/media';
import { Enum_Componentutilslink_Type } from '~/graphql/generated/client';
import { Languages } from '~/i18n/ui';
import { IconButton } from '../ui/icon-button';
import { Link } from '../ui/link';
import { Text } from '../ui/text';

type MediaFile = { name: string; url: string };
type LegacyWrapped<T> = { data: { attributes: T } | null };
type LegacyCollection<T> = { data: Array<{ attributes: T }> };

type ProjectCardData = {
  title?: string | null;
  description?: string | null;
  slug?: string | null;
  isActive?: boolean | null;
  date?: string | null;
  category?: { name?: string | null } | LegacyWrapped<{ name?: string | null }> | null;
  banner?: MediaFile | LegacyWrapped<MediaFile> | null;
  media?: Array<MediaFile | null> | LegacyCollection<MediaFile> | null;
  links?: Array<{
    title?: string | null;
    url?: string | null;
    type?: Enum_Componentutilslink_Type | null;
  } | null> | null;
  [key: string]: unknown;
};

const extractMedia = (
  banner: ProjectCardData['banner'],
  media: ProjectCardData['media']
): MediaFile | null => {
  if (banner && 'url' in banner) return banner;
  if (banner && 'data' in banner) return banner.data?.attributes ?? null;
  if (Array.isArray(media)) {
    const first = media.find((m): m is MediaFile => m != null);
    if (first) return first;
  }
  if (media && !Array.isArray(media) && 'data' in media) return media.data?.[0]?.attributes ?? null;
  return null;
};

export const ProjectCard = (props: { data: ProjectCardData; locale: Languages }) => {
  const { data, locale } = props;
  const { title, description, slug, date, links } = data;
  const category =
    data.category && 'name' in data.category
      ? data.category
      : (data.category as LegacyWrapped<{ name?: string | null }> | null)?.data?.attributes;
  const image = extractMedia(data.banner, data.media);
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
            fontWeight="bold"
          >
            {title}
          </Text>
          <Wrap gap="1" rowGap="0.5" color="fg.subtle" fontSize="sm">
            <Text>{category?.name}</Text> <Text>|</Text>
            <Text>{date && formatMonthYear(parseDate(date), locale)}</Text>
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
