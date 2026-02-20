import { Box, HStack, Stack } from 'styled-system/jsx';
import type { NamecardData, NamecardRenderable } from '~/constants/namecard';
import { ProfileNamecard } from './ProfileNamecard';

const resolveRenderable = (value: NamecardRenderable) =>
  typeof value === 'function' ? value() : value;

export const Namecard = ({
  data,
  side = 'front'
}: {
  data: NamecardData;
  side: 'front' | 'back';
  nametag?: boolean;
}) => {
  if (data.theme === 'profile') {
    return (
      <ProfileNamecard
        side={side}
        logos={data.logos}
        front={data.profile.front}
        back={data.profile.back}
        cornerStripeColors={data.profile.cornerStripeColors}
        accentColor={data.profile.accentColor ?? data.color}
      />
    );
  }

  if (side === 'front') {
    return (
      <HStack
        style={{
          WebkitPrintColorAdjust: 'exact',
          ['--main-color' as 'color']: data.color
        }}
        gap="0"
        width="91mm"
        height="55mm"
        bgColor="white"
        _print={{
          pageBreakBefore: 'always',
          printColorAdjust: 'exact'
        }}
      >
        <Box width="5mm" h="full" bgColor="var(--main-color, #1F1F5A)" />
        <Stack flex="1" gap="2" justifyContent="space-around" h="full" py="4" pl="4" pr="2">
          {resolveRenderable(data.content.frontMain)}
        </Stack>
        {data.content.frontRail && resolveRenderable(data.content.frontRail)}
      </HStack>
    );
  }

  return (
    <HStack
      style={{
        WebkitPrintColorAdjust: 'exact',
        ['--main-color' as 'color']: data.color
      }}
      gap="0"
      width="91mm"
      height="55mm"
      bgColor="white"
      _print={{
        printColorAdjust: 'exact'
      }}
    >
      <Stack
        flex="1"
        gap="2"
        justifyContent="space-evenly"
        alignItems="center"
        h="full"
        py="2"
        px="4"
      >
        {resolveRenderable(data.content.backMain)}
      </Stack>
      <Box width="5mm" h="full" bgColor="var(--main-color, #1F1F5A)" />
    </HStack>
  );
};
