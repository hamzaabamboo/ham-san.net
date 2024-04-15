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
      width="var(--width)"
      height="var(--height)"
      perspective="calc(2 * var(--width))"
      perspectiveOrigin="center"
    >
      <Box
        style={{
          viewTransitionName: `namecard-${data.variant}-front`
        }}
        shadow="md"
        animation={{ base: '5s linear infinite spin', _groupHover: 'none' }}
        transformStyle="preserve-3d"
      >
        <Box position="absolute">
          <StyledNamecard data={data} side="front" />
        </Box>
        <Box
          position="absolute"
          transformOrigin="left"
          width="var(--thickness)"
          height="var(--height)"
          backgroundColor="var(--color)"
          transform="rotateY(90deg)"
        />
        <Box
          backfaceVisibility="hidden"
          position="absolute"
          transform="rotateY(180deg) translateZ(var(--thickness))"
        >
          <StyledNamecard data={data} side="back" />
        </Box>
        <Box
          position="absolute"
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
