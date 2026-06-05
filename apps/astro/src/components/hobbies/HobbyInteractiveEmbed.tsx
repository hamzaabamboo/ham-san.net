import type { ComponentType } from 'react';
import { DartsBoardEmbed } from './embeds/DartsBoardEmbed';
import { FieldNotesEmbed } from './embeds/FieldNotesEmbed';
import { LinkLibraryEmbed } from './embeds/LinkLibraryEmbed';
import { PhotoGalleryEmbed } from './embeds/PhotoGalleryEmbed';
import { PianoChordsEmbed } from './embeds/PianoChordsEmbed';
import { RubikAlgorithmsEmbed } from './embeds/RubikAlgorithmsEmbed';
import { TwitterFeedEmbed } from './embeds/TwitterFeedEmbed';
import { TypingStatsEmbed } from './embeds/TypingStatsEmbed';
import type { HobbyEmbedProps } from './embeds/types';
import { hobbyStyles } from './hobbyStyles';

type EmbedDefinition = {
  title: string;
  description: string;
  className: string;
  Component: ComponentType<HobbyEmbedProps>;
};

const embedRegistry: Record<string, EmbedDefinition> = {
  'photo-gallery': {
    title: 'Photo lab',
    description: 'Contact sheet, references, and field feed.',
    className: 'photo-gallery',
    Component: PhotoGalleryEmbed
  },
  'twitter-feed': {
    title: 'Signal feed',
    description: 'External posts and small public updates.',
    className: 'twitter-feed',
    Component: TwitterFeedEmbed
  },
  'rubik-algorithms': {
    title: 'Algorithm viewer',
    description: 'Move notation with practice context.',
    className: 'rubik-algorithms',
    Component: RubikAlgorithmsEmbed
  },
  'typing-stats': {
    title: 'Typing telemetry',
    description: 'Profiles and practice references.',
    className: 'typing-stats',
    Component: TypingStatsEmbed
  },
  'darts-board': {
    title: 'Darts board',
    description: 'Source-backed stats, loadout, and board notes.',
    className: 'darts-board',
    Component: DartsBoardEmbed
  },
  'link-library': {
    title: 'Link library',
    description: 'External references from the source note.',
    className: 'link-library',
    Component: LinkLibraryEmbed
  },
  'piano-chords': {
    title: 'Chord player',
    description: 'Source voicings and music pages.',
    className: 'piano-chords',
    Component: PianoChordsEmbed
  },
  'field-notes': {
    title: 'Field notes',
    description: 'Source state, links, and archive metadata.',
    className: 'field-notes',
    Component: FieldNotesEmbed
  }
};

const fallbackEmbed = embedRegistry['field-notes'];

export const HobbyInteractiveEmbed = ({
  type,
  title,
  description,
  body,
  images = [],
  links = [],
  nestedPages = [],
  statusLabel,
  moduleLabel = 'module',
  moduleTitle,
  moduleDescription,
  updatedPrefix = 'Updated',
  liveContentLabel = 'Live content',
  emptySourceLabel,
  nestedSourcePagesLabel,
  sourceNoteAttachedLabel,
  statusMetricLabel,
  linksMetricLabel,
  updatedMetricLabel,
  pagesMetricLabel,
  profilesMetricLabel,
  sourceMetricLabel,
  linkedPhotoSourcesLabel,
  noImagesLabel,
  noLinksLabel,
  sourceNoteLabel,
  noFeedLabel,
  noTypingProfilesLabel,
  sourceNoteUseLabel,
  nestedSourcePageUseLabel,
  openSourcePageLabel,
  noAlgorithmSetsLabel,
  audioUnavailableLabel,
  playedLabel,
  audioStartsAfterTapLabel,
  sourcePagesAttachedLabel,
  updatedAt,
  status = 'active'
}: HobbyEmbedProps & { type: string }) => {
  const embed = embedRegistry[type] ?? fallbackEmbed;
  const Component = embed.Component;

  return (
    <section className={hobbyStyles.embed}>
      <div className={hobbyStyles.embedHeader}>
        <div>
          <p className={`${hobbyStyles.embedEyebrow} hobby-meta`}>
            {statusLabel ?? status} {moduleLabel}
          </p>
          <h2>{moduleTitle ?? embed.title}</h2>
        </div>
        <div className={`${hobbyStyles.embedMeta} hobby-meta`}>
          <span>{title ?? 'Hobby'}</span>
          <span>{updatedAt ? `${updatedPrefix} ${updatedAt}` : liveContentLabel}</span>
        </div>
      </div>
      <p className={hobbyStyles.embedSummary}>
        {description || moduleDescription || embed.description}
      </p>
      <Component
        title={title}
        description={description}
        body={body}
        images={images}
        links={links}
        nestedPages={nestedPages}
        statusLabel={statusLabel}
        moduleLabel={moduleLabel}
        moduleTitle={moduleTitle}
        moduleDescription={moduleDescription}
        updatedPrefix={updatedPrefix}
        liveContentLabel={liveContentLabel}
        emptySourceLabel={emptySourceLabel}
        nestedSourcePagesLabel={nestedSourcePagesLabel}
        sourceNoteAttachedLabel={sourceNoteAttachedLabel}
        statusMetricLabel={statusMetricLabel}
        linksMetricLabel={linksMetricLabel}
        updatedMetricLabel={updatedMetricLabel}
        pagesMetricLabel={pagesMetricLabel}
        profilesMetricLabel={profilesMetricLabel}
        sourceMetricLabel={sourceMetricLabel}
        linkedPhotoSourcesLabel={linkedPhotoSourcesLabel}
        noImagesLabel={noImagesLabel}
        noLinksLabel={noLinksLabel}
        sourceNoteLabel={sourceNoteLabel}
        noFeedLabel={noFeedLabel}
        noTypingProfilesLabel={noTypingProfilesLabel}
        sourceNoteUseLabel={sourceNoteUseLabel}
        nestedSourcePageUseLabel={nestedSourcePageUseLabel}
        openSourcePageLabel={openSourcePageLabel}
        noAlgorithmSetsLabel={noAlgorithmSetsLabel}
        audioUnavailableLabel={audioUnavailableLabel}
        playedLabel={playedLabel}
        audioStartsAfterTapLabel={audioStartsAfterTapLabel}
        sourcePagesAttachedLabel={sourcePagesAttachedLabel}
        updatedAt={updatedAt}
        status={status}
      />
    </section>
  );
};
