import { FaArrowRight, FaGithub, FaGlobe } from 'react-icons/fa';
import { Box, Center, Stack, styled, Wrap } from 'styled-system/jsx';
import { formatMonthYear, parseDate } from 'utils/date';
import { resolveMedia } from 'utils/media';
import { projectMonogram } from '~/utils/monogram';
import { Enum_Componentutilslink_Type } from '~/graphql/generated/client';
import { Languages } from '~/i18n/ui';
import { useTranslations } from '~/i18n/utils';
import { IconButton } from '../ui/icon-button';
import { Link } from '../ui/link';
import { Text } from '../ui/text';

type MediaFile = {
  name: string;
  url: string;
  width?: number | null;
  height?: number | null;
  formats?: unknown;
};
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
  const t = useTranslations(locale);
  const { title, description, slug, date, links } = data;
  const category =
    data.category && 'name' in data.category
      ? data.category
      : (data.category as LegacyWrapped<{ name?: string | null }> | null)?.data?.attributes;
  const image = extractMedia(data.banner, data.media);
  const resolved = resolveMedia(image, 400, import.meta.env.PUBLIC_API_URL);
  const link = links?.find((l) => l?.type === Enum_Componentutilslink_Type.Web);
  const ghLink = links?.find((l) => l?.type === Enum_Componentutilslink_Type.Github);

  return (
    <Stack
      className="group"
      border="1px solid"
      borderColor="var(--atelier-line)"
      h="full"
      bg="var(--atelier-bg)"
    >
      <Link
        href={`/${locale}/projects/${slug}`}
        data-astro-prefetch="hover"
        display="block"
        flex={1}
      >
        <Stack gap="0" h="full">
          {/* Overlaid on the media, not stacked above it: a 33px band pushed archived cards
              down, so a five-across row showed three different title baselines. */}
          <Box
            position="relative"
            flexShrink={0}
            borderColor="var(--atelier-line)"
            borderBottom="1px solid"
            backgroundColor="var(--atelier-surface-highest)"
            overflow="hidden"
          >
            {!data.isActive && (
              <Box
                zIndex="1"
                position="absolute"
                top="0"
                left="0"
                borderColor="var(--atelier-line)"
                borderRight="1px solid"
                borderBottom="1px solid"
                py="1.5"
                px="3"
                color="var(--atelier-fg-muted)"
                fontFamily="var(--font-code)"
                fontSize="10px"
                letterSpacing="0.12em"
                textTransform="uppercase"
                bg="var(--atelier-bg)"
              >
                {t('project.card-archive')}
              </Box>
            )}
            {image && resolved ? (
              <styled.img
                src={resolved.src}
                alt={image.name}
                htmlWidth={800}
                htmlHeight={600}
                loading="lazy"
                decoding="async"
                aspectRatio="4 / 3"
                objectPosition="center"
                objectFit="cover"
                width="full"
                transition="transform 0.3s ease, filter 0.3s ease"
                filter="var(--atelier-image-rest)"
                _groupHover={{ transform: 'scale(1.03)', filter: 'var(--atelier-image-hover)' }}
              />
            ) : (
              <Box
                className="fallback-grid-lines"
                position="relative"
                aspectRatio="4 / 3"
                overflow="hidden"
              >
                <Center inset="0" position="absolute">
                  <Text
                    color="var(--atelier-fg)"
                    fontFamily="var(--font-display)"
                    fontSize="96px"
                    lineHeight="1"
                    opacity="0.06"
                    userSelect="none"
                    transition="opacity 0.3s ease"
                    fontStyle="italic"
                    _groupHover={{ opacity: 0.1 }}
                  >
                    {projectMonogram(title)}
                  </Text>
                </Center>
                <Box
                  position="absolute"
                  left="0"
                  right="0"
                  bottom="0"
                  h="2px"
                  bg="var(--atelier-line)"
                  transition="background-color 0.3s ease"
                  _groupHover={{ bg: 'var(--atelier-accent)' }}
                />
              </Box>
            )}
          </Box>
          <Stack flex="1" gap="3" p="5">
            {/* Reserves two lines: in a narrow column "Side Project | October 2020" wraps
                while "School Work | May 2015" does not, and the 20px difference put the
                titles of one row on two baselines. */}
            <Wrap
              gap="2"
              rowGap="0.5"
              alignContent="start"
              minH="2.4rem"
              color="var(--atelier-outline)"
              fontFamily="var(--font-code)"
              fontSize="xs"
            >
              {category?.name && <Text>{category.name}</Text>}
              {category?.name && date && <Text>|</Text>}
              <Text>{date && formatMonthYear(parseDate(date), locale)}</Text>
            </Wrap>
            <Text
              as="h3"
              fontFamily="var(--font-body)"
              fontSize="xl"
              fontWeight="bold"
              letterSpacing="-0.02em"
              lineHeight="1.1"
              textTransform="uppercase"
            >
              {title}
            </Text>
            <Text color="var(--atelier-fg-muted)" fontSize="sm" lineHeight="1.7">
              {description}
            </Text>
            <Wrap
              gap="2"
              alignItems="center"
              marginTop="auto"
              color="var(--atelier-accent)"
              fontFamily="var(--font-code)"
              fontSize="10px"
              letterSpacing="0.12em"
              textTransform="uppercase"
            >
              <Text>{t('project.open-project')}</Text>
              <FaArrowRight />
            </Wrap>
          </Stack>
        </Stack>
      </Link>
      {/* Reserves the icon row's height even when a project has no external links. Without
          it the sibling collapses, the link stack above absorbs the slack, and the bottom-
          pinned CTA drops ~32px below its neighbours in the same grid row. */}
      <Wrap alignItems="center" w="full" minH="3rem" p="4" pt="0">
        {link?.url && (
          <IconButton
            asChild
            size="xs"
            variant="ghost"
            border="1px solid"
            borderColor="var(--atelier-surface-high)"
            color="var(--atelier-fg-muted)"
            bg="transparent"
            _hover={{
              bg: 'transparent',
              borderColor: 'var(--atelier-accent)',
              color: 'var(--atelier-accent)'
            }}
          >
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              aria-label={t('project.visit-site')}
            >
              <FaGlobe />
            </a>
          </IconButton>
        )}
        {ghLink?.url && (
          <IconButton
            asChild
            size="xs"
            variant="ghost"
            border="1px solid"
            borderColor="var(--atelier-surface-high)"
            color="var(--atelier-fg-muted)"
            bg="transparent"
            _hover={{
              bg: 'transparent',
              borderColor: 'var(--atelier-accent)',
              color: 'var(--atelier-accent)'
            }}
          >
            <a
              href={ghLink.url}
              target="_blank"
              rel="noreferrer"
              aria-label={t('project.source-code')}
            >
              <FaGithub />
            </a>
          </IconButton>
        )}
      </Wrap>
    </Stack>
  );
};
