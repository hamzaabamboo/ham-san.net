import { Box, Center, HStack, Stack, styled } from 'styled-system/jsx';
import type { NamecardRenderable } from './types';

const resolveRenderable = (value: NamecardRenderable) =>
  typeof value === 'function' ? value() : value;

type DefaultFrontMainContentProps = {
  firstRow: NamecardRenderable;
  secondRow: NamecardRenderable;
  name: NamecardRenderable;
  nameSubtitle: NamecardRenderable;
  message: NamecardRenderable;
  contacts?: NamecardRenderable;
};

export const createDefaultFrontMainContent = ({
  firstRow,
  secondRow,
  name,
  nameSubtitle,
  message,
  contacts
}: DefaultFrontMainContentProps) => (
  <>
    <Stack gap="1" fontSize="xs">
      <Box lineHeight="1">{resolveRenderable(firstRow)}</Box>
      <Box>{resolveRenderable(secondRow)}</Box>
    </Stack>
    <styled.hr borderColor="var(--main-color)" />
    <Stack gap="0">
      <Box fontSize="4xl" fontWeight="semibold" lineHeight="1.12">
        {resolveRenderable(name)}
      </Box>
      <Box fontSize="sm">{resolveRenderable(nameSubtitle)}</Box>
    </Stack>
    <Stack gap="1">
      <Stack gap="0" fontSize="xs">
        <styled.p>{resolveRenderable(message)}</styled.p>
      </Stack>
      {contacts && (
        <Stack gap="0" fontSize="0.5rem">
          {resolveRenderable(contacts)}
        </Stack>
      )}
    </Stack>
  </>
);

type DefaultFrontRailContentProps = {
  topLogo?: string;
  middleLogo?: string;
  bottomLogo?: string;
};

export const createDefaultFrontRailContent = ({
  topLogo,
  middleLogo,
  bottomLogo
}: DefaultFrontRailContentProps) => (
  <Stack justifyContent="space-between" alignItems="flex-end" w="84px" h="full" py="4" pr="4">
    {topLogo && (
      <styled.img src={topLogo} aspectRatio="square" objectPosition="center" objectFit="contain" />
    )}
    {middleLogo && <styled.img src={middleLogo} />}
    {bottomLogo && <styled.img src={bottomLogo} />}
  </Stack>
);

type DefaultBackMainContentProps = {
  qrCode: string;
  quote: NamecardRenderable;
};

export const createDefaultBackMainContent = ({ qrCode, quote }: DefaultBackMainContentProps) => (
  <>
    <Center>
      <styled.img src={qrCode} maxW="100px" />
    </Center>
    <HStack alignItems="center">{resolveRenderable(quote)}</HStack>
  </>
);

export const createContactContent = (twitter: string, discord: string) => (
  <>
    <styled.p>
      X (旧: Twitter): <b>{twitter}</b>
    </styled.p>
    <styled.p>
      Discord: <b>{discord}</b>
    </styled.p>
  </>
);
