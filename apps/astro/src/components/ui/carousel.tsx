'use client';
import {
  Carousel as ArkCarousel,
  CarouselContext,
  useCarouselContext
} from '@ark-ui/react/carousel';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { type ComponentProps, forwardRef } from 'react';
import { createStyleContext } from 'styled-system/jsx';
import { carousel } from 'styled-system/recipes';
import { handleCarouselKeyNavigation, navigateCarousel } from './carousel-motion';

const { withProvider, withContext } = createStyleContext(carousel);

const StyledRoot = withProvider(ArkCarousel.Root, 'root');
export type RootProps = Omit<ComponentProps<typeof StyledRoot>, 'page'> & { page?: number };
export const Root = forwardRef<HTMLDivElement, RootProps>((props, ref) => (
  <StyledRoot
    {...(props as unknown as ComponentProps<typeof StyledRoot>)}
    ref={ref}
  />
));
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
  ComponentProps<typeof StyledIndicatorGroup> & { instant?: boolean }
>((props, ref) => {
  const carouselContext = useCarouselContext();
  const { instant = false, onKeyDownCapture, ...rest } = props;

  return (
    <StyledIndicatorGroup
      {...rest}
      ref={ref}
      onKeyDownCapture={(event) => {
        const orientation =
          event.currentTarget.dataset.orientation === 'vertical' ? 'vertical' : 'horizontal';
        const direction = event.currentTarget.closest('[dir="rtl"]') ? 'rtl' : 'ltr';
        handleCarouselKeyNavigation(
          event,
          carouselContext,
          orientation,
          direction,
          instant,
          onKeyDownCapture
        );
      }}
    >
      {carouselContext.pageSnapPoints.map((_, index) => (
        <Indicator
          key={index}
          index={index}
          readOnly={instant}
          onClick={() => {
            if (instant) navigateCarousel(carouselContext, index, true);
          }}
        />
      ))}
    </StyledIndicatorGroup>
  );
});

export const Context = CarouselContext;
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
  PrevTrigger,
  Context
};
