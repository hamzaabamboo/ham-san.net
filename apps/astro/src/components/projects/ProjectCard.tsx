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
    <Stack border="1px solid" borderColor="border.subtle" h="full" bg="bg.default">
      <Link
        href={`/${locale}/projects/${slug}`}
        data-astro-prefetch="hover"
        display="block"
        flex={1}
      >
        <Stack gap="0" h="full">
          <Box
            borderColor="border.subtle"
            borderBottom="1px solid"
            py="2"
            px="3"
            color="amber.500"
            fontFamily="JetBrains Mono, monospace"
            fontSize="10px"
            letterSpacing="0.12em"
            textTransform="uppercase"
          >
            {data.isActive ? 'active archive' : 'lab archive'}
          </Box>
          <Box
            borderColor="border.subtle"
            borderBottom="1px solid"
            backgroundColor="bg.muted"
            overflow="hidden"
          >
            {image ? (
              <styled.img
                src={getMediaUrl(image.url, {}, import.meta.env.PUBLIC_API_URL) ?? ''}
                alt={image.name}
                aspectRatio="4 / 3"
                objectPosition="center"
                objectFit="cover"
                width="full"
                transition="transform 0.3s ease, filter 0.3s ease"
                filter="grayscale(1)"
                _groupHover={{ transform: 'scale(1.03)', filter: 'grayscale(0)' }}
              />
            ) : (
              <Center aspectRatio="4 / 3" color="fg.subtle" fontSize="xl">
                <FaPhotoVideo />
              </Center>
            )}
          </Box>
          <Stack gap="3" h="full" p="5">
            <Wrap
              gap="2"
              rowGap="0.5"
              color="fg.subtle"
              fontFamily="JetBrains Mono, monospace"
              fontSize="xs"
            >
              {category?.name && <Text>{category.name}</Text>}
              {category?.name && date && <Text>|</Text>}
              <Text>{date && formatMonthYear(parseDate(date), locale)}</Text>
            </Wrap>
            <Text
              as="h3"
              fontFamily="Newsreader, serif"
              fontSize="3xl"
              lineHeight="0.95"
              fontStyle="italic"
            >
              {title}
            </Text>
            <Text color="fg.muted" fontSize="sm" lineHeight="1.7">
              {description}
            </Text>
          </Stack>
        </Stack>
      </Link>
      <Wrap w="full" p="4" pt="0">
        {link?.url && (
          <Link href={link?.url} target="_blank">
            <IconButton size="xs" variant="subtle" border="1px solid" borderColor="border.subtle">
              <FaGlobe />
            </IconButton>
          </Link>
        )}
        {ghLink?.url && (
          <Link href={ghLink.url} target="_blank">
            <IconButton size="xs" variant="subtle" border="1px solid" borderColor="border.subtle">
              <FaGithub />
            </IconButton>
          </Link>
        )}
      </Wrap>
    </Stack>
  );
};
