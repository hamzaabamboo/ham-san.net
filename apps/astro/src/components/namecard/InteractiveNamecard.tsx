import { Box, Stack, styled } from 'styled-system/jsx';
import { NamecardData } from '~/constants/namecard';
import { Namecard } from './Namecard';

const StyledNamecard = styled(Namecard);

export const InteractiveNamecard = ({ data }: { data: NamecardData }) => {
  return (
    <Stack
      className="group"
      style={{
        ['--height' as 'height']: '55mm',
        ['--width' as 'width']: '91mm',
        ['--thickness' as 'minHeight']: '2mm',
        ['--color' as 'color']: data.color
      }}
      gap="0"
      w="full"
      width="var(--width)"
      h="full"
      height="var(--height)"
      perspective="var(--width)"
      perspectiveOrigin="center"
    >
      <Box
        className="card"
        position="relative"
        shadow="md"
        transition="transform"
        animation={{ base: '5s linear infinite spin', _groupHover: 'none' }}
        transformStyle="preserve-3d"
        transitionTimingFunction="linear"
        transitionDelay="0.1s"
        transitionDuration="1s"
      >
        <Box
          style={{
            viewTransitionName: `namecard-${data.variant}-front`
          }}
          backfaceVisibility="hidden"
          position="absolute"
          top="0"
          left="0"
          transform="rotate3d(0,0,0,0deg)"
        >
          <StyledNamecard data={data} side="front" />
        </Box>
        <Box
          position="absolute"
          top="0"
          left="0"
          transformOrigin="left"
          transform="rotate3d(0,1,0,90deg)"
          width="var(--thickness)"
          height="var(--height)"
          backgroundColor="var(--color)"
        />
        <Box
          backfaceVisibility="hidden"
          position="absolute"
          top="0"
          left="0"
          transform="rotate3d(0,1,0,180deg) translate3d(0,0,var(--thickness))"
          transition="transform"
        >
          <StyledNamecard data={data} side="back" />
        </Box>
        <Box
          position="absolute"
          top="0"
          right="0"
          transformOrigin="right"
          transform="rotate3d(0,1,0,-90deg)"
          width="var(--thickness)"
          height="var(--height)"
          backgroundColor="white"
        />
      </Box>
    </Stack>
  );
};
