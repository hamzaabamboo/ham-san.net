import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Grid, GridItem, Stack, styled } from 'styled-system/jsx';
import { Carousel as _Carousel } from '~/components/ui/carousel';
import { IconButton } from '~/components/ui/icon-button';

export const Carousel = (props: _Carousel.RootProps & { images: string[] }) => {
  const [index, setIndex] = useState(0);
  const { images, ...rest } = props;

  return (
    <Stack>
      <_Carousel.Root
        slidesPerPage={1}
        onPageChange={({ page }) => setIndex(page)}
        loop
        page={index}
        {...rest}
      >
        <_Carousel.Viewport>
          <_Carousel.ItemGroup>
            {images.map((image, index) => (
              <_Carousel.Item key={index} index={index}>
                <styled.img
                  src={image}
                  alt={`Slide ${index}`}
                  aspectRatio="16 / 9"
                  objectFit="contain"
                  w="full"
                />
              </_Carousel.Item>
            ))}
          </_Carousel.ItemGroup>
          <_Carousel.Control>
            <_Carousel.PrevTrigger asChild>
              <IconButton size="sm" variant="link" aria-label="Previous Slide">
                <FaChevronLeft />
              </IconButton>
            </_Carousel.PrevTrigger>
            <_Carousel.IndicatorGroup>
              {images.map((_, index) => (
                <_Carousel.Indicator
                  key={index}
                  index={index}
                  aria-label={`Goto slide ${index + 1}`}
                />
              ))}
            </_Carousel.IndicatorGroup>
            <_Carousel.NextTrigger asChild>
              <IconButton size="sm" variant="link" aria-label="Next Slide">
                <FaChevronRight />
              </IconButton>
            </_Carousel.NextTrigger>
          </_Carousel.Control>
        </_Carousel.Viewport>
      </_Carousel.Root>
      <Grid gridTemplateColumns="repeat(auto-fit, 100px)">
        {images.map((image, idx) => {
          return (
            <GridItem
              key={`slide-${idx}`}
              onClick={() => setIndex(idx)}
              aria-selected={idx === index}
              border="1px solid"
              borderColor="border.default"
              rounded="l1"
              backgroundColor={{ _selected: 'bg.subtle' }}
              cursor="pointer"
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
