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
  interactive: boolean;
  Component: ComponentType<HobbyEmbedProps>;
};

const embedRegistry: Record<string, EmbedDefinition> = {
  'photo-gallery': {
    title: 'Photo lab',
    description: 'Images and references.',
    className: 'photo-gallery',
    interactive: true,
    Component: PhotoGalleryEmbed
  },
  'twitter-feed': {
    title: 'Social feed',
    description: 'Public posts and profile links.',
    className: 'twitter-feed',
    interactive: false,
    Component: TwitterFeedEmbed
  },
  'rubik-algorithms': {
    title: 'Algorithms',
    description: 'Move notation with practice context.',
    className: 'rubik-algorithms',
    interactive: true,
    Component: RubikAlgorithmsEmbed
  },
  'typing-stats': {
    title: 'Typing profiles',
    description: 'Typing profiles and practice links.',
    className: 'typing-stats',
    interactive: false,
    Component: TypingStatsEmbed
  },
  'darts-board': {
    title: 'Darts board',
    description: 'Board, gear, and practice notes.',
    className: 'darts-board',
    interactive: false,
    Component: DartsBoardEmbed
  },
  'link-library': {
    title: 'Link library',
    description: 'External references.',
    className: 'link-library',
    interactive: false,
    Component: LinkLibraryEmbed
  },
  'piano-chords': {
    title: 'Chord player',
    description: 'Chord, voicing, and audio pages.',
    className: 'piano-chords',
    interactive: true,
    Component: PianoChordsEmbed
  },
  'field-notes': {
    title: 'Links and pages',
    description: 'Links and related pages.',
    className: 'field-notes',
    interactive: false,
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
  imageAlts = [],
  links = [],
  nestedPages = [],
  moduleTitle,
  moduleDescription,
  emptySourceLabel,
  emptySourceStateLabel,
  nestedSourcePagesLabel,
  sourceNoteAttachedLabel,
  linkedPhotoSourcesLabel,
  noImagesLabel,
  imageLabel,
  noLinksLabel,
  noFeedLabel,
  noTypingProfilesLabel,
  openSourcePageLabel,
  noAlgorithmSetsLabel,
  audioUnavailableLabel,
  playedLabel,
  audioStartsAfterTapLabel,
  noChordsLabel,
  noDartsDataLabel,
  moreLabel,
  status = 'active'
}: HobbyEmbedProps & { type: string }) => {
  const embed = embedRegistry[type] ?? fallbackEmbed;
  const Component = embed.Component;

  return (
    <section
      className={hobbyStyles.embed}
      data-embed={embed.className}
      data-interactive={embed.interactive}
      data-status={status}
    >
      <div className={hobbyStyles.embedHeader}>
        <h2>{moduleTitle ?? embed.title}</h2>
      </div>
      <p className={hobbyStyles.embedSummary}>
        {moduleDescription || description || embed.description}
      </p>
      <Component
        title={title}
        description={description}
        body={body}
        images={images}
        imageAlts={imageAlts}
        links={links}
        nestedPages={nestedPages}
        moduleTitle={moduleTitle}
        moduleDescription={moduleDescription}
        emptySourceLabel={emptySourceLabel}
        emptySourceStateLabel={emptySourceStateLabel}
        nestedSourcePagesLabel={nestedSourcePagesLabel}
        sourceNoteAttachedLabel={sourceNoteAttachedLabel}
        linkedPhotoSourcesLabel={linkedPhotoSourcesLabel}
        noImagesLabel={noImagesLabel}
        imageLabel={imageLabel}
        noLinksLabel={noLinksLabel}
        noFeedLabel={noFeedLabel}
        noTypingProfilesLabel={noTypingProfilesLabel}
        openSourcePageLabel={openSourcePageLabel}
        noAlgorithmSetsLabel={noAlgorithmSetsLabel}
        audioUnavailableLabel={audioUnavailableLabel}
        playedLabel={playedLabel}
        audioStartsAfterTapLabel={audioStartsAfterTapLabel}
        noChordsLabel={noChordsLabel}
        noDartsDataLabel={noDartsDataLabel}
        moreLabel={moreLabel}
        status={status}
      />
    </section>
  );
};
