import { useState } from 'react';
import { hobbyStyles } from '../hobbyStyles';
import type { HobbyEmbedProps } from './types';

export const PhotoGalleryEmbed = ({ images = [], links = [] }: HobbyEmbedProps) => {
  const galleryImages = images.slice(0, 6);
  const rail = galleryImages.length > 0 ? galleryImages : ['empty', 'empty-2', 'empty-3'];
  const [activeImage, setActiveImage] = useState(0);
  const photoLinks = links
    .filter((link) =>
      /(photo|photos|flickr|instagram|500px|imgur)/i.test(`${link.label} ${link.href}`)
    )
    .sort((a, b) => {
      const score = (link: typeof a) =>
        /photos\.app\.goo\.gl|photos\.google/i.test(link.href) ? 0 : 1;
      return score(a) - score(b);
    });
  const galleryLinks = (photoLinks.length > 0 ? photoLinks : links).slice(0, 4);

  return (
    <div className={hobbyStyles.gallery}>
      <div className={hobbyStyles.galleryStage}>
        {galleryImages[activeImage] ? (
          <img src={galleryImages[activeImage]} alt="" />
        ) : galleryLinks.length > 0 ? (
          <div className={hobbyStyles.gallerySources}>
            <span className={hobbyStyles.fallbackMark}>PG</span>
            <strong>Linked photo sources</strong>
            <div>
              {galleryLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className={hobbyStyles.galleryFallback}>
            <span className={hobbyStyles.fallbackMark}>PG</span>
            <strong>No images attached yet</strong>
          </div>
        )}
      </div>
      <div className={hobbyStyles.galleryRail}>
        {rail.map((image, index) => (
          <button
            key={image}
            type="button"
            data-active={index === activeImage}
            onClick={() => setActiveImage(index)}
          >
            {image.startsWith('empty') ? (
              String(index + 1).padStart(2, '0')
            ) : (
              <img src={image} alt="" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
