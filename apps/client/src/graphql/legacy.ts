type AnyObj = Record<string, any>;

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

const mapBlog = (value: AnyObj) => ({
  ...value,
  category: wrapOne(value.category),
  thumbnail: wrapOne(mapMedia(value.thumbnail)),
  tags: wrapMany(value.tags, mapTag),
  banner: wrapOne(mapMedia(value.banner)),
  localizations: wrapMany(value.localizations, mapBlog)
});

export const toLegacyFetchHomePage = (data: AnyObj) => ({
  projects: wrapMany(data.projects, mapProject),
  homepage: wrapOne({
    ...data.homepage,
    introductionImage: wrapOne(mapMedia(data.homepage?.introductionImage)),
    heroImage: wrapOne(mapMedia(data.homepage?.heroImage))
  })
});

export const toLegacyFetchAboutMe = (data: AnyObj) => ({
  aboutMe: wrapOne(data.aboutMe),
  experiences: wrapMany(data.experiences, mapExperience),
  educations: wrapMany(data.educations, mapEducation),
  tags: wrapMany(data.tags, mapTag)
});

export const toLegacyFetchProjects = (data: AnyObj) => ({
  projects: wrapMany(data.projects, mapProject)
});

export const toLegacyGetProjectBySlug = (data: AnyObj) => ({
  projects: wrapMany(data.projects, mapProject)
});

export const toLegacyFetchBlogPosts = (data: AnyObj) => ({
  blogs: wrapMany(data.blogs, mapBlog)
});

export const toLegacyGetBlogPostBySlug = (data: AnyObj) => ({
  blogs: wrapMany(data.blogs, mapBlog)
});

export const toLegacyGetTagBySlug = (data: AnyObj) => ({
  tags: wrapMany(data.tags, mapTag)
});
