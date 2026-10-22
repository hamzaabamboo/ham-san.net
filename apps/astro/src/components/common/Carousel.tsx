import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { css } from 'styled-system/css';
import { Grid, styled } from 'styled-system/jsx';
import { Carousel as UICarousel, type RootProps } from '~/components/ui/carousel';
import { navigateCarousel, subscribeToReducedMotion } from '~/components/ui/carousel-motion';
import { IconButton } from '~/components/ui/icon-button';

// Static classes, not a template literal: Panda extracts prop values at build time, so a
// computed `gridTemplateColumns` string is dropped and the grid collapses to one column.
// A fixed track width in a 308px container resolves to ONE column, so at 390 the strip
// stacked vertically and stood 504px tall against a 195px slide — the control outweighing
// what it navigates. Below `md` it is a scrollable row instead.
const thumbnailStripBase = {
  display: 'grid',
  gridAutoFlow: 'column',
  gridAutoColumns: '38%',
  gap: '2',
  p: '1',
  scrollPaddingInline: '1',
  overflowX: 'auto',
  overscrollBehaviorX: 'contain'
} as const;

const thumbnailStrip = css({
  ...thumbnailStripBase,
  md: {
    gridAutoColumns: '100px'
  }
});
const thumbnailStripWide = css({
  ...thumbnailStripBase,
  md: {
    gridTemplateColumns: 'repeat(auto-fit, 160px)',
    gridAutoFlow: 'row',
    gridAutoColumns: 'auto',
    overflowX: 'visible'
  }
});

// Selection was a background colour visible only through `object-fit: contain`
// letterboxing, so a thumbnail whose image filled its box showed no selected state at all —
// and hover carried the accent, reading louder than selection. With the arrows and dots gone
// below four slides these buttons are the only control, so selection has to be unambiguous.
const thumbnailButton = css({
  position: 'relative',
  backgroundColor: 'transparent',
  '&[aria-pressed="true"]': {
    borderColor: 'var(--atelier-accent)'
  },
  '&[aria-pressed="true"]::after': {
    insetInline: '0',
    position: 'absolute',
    bottom: '0',
    height: '2px',
    background: 'var(--atelier-accent)',
    content: '""'
  },
  '&:hover': { borderColor: 'var(--atelier-outline)' }
});
const carouselImage = css({
  boxSizing: 'border-box',
  aspectRatio: '16 / 9',
  objectFit: 'contain',
  border: '1px solid var(--atelier-line)',
  w: 'full',
  backgroundColor: 'var(--atelier-surface-highest)',
  filter: 'var(--atelier-image-plate)'
});
const carouselImagePortrait = css({
  boxSizing: 'border-box',
  objectFit: 'contain',
  border: '1px solid var(--atelier-line)',
  w: 'full',
  height: '70vh',
  maxHeight: '640px',
  backgroundColor: 'var(--atelier-surface-highest)',
  filter: 'var(--atelier-image-plate)'
});
const thumbnailImage = css({
  aspectRatio: '16 / 9',
  objectFit: 'cover',
  w: 'full',
  filter: 'var(--atelier-image-rest)'
});

export const AppCarousel = (
  props: Omit<RootProps, 'slideCount'> & {
    images: string[];
    portrait?: boolean;
    previousSlideLabel?: string;
    nextSlideLabel?: string;
    gotoSlideLabel?: string;
    slideLabel?: string;
    startRotationLabel?: string;
    stopRotationLabel?: string;
  }
) => {
  const [index, setIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    setHydrated(true);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    return subscribeToReducedMotion(media, setReducedMotion);
  }, []);
  const {
    images,
    portrait = false,
    previousSlideLabel = 'Previous slide',
    nextSlideLabel = 'Next slide',
    gotoSlideLabel = 'Go to slide',
    slideLabel = 'Screenshot',
    startRotationLabel = 'Start slide rotation',
    stopRotationLabel = 'Stop slide rotation',
    ...rest
  } = props;

  return (
    <UICarousel.Root
      // An unnamed region drops out of the landmark list, and ARIA requires a name wherever
      // `aria-roledescription` is set — the component announced itself as a carousel with
      // nothing to identify it.
      aria-label={slideLabel}
      slideCount={images.length}
      slidesPerPage={1}
      onPageChange={({ page }: { page: number }) => setIndex(page)}
      loop
      translations={{
        nextTrigger: nextSlideLabel,
        prevTrigger: previousSlideLabel,
        indicator: (indicatorIndex) => `${gotoSlideLabel} ${indicatorIndex + 1}`,
        item: (itemIndex, count) => `${slideLabel} ${itemIndex + 1} / ${count}`,
        autoplayStart: startRotationLabel,
        autoplayStop: stopRotationLabel
      }}
      page={index}
      {...rest}
    >
      <UICarousel.Viewport>
        {images.map((image, index) => (
          <UICarousel.Item
            key={index}
            index={index}
            aria-hidden={hydrated ? undefined : index !== 0}
          >
            <img
              src={image}
              alt={`${slideLabel} ${index + 1}`}
              className={portrait ? carouselImagePortrait : carouselImage}
              loading="lazy"
              width={1600}
              height={900}
            />
          </UICarousel.Item>
        ))}
      </UICarousel.Viewport>
      <UICarousel.Context>
        {(carousel) => (
          <>
            <UICarousel.Control hidden={images.length <= 3}>
              <UICarousel.PrevTrigger asChild>
                <IconButton
                  size="sm"
                  variant="link"
                  aria-label={previousSlideLabel}
                  onClickCapture={(event) => {
                    event.preventDefault();
                    navigateCarousel(carousel, 'previous', reducedMotion);
                  }}
                  w="44px"
                  minH="44px"
                >
                  <FaChevronLeft />
                </IconButton>
              </UICarousel.PrevTrigger>
              <UICarousel.IndicatorGroup instant={reducedMotion} />
              <UICarousel.NextTrigger asChild>
                <IconButton
                  size="sm"
                  variant="link"
                  aria-label={nextSlideLabel}
                  onClickCapture={(event) => {
                    event.preventDefault();
                    navigateCarousel(carousel, 'next', reducedMotion);
                  }}
                  w="44px"
                  minH="44px"
                >
                  <FaChevronRight />
                </IconButton>
              </UICarousel.NextTrigger>
            </UICarousel.Control>
            <Grid
              className={images.length <= 3 ? thumbnailStripWide : thumbnailStrip}
              hidden={images.length < 2}
            >
              {images.map((image, idx) => (
                <styled.button
                  className={thumbnailButton}
                  type="button"
                  key={`slide-${idx}`}
                  onClick={() => navigateCarousel(carousel, idx, reducedMotion)}
                  aria-label={`${gotoSlideLabel} ${idx + 1}`}
                  aria-pressed={idx === index}
                  cursor="pointer"
                  border="1px solid"
                  borderColor="var(--atelier-line)"
                  rounded="none"
                  padding="0"
                  _focusVisible={{
                    outline: '2px solid var(--atelier-accent)',
                    outlineOffset: '2px'
                  }}
                >
                  <img
                    src={image}
                    alt=""
                    className={thumbnailImage}
                    loading="lazy"
                    width={320}
                    height={180}
                  />
                </styled.button>
              ))}
            </Grid>
          </>
        )}
      </UICarousel.Context>
    </UICarousel.Root>
  );
};

export const Carousel = AppCarousel;
