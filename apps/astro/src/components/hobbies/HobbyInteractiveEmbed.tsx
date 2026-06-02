import type { ComponentType } from 'react';
import { FieldNotesEmbed } from './embeds/FieldNotesEmbed';
import { PhotoGalleryEmbed } from './embeds/PhotoGalleryEmbed';
import { PianoChordsEmbed } from './embeds/PianoChordsEmbed';
import { RubikAlgorithmsEmbed } from './embeds/RubikAlgorithmsEmbed';
import { TwitterFeedEmbed } from './embeds/TwitterFeedEmbed';
import { TypingStatsEmbed } from './embeds/TypingStatsEmbed';
import type { HobbyEmbedProps } from './embeds/types';

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
    description: 'Speed, accuracy, and daily rhythm.',
    className: 'typing-stats',
    Component: TypingStatsEmbed
  },
  'piano-chords': {
    title: 'Chord player',
    description: 'Tap a voicing to hear the shape.',
    className: 'piano-chords',
    Component: PianoChordsEmbed
  },
  'field-notes': {
    title: 'Field notes',
    description: 'A compact workspace for this hobby.',
    className: 'field-notes',
    Component: FieldNotesEmbed
  }
};

const fallbackEmbed = embedRegistry['field-notes'];

export const HobbyInteractiveEmbed = ({
  type,
  title,
  description,
  images = [],
  updatedAt,
  status = 'active'
}: HobbyEmbedProps & { type: string }) => {
  const embed = embedRegistry[type] ?? fallbackEmbed;
  const Component = embed.Component;

  return (
    <section className={`hobby-embed hobby-embed--${embed.className}`}>
      <div className="hobby-embed__header">
        <div>
          <p className="hobby-embed__eyebrow">{status} module</p>
          <h2>{embed.title}</h2>
        </div>
        <div className="hobby-embed__meta">
          <span>{title ?? 'Hobby'}</span>
          <span>{updatedAt ? `Updated ${updatedAt}` : 'Live content'}</span>
        </div>
      </div>
      <p className="hobby-embed__summary">{description || embed.description}</p>
      <Component
        title={title}
        description={description}
        images={images}
        updatedAt={updatedAt}
        status={status}
      />
    </section>
  );
};
