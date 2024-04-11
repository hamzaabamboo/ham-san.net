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
        style={{
          viewTransitionName: `namecard-${data.variant}-front`
        }}
        position="relative"
        shadow="md"
        transition="transform"
        animation={{ base: '5s linear infinite spin', _groupHover: 'none' }}
        transitionTimingFunction="linear"
        transitionDelay="0.1s"
        transitionDuration="1s"
        transformStyle="preserve-3d"
      >
        <Box backfaceVisibility="hidden" position="absolute" top="0" left="0">
          <StyledNamecard data={data} side="front" />
        </Box>
        <Box
          position="absolute"
          top="0"
          left="0"
          transformOrigin="left"
          width="var(--thickness)"
          height="var(--height)"
          backgroundColor="var(--color)"
          transform="rotateY(90deg)"
        />
        <Box
          backfaceVisibility="hidden"
          position="absolute"
          top="0"
          left="0"
          transition="transform"
          transform="rotateY(180deg) translateZ(var(--thickness))"
        >
          <StyledNamecard data={data} side="back" />
        </Box>
        <Box
          position="absolute"
          top="0"
          right="0"
          transformOrigin="right"
          width="var(--thickness)"
          height="var(--height)"
          backgroundColor="white"
          transform="rotateY(-90deg)"
        />
      </Box>
    </Stack>
  );
};
