export type CarouselNavigation = {
  pageSnapPoints: number[];
  scrollNext: (instant?: boolean) => void;
  scrollPrev: (instant?: boolean) => void;
  scrollTo: (index: number, instant?: boolean) => void;
};

export type CarouselNavigationAction = 'first' | 'last' | 'next' | 'previous' | number;

export const subscribeToReducedMotion = (
  media: Pick<MediaQueryList, 'addEventListener' | 'matches' | 'removeEventListener'>,
  onChange: (matches: boolean) => void
) => {
  const update = () => onChange(media.matches);
  update();
  media.addEventListener('change', update);
  return () => media.removeEventListener('change', update);
};

export const navigateCarousel = (
  carousel: CarouselNavigation,
  action: CarouselNavigationAction,
  instant: boolean
) => {
  if (action === 'first') carousel.scrollTo(0, instant);
  else if (action === 'last') carousel.scrollTo(carousel.pageSnapPoints.length - 1, instant);
  else if (action === 'next') carousel.scrollNext(instant);
  else if (action === 'previous') carousel.scrollPrev(instant);
  else carousel.scrollTo(action, instant);
};

export const getCarouselKeyAction = (
  key: string,
  orientation: 'horizontal' | 'vertical',
  direction: 'ltr' | 'rtl'
): CarouselNavigationAction | null => {
  if (key === 'Home') return 'first';
  if (key === 'End') return 'last';
  if (orientation === 'vertical') {
    if (key === 'ArrowUp') return 'previous';
    if (key === 'ArrowDown') return 'next';
    return null;
  }
  if (key === 'ArrowLeft') return direction === 'rtl' ? 'next' : 'previous';
  if (key === 'ArrowRight') return direction === 'rtl' ? 'previous' : 'next';
  return null;
};

export const navigateCarouselByKey = (
  carousel: CarouselNavigation,
  key: string,
  orientation: 'horizontal' | 'vertical',
  direction: 'ltr' | 'rtl',
  instant: boolean,
  defaultPrevented: boolean
) => {
  if (defaultPrevented || !instant) return false;
  const action = getCarouselKeyAction(key, orientation, direction);
  if (!action) return false;
  navigateCarousel(carousel, action, true);
  return true;
};

export const handleCarouselKeyNavigation = <
  TEvent extends { defaultPrevented: boolean; key: string; preventDefault: () => void }
>(
  event: TEvent,
  carousel: CarouselNavigation,
  orientation: 'horizontal' | 'vertical',
  direction: 'ltr' | 'rtl',
  instant: boolean,
  onKeyDown?: (event: TEvent) => void
) => {
  onKeyDown?.(event);
  if (
    navigateCarouselByKey(
      carousel,
      event.key,
      orientation,
      direction,
      instant,
      event.defaultPrevented
    )
  )
    event.preventDefault();
};
