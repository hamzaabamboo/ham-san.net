import { Box, Center, HStack, Stack, styled } from 'styled-system/jsx';
import { NamecardData } from '~/constants/namecard';
import { ProfileNamecard } from './ProfileNamecard';

export const Namecard = ({
  data,
  side = 'front',
  nametag = false
}: {
  data: NamecardData;
  side: 'front' | 'back';
  nametag?: boolean;
}) => {
  const { color, content, logoTop, logoBottom, logoMiddle, qrCode, Quote } = data;

  if (side === 'front' && data.style === 'profile' && data.profile) {
    return (
      <ProfileNamecard
        side="front"
        accentColor={data.profile.accentColor ?? color}
        logos={{
          top: logoTop ?? logoBottom,
          middle: logoMiddle,
          bottom: logoBottom
        }}
        front={data.profile.front}
        back={data.profile.back}
      />
    );
  }

  if (side === 'back' && data.style === 'profile' && data.profile) {
    return (
      <ProfileNamecard
        side="back"
        accentColor={data.profile.accentColor ?? color}
        logos={{
          top: logoTop ?? logoBottom,
          middle: logoMiddle,
          bottom: logoBottom
        }}
        front={data.profile.front}
        back={data.profile.back}
      />
    );
  }

  if (side === 'front') {
    return (
      <HStack
        style={{
          WebkitPrintColorAdjust: 'exact',
          ['--main-color' as 'color']: color
        }}
        gap="0"
        width="91mm"
        height="55mm"
        bgColor="white"
        _print={{
          pageBreakBefore: 'always',
          // border: '1px solid',
          printColorAdjust: 'exact'
        }}
      >
        <Box width="5mm" h="full" bgColor="var(--main-color, #1F1F5A)" />
        <Stack flex="1" gap="2" justifyContent="space-around" h="full" py="4" pl="4" pr="2">
          <Stack gap="1" fontSize={nametag ? '0.6rem' : 'xs'}>
            <styled.p lineHeight="1">{content.firstRow}</styled.p>
            <styled.p>{content.secondRow}</styled.p>
          </Stack>
          <styled.hr borderColor="var(--main-color)" />
          <Stack gap="0">
            <styled.h1 fontSize={nametag ? '5xl' : '4xl'} fontWeight="semibold" lineHeight="1.12">
              {content.name}
            </styled.h1>
            <styled.p fontSize={nametag ? '0.6rem' : 'sm'}>{content.nameSubtitle}</styled.p>
          </Stack>
          <Stack gap="1">
            <Stack gap="0" fontSize="xs">
              <styled.p>สวัสดีครับ!（サワディーカー）</styled.p>
            </Stack>
            <Stack gap="0" fontSize="0.5rem">
              <styled.p>
                X (旧: Twitter): <b>@HamP_punipuni</b>
              </styled.p>
              <styled.p>
                Discord: <b>HamP</b>
              </styled.p>
            </Stack>
          </Stack>
        </Stack>
        <Stack justifyContent="space-between" alignItems="flex-end" w="84px" h="full" py="4" pr="4">
          <styled.img
            src={logoTop}
            aspectRatio="square"
            objectPosition="center"
            objectFit="contain"
          />
          {logoMiddle && <styled.img src={logoMiddle} />}
          <styled.img src={logoBottom} />
        </Stack>
      </HStack>
    );
  }
  return (
    <>
      <HStack
        style={{
          WebkitPrintColorAdjust: 'exact',
          ['--main-color' as 'color']: color
        }}
        gap="0"
        border={
          {
            // _print: '1px solid'
          }
        }
        width="91mm"
        height="55mm"
        bgColor="white"
        printColorAdjust={{ _print: 'exact' }}
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
          <Center>
            <styled.img src={qrCode} maxW="100px" />
          </Center>
          <HStack alignItems="center">
            <Quote />
          </HStack>
        </Stack>
        <Box width="5mm" h="full" bgColor="var(--main-color, #1F1F5A)" />
      </HStack>
    </>
  );
};
