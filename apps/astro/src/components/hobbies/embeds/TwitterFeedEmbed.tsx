import type { HobbyEmbedProps } from './types';

export const TwitterFeedEmbed = ({ description }: HobbyEmbedProps) => (
  <div className="hobby-feed">
    {['Now', 'Build log', 'Archive'].map((label, index) => (
      <article key={label}>
        <span>{label}</span>
        <p>
          {index === 0
            ? description || 'Latest public signal gets pinned here.'
            : index === 1
              ? 'Use a Markdown link or frontmatter handle to connect the live feed.'
              : 'Older posts stay readable even when embeds fail.'}
        </p>
      </article>
    ))}
  </div>
);
