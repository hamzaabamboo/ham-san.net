type AnyObj = Record<string, any>;
type Entity = { id: string | null; attributes: AnyObj | null };
type EntityResponse = { data: Entity | null };
type EntityCollection = { data: Entity[] };

const isObject = (value: unknown): value is AnyObj => typeof value === 'object' && value !== null;

const hasData = (value: unknown): value is { data: unknown } =>
  isObject(value) && Object.prototype.hasOwnProperty.call(value, 'data');

const toEntity = (value: unknown): Entity | null => {
  if (!isObject(value)) return null;
  if (hasData(value)) return toEntity(value.data);
  if ('attributes' in value) {
    return {
      id: (value.id as string | null | undefined) ?? null,
      attributes: (value.attributes as AnyObj | null | undefined) ?? null
    };
  }
  return {
    id: (value.id as string | null | undefined) ?? (value.documentId as string | null | undefined) ?? null,
    attributes: value
  };
};

const toResponse = (value: unknown, map?: (v: AnyObj) => AnyObj): EntityResponse => {
  const entity = toEntity(value);
  if (!entity) return { data: null };
  return {
    data: {
      id: entity.id,
      attributes: entity.attributes ? (map ? map(entity.attributes) : entity.attributes) : null
    }
  };
};

const toCollection = (value: unknown, map?: (v: AnyObj) => AnyObj): EntityCollection => {
  const source = hasData(value) ? value.data : value;
  const entries = Array.isArray(source) ? source : [];
  return {
    data: entries
      .map((entry) => toEntity(entry))
      .filter((entry): entry is Entity => entry !== null)
      .map((entry) => ({
        id: entry.id,
        attributes: entry.attributes ? (map ? map(entry.attributes) : entry.attributes) : null
      }))
  };
};

const mapMedia = (value: AnyObj) => ({ ...value });

const mapTag = (value: AnyObj) => ({
  ...value,
  projects: toCollection(value.projects, mapProject),
  experiences: toCollection(value.experiences, mapExperience)
});

const mapExperience = (value: AnyObj) => ({
  ...value,
  tags: toCollection(value.tags, mapTag),
  localizations: toCollection(value.localizations, mapExperience)
});

const mapEducation = (value: AnyObj) => ({
  ...value,
  localizations: toCollection(value.localizations, mapEducation)
});

const mapProject = (value: AnyObj) => ({
  ...value,
  category: toResponse(value.category),
  media: toCollection(value.media, mapMedia),
  tags: toCollection(value.tags, mapTag),
  banner: toResponse(value.banner, mapMedia),
  localizations: toCollection(value.localizations, mapProject)
});

export const toLegacyFetchAboutMe = (data: AnyObj) => ({
  aboutMe: toResponse(data.aboutMe),
  experiences: toCollection(data.experiences, mapExperience),
  educations: toCollection(data.educations, mapEducation),
  tags: toCollection(data.tags, mapTag)
});

export const toLegacyFetchProjects = (data: AnyObj) => ({
  projects: toCollection(data.projects, mapProject)
});

export const toLegacyGetProjectBySlug = (data: AnyObj) => ({
  projects: toCollection(data.projects, mapProject)
});

export const toLegacyGetTagBySlug = (data: AnyObj) => ({
  tags: toCollection(data.tags, mapTag)
});
