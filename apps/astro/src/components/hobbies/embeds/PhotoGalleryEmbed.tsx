import { useState } from 'react';
import { hobbyStyles } from '../hobbyStyles';
import type { HobbyEmbedProps } from './types';

export const PhotoGalleryEmbed = ({ images = [] }: HobbyEmbedProps) => {
  const galleryImages = images.slice(0, 6);
  const rail = galleryImages.length > 0 ? galleryImages : ['empty', 'empty-2', 'empty-3'];
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className={hobbyStyles.gallery}>
      <div className={hobbyStyles.galleryStage}>
        {galleryImages[activeImage] ? (
          <img src={galleryImages[activeImage]} alt="" />
        ) : (
          <div className={hobbyStyles.galleryFallback}>
            <span className={hobbyStyles.fallbackMark}>PG</span>
            <strong>Drop Markdown images here</strong>
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
