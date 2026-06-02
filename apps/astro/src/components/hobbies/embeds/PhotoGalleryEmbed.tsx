import { useState } from 'react';
import type { HobbyEmbedProps } from './types';

export const PhotoGalleryEmbed = ({ images = [] }: HobbyEmbedProps) => {
  const galleryImages = images.slice(0, 6);
  const rail = galleryImages.length > 0 ? galleryImages : ['empty', 'empty-2', 'empty-3'];
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="hobby-gallery">
      <div className="hobby-gallery__stage">
        {galleryImages[activeImage] ? (
          <img src={galleryImages[activeImage]} alt="" />
        ) : (
          <div className="hobby-gallery__fallback">
            <span className="material-symbols-outlined">photo_camera</span>
            <strong>Drop Markdown images here</strong>
          </div>
        )}
      </div>
      <div className="hobby-gallery__rail">
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
