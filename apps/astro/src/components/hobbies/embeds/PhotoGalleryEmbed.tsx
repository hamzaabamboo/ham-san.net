import { useState } from 'react';
import { HobbyTypeGlyph } from '../HobbyTypeGlyph';
import { hobbyStyles } from '../hobbyStyles';
import type { HobbyEmbedProps } from './types';

export const PhotoGalleryEmbed = ({
  images = [],
  links = [],
  linkedPhotoSourcesLabel = 'Linked photo sources',
  noImagesLabel = 'No images attached yet'
}: HobbyEmbedProps) => {
  const galleryImages = images.slice(0, 6);
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
    <div className={hobbyStyles.gallery} data-has-rail={galleryImages.length > 0}>
      <div className={hobbyStyles.galleryStage}>
        {galleryImages[activeImage] ? (
          <img src={galleryImages[activeImage]} alt="" />
        ) : galleryLinks.length > 0 ? (
          <div className={hobbyStyles.gallerySources}>
            <HobbyTypeGlyph type="photo-gallery" size="hero" />
            <strong>{linkedPhotoSourcesLabel}</strong>
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
            <HobbyTypeGlyph type="photo-gallery" size="hero" />
            <strong>{noImagesLabel}</strong>
          </div>
        )}
      </div>
      {galleryImages.length > 0 && (
        <div className={hobbyStyles.galleryRail}>
          {galleryImages.map((image, index) => (
            <button
              key={image}
              type="button"
              data-active={index === activeImage}
              onClick={() => setActiveImage(index)}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
