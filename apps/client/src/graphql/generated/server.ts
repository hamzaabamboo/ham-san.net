import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: any;
  I18NLocaleCode: any;
  JSON: any;
  Upload: any;
};

export type AboutMe = {
  __typename?: 'AboutMe';
  createdAt?: Maybe<Scalars['DateTime']>;
  introduction?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
  localizations?: Maybe<AboutMeRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};


export type AboutMeLocalizationsArgs = {
  publicationState?: InputMaybe<PublicationState>;
};

export type AboutMeEntity = {
  __typename?: 'AboutMeEntity';
  attributes?: Maybe<AboutMe>;
  id?: Maybe<Scalars['ID']>;
};

export type AboutMeEntityResponse = {
  __typename?: 'AboutMeEntityResponse';
  data?: Maybe<AboutMeEntity>;
};

export type AboutMeInput = {
  introduction?: InputMaybe<Scalars['String']>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
};

export type AboutMeRelationResponseCollection = {
  __typename?: 'AboutMeRelationResponseCollection';
  data: Array<AboutMeEntity>;
};

export type Blog = {
  __typename?: 'Blog';
  banner?: Maybe<UploadFileEntityResponse>;
  category?: Maybe<CategoryEntityResponse>;
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
  localizations?: Maybe<BlogRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  slug?: Maybe<Scalars['String']>;
  tags?: Maybe<TagRelationResponseCollection>;
  thumbnail?: Maybe<UploadFileEntityResponse>;
  title?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};


export type BlogLocalizationsArgs = {
  filters?: InputMaybe<BlogFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type BlogTagsArgs = {
  filters?: InputMaybe<TagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type BlogEntity = {
  __typename?: 'BlogEntity';
  attributes?: Maybe<Blog>;
  id?: Maybe<Scalars['ID']>;
};

export type BlogEntityResponse = {
  __typename?: 'BlogEntityResponse';
  data?: Maybe<BlogEntity>;
};

export type BlogEntityResponseCollection = {
  __typename?: 'BlogEntityResponseCollection';
  data: Array<BlogEntity>;
  meta: ResponseCollectionMeta;
};

export type BlogFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<BlogFiltersInput>>>;
  category?: InputMaybe<CategoryFiltersInput>;
  content?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<BlogFiltersInput>;
  not?: InputMaybe<BlogFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<BlogFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  slug?: InputMaybe<StringFilterInput>;
  tags?: InputMaybe<TagFiltersInput>;
  title?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type BlogInput = {
  banner?: InputMaybe<Scalars['ID']>;
  category?: InputMaybe<Scalars['ID']>;
  content?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  slug?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  thumbnail?: InputMaybe<Scalars['ID']>;
  title?: InputMaybe<Scalars['String']>;
};

export type BlogRelationResponseCollection = {
  __typename?: 'BlogRelationResponseCollection';
  data: Array<BlogEntity>;
};

export type BooleanFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
  contains?: InputMaybe<Scalars['Boolean']>;
  containsi?: InputMaybe<Scalars['Boolean']>;
  endsWith?: InputMaybe<Scalars['Boolean']>;
  eq?: InputMaybe<Scalars['Boolean']>;
  eqi?: InputMaybe<Scalars['Boolean']>;
  gt?: InputMaybe<Scalars['Boolean']>;
  gte?: InputMaybe<Scalars['Boolean']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
  lt?: InputMaybe<Scalars['Boolean']>;
  lte?: InputMaybe<Scalars['Boolean']>;
  ne?: InputMaybe<Scalars['Boolean']>;
  nei?: InputMaybe<Scalars['Boolean']>;
  not?: InputMaybe<BooleanFilterInput>;
  notContains?: InputMaybe<Scalars['Boolean']>;
  notContainsi?: InputMaybe<Scalars['Boolean']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
  notNull?: InputMaybe<Scalars['Boolean']>;
  null?: InputMaybe<Scalars['Boolean']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
  startsWith?: InputMaybe<Scalars['Boolean']>;
};

export type Category = {
  __typename?: 'Category';
  blogs?: Maybe<BlogRelationResponseCollection>;
  createdAt?: Maybe<Scalars['DateTime']>;
  locale?: Maybe<Scalars['String']>;
  localizations?: Maybe<CategoryRelationResponseCollection>;
  name?: Maybe<Scalars['String']>;
  projects?: Maybe<ProjectRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};


export type CategoryBlogsArgs = {
  filters?: InputMaybe<BlogFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type CategoryLocalizationsArgs = {
  filters?: InputMaybe<CategoryFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type CategoryProjectsArgs = {
  filters?: InputMaybe<ProjectFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CategoryEntity = {
  __typename?: 'CategoryEntity';
  attributes?: Maybe<Category>;
  id?: Maybe<Scalars['ID']>;
};

export type CategoryEntityResponse = {
  __typename?: 'CategoryEntityResponse';
  data?: Maybe<CategoryEntity>;
};

export type CategoryEntityResponseCollection = {
  __typename?: 'CategoryEntityResponseCollection';
  data: Array<CategoryEntity>;
  meta: ResponseCollectionMeta;
};

export type CategoryFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<CategoryFiltersInput>>>;
  blogs?: InputMaybe<BlogFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<CategoryFiltersInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<CategoryFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<CategoryFiltersInput>>>;
  projects?: InputMaybe<ProjectFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type CategoryInput = {
  blogs?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  name?: InputMaybe<Scalars['String']>;
  projects?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
};

export type CategoryRelationResponseCollection = {
  __typename?: 'CategoryRelationResponseCollection';
  data: Array<CategoryEntity>;
};

export type ComponentUtilsLink = {
  __typename?: 'ComponentUtilsLink';
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Enum_Componentutilslink_Type>;
  url?: Maybe<Scalars['String']>;
};

export type ComponentUtilsLinkFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentUtilsLinkFiltersInput>>>;
  not?: InputMaybe<ComponentUtilsLinkFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentUtilsLinkFiltersInput>>>;
  title?: InputMaybe<StringFilterInput>;
  type?: InputMaybe<StringFilterInput>;
  url?: InputMaybe<StringFilterInput>;
};

export type ComponentUtilsLinkInput = {
  id?: InputMaybe<Scalars['ID']>;
  title?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Enum_Componentutilslink_Type>;
  url?: InputMaybe<Scalars['String']>;
};

export type DateFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Date']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Date']>>>;
  contains?: InputMaybe<Scalars['Date']>;
  containsi?: InputMaybe<Scalars['Date']>;
  endsWith?: InputMaybe<Scalars['Date']>;
  eq?: InputMaybe<Scalars['Date']>;
  eqi?: InputMaybe<Scalars['Date']>;
  gt?: InputMaybe<Scalars['Date']>;
  gte?: InputMaybe<Scalars['Date']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Date']>>>;
  lt?: InputMaybe<Scalars['Date']>;
  lte?: InputMaybe<Scalars['Date']>;
  ne?: InputMaybe<Scalars['Date']>;
  nei?: InputMaybe<Scalars['Date']>;
  not?: InputMaybe<DateFilterInput>;
  notContains?: InputMaybe<Scalars['Date']>;
  notContainsi?: InputMaybe<Scalars['Date']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Date']>>>;
  notNull?: InputMaybe<Scalars['Boolean']>;
  null?: InputMaybe<Scalars['Boolean']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Date']>>>;
  startsWith?: InputMaybe<Scalars['Date']>;
};

export type DateTimeFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  contains?: InputMaybe<Scalars['DateTime']>;
  containsi?: InputMaybe<Scalars['DateTime']>;
  endsWith?: InputMaybe<Scalars['DateTime']>;
  eq?: InputMaybe<Scalars['DateTime']>;
  eqi?: InputMaybe<Scalars['DateTime']>;
  gt?: InputMaybe<Scalars['DateTime']>;
  gte?: InputMaybe<Scalars['DateTime']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  lt?: InputMaybe<Scalars['DateTime']>;
  lte?: InputMaybe<Scalars['DateTime']>;
  ne?: InputMaybe<Scalars['DateTime']>;
  nei?: InputMaybe<Scalars['DateTime']>;
  not?: InputMaybe<DateTimeFilterInput>;
  notContains?: InputMaybe<Scalars['DateTime']>;
  notContainsi?: InputMaybe<Scalars['DateTime']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  notNull?: InputMaybe<Scalars['Boolean']>;
  null?: InputMaybe<Scalars['Boolean']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  startsWith?: InputMaybe<Scalars['DateTime']>;
};

export enum Enum_Componentutilslink_Type {
  Github = 'github',
  Others = 'others',
  Web = 'web'
}

export enum Enum_Tag_Type {
  Backend = 'Backend',
  Database = 'Database',
  DevOps = 'DevOps',
  Frontend = 'Frontend',
  NonDev = 'Non_Dev',
  Others = 'Others',
  ProgrammingLanguage = 'Programming_Language'
}

export type Education = {
  __typename?: 'Education';
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  end?: Maybe<Scalars['Date']>;
  locale?: Maybe<Scalars['String']>;
  localizations?: Maybe<EducationRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  start?: Maybe<Scalars['Date']>;
  title?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};


export type EducationLocalizationsArgs = {
  filters?: InputMaybe<EducationFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type EducationEntity = {
  __typename?: 'EducationEntity';
  attributes?: Maybe<Education>;
  id?: Maybe<Scalars['ID']>;
};

export type EducationEntityResponse = {
  __typename?: 'EducationEntityResponse';
  data?: Maybe<EducationEntity>;
};

export type EducationEntityResponseCollection = {
  __typename?: 'EducationEntityResponseCollection';
  data: Array<EducationEntity>;
  meta: ResponseCollectionMeta;
};

export type EducationFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<EducationFiltersInput>>>;
  content?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  end?: InputMaybe<DateFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<EducationFiltersInput>;
  not?: InputMaybe<EducationFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<EducationFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  start?: InputMaybe<DateFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type EducationInput = {
  content?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  end?: InputMaybe<Scalars['Date']>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  start?: InputMaybe<Scalars['Date']>;
  title?: InputMaybe<Scalars['String']>;
};

export type EducationRelationResponseCollection = {
  __typename?: 'EducationRelationResponseCollection';
  data: Array<EducationEntity>;
};

export type Experience = {
  __typename?: 'Experience';
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  end?: Maybe<Scalars['Date']>;
  locale?: Maybe<Scalars['String']>;
  localizations?: Maybe<ExperienceRelationResponseCollection>;
  position?: Maybe<Scalars['String']>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  slug?: Maybe<Scalars['String']>;
  start?: Maybe<Scalars['Date']>;
  tags?: Maybe<TagRelationResponseCollection>;
  title?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};


export type ExperienceLocalizationsArgs = {
  filters?: InputMaybe<ExperienceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type ExperienceTagsArgs = {
  filters?: InputMaybe<TagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ExperienceEntity = {
  __typename?: 'ExperienceEntity';
  attributes?: Maybe<Experience>;
  id?: Maybe<Scalars['ID']>;
};

export type ExperienceEntityResponse = {
  __typename?: 'ExperienceEntityResponse';
  data?: Maybe<ExperienceEntity>;
};

export type ExperienceEntityResponseCollection = {
  __typename?: 'ExperienceEntityResponseCollection';
  data: Array<ExperienceEntity>;
  meta: ResponseCollectionMeta;
};

export type ExperienceFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ExperienceFiltersInput>>>;
  content?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  end?: InputMaybe<DateFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<ExperienceFiltersInput>;
  not?: InputMaybe<ExperienceFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ExperienceFiltersInput>>>;
  position?: InputMaybe<StringFilterInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  slug?: InputMaybe<StringFilterInput>;
  start?: InputMaybe<DateFilterInput>;
  tags?: InputMaybe<TagFiltersInput>;
  title?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ExperienceInput = {
  content?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  end?: InputMaybe<Scalars['Date']>;
  position?: InputMaybe<Scalars['String']>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  slug?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Date']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  title?: InputMaybe<Scalars['String']>;
};

export type ExperienceRelationResponseCollection = {
  __typename?: 'ExperienceRelationResponseCollection';
  data: Array<ExperienceEntity>;
};

export type FileInfoInput = {
  alternativeText?: InputMaybe<Scalars['String']>;
  caption?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type FloatFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  contains?: InputMaybe<Scalars['Float']>;
  containsi?: InputMaybe<Scalars['Float']>;
  endsWith?: InputMaybe<Scalars['Float']>;
  eq?: InputMaybe<Scalars['Float']>;
  eqi?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  gte?: InputMaybe<Scalars['Float']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  lt?: InputMaybe<Scalars['Float']>;
  lte?: InputMaybe<Scalars['Float']>;
  ne?: InputMaybe<Scalars['Float']>;
  nei?: InputMaybe<Scalars['Float']>;
  not?: InputMaybe<FloatFilterInput>;
  notContains?: InputMaybe<Scalars['Float']>;
  notContainsi?: InputMaybe<Scalars['Float']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  notNull?: InputMaybe<Scalars['Boolean']>;
  null?: InputMaybe<Scalars['Boolean']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  startsWith?: InputMaybe<Scalars['Float']>;
};

export type GenericMorph = AboutMe | Blog | Category | ComponentUtilsLink | Education | Experience | Homepage | I18NLocale | Project | Tag | UploadFile | UploadFolder | UsersPermissionsPermission | UsersPermissionsRole | UsersPermissionsUser;

export type Homepage = {
  __typename?: 'Homepage';
  createdAt?: Maybe<Scalars['DateTime']>;
  hero?: Maybe<Scalars['String']>;
  heroImage?: Maybe<UploadFileEntityResponse>;
  heroSubtitle?: Maybe<Scalars['String']>;
  introduction?: Maybe<Scalars['String']>;
  introductionImage?: Maybe<UploadFileEntityResponse>;
  locale?: Maybe<Scalars['String']>;
  localizations?: Maybe<HomepageRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};


export type HomepageLocalizationsArgs = {
  publicationState?: InputMaybe<PublicationState>;
};

export type HomepageEntity = {
  __typename?: 'HomepageEntity';
  attributes?: Maybe<Homepage>;
  id?: Maybe<Scalars['ID']>;
};

export type HomepageEntityResponse = {
  __typename?: 'HomepageEntityResponse';
  data?: Maybe<HomepageEntity>;
};

export type HomepageInput = {
  hero?: InputMaybe<Scalars['String']>;
  heroImage?: InputMaybe<Scalars['ID']>;
  heroSubtitle?: InputMaybe<Scalars['String']>;
  introduction?: InputMaybe<Scalars['String']>;
  introductionImage?: InputMaybe<Scalars['ID']>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
};

export type HomepageRelationResponseCollection = {
  __typename?: 'HomepageRelationResponseCollection';
  data: Array<HomepageEntity>;
};

export type I18NLocale = {
  __typename?: 'I18NLocale';
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type I18NLocaleEntity = {
  __typename?: 'I18NLocaleEntity';
  attributes?: Maybe<I18NLocale>;
  id?: Maybe<Scalars['ID']>;
};

export type I18NLocaleEntityResponse = {
  __typename?: 'I18NLocaleEntityResponse';
  data?: Maybe<I18NLocaleEntity>;
};

export type I18NLocaleEntityResponseCollection = {
  __typename?: 'I18NLocaleEntityResponseCollection';
  data: Array<I18NLocaleEntity>;
  meta: ResponseCollectionMeta;
};

export type I18NLocaleFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<I18NLocaleFiltersInput>>>;
  code?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<I18NLocaleFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<I18NLocaleFiltersInput>>>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type IdFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  contains?: InputMaybe<Scalars['ID']>;
  containsi?: InputMaybe<Scalars['ID']>;
  endsWith?: InputMaybe<Scalars['ID']>;
  eq?: InputMaybe<Scalars['ID']>;
  eqi?: InputMaybe<Scalars['ID']>;
  gt?: InputMaybe<Scalars['ID']>;
  gte?: InputMaybe<Scalars['ID']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  lt?: InputMaybe<Scalars['ID']>;
  lte?: InputMaybe<Scalars['ID']>;
  ne?: InputMaybe<Scalars['ID']>;
  nei?: InputMaybe<Scalars['ID']>;
  not?: InputMaybe<IdFilterInput>;
  notContains?: InputMaybe<Scalars['ID']>;
  notContainsi?: InputMaybe<Scalars['ID']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  notNull?: InputMaybe<Scalars['Boolean']>;
  null?: InputMaybe<Scalars['Boolean']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  startsWith?: InputMaybe<Scalars['ID']>;
};

export type IntFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  contains?: InputMaybe<Scalars['Int']>;
  containsi?: InputMaybe<Scalars['Int']>;
  endsWith?: InputMaybe<Scalars['Int']>;
  eq?: InputMaybe<Scalars['Int']>;
  eqi?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  ne?: InputMaybe<Scalars['Int']>;
  nei?: InputMaybe<Scalars['Int']>;
  not?: InputMaybe<IntFilterInput>;
  notContains?: InputMaybe<Scalars['Int']>;
  notContainsi?: InputMaybe<Scalars['Int']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  notNull?: InputMaybe<Scalars['Boolean']>;
  null?: InputMaybe<Scalars['Boolean']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  startsWith?: InputMaybe<Scalars['Int']>;
};

export type JsonFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  contains?: InputMaybe<Scalars['JSON']>;
  containsi?: InputMaybe<Scalars['JSON']>;
  endsWith?: InputMaybe<Scalars['JSON']>;
  eq?: InputMaybe<Scalars['JSON']>;
  eqi?: InputMaybe<Scalars['JSON']>;
  gt?: InputMaybe<Scalars['JSON']>;
  gte?: InputMaybe<Scalars['JSON']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  lt?: InputMaybe<Scalars['JSON']>;
  lte?: InputMaybe<Scalars['JSON']>;
  ne?: InputMaybe<Scalars['JSON']>;
  nei?: InputMaybe<Scalars['JSON']>;
  not?: InputMaybe<JsonFilterInput>;
  notContains?: InputMaybe<Scalars['JSON']>;
  notContainsi?: InputMaybe<Scalars['JSON']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  notNull?: InputMaybe<Scalars['Boolean']>;
  null?: InputMaybe<Scalars['Boolean']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  startsWith?: InputMaybe<Scalars['JSON']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Change user password. Confirm with the current password. */
  changePassword?: Maybe<UsersPermissionsLoginPayload>;
  createAboutMeLocalization?: Maybe<AboutMeEntityResponse>;
  createBlog?: Maybe<BlogEntityResponse>;
  createBlogLocalization?: Maybe<BlogEntityResponse>;
  createCategory?: Maybe<CategoryEntityResponse>;
  createCategoryLocalization?: Maybe<CategoryEntityResponse>;
  createEducation?: Maybe<EducationEntityResponse>;
  createEducationLocalization?: Maybe<EducationEntityResponse>;
  createExperience?: Maybe<ExperienceEntityResponse>;
  createExperienceLocalization?: Maybe<ExperienceEntityResponse>;
  createHomepageLocalization?: Maybe<HomepageEntityResponse>;
  createProject?: Maybe<ProjectEntityResponse>;
  createProjectLocalization?: Maybe<ProjectEntityResponse>;
  createTag?: Maybe<TagEntityResponse>;
  createTagLocalization?: Maybe<TagEntityResponse>;
  createUploadFile?: Maybe<UploadFileEntityResponse>;
  createUploadFolder?: Maybe<UploadFolderEntityResponse>;
  /** Create a new role */
  createUsersPermissionsRole?: Maybe<UsersPermissionsCreateRolePayload>;
  /** Create a new user */
  createUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  deleteAboutMe?: Maybe<AboutMeEntityResponse>;
  deleteBlog?: Maybe<BlogEntityResponse>;
  deleteCategory?: Maybe<CategoryEntityResponse>;
  deleteEducation?: Maybe<EducationEntityResponse>;
  deleteExperience?: Maybe<ExperienceEntityResponse>;
  deleteHomepage?: Maybe<HomepageEntityResponse>;
  deleteProject?: Maybe<ProjectEntityResponse>;
  deleteTag?: Maybe<TagEntityResponse>;
  deleteUploadFile?: Maybe<UploadFileEntityResponse>;
  deleteUploadFolder?: Maybe<UploadFolderEntityResponse>;
  /** Delete an existing role */
  deleteUsersPermissionsRole?: Maybe<UsersPermissionsDeleteRolePayload>;
  /** Delete an existing user */
  deleteUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  /** Confirm an email users email address */
  emailConfirmation?: Maybe<UsersPermissionsLoginPayload>;
  /** Request a reset password token */
  forgotPassword?: Maybe<UsersPermissionsPasswordPayload>;
  login: UsersPermissionsLoginPayload;
  multipleUpload: Array<Maybe<UploadFileEntityResponse>>;
  /** Register a user */
  register: UsersPermissionsLoginPayload;
  removeFile?: Maybe<UploadFileEntityResponse>;
  /** Reset user password. Confirm with a code (resetToken from forgotPassword) */
  resetPassword?: Maybe<UsersPermissionsLoginPayload>;
  updateAboutMe?: Maybe<AboutMeEntityResponse>;
  updateBlog?: Maybe<BlogEntityResponse>;
  updateCategory?: Maybe<CategoryEntityResponse>;
  updateEducation?: Maybe<EducationEntityResponse>;
  updateExperience?: Maybe<ExperienceEntityResponse>;
  updateFileInfo: UploadFileEntityResponse;
  updateHomepage?: Maybe<HomepageEntityResponse>;
  updateProject?: Maybe<ProjectEntityResponse>;
  updateTag?: Maybe<TagEntityResponse>;
  updateUploadFile?: Maybe<UploadFileEntityResponse>;
  updateUploadFolder?: Maybe<UploadFolderEntityResponse>;
  /** Update an existing role */
  updateUsersPermissionsRole?: Maybe<UsersPermissionsUpdateRolePayload>;
  /** Update an existing user */
  updateUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  upload: UploadFileEntityResponse;
};


export type MutationChangePasswordArgs = {
  currentPassword: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
};


export type MutationCreateAboutMeLocalizationArgs = {
  data?: InputMaybe<AboutMeInput>;
  id?: InputMaybe<Scalars['ID']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationCreateBlogArgs = {
  data: BlogInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationCreateBlogLocalizationArgs = {
  data?: InputMaybe<BlogInput>;
  id?: InputMaybe<Scalars['ID']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationCreateCategoryArgs = {
  data: CategoryInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationCreateCategoryLocalizationArgs = {
  data?: InputMaybe<CategoryInput>;
  id?: InputMaybe<Scalars['ID']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationCreateEducationArgs = {
  data: EducationInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationCreateEducationLocalizationArgs = {
  data?: InputMaybe<EducationInput>;
  id?: InputMaybe<Scalars['ID']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationCreateExperienceArgs = {
  data: ExperienceInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationCreateExperienceLocalizationArgs = {
  data?: InputMaybe<ExperienceInput>;
  id?: InputMaybe<Scalars['ID']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationCreateHomepageLocalizationArgs = {
  data?: InputMaybe<HomepageInput>;
  id?: InputMaybe<Scalars['ID']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationCreateProjectArgs = {
  data: ProjectInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationCreateProjectLocalizationArgs = {
  data?: InputMaybe<ProjectInput>;
  id?: InputMaybe<Scalars['ID']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationCreateTagArgs = {
  data: TagInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationCreateTagLocalizationArgs = {
  data?: InputMaybe<TagInput>;
  id?: InputMaybe<Scalars['ID']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationCreateUploadFileArgs = {
  data: UploadFileInput;
};


export type MutationCreateUploadFolderArgs = {
  data: UploadFolderInput;
};


export type MutationCreateUsersPermissionsRoleArgs = {
  data: UsersPermissionsRoleInput;
};


export type MutationCreateUsersPermissionsUserArgs = {
  data: UsersPermissionsUserInput;
};


export type MutationDeleteAboutMeArgs = {
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationDeleteBlogArgs = {
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationDeleteEducationArgs = {
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationDeleteExperienceArgs = {
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationDeleteHomepageArgs = {
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationDeleteTagArgs = {
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationDeleteUploadFileArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUploadFolderArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUsersPermissionsRoleArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUsersPermissionsUserArgs = {
  id: Scalars['ID'];
};


export type MutationEmailConfirmationArgs = {
  confirmation: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  input: UsersPermissionsLoginInput;
};


export type MutationMultipleUploadArgs = {
  field?: InputMaybe<Scalars['String']>;
  files: Array<InputMaybe<Scalars['Upload']>>;
  ref?: InputMaybe<Scalars['String']>;
  refId?: InputMaybe<Scalars['ID']>;
};


export type MutationRegisterArgs = {
  input: UsersPermissionsRegisterInput;
};


export type MutationRemoveFileArgs = {
  id: Scalars['ID'];
};


export type MutationResetPasswordArgs = {
  code: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
};


export type MutationUpdateAboutMeArgs = {
  data: AboutMeInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationUpdateBlogArgs = {
  data: BlogInput;
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationUpdateCategoryArgs = {
  data: CategoryInput;
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationUpdateEducationArgs = {
  data: EducationInput;
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationUpdateExperienceArgs = {
  data: ExperienceInput;
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationUpdateFileInfoArgs = {
  id: Scalars['ID'];
  info?: InputMaybe<FileInfoInput>;
};


export type MutationUpdateHomepageArgs = {
  data: HomepageInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationUpdateProjectArgs = {
  data: ProjectInput;
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationUpdateTagArgs = {
  data: TagInput;
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type MutationUpdateUploadFileArgs = {
  data: UploadFileInput;
  id: Scalars['ID'];
};


export type MutationUpdateUploadFolderArgs = {
  data: UploadFolderInput;
  id: Scalars['ID'];
};


export type MutationUpdateUsersPermissionsRoleArgs = {
  data: UsersPermissionsRoleInput;
  id: Scalars['ID'];
};


export type MutationUpdateUsersPermissionsUserArgs = {
  data: UsersPermissionsUserInput;
  id: Scalars['ID'];
};


export type MutationUploadArgs = {
  field?: InputMaybe<Scalars['String']>;
  file: Scalars['Upload'];
  info?: InputMaybe<FileInfoInput>;
  ref?: InputMaybe<Scalars['String']>;
  refId?: InputMaybe<Scalars['ID']>;
};

export type Pagination = {
  __typename?: 'Pagination';
  page: Scalars['Int'];
  pageCount: Scalars['Int'];
  pageSize: Scalars['Int'];
  total: Scalars['Int'];
};

export type PaginationArg = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  start?: InputMaybe<Scalars['Int']>;
};

export type Project = {
  __typename?: 'Project';
  banner?: Maybe<UploadFileEntityResponse>;
  category?: Maybe<CategoryEntityResponse>;
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  date?: Maybe<Scalars['Date']>;
  description?: Maybe<Scalars['String']>;
  finishedDate?: Maybe<Scalars['Date']>;
  isActive?: Maybe<Scalars['Boolean']>;
  isFeatured?: Maybe<Scalars['Boolean']>;
  links?: Maybe<Array<Maybe<ComponentUtilsLink>>>;
  locale?: Maybe<Scalars['String']>;
  localizations?: Maybe<ProjectRelationResponseCollection>;
  media?: Maybe<UploadFileRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  slug?: Maybe<Scalars['String']>;
  tags?: Maybe<TagRelationResponseCollection>;
  title?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};


export type ProjectLinksArgs = {
  filters?: InputMaybe<ComponentUtilsLinkFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type ProjectLocalizationsArgs = {
  filters?: InputMaybe<ProjectFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type ProjectMediaArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type ProjectTagsArgs = {
  filters?: InputMaybe<TagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ProjectEntity = {
  __typename?: 'ProjectEntity';
  attributes?: Maybe<Project>;
  id?: Maybe<Scalars['ID']>;
};

export type ProjectEntityResponse = {
  __typename?: 'ProjectEntityResponse';
  data?: Maybe<ProjectEntity>;
};

export type ProjectEntityResponseCollection = {
  __typename?: 'ProjectEntityResponseCollection';
  data: Array<ProjectEntity>;
  meta: ResponseCollectionMeta;
};

export type ProjectFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ProjectFiltersInput>>>;
  category?: InputMaybe<CategoryFiltersInput>;
  content?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  date?: InputMaybe<DateFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  finishedDate?: InputMaybe<DateFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  isActive?: InputMaybe<BooleanFilterInput>;
  isFeatured?: InputMaybe<BooleanFilterInput>;
  links?: InputMaybe<ComponentUtilsLinkFiltersInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<ProjectFiltersInput>;
  not?: InputMaybe<ProjectFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ProjectFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  slug?: InputMaybe<StringFilterInput>;
  tags?: InputMaybe<TagFiltersInput>;
  title?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ProjectInput = {
  banner?: InputMaybe<Scalars['ID']>;
  category?: InputMaybe<Scalars['ID']>;
  content?: InputMaybe<Scalars['String']>;
  date?: InputMaybe<Scalars['Date']>;
  description?: InputMaybe<Scalars['String']>;
  finishedDate?: InputMaybe<Scalars['Date']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  isFeatured?: InputMaybe<Scalars['Boolean']>;
  links?: InputMaybe<Array<InputMaybe<ComponentUtilsLinkInput>>>;
  media?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  slug?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  title?: InputMaybe<Scalars['String']>;
};

export type ProjectRelationResponseCollection = {
  __typename?: 'ProjectRelationResponseCollection';
  data: Array<ProjectEntity>;
};

export enum PublicationState {
  Live = 'LIVE',
  Preview = 'PREVIEW'
}

export type Query = {
  __typename?: 'Query';
  aboutMe?: Maybe<AboutMeEntityResponse>;
  blog?: Maybe<BlogEntityResponse>;
  blogs?: Maybe<BlogEntityResponseCollection>;
  categories?: Maybe<CategoryEntityResponseCollection>;
  category?: Maybe<CategoryEntityResponse>;
  education?: Maybe<EducationEntityResponse>;
  educations?: Maybe<EducationEntityResponseCollection>;
  experience?: Maybe<ExperienceEntityResponse>;
  experiences?: Maybe<ExperienceEntityResponseCollection>;
  homepage?: Maybe<HomepageEntityResponse>;
  i18NLocale?: Maybe<I18NLocaleEntityResponse>;
  i18NLocales?: Maybe<I18NLocaleEntityResponseCollection>;
  me?: Maybe<UsersPermissionsMe>;
  project?: Maybe<ProjectEntityResponse>;
  projects?: Maybe<ProjectEntityResponseCollection>;
  tag?: Maybe<TagEntityResponse>;
  tags?: Maybe<TagEntityResponseCollection>;
  uploadFile?: Maybe<UploadFileEntityResponse>;
  uploadFiles?: Maybe<UploadFileEntityResponseCollection>;
  uploadFolder?: Maybe<UploadFolderEntityResponse>;
  uploadFolders?: Maybe<UploadFolderEntityResponseCollection>;
  usersPermissionsRole?: Maybe<UsersPermissionsRoleEntityResponse>;
  usersPermissionsRoles?: Maybe<UsersPermissionsRoleEntityResponseCollection>;
  usersPermissionsUser?: Maybe<UsersPermissionsUserEntityResponse>;
  usersPermissionsUsers?: Maybe<UsersPermissionsUserEntityResponseCollection>;
};


export type QueryAboutMeArgs = {
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryBlogArgs = {
  id?: InputMaybe<Scalars['ID']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type QueryBlogsArgs = {
  filters?: InputMaybe<BlogFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryCategoriesArgs = {
  filters?: InputMaybe<CategoryFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryCategoryArgs = {
  id?: InputMaybe<Scalars['ID']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type QueryEducationArgs = {
  id?: InputMaybe<Scalars['ID']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type QueryEducationsArgs = {
  filters?: InputMaybe<EducationFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryExperienceArgs = {
  id?: InputMaybe<Scalars['ID']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type QueryExperiencesArgs = {
  filters?: InputMaybe<ExperienceFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryHomepageArgs = {
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryI18NLocaleArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryI18NLocalesArgs = {
  filters?: InputMaybe<I18NLocaleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryProjectArgs = {
  id?: InputMaybe<Scalars['ID']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type QueryProjectsArgs = {
  filters?: InputMaybe<ProjectFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryTagArgs = {
  id?: InputMaybe<Scalars['ID']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
};


export type QueryTagsArgs = {
  filters?: InputMaybe<TagFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryUploadFileArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryUploadFilesArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryUploadFolderArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryUploadFoldersArgs = {
  filters?: InputMaybe<UploadFolderFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryUsersPermissionsRoleArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryUsersPermissionsRolesArgs = {
  filters?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryUsersPermissionsUserArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryUsersPermissionsUsersArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ResponseCollectionMeta = {
  __typename?: 'ResponseCollectionMeta';
  pagination: Pagination;
};

export type StringFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contains?: InputMaybe<Scalars['String']>;
  containsi?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  eq?: InputMaybe<Scalars['String']>;
  eqi?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  gte?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  lt?: InputMaybe<Scalars['String']>;
  lte?: InputMaybe<Scalars['String']>;
  ne?: InputMaybe<Scalars['String']>;
  nei?: InputMaybe<Scalars['String']>;
  not?: InputMaybe<StringFilterInput>;
  notContains?: InputMaybe<Scalars['String']>;
  notContainsi?: InputMaybe<Scalars['String']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  notNull?: InputMaybe<Scalars['Boolean']>;
  null?: InputMaybe<Scalars['Boolean']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type Tag = {
  __typename?: 'Tag';
  blogs?: Maybe<BlogRelationResponseCollection>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  experiences?: Maybe<ExperienceRelationResponseCollection>;
  locale?: Maybe<Scalars['String']>;
  localizations?: Maybe<TagRelationResponseCollection>;
  order?: Maybe<Scalars['Int']>;
  projects?: Maybe<ProjectRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  slug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Enum_Tag_Type>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};


export type TagBlogsArgs = {
  filters?: InputMaybe<BlogFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type TagExperiencesArgs = {
  filters?: InputMaybe<ExperienceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type TagLocalizationsArgs = {
  filters?: InputMaybe<TagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type TagProjectsArgs = {
  filters?: InputMaybe<ProjectFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type TagEntity = {
  __typename?: 'TagEntity';
  attributes?: Maybe<Tag>;
  id?: Maybe<Scalars['ID']>;
};

export type TagEntityResponse = {
  __typename?: 'TagEntityResponse';
  data?: Maybe<TagEntity>;
};

export type TagEntityResponseCollection = {
  __typename?: 'TagEntityResponseCollection';
  data: Array<TagEntity>;
  meta: ResponseCollectionMeta;
};

export type TagFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<TagFiltersInput>>>;
  blogs?: InputMaybe<BlogFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  experiences?: InputMaybe<ExperienceFiltersInput>;
  id?: InputMaybe<IdFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<TagFiltersInput>;
  not?: InputMaybe<TagFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<TagFiltersInput>>>;
  order?: InputMaybe<IntFilterInput>;
  projects?: InputMaybe<ProjectFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  slug?: InputMaybe<StringFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  type?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type TagInput = {
  blogs?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  description?: InputMaybe<Scalars['String']>;
  experiences?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  order?: InputMaybe<Scalars['Int']>;
  projects?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  slug?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Enum_Tag_Type>;
};

export type TagRelationResponseCollection = {
  __typename?: 'TagRelationResponseCollection';
  data: Array<TagEntity>;
};

export type UploadFile = {
  __typename?: 'UploadFile';
  alternativeText?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  ext?: Maybe<Scalars['String']>;
  formats?: Maybe<Scalars['JSON']>;
  hash: Scalars['String'];
  height?: Maybe<Scalars['Int']>;
  mime: Scalars['String'];
  name: Scalars['String'];
  previewUrl?: Maybe<Scalars['String']>;
  provider: Scalars['String'];
  provider_metadata?: Maybe<Scalars['JSON']>;
  related?: Maybe<Array<Maybe<GenericMorph>>>;
  size: Scalars['Float'];
  updatedAt?: Maybe<Scalars['DateTime']>;
  url: Scalars['String'];
  width?: Maybe<Scalars['Int']>;
};

export type UploadFileEntity = {
  __typename?: 'UploadFileEntity';
  attributes?: Maybe<UploadFile>;
  id?: Maybe<Scalars['ID']>;
};

export type UploadFileEntityResponse = {
  __typename?: 'UploadFileEntityResponse';
  data?: Maybe<UploadFileEntity>;
};

export type UploadFileEntityResponseCollection = {
  __typename?: 'UploadFileEntityResponseCollection';
  data: Array<UploadFileEntity>;
  meta: ResponseCollectionMeta;
};

export type UploadFileFiltersInput = {
  alternativeText?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<UploadFileFiltersInput>>>;
  caption?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  ext?: InputMaybe<StringFilterInput>;
  folder?: InputMaybe<UploadFolderFiltersInput>;
  folderPath?: InputMaybe<StringFilterInput>;
  formats?: InputMaybe<JsonFilterInput>;
  hash?: InputMaybe<StringFilterInput>;
  height?: InputMaybe<IntFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  mime?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UploadFileFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UploadFileFiltersInput>>>;
  previewUrl?: InputMaybe<StringFilterInput>;
  provider?: InputMaybe<StringFilterInput>;
  provider_metadata?: InputMaybe<JsonFilterInput>;
  size?: InputMaybe<FloatFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  url?: InputMaybe<StringFilterInput>;
  width?: InputMaybe<IntFilterInput>;
};

export type UploadFileInput = {
  alternativeText?: InputMaybe<Scalars['String']>;
  caption?: InputMaybe<Scalars['String']>;
  ext?: InputMaybe<Scalars['String']>;
  folder?: InputMaybe<Scalars['ID']>;
  folderPath?: InputMaybe<Scalars['String']>;
  formats?: InputMaybe<Scalars['JSON']>;
  hash?: InputMaybe<Scalars['String']>;
  height?: InputMaybe<Scalars['Int']>;
  mime?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  previewUrl?: InputMaybe<Scalars['String']>;
  provider?: InputMaybe<Scalars['String']>;
  provider_metadata?: InputMaybe<Scalars['JSON']>;
  size?: InputMaybe<Scalars['Float']>;
  url?: InputMaybe<Scalars['String']>;
  width?: InputMaybe<Scalars['Int']>;
};

export type UploadFileRelationResponseCollection = {
  __typename?: 'UploadFileRelationResponseCollection';
  data: Array<UploadFileEntity>;
};

export type UploadFolder = {
  __typename?: 'UploadFolder';
  children?: Maybe<UploadFolderRelationResponseCollection>;
  createdAt?: Maybe<Scalars['DateTime']>;
  files?: Maybe<UploadFileRelationResponseCollection>;
  name: Scalars['String'];
  parent?: Maybe<UploadFolderEntityResponse>;
  path: Scalars['String'];
  pathId: Scalars['Int'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};


export type UploadFolderChildrenArgs = {
  filters?: InputMaybe<UploadFolderFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type UploadFolderFilesArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type UploadFolderEntity = {
  __typename?: 'UploadFolderEntity';
  attributes?: Maybe<UploadFolder>;
  id?: Maybe<Scalars['ID']>;
};

export type UploadFolderEntityResponse = {
  __typename?: 'UploadFolderEntityResponse';
  data?: Maybe<UploadFolderEntity>;
};

export type UploadFolderEntityResponseCollection = {
  __typename?: 'UploadFolderEntityResponseCollection';
  data: Array<UploadFolderEntity>;
  meta: ResponseCollectionMeta;
};

export type UploadFolderFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UploadFolderFiltersInput>>>;
  children?: InputMaybe<UploadFolderFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  files?: InputMaybe<UploadFileFiltersInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UploadFolderFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UploadFolderFiltersInput>>>;
  parent?: InputMaybe<UploadFolderFiltersInput>;
  path?: InputMaybe<StringFilterInput>;
  pathId?: InputMaybe<IntFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type UploadFolderInput = {
  children?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  files?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  name?: InputMaybe<Scalars['String']>;
  parent?: InputMaybe<Scalars['ID']>;
  path?: InputMaybe<Scalars['String']>;
  pathId?: InputMaybe<Scalars['Int']>;
};

export type UploadFolderRelationResponseCollection = {
  __typename?: 'UploadFolderRelationResponseCollection';
  data: Array<UploadFolderEntity>;
};

export type UsersPermissionsCreateRolePayload = {
  __typename?: 'UsersPermissionsCreateRolePayload';
  ok: Scalars['Boolean'];
};

export type UsersPermissionsDeleteRolePayload = {
  __typename?: 'UsersPermissionsDeleteRolePayload';
  ok: Scalars['Boolean'];
};

export type UsersPermissionsLoginInput = {
  identifier: Scalars['String'];
  password: Scalars['String'];
  provider?: Scalars['String'];
};

export type UsersPermissionsLoginPayload = {
  __typename?: 'UsersPermissionsLoginPayload';
  jwt?: Maybe<Scalars['String']>;
  user: UsersPermissionsMe;
};

export type UsersPermissionsMe = {
  __typename?: 'UsersPermissionsMe';
  blocked?: Maybe<Scalars['Boolean']>;
  confirmed?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  role?: Maybe<UsersPermissionsMeRole>;
  username: Scalars['String'];
};

export type UsersPermissionsMeRole = {
  __typename?: 'UsersPermissionsMeRole';
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  type?: Maybe<Scalars['String']>;
};

export type UsersPermissionsPasswordPayload = {
  __typename?: 'UsersPermissionsPasswordPayload';
  ok: Scalars['Boolean'];
};

export type UsersPermissionsPermission = {
  __typename?: 'UsersPermissionsPermission';
  action: Scalars['String'];
  createdAt?: Maybe<Scalars['DateTime']>;
  role?: Maybe<UsersPermissionsRoleEntityResponse>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type UsersPermissionsPermissionEntity = {
  __typename?: 'UsersPermissionsPermissionEntity';
  attributes?: Maybe<UsersPermissionsPermission>;
  id?: Maybe<Scalars['ID']>;
};

export type UsersPermissionsPermissionFiltersInput = {
  action?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsPermissionFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsPermissionFiltersInput>>>;
  role?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type UsersPermissionsPermissionRelationResponseCollection = {
  __typename?: 'UsersPermissionsPermissionRelationResponseCollection';
  data: Array<UsersPermissionsPermissionEntity>;
};

export type UsersPermissionsRegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UsersPermissionsRole = {
  __typename?: 'UsersPermissionsRole';
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  permissions?: Maybe<UsersPermissionsPermissionRelationResponseCollection>;
  type?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  users?: Maybe<UsersPermissionsUserRelationResponseCollection>;
};


export type UsersPermissionsRolePermissionsArgs = {
  filters?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type UsersPermissionsRoleUsersArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type UsersPermissionsRoleEntity = {
  __typename?: 'UsersPermissionsRoleEntity';
  attributes?: Maybe<UsersPermissionsRole>;
  id?: Maybe<Scalars['ID']>;
};

export type UsersPermissionsRoleEntityResponse = {
  __typename?: 'UsersPermissionsRoleEntityResponse';
  data?: Maybe<UsersPermissionsRoleEntity>;
};

export type UsersPermissionsRoleEntityResponseCollection = {
  __typename?: 'UsersPermissionsRoleEntityResponseCollection';
  data: Array<UsersPermissionsRoleEntity>;
  meta: ResponseCollectionMeta;
};

export type UsersPermissionsRoleFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsRoleFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsRoleFiltersInput>>>;
  permissions?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  type?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  users?: InputMaybe<UsersPermissionsUserFiltersInput>;
};

export type UsersPermissionsRoleInput = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  permissions?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  type?: InputMaybe<Scalars['String']>;
  users?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type UsersPermissionsUpdateRolePayload = {
  __typename?: 'UsersPermissionsUpdateRolePayload';
  ok: Scalars['Boolean'];
};

export type UsersPermissionsUser = {
  __typename?: 'UsersPermissionsUser';
  blocked?: Maybe<Scalars['Boolean']>;
  confirmed?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  email: Scalars['String'];
  provider?: Maybe<Scalars['String']>;
  role?: Maybe<UsersPermissionsRoleEntityResponse>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  username: Scalars['String'];
};

export type UsersPermissionsUserEntity = {
  __typename?: 'UsersPermissionsUserEntity';
  attributes?: Maybe<UsersPermissionsUser>;
  id?: Maybe<Scalars['ID']>;
};

export type UsersPermissionsUserEntityResponse = {
  __typename?: 'UsersPermissionsUserEntityResponse';
  data?: Maybe<UsersPermissionsUserEntity>;
};

export type UsersPermissionsUserEntityResponseCollection = {
  __typename?: 'UsersPermissionsUserEntityResponseCollection';
  data: Array<UsersPermissionsUserEntity>;
  meta: ResponseCollectionMeta;
};

export type UsersPermissionsUserFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>;
  blocked?: InputMaybe<BooleanFilterInput>;
  confirmationToken?: InputMaybe<StringFilterInput>;
  confirmed?: InputMaybe<BooleanFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  email?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<UsersPermissionsUserFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>;
  password?: InputMaybe<StringFilterInput>;
  provider?: InputMaybe<StringFilterInput>;
  resetPasswordToken?: InputMaybe<StringFilterInput>;
  role?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  username?: InputMaybe<StringFilterInput>;
};

export type UsersPermissionsUserInput = {
  blocked?: InputMaybe<Scalars['Boolean']>;
  confirmationToken?: InputMaybe<Scalars['String']>;
  confirmed?: InputMaybe<Scalars['Boolean']>;
  email?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  provider?: InputMaybe<Scalars['String']>;
  resetPasswordToken?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Scalars['ID']>;
  username?: InputMaybe<Scalars['String']>;
};

export type UsersPermissionsUserRelationResponseCollection = {
  __typename?: 'UsersPermissionsUserRelationResponseCollection';
  data: Array<UsersPermissionsUserEntity>;
};

export type BlogFragment = { __typename?: 'Blog', title?: string | null, description?: string | null, content?: string | null, slug?: string | null, createdAt?: any | null, category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', name?: string | null } | null } | null } | null, thumbnail?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', id?: string | null, attributes?: { __typename?: 'UploadFile', name: string, url: string } | null } | null } | null, tags?: { __typename?: 'TagRelationResponseCollection', data: Array<{ __typename?: 'TagEntity', id?: string | null, attributes?: { __typename?: 'Tag', title?: string | null, slug?: string | null, type?: Enum_Tag_Type | null } | null }> } | null, banner?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', name: string, url: string } | null } | null } | null, localizations?: { __typename?: 'BlogRelationResponseCollection', data: Array<{ __typename?: 'BlogEntity', attributes?: { __typename?: 'Blog', locale?: string | null, slug?: string | null } | null }> } | null };

export type BlogPreviewFragment = { __typename?: 'Blog', title?: string | null, description?: string | null, slug?: string | null, createdAt?: any | null, category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', name?: string | null } | null } | null } | null, thumbnail?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', id?: string | null, attributes?: { __typename?: 'UploadFile', name: string, url: string } | null } | null } | null, tags?: { __typename?: 'TagRelationResponseCollection', data: Array<{ __typename?: 'TagEntity', id?: string | null, attributes?: { __typename?: 'Tag', title?: string | null, slug?: string | null, type?: Enum_Tag_Type | null } | null }> } | null };

export type EducationFragment = { __typename?: 'Education', locale?: string | null, title?: string | null, start?: any | null, end?: any | null, content?: string | null, description?: string | null };

export type ExperienceFragment = { __typename?: 'Experience', locale?: string | null, title?: string | null, description?: string | null, start?: any | null, end?: any | null, slug?: string | null, content?: string | null, position?: string | null, tags?: { __typename?: 'TagRelationResponseCollection', data: Array<{ __typename?: 'TagEntity', attributes?: { __typename?: 'Tag', title?: string | null, slug?: string | null, type?: Enum_Tag_Type | null } | null }> } | null };

export type MediaFragment = { __typename?: 'UploadFile', name: string, url: string };

export type ProjectFragment = { __typename?: 'Project', title?: string | null, description?: string | null, content?: string | null, slug?: string | null, isActive?: boolean | null, locale?: string | null, date?: any | null, finishedDate?: any | null, category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', name?: string | null } | null } | null } | null, media?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', id?: string | null, attributes?: { __typename?: 'UploadFile', name: string, url: string } | null }> } | null, tags?: { __typename?: 'TagRelationResponseCollection', data: Array<{ __typename?: 'TagEntity', id?: string | null, attributes?: { __typename?: 'Tag', title?: string | null, slug?: string | null, type?: Enum_Tag_Type | null } | null }> } | null, links?: Array<{ __typename?: 'ComponentUtilsLink', title?: string | null, url?: string | null, type?: Enum_Componentutilslink_Type | null } | null> | null, banner?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', name: string, url: string } | null } | null } | null, localizations?: { __typename?: 'ProjectRelationResponseCollection', data: Array<{ __typename?: 'ProjectEntity', attributes?: { __typename?: 'Project', locale?: string | null, slug?: string | null } | null }> } | null };

export type ProjectPreviewFragment = { __typename?: 'Project', title?: string | null, description?: string | null, slug?: string | null, isActive?: boolean | null, locale?: string | null, date?: any | null, category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', name?: string | null } | null } | null } | null, media?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', id?: string | null, attributes?: { __typename?: 'UploadFile', name: string, url: string } | null }> } | null, links?: Array<{ __typename?: 'ComponentUtilsLink', title?: string | null, url?: string | null, type?: Enum_Componentutilslink_Type | null } | null> | null, tags?: { __typename?: 'TagRelationResponseCollection', data: Array<{ __typename?: 'TagEntity', id?: string | null, attributes?: { __typename?: 'Tag', title?: string | null, slug?: string | null, type?: Enum_Tag_Type | null } | null }> } | null };

export type TagFragment = { __typename?: 'Tag', title?: string | null, slug?: string | null, type?: Enum_Tag_Type | null };

export type FetchAboutMeQueryVariables = Exact<{
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
}>;


export type FetchAboutMeQuery = { __typename?: 'Query', aboutMe?: { __typename?: 'AboutMeEntityResponse', data?: { __typename?: 'AboutMeEntity', attributes?: { __typename?: 'AboutMe', introduction?: string | null } | null } | null } | null, experiences?: { __typename?: 'ExperienceEntityResponseCollection', data: Array<{ __typename?: 'ExperienceEntity', attributes?: { __typename?: 'Experience', locale?: string | null, title?: string | null, description?: string | null, start?: any | null, end?: any | null, slug?: string | null, content?: string | null, position?: string | null, localizations?: { __typename?: 'ExperienceRelationResponseCollection', data: Array<{ __typename?: 'ExperienceEntity', attributes?: { __typename?: 'Experience', locale?: string | null, title?: string | null, description?: string | null, start?: any | null, end?: any | null, slug?: string | null, content?: string | null, position?: string | null, tags?: { __typename?: 'TagRelationResponseCollection', data: Array<{ __typename?: 'TagEntity', attributes?: { __typename?: 'Tag', title?: string | null, slug?: string | null, type?: Enum_Tag_Type | null } | null }> } | null } | null }> } | null, tags?: { __typename?: 'TagRelationResponseCollection', data: Array<{ __typename?: 'TagEntity', attributes?: { __typename?: 'Tag', title?: string | null, slug?: string | null, type?: Enum_Tag_Type | null } | null }> } | null } | null }> } | null, educations?: { __typename?: 'EducationEntityResponseCollection', data: Array<{ __typename?: 'EducationEntity', attributes?: { __typename?: 'Education', locale?: string | null, title?: string | null, start?: any | null, end?: any | null, content?: string | null, description?: string | null, localizations?: { __typename?: 'EducationRelationResponseCollection', data: Array<{ __typename?: 'EducationEntity', attributes?: { __typename?: 'Education', locale?: string | null, title?: string | null, start?: any | null, end?: any | null, content?: string | null, description?: string | null } | null }> } | null } | null }> } | null, tags?: { __typename?: 'TagEntityResponseCollection', data: Array<{ __typename?: 'TagEntity', attributes?: { __typename?: 'Tag', title?: string | null, slug?: string | null, type?: Enum_Tag_Type | null, projects?: { __typename?: 'ProjectRelationResponseCollection', data: Array<{ __typename?: 'ProjectEntity', id?: string | null }> } | null } | null }> } | null };

export type FetchBlogPostsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
}>;


export type FetchBlogPostsQuery = { __typename?: 'Query', blogs?: { __typename?: 'BlogEntityResponseCollection', data: Array<{ __typename?: 'BlogEntity', id?: string | null, attributes?: { __typename?: 'Blog', title?: string | null, description?: string | null, content?: string | null, slug?: string | null, createdAt?: any | null, category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', name?: string | null } | null } | null } | null, thumbnail?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', id?: string | null, attributes?: { __typename?: 'UploadFile', name: string, url: string } | null } | null } | null, tags?: { __typename?: 'TagRelationResponseCollection', data: Array<{ __typename?: 'TagEntity', id?: string | null, attributes?: { __typename?: 'Tag', title?: string | null, slug?: string | null, type?: Enum_Tag_Type | null } | null }> } | null, banner?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', name: string, url: string } | null } | null } | null, localizations?: { __typename?: 'BlogRelationResponseCollection', data: Array<{ __typename?: 'BlogEntity', attributes?: { __typename?: 'Blog', locale?: string | null, slug?: string | null } | null }> } | null } | null }> } | null };

export type FetchHomePageQueryVariables = Exact<{
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
}>;


export type FetchHomePageQuery = { __typename?: 'Query', projects?: { __typename?: 'ProjectEntityResponseCollection', data: Array<{ __typename?: 'ProjectEntity', id?: string | null, attributes?: { __typename?: 'Project', title?: string | null, description?: string | null, slug?: string | null, isActive?: boolean | null, locale?: string | null, date?: any | null, localizations?: { __typename?: 'ProjectRelationResponseCollection', data: Array<{ __typename?: 'ProjectEntity', attributes?: { __typename?: 'Project', title?: string | null, description?: string | null, slug?: string | null, isActive?: boolean | null, locale?: string | null, date?: any | null, category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', name?: string | null } | null } | null } | null, media?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', id?: string | null, attributes?: { __typename?: 'UploadFile', name: string, url: string } | null }> } | null, links?: Array<{ __typename?: 'ComponentUtilsLink', title?: string | null, url?: string | null, type?: Enum_Componentutilslink_Type | null } | null> | null, tags?: { __typename?: 'TagRelationResponseCollection', data: Array<{ __typename?: 'TagEntity', id?: string | null, attributes?: { __typename?: 'Tag', title?: string | null, slug?: string | null, type?: Enum_Tag_Type | null } | null }> } | null } | null }> } | null, category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', name?: string | null } | null } | null } | null, media?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', id?: string | null, attributes?: { __typename?: 'UploadFile', name: string, url: string } | null }> } | null, links?: Array<{ __typename?: 'ComponentUtilsLink', title?: string | null, url?: string | null, type?: Enum_Componentutilslink_Type | null } | null> | null, tags?: { __typename?: 'TagRelationResponseCollection', data: Array<{ __typename?: 'TagEntity', id?: string | null, attributes?: { __typename?: 'Tag', title?: string | null, slug?: string | null, type?: Enum_Tag_Type | null } | null }> } | null } | null }> } | null, homepage?: { __typename?: 'HomepageEntityResponse', data?: { __typename?: 'HomepageEntity', attributes?: { __typename?: 'Homepage', introduction?: string | null, hero?: string | null, heroSubtitle?: string | null, introductionImage?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', id?: string | null, attributes?: { __typename?: 'UploadFile', name: string, url: string } | null } | null } | null, heroImage?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', id?: string | null, attributes?: { __typename?: 'UploadFile', name: string, url: string } | null } | null } | null } | null } | null } | null };

export type FetchProjectsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  isFeatured?: InputMaybe<Scalars['Boolean']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
}>;


export type FetchProjectsQuery = { __typename?: 'Query', projects?: { __typename?: 'ProjectEntityResponseCollection', data: Array<{ __typename?: 'ProjectEntity', id?: string | null, attributes?: { __typename?: 'Project', title?: string | null, description?: string | null, slug?: string | null, isActive?: boolean | null, locale?: string | null, date?: any | null, localizations?: { __typename?: 'ProjectRelationResponseCollection', data: Array<{ __typename?: 'ProjectEntity', attributes?: { __typename?: 'Project', title?: string | null, description?: string | null, slug?: string | null, isActive?: boolean | null, locale?: string | null, date?: any | null, category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', name?: string | null } | null } | null } | null, media?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', id?: string | null, attributes?: { __typename?: 'UploadFile', name: string, url: string } | null }> } | null, links?: Array<{ __typename?: 'ComponentUtilsLink', title?: string | null, url?: string | null, type?: Enum_Componentutilslink_Type | null } | null> | null, tags?: { __typename?: 'TagRelationResponseCollection', data: Array<{ __typename?: 'TagEntity', id?: string | null, attributes?: { __typename?: 'Tag', title?: string | null, slug?: string | null, type?: Enum_Tag_Type | null } | null }> } | null } | null }> } | null, category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', name?: string | null } | null } | null } | null, media?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', id?: string | null, attributes?: { __typename?: 'UploadFile', name: string, url: string } | null }> } | null, links?: Array<{ __typename?: 'ComponentUtilsLink', title?: string | null, url?: string | null, type?: Enum_Componentutilslink_Type | null } | null> | null, tags?: { __typename?: 'TagRelationResponseCollection', data: Array<{ __typename?: 'TagEntity', id?: string | null, attributes?: { __typename?: 'Tag', title?: string | null, slug?: string | null, type?: Enum_Tag_Type | null } | null }> } | null } | null }> } | null };

export type GetBlogPostBySlugQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
}>;


export type GetBlogPostBySlugQuery = { __typename?: 'Query', blogs?: { __typename?: 'BlogEntityResponseCollection', data: Array<{ __typename?: 'BlogEntity', id?: string | null, attributes?: { __typename?: 'Blog', title?: string | null, description?: string | null, content?: string | null, slug?: string | null, createdAt?: any | null, category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', name?: string | null } | null } | null } | null, thumbnail?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', id?: string | null, attributes?: { __typename?: 'UploadFile', name: string, url: string } | null } | null } | null, tags?: { __typename?: 'TagRelationResponseCollection', data: Array<{ __typename?: 'TagEntity', id?: string | null, attributes?: { __typename?: 'Tag', title?: string | null, slug?: string | null, type?: Enum_Tag_Type | null } | null }> } | null, banner?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', name: string, url: string } | null } | null } | null, localizations?: { __typename?: 'BlogRelationResponseCollection', data: Array<{ __typename?: 'BlogEntity', attributes?: { __typename?: 'Blog', locale?: string | null, slug?: string | null } | null }> } | null } | null }> } | null };

export type GetProjectBySlugQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
}>;


export type GetProjectBySlugQuery = { __typename?: 'Query', projects?: { __typename?: 'ProjectEntityResponseCollection', data: Array<{ __typename?: 'ProjectEntity', id?: string | null, attributes?: { __typename?: 'Project', title?: string | null, description?: string | null, content?: string | null, slug?: string | null, isActive?: boolean | null, locale?: string | null, date?: any | null, finishedDate?: any | null, category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', name?: string | null } | null } | null } | null, media?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', id?: string | null, attributes?: { __typename?: 'UploadFile', name: string, url: string } | null }> } | null, tags?: { __typename?: 'TagRelationResponseCollection', data: Array<{ __typename?: 'TagEntity', id?: string | null, attributes?: { __typename?: 'Tag', title?: string | null, slug?: string | null, type?: Enum_Tag_Type | null } | null }> } | null, links?: Array<{ __typename?: 'ComponentUtilsLink', title?: string | null, url?: string | null, type?: Enum_Componentutilslink_Type | null } | null> | null, banner?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', name: string, url: string } | null } | null } | null, localizations?: { __typename?: 'ProjectRelationResponseCollection', data: Array<{ __typename?: 'ProjectEntity', attributes?: { __typename?: 'Project', locale?: string | null, slug?: string | null } | null }> } | null } | null }> } | null };

export type GetTagBySlugQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']>;
}>;


export type GetTagBySlugQuery = { __typename?: 'Query', tags?: { __typename?: 'TagEntityResponseCollection', data: Array<{ __typename?: 'TagEntity', id?: string | null, attributes?: { __typename?: 'Tag', title?: string | null, slug?: string | null, type?: Enum_Tag_Type | null, projects?: { __typename?: 'ProjectRelationResponseCollection', data: Array<{ __typename?: 'ProjectEntity', attributes?: { __typename?: 'Project', title?: string | null, description?: string | null, slug?: string | null, isActive?: boolean | null, locale?: string | null, date?: any | null, category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', name?: string | null } | null } | null } | null, media?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', id?: string | null, attributes?: { __typename?: 'UploadFile', name: string, url: string } | null }> } | null, links?: Array<{ __typename?: 'ComponentUtilsLink', title?: string | null, url?: string | null, type?: Enum_Componentutilslink_Type | null } | null> | null, tags?: { __typename?: 'TagRelationResponseCollection', data: Array<{ __typename?: 'TagEntity', id?: string | null, attributes?: { __typename?: 'Tag', title?: string | null, slug?: string | null, type?: Enum_Tag_Type | null } | null }> } | null } | null }> } | null, experiences?: { __typename?: 'ExperienceRelationResponseCollection', data: Array<{ __typename?: 'ExperienceEntity', attributes?: { __typename?: 'Experience', locale?: string | null, title?: string | null, description?: string | null, start?: any | null, end?: any | null, slug?: string | null, content?: string | null, position?: string | null, tags?: { __typename?: 'TagRelationResponseCollection', data: Array<{ __typename?: 'TagEntity', attributes?: { __typename?: 'Tag', title?: string | null, slug?: string | null, type?: Enum_Tag_Type | null } | null }> } | null } | null }> } | null } | null }> } | null };

export const MediaFragmentDoc = gql`
    fragment media on UploadFile {
  name
  url
}
    `;
export const TagFragmentDoc = gql`
    fragment tag on Tag {
  title
  slug
  type
}
    `;
export const BlogFragmentDoc = gql`
    fragment blog on Blog {
  title
  description
  content
  slug
  category {
    data {
      id
      attributes {
        name
      }
    }
  }
  thumbnail {
    data {
      id
      attributes {
        ...media
      }
    }
  }
  tags {
    data {
      id
      attributes {
        ...tag
      }
    }
  }
  banner {
    data {
      attributes {
        ...media
      }
    }
  }
  localizations {
    data {
      attributes {
        locale
        slug
      }
    }
  }
  createdAt
}
    ${MediaFragmentDoc}
${TagFragmentDoc}`;
export const BlogPreviewFragmentDoc = gql`
    fragment blogPreview on Blog {
  title
  description
  slug
  category {
    data {
      id
      attributes {
        name
      }
    }
  }
  thumbnail {
    data {
      id
      attributes {
        ...media
      }
    }
  }
  createdAt
  tags {
    data {
      id
      attributes {
        ...tag
      }
    }
  }
}
    ${MediaFragmentDoc}
${TagFragmentDoc}`;
export const EducationFragmentDoc = gql`
    fragment education on Education {
  locale
  title
  start
  end
  content
  description
}
    `;
export const ExperienceFragmentDoc = gql`
    fragment experience on Experience {
  locale
  title
  description
  start
  end
  slug
  tags {
    data {
      attributes {
        ...tag
      }
    }
  }
  content
  position
}
    ${TagFragmentDoc}`;
export const ProjectFragmentDoc = gql`
    fragment project on Project {
  title
  description
  content
  slug
  isActive
  locale
  category {
    data {
      id
      attributes {
        name
      }
    }
  }
  media {
    data {
      id
      attributes {
        ...media
      }
    }
  }
  date
  finishedDate
  tags {
    data {
      id
      attributes {
        ...tag
      }
    }
  }
  links {
    title
    url
    type
  }
  banner {
    data {
      attributes {
        ...media
      }
    }
  }
  localizations {
    data {
      attributes {
        locale
        slug
      }
    }
  }
}
    ${MediaFragmentDoc}
${TagFragmentDoc}`;
export const ProjectPreviewFragmentDoc = gql`
    fragment projectPreview on Project {
  title
  description
  slug
  isActive
  locale
  category {
    data {
      id
      attributes {
        name
      }
    }
  }
  media(pagination: {pageSize: 1}) {
    data {
      id
      attributes {
        ...media
      }
    }
  }
  date
  links {
    title
    url
    type
  }
  tags {
    data {
      id
      attributes {
        ...tag
      }
    }
  }
}
    ${MediaFragmentDoc}
${TagFragmentDoc}`;
export const FetchAboutMeDocument = gql`
    query fetchAboutMe($locale: I18NLocaleCode) {
  aboutMe(locale: $locale) {
    data {
      attributes {
        introduction
      }
    }
  }
  experiences(locale: $locale, sort: ["start:desc"]) {
    data {
      attributes {
        ...experience
        localizations {
          data {
            attributes {
              ...experience
            }
          }
        }
      }
    }
  }
  educations(locale: $locale, sort: ["start:desc"]) {
    data {
      attributes {
        ...education
        localizations {
          data {
            attributes {
              ...education
            }
          }
        }
      }
    }
  }
  tags(locale: $locale, sort: ["order:asc"], pagination: {limit: 100}) {
    data {
      attributes {
        ...tag
        projects {
          data {
            id
          }
        }
      }
    }
  }
}
    ${ExperienceFragmentDoc}
${EducationFragmentDoc}
${TagFragmentDoc}`;
export const FetchBlogPostsDocument = gql`
    query fetchBlogPosts($limit: Int = 100, $locale: I18NLocaleCode) {
  blogs(
    pagination: {pageSize: $limit}
    sort: ["isFeatured:desc", "date:desc"]
    locale: $locale
  ) {
    data {
      id
      attributes {
        ...blog
      }
    }
  }
}
    ${BlogFragmentDoc}`;
export const FetchHomePageDocument = gql`
    query fetchHomePage($locale: I18NLocaleCode) {
  projects(
    pagination: {pageSize: 3}
    filters: {isFeatured: {eq: true}}
    sort: ["isFeatured:desc", "date:desc"]
  ) {
    data {
      id
      attributes {
        ...projectPreview
        localizations {
          data {
            attributes {
              ...projectPreview
            }
          }
        }
      }
    }
  }
  homepage(locale: $locale) {
    data {
      attributes {
        introduction
        introductionImage {
          data {
            id
            attributes {
              ...media
            }
          }
        }
        hero
        heroSubtitle
        heroImage {
          data {
            id
            attributes {
              ...media
            }
          }
        }
      }
    }
  }
}
    ${ProjectPreviewFragmentDoc}
${MediaFragmentDoc}`;
export const FetchProjectsDocument = gql`
    query fetchProjects($limit: Int = 100, $isFeatured: Boolean = false, $locale: I18NLocaleCode) {
  projects(
    pagination: {pageSize: $limit}
    filters: {isFeatured: {eq: $isFeatured}}
    sort: ["isFeatured:desc", "date:desc"]
    locale: $locale
  ) {
    data {
      id
      attributes {
        ...projectPreview
        localizations {
          data {
            attributes {
              ...projectPreview
            }
          }
        }
      }
    }
  }
}
    ${ProjectPreviewFragmentDoc}`;
export const GetBlogPostBySlugDocument = gql`
    query getBlogPostBySlug($slug: String, $locale: I18NLocaleCode = "all") {
  blogs(filters: {slug: {eq: $slug}}, locale: $locale) {
    data {
      id
      attributes {
        ...blog
      }
    }
  }
}
    ${BlogFragmentDoc}`;
export const GetProjectBySlugDocument = gql`
    query getProjectBySlug($slug: String, $locale: I18NLocaleCode = "all") {
  projects(filters: {slug: {eq: $slug}}, locale: $locale) {
    data {
      id
      attributes {
        ...project
      }
    }
  }
}
    ${ProjectFragmentDoc}`;
export const GetTagBySlugDocument = gql`
    query getTagBySlug($slug: String, $locale: I18NLocaleCode = "all") {
  tags(filters: {slug: {eq: $slug}}, locale: $locale) {
    data {
      id
      attributes {
        ...tag
        projects(sort: ["isFeatured:desc", "date:desc"]) {
          data {
            attributes {
              ...projectPreview
            }
          }
        }
        experiences {
          data {
            attributes {
              ...experience
            }
          }
        }
      }
    }
  }
}
    ${TagFragmentDoc}
${ProjectPreviewFragmentDoc}
${ExperienceFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    fetchAboutMe(variables?: FetchAboutMeQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FetchAboutMeQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FetchAboutMeQuery>(FetchAboutMeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'fetchAboutMe', 'query');
    },
    fetchBlogPosts(variables?: FetchBlogPostsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FetchBlogPostsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FetchBlogPostsQuery>(FetchBlogPostsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'fetchBlogPosts', 'query');
    },
    fetchHomePage(variables?: FetchHomePageQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FetchHomePageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FetchHomePageQuery>(FetchHomePageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'fetchHomePage', 'query');
    },
    fetchProjects(variables?: FetchProjectsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FetchProjectsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FetchProjectsQuery>(FetchProjectsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'fetchProjects', 'query');
    },
    getBlogPostBySlug(variables?: GetBlogPostBySlugQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetBlogPostBySlugQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetBlogPostBySlugQuery>(GetBlogPostBySlugDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getBlogPostBySlug', 'query');
    },
    getProjectBySlug(variables?: GetProjectBySlugQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetProjectBySlugQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetProjectBySlugQuery>(GetProjectBySlugDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getProjectBySlug', 'query');
    },
    getTagBySlug(variables?: GetTagBySlugQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetTagBySlugQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTagBySlugQuery>(GetTagBySlugDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getTagBySlug', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;