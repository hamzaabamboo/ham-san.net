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

export type HobbyEmbedTranslationKey = `hobbies.${EmbedCopyKey}`;
export type HobbyMetricTranslationKey = `hobbies.${MetricCopyKey}`;
export type HobbyTranslationKey = `hobbies.${EmbedCopyKey | MetricCopyKey}`;

type Translate = (key: HobbyEmbedTranslationKey) => unknown;
type MetricTranslate = (key: HobbyMetricTranslationKey) => unknown;

const getCopyKey = (type: string | undefined, field: 'label' | 'description'): EmbedCopyKey =>
  embedCopyKeys[type as keyof typeof embedCopyKeys]?.[field] ?? fallbackCopyKeys[field];

const translate = (t: Translate, key: EmbedCopyKey) => String(t(`hobbies.${key}`));

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

export const getHobbyOverviewSummary = ({
  hasSource,
  value,
  t
}: {
  hasSource: boolean;
  value?: string;
  t: Translate;
}) => {
  if (!hasSource) return translate(t, fallbackCopyKeys.emptyOverview);

  const source = value?.trim();
  if (!source) return '';
  if (genericSummaryPatterns.some((pattern) => pattern.test(source))) return '';
  return source;
};

export const formatHobbyUpdated = ({
  date,
  locale,
  noDateLabel
}: {
  date?: string | null;
  locale?: string;
  noDateLabel: string;
}) => {
  const parsed = date ? new Date(date) : null;
  return parsed && !Number.isNaN(parsed.getTime())
    ? new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'Asia/Tokyo',
        calendar: 'gregory'
      }).format(parsed)
    : noDateLabel;
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
  const template = String(t(`hobbies.${key}`));
  const value = new Intl.NumberFormat(locale || 'en').format(count);
  return template.includes('{count}') ? template.replace('{count}', value) : `${value} ${template}`;
};
