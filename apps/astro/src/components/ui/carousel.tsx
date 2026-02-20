'use client';
import { Carousel as ArkCarousel, useCarouselContext } from '@ark-ui/react/carousel';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { type ComponentProps, forwardRef } from 'react';
import { createStyleContext } from 'styled-system/jsx';
import { carousel } from 'styled-system/recipes';

const { withProvider, withContext } = createStyleContext(carousel);

export const Root = withProvider(ArkCarousel.Root, 'root');
export type RootProps = ComponentProps<typeof Root>;
export const RootProvider = withProvider(ArkCarousel.RootProvider, 'root');
export const AutoplayTrigger = withContext(ArkCarousel.AutoplayTrigger, 'autoplayTrigger');
export const Control = withContext(ArkCarousel.Control, 'control');
export const Indicator = withContext(ArkCarousel.Indicator, 'indicator');
export const Item = withContext(ArkCarousel.Item, 'item');
export const ItemGroup = withContext(ArkCarousel.ItemGroup, 'itemGroup');
export const NextTrigger = withContext(ArkCarousel.NextTrigger, 'nextTrigger', {
  defaultProps: { children: <FaChevronRight /> }
});
export const PrevTrigger = withContext(ArkCarousel.PrevTrigger, 'prevTrigger', {
  defaultProps: { children: <FaChevronLeft /> }
});

const StyledIndicatorGroup = withContext(ArkCarousel.IndicatorGroup, 'indicatorGroup');
export const IndicatorGroup = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof StyledIndicatorGroup>
>((props, ref) => {
  const carouselContext = useCarouselContext();

  return (
    <StyledIndicatorGroup {...props} ref={ref}>
      {carouselContext.pageSnapPoints.map((_, index) => (
        <Indicator key={index} index={index} />
      ))}
    </StyledIndicatorGroup>
  );
});

export { CarouselContext as Context } from '@ark-ui/react/carousel';
export const Viewport = ItemGroup;
export const Carousel = {
  Root,
  RootProvider,
  AutoplayTrigger,
  Control,
  Indicator,
  IndicatorGroup,
  Item,
  ItemGroup,
  Viewport,
  NextTrigger,
  PrevTrigger
};
