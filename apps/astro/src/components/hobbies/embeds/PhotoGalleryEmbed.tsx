import { useState } from 'react';
import { getPhotoSourceLinks } from '~/utils/hobby-links';
import { hobbyStyles } from '../hobbyStyles';
import { getHostLabel } from './source';
import type { HobbyEmbedProps } from './types';

const maxVisibleImages = 6;

export const PhotoGalleryEmbed = ({
  images = [],
  imageAlts = [],
  links = [],
  linkedPhotoSourcesLabel = 'Linked photo sources',
  noImagesLabel = 'No images attached yet',
  imageLabel = 'Photo',
  moreLabel = 'more'
}: HobbyEmbedProps) => {
  const galleryImages = images.slice(0, maxVisibleImages);
  const hiddenCount = images.length - galleryImages.length;
  const getImageLabel = (index: number) => imageAlts[index] || `${imageLabel} ${index + 1}`;
  const [activeImage, setActiveImage] = useState(0);
  const galleryLinks = getPhotoSourceLinks(links);
  const getDisplayLabel = (link: { href: string; label: string }) => {
    const host = getHostLabel(link.href);
    if (link.label !== host && link.label !== link.href) return link.label;
    try {
      const segment = new URL(link.href).pathname.split('/').filter(Boolean)[0];
      return segment ? `${host}/${segment}` : host;
    } catch {
      return link.href;
    }
  };

  return (
    <div className={hobbyStyles.gallery} data-has-rail={galleryImages.length > 0}>
      <div className={hobbyStyles.galleryStage}>
        {galleryImages[activeImage] ? (
          <img
            src={galleryImages[activeImage]}
            alt={getImageLabel(activeImage)}
            width={1200}
            height={900}
            decoding="async"
          />
        ) : galleryLinks.length > 0 ? (
          <div className={hobbyStyles.gallerySources}>
            <strong>{linkedPhotoSourcesLabel}</strong>
            <div>
              {galleryLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {getDisplayLabel(link)}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className={hobbyStyles.galleryFallback}>
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
              aria-label={getImageLabel(index)}
              aria-pressed={index === activeImage}
              onClick={() => setActiveImage(index)}
            >
              <img src={image} alt="" width={320} height={240} loading="lazy" decoding="async" />
            </button>
          ))}
          {hiddenCount > 0 && <p>{`+${hiddenCount} ${moreLabel}`}</p>}
        </div>
      )}
    </div>
  );
};
