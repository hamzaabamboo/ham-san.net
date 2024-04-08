import { Box, Stack, styled } from 'styled-system/jsx';
import { NamecardData } from '~/constants/namecard';
import { Namecard } from './Namecard';

const StyledNamecard = styled(Namecard);

export const InteractiveNamecard = ({ data }: { data: NamecardData }) => {
  return (
    <Stack
      className="group"
      position="relative"
      gap="0"
      w="full"
      width="91mm"
      h="full"
      height="55mm"
      perspective="91mm"
      perspectiveOrigin="center"
    >
      <Box
        className="card"
        transition="transform"
        transitionTimingFunction="linear"
        transitionDelay="0.1s"
        transitionDuration="1s"
        transform={{ base: 'rotateY(0deg)', _groupHover: 'rotateY(180deg)' }}
        transformStyle="preserve-3d"
      >
        <Box
          backfaceVisibility="hidden"
          position="absolute"
          top="0"
          left="0"
          shadow="md"
          transform={{ base: 'rotateY(0deg)' }}
        >
          <StyledNamecard data={data} side="front" />
        </Box>
        <Box
          backfaceVisibility="hidden"
          position="absolute"
          top="0"
          left="0"
          shadow="md"
          transition="transform"
          transform={{ base: 'rotateY(180deg)' }}
        >
          <StyledNamecard data={data} side="back" />
        </Box>
      </Box>
    </Stack>
  );
};
