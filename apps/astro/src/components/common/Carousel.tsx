import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Grid, GridItem, Stack, styled } from 'styled-system/jsx';
import { Carousel as UICarousel, type RootProps } from '~/components/ui/carousel';
import { IconButton } from '~/components/ui/icon-button';

export const AppCarousel = (props: Omit<RootProps, 'slideCount'> & { images: string[] }) => {
  const [index, setIndex] = useState(0);
  const { images, ...rest } = props;

  return (
    <Stack>
      <UICarousel.Root
        slideCount={images.length}
        slidesPerPage={1}
        onPageChange={({ page }: { page: number }) => setIndex(page)}
        loop
        page={String(index)}
        {...rest}
      >
        <UICarousel.Viewport>
          <UICarousel.ItemGroup>
            {images.map((image, index) => (
              <UICarousel.Item key={index} index={index}>
                <styled.img
                  src={image}
                  alt={`Slide ${index}`}
                  aspectRatio="16 / 9"
                  objectFit="contain"
                  w="full"
                />
              </UICarousel.Item>
            ))}
          </UICarousel.ItemGroup>
          <UICarousel.Control>
            <UICarousel.PrevTrigger asChild>
              <IconButton size="sm" variant="link" aria-label="Previous Slide">
                <FaChevronLeft />
              </IconButton>
            </UICarousel.PrevTrigger>
            <UICarousel.IndicatorGroup>
              {images.map((_, index) => (
                <UICarousel.Indicator
                  key={index}
                  index={index}
                  aria-label={`Goto slide ${index + 1}`}
                />
              ))}
            </UICarousel.IndicatorGroup>
            <UICarousel.NextTrigger asChild>
              <IconButton size="sm" variant="link" aria-label="Next Slide">
                <FaChevronRight />
              </IconButton>
            </UICarousel.NextTrigger>
          </UICarousel.Control>
        </UICarousel.Viewport>
      </UICarousel.Root>
      <Grid gridTemplateColumns="repeat(auto-fit, 100px)">
        {images.map((image, idx) => {
          return (
            <GridItem
              key={`slide-${idx}`}
              onClick={() => setIndex(idx)}
              aria-selected={idx === index}
              cursor="pointer"
              border="1px solid"
              borderColor="border.default"
              rounded="l1"
              backgroundColor={{ _selected: 'bg.subtle' }}
            >
              <styled.img
                src={image}
                alt={`Slide ${index}`}
                aspectRatio="1"
                objectFit="contain"
                w="full"
              />
            </GridItem>
          );
        })}
      </Grid>
    </Stack>
  );
};

export const Carousel = AppCarousel;
