import { Box, Center, HStack, Stack, styled } from 'styled-system/jsx';
import { NamecardData } from '~/constants/namecard';

export const Namecard = ({
  data,
  side = 'front'
}: {
  data: NamecardData;
  side: 'front' | 'back';
}) => {
  const { color, content, logoTop, logoBottom, logoMiddle, qrCode, Quote } = data;
  if (side === 'front') {
    return (
      <HStack
        _print={{
          pageBreakBefore: 'always',
          // border: '1px solid',
          printColorAdjust: 'exact'
        }}
        width="91mm"
        height="55mm"
        gap="0"
        bgColor="white"
        style={{
          WebkitPrintColorAdjust: 'exact',
          ['--main-color' as 'color']: color
        }}
      >
        <Box width="5mm" h="full" bgColor="var(--main-color, #1F1F5A)" />
        <Stack flex="1" gap="2" pl="4" pr="2" justifyContent="space-around" h="full" py="4">
          <Stack gap="1" fontSize="xs">
            <styled.p lineHeight="1">{content.firstRow}</styled.p>
            <styled.p>{content.secondRow}</styled.p>
          </Stack>
          <styled.hr borderColor="var(--main-color)" />
          <Stack gap="0">
            <styled.h1 fontWeight="semibold" lineHeight="1.12" fontSize="4xl">
              {content.name}
            </styled.h1>
            <styled.p fontSize="sm">{content.nameSubtitle}</styled.p>
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
        <Stack justifyContent="space-between" py="4" pr="4" h="full" w="84px" alignItems="flex-end">
          <styled.img src={logoTop} />
          {logoMiddle && <styled.img src={logoMiddle} />}
          <styled.img src={logoBottom} />
        </Stack>
      </HStack>
    );
  }
  return (
    <>
      <HStack
        width="91mm"
        height="55mm"
        bgColor="white"
        gap="0"
        border={{ _print: '1px solid' }}
        printColorAdjust={{ _print: 'exact' }}
        style={{
          WebkitPrintColorAdjust: 'exact',
          ['--main-color' as 'color']: color
        }}
      >
        <Stack flex="1" gap="2" justifyContent="space-evenly" alignItems="center" h="full" p="4">
          <Center>
            <styled.img maxW="100px" src={qrCode} />
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
