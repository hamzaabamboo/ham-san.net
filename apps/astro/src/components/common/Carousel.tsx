import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { css } from 'styled-system/css';
import { Grid, styled } from 'styled-system/jsx';
import { Carousel as UICarousel, type RootProps } from '~/components/ui/carousel';
import { navigateCarousel, subscribeToReducedMotion } from '~/components/ui/carousel-motion';
import { IconButton } from '~/components/ui/icon-button';

const thumbnailButton = css({
  backgroundColor: 'transparent',
  '&[aria-pressed="true"]': { backgroundColor: '#353534' },
  '&:hover': { borderColor: '#ffb000' }
});
const carouselImage = css({ aspectRatio: '16 / 9', objectFit: 'contain', w: 'full' });
const thumbnailImage = css({ aspectRatio: '1', objectFit: 'contain', w: 'full' });

export const AppCarousel = (
  props: Omit<RootProps, 'slideCount'> & {
    images: string[];
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
              className={carouselImage}
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
            <UICarousel.Control>
              <UICarousel.PrevTrigger asChild>
                <IconButton
                  size="sm"
                  variant="link"
                  aria-label={previousSlideLabel}
                  onClickCapture={(event) => {
                    event.preventDefault();
                    navigateCarousel(carousel, 'previous', reducedMotion);
                  }}
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
                >
                  <FaChevronRight />
                </IconButton>
              </UICarousel.NextTrigger>
            </UICarousel.Control>
            <Grid gridTemplateColumns="repeat(auto-fit, 100px)">
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
                  borderColor="#524533"
                  rounded="none"
                  padding="0"
                  _focusVisible={{ outline: '2px solid #ffb000', outlineOffset: '2px' }}
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
