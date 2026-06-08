const embedCopyKeys = {
  'photo-gallery': {
    label: 'embed-photo-gallery',
    description: 'embed-photo-gallery-description'
  },
  'twitter-feed': {
    label: 'embed-twitter-feed',
    description: 'embed-twitter-feed-description'
  },
  'rubik-algorithms': {
    label: 'embed-rubik-algorithms',
    description: 'embed-rubik-algorithms-description'
  },
  'typing-stats': {
    label: 'embed-typing-stats',
    description: 'embed-typing-stats-description'
  },
  'darts-board': {
    label: 'embed-darts-board',
    description: 'embed-darts-board-description'
  },
  'link-library': {
    label: 'embed-link-library',
    description: 'embed-link-library-description'
  },
  'piano-chords': {
    label: 'embed-piano-chords',
    description: 'embed-piano-chords-description'
  }
} as const;

const fallbackCopyKeys = {
  label: 'embed-field-notes',
  description: 'embed-field-notes-description',
  emptyLabel: 'embed-empty-page'
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
  | (typeof fallbackCopyKeys)['label']
  | (typeof fallbackCopyKeys)['description']
  | (typeof fallbackCopyKeys)['emptyLabel'];

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

const hasLatinWords = (value: string) => /[A-Za-z]{3}/.test(value);
const hasCjkOrThaiText = (value: string) => /[\u0E00-\u0E7F\u3040-\u30ff\u3400-\u9fff]/.test(value);

export const getHobbyEmbedLabel = (t: Translate, type?: string) =>
  translate(t, getCopyKey(type, 'label'));

export const getHobbyEmbedDescription = (t: Translate, type?: string) =>
  translate(t, getCopyKey(type, 'description'));

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
