import { Box, Stack, styled } from 'styled-system/jsx';
import { NamecardData } from '~/constants/namecard';
import { Namecard } from './Namecard';

const StyledNamecard = styled(Namecard);

export const InteractiveNamecard = ({ data }: { data: NamecardData }) => {
  return (
    <Stack
      gap="0"
      position="relative"
      perspective="91mm"
      perspectiveOrigin="center"
      className="group"
      h="full"
      w="full"
      width="91mm"
      height="55mm"
    >
      <Box
        className="card"
        transition="transform"
        transitionTimingFunction="linear"
        transitionDuration="1s"
        transitionDelay="0.1s"
        transform={{ base: 'rotateY(0deg)', _groupHover: 'rotateY(180deg)' }}
        transformStyle="preserve-3d"
      >
        <Box
          backfaceVisibility="hidden"
          position="absolute"
          transform={{ base: 'rotateY(0deg)' }}
          shadow="md"
          top="0"
          left="0"
        >
          <StyledNamecard data={data} side="front" />
        </Box>
        <Box
          backfaceVisibility="hidden"
          position="absolute"
          transition="transform"
          transform={{ base: 'rotateY(180deg)' }}
          shadow="md"
          top="0"
          left="0"
        >
          <StyledNamecard data={data} side="back" />
        </Box>
      </Box>
    </Stack>
  );
};
