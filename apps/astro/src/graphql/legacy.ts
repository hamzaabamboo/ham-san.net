type AnyObj = Record<string, any>;
type AnyObjArray = AnyObj[] | null | undefined;

const wrapEntity = (attributes: AnyObj | null | undefined, id?: string | null) => ({
  id: id ?? attributes?.id ?? attributes?.documentId ?? null,
  attributes: attributes ?? null
});

const wrapOne = (value: AnyObj | null | undefined) => ({
  data: value ? wrapEntity(value) : null
});

const wrapMany = (
  items: AnyObj[] | null | undefined,
  map?: (v: AnyObj) => AnyObj | null | undefined
) => ({
  data: (items ?? []).map((item) => wrapEntity(map ? (map(item) ?? item) : item))
});

const mapMedia = (value: AnyObj | null | undefined) => (value ? { ...value } : value);

const mapTag = (value: AnyObj) => ({
  ...value,
  projects: wrapMany(value.projects, mapProject),
  experiences: wrapMany(value.experiences, mapExperience)
});

const mapExperience = (value: AnyObj) => ({
  ...value,
  tags: wrapMany(value.tags, mapTag),
  localizations: wrapMany(value.localizations, mapExperience)
});

const mapEducation = (value: AnyObj) => ({
  ...value,
  localizations: wrapMany(value.localizations, mapEducation)
});

const mapProject = (value: AnyObj) => ({
  ...value,
  category: wrapOne(value.category),
  media: wrapMany(value.media, mapMedia),
  tags: wrapMany(value.tags, mapTag),
  banner: wrapOne(mapMedia(value.banner)),
  localizations: wrapMany(value.localizations, mapProject)
});

export const toLegacyFetchAboutMe = (data: AnyObj) => ({
  aboutMe: wrapOne(data.aboutMe),
  experiences: wrapMany(data.experiences as AnyObjArray, mapExperience),
  educations: wrapMany(data.educations as AnyObjArray, mapEducation),
  tags: wrapMany(data.tags as AnyObjArray, mapTag)
});

export const toLegacyFetchProjects = (data: AnyObj) => ({
  projects: wrapMany(data.projects as AnyObjArray, mapProject)
});

export const toLegacyGetProjectBySlug = (data: AnyObj) => ({
  projects: wrapMany(data.projects as AnyObjArray, mapProject)
});

export const toLegacyGetTagBySlug = (data: AnyObj) => ({
  tags: wrapMany(data.tags as AnyObjArray, mapTag)
});
