const embedCopyKeys = {
  'photo-gallery': {
    label: 'embed-photo-gallery',
    description: 'embed-photo-gallery-description',
    overview: 'overview-photo-gallery'
  },
  'twitter-feed': {
    label: 'embed-twitter-feed',
    description: 'embed-twitter-feed-description',
    overview: 'overview-twitter-feed'
  },
  'rubik-algorithms': {
    label: 'embed-rubik-algorithms',
    description: 'embed-rubik-algorithms-description',
    overview: 'overview-rubik-algorithms'
  },
  'typing-stats': {
    label: 'embed-typing-stats',
    description: 'embed-typing-stats-description',
    overview: 'overview-typing-stats'
  },
  'darts-board': {
    label: 'embed-darts-board',
    description: 'embed-darts-board-description',
    overview: 'overview-darts-board'
  },
  'link-library': {
    label: 'embed-link-library',
    description: 'embed-link-library-description',
    overview: 'overview-link-library'
  },
  'piano-chords': {
    label: 'embed-piano-chords',
    description: 'embed-piano-chords-description',
    overview: 'overview-piano-chords'
  }
} as const;

const fallbackCopyKeys = {
  label: 'embed-field-notes',
  description: 'embed-field-notes-description',
  overview: 'overview-field-notes',
  emptyLabel: 'embed-empty-page',
  emptyOverview: 'overview-empty-page'
} as const;

const metricCopyKeys = {
  link: {
    singular: 'metric-link',
    plural: 'metric-links'
  },
  page: {
    singular: 'metric-page',
    plural: 'metric-pages'
  }
} as const;

const sourceHeadingCopyKeys = {
  body: 'source-heading-body',
  lens: 'source-heading-lens',
  'lens review': 'source-heading-lens-review',
  'lens references': 'source-heading-lens-references',
  'interested in': 'source-heading-interested-in',
  'rental shop': 'source-heading-rental-shop',
  'venue / live photo notes': 'source-heading-venue-live-photo-notes',
  added: 'source-heading-added'
} as const;

type EmbedCopyKey =
  | (typeof embedCopyKeys)[keyof typeof embedCopyKeys]['label']
  | (typeof embedCopyKeys)[keyof typeof embedCopyKeys]['description']
  | (typeof embedCopyKeys)[keyof typeof embedCopyKeys]['overview']
  | (typeof fallbackCopyKeys)['label']
  | (typeof fallbackCopyKeys)['description']
  | (typeof fallbackCopyKeys)['overview']
  | (typeof fallbackCopyKeys)['emptyLabel']
  | (typeof fallbackCopyKeys)['emptyOverview'];

type MetricCopyKey =
  | (typeof metricCopyKeys)[keyof typeof metricCopyKeys]['singular']
  | (typeof metricCopyKeys)[keyof typeof metricCopyKeys]['plural'];
type SourceHeadingCopyKey = (typeof sourceHeadingCopyKeys)[keyof typeof sourceHeadingCopyKeys];

export type HobbyEmbedTranslationKey = `hobbies.${EmbedCopyKey}`;
export type HobbyMetricTranslationKey = `hobbies.${MetricCopyKey}`;
export type HobbySourceHeadingTranslationKey = `hobbies.${SourceHeadingCopyKey}`;
export type HobbyTranslationKey = `hobbies.${EmbedCopyKey | MetricCopyKey | SourceHeadingCopyKey}`;

type Translate = (key: HobbyEmbedTranslationKey) => unknown;
type MetricTranslate = (key: HobbyMetricTranslationKey) => unknown;
type SourceHeadingTranslate = (key: HobbySourceHeadingTranslationKey) => unknown;

const getCopyKey = (type: string | undefined, field: 'label' | 'description'): EmbedCopyKey =>
  embedCopyKeys[type as keyof typeof embedCopyKeys]?.[field] ?? fallbackCopyKeys[field];

const translate = (t: Translate, key: EmbedCopyKey) => String(t(`hobbies.${key}`));

const hasLatinWords = (value: string) => /[A-Za-z]{3}/.test(value);
const hasCjkOrThaiText = (value: string) => /[\u0E00-\u0E7F\u3040-\u30ff\u3400-\u9fff]/.test(value);
const genericSummaryPatterns = [
  /^links?\.?$/i,
  /^profiles? and links?\.?$/i,
  /^stats? and gear\.?$/i,
  /^gear and resources?\.?$/i,
  /^pictures?, gear, and lens references\b/i,
  /^parked for now\.?$/i
];

export const getHobbyEmbedLabel = (t: Translate, type?: string) =>
  translate(t, getCopyKey(type, 'label'));

export const getHobbyEmbedDescription = (t: Translate, type?: string) =>
  translate(t, getCopyKey(type, 'description'));

export const getHobbyOverviewDescription = (t: Translate, type?: string) =>
  translate(
    t,
    embedCopyKeys[type as keyof typeof embedCopyKeys]?.overview ?? fallbackCopyKeys.overview
  );

export const getHobbyContentLabel = ({
  hasSource,
  type,
  t
}: {
  hasSource: boolean;
  type?: string;
  t: Translate;
}) => (hasSource ? getHobbyEmbedLabel(t, type) : translate(t, fallbackCopyKeys.emptyLabel));

export const shouldLocalizeHobbySummary = (locale: string | undefined, value?: string) =>
  locale !== 'en' && !!value && hasLatinWords(value) && !hasCjkOrThaiText(value);

export const getLocalizedHobbySummary = ({
  locale,
  value,
  type,
  t
}: {
  locale: string | undefined;
  value?: string;
  type?: string;
  t: Translate;
}) => (shouldLocalizeHobbySummary(locale, value) ? getHobbyEmbedDescription(t, type) : value);

export const getHobbyOverviewSummary = ({
  hasSource,
  locale,
  value,
  type,
  t
}: {
  hasSource: boolean;
  locale: string | undefined;
  value?: string;
  type?: string;
  t: Translate;
}) => {
  if (!hasSource) return translate(t, fallbackCopyKeys.emptyOverview);

  const source = value?.trim();
  if (source && genericSummaryPatterns.some((pattern) => pattern.test(source))) {
    return getHobbyOverviewDescription(t, type);
  }

  const localized = getLocalizedHobbySummary({ locale, value, type, t })?.trim();
  if (!localized) return getHobbyOverviewDescription(t, type);
  if (genericSummaryPatterns.some((pattern) => pattern.test(localized))) {
    return getHobbyOverviewDescription(t, type);
  }
  return localized;
};

export const localizeHobbyMarkdownHeadings = ({
  content,
  locale,
  t
}: {
  content: string;
  locale: string | undefined;
  t: SourceHeadingTranslate;
}) => {
  if (locale === 'en') return content;

  return content.replace(/^(#{1,6})\s+(.+)$/gm, (match, marks: string, rawHeading: string) => {
    const suffix = rawHeading.match(/\s+\(added\s+([^)]+)\)\s*$/i);
    const heading = suffix ? rawHeading.slice(0, suffix.index).trim() : rawHeading;
    const key =
      sourceHeadingCopyKeys[
        heading
          .replace(/[*_`]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .toLowerCase() as keyof typeof sourceHeadingCopyKeys
      ];
    if (!key) return match;

    const localizedHeading = String(t(`hobbies.${key}`));
    if (!suffix) return `${marks} ${localizedHeading}`;
    return `${marks} ${localizedHeading} (${String(t('hobbies.source-heading-added'))} ${suffix[1]})`;
  });
};

export const getHobbyCountLabel = ({
  count,
  locale,
  type,
  t
}: {
  count: number;
  locale?: string;
  type: keyof typeof metricCopyKeys;
  t: MetricTranslate;
}) => {
  const key = count === 1 ? metricCopyKeys[type].singular : metricCopyKeys[type].plural;
  const value = new Intl.NumberFormat(locale || 'en').format(count);
  return `${value} ${String(t(`hobbies.${key}`))}`;
};
