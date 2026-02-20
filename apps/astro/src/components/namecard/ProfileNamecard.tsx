import type { ReactNode } from 'react';
import { Box, HStack, Stack, styled } from 'styled-system/jsx';

type ProfileLabels = {
  name: string;
  birthday: string;
  location: string;
  oshi: string;
  message: string;
};

type ProfilePerson = {
  name: string;
  birthday: string;
  location: string;
  oshi: string;
  message: string;
};

type ProfileLogos = {
  top: string;
  middle?: string;
  bottom?: string;
};

type ProfileIllustration = {
  src: string;
};

type ProfileFace = {
  title?: string;
  brand?: string;
  footer?: string;
  labels?: Partial<ProfileLabels>;
  person?: Partial<ProfilePerson>;
  message?: string;
  illustration?: ProfileIllustration;
  showBrand?: boolean;
  showFooter?: boolean;
  showValues?: boolean;
};

export type ProfileNamecardProps = {
  side: 'front' | 'back';
  accentColor?: string;
  widthMm?: number;
  heightMm?: number;
  logos: ProfileLogos;
  front: ProfileFace;
  back?: ProfileFace;
};

const defaultLabels: ProfileLabels = {
  name: '名前',
  birthday: '誕生日',
  location: '住んでる場所',
  oshi: '推し',
  message: '同じ学校のみんなにひとこと'
};

const emptyPerson: ProfilePerson = {
  name: '',
  birthday: '',
  location: '',
  oshi: '',
  message: ''
};

const mm = (value: number) => `${value}mm`;
const textStrokeStyle = {
  WebkitTextStroke: '0.5mm rgba(255, 255, 255, 0.95)',
  paintOrder: 'stroke fill'
} as const;

const mergeFace = (front: ProfileFace, back?: ProfileFace) => ({
  ...front,
  ...back,
  labels: {
    ...front.labels,
    ...back?.labels
  },
  person: {
    ...front.person,
    ...back?.person
  }
});

const CardShell = ({
  accentColor,
  widthMm,
  heightMm,
  children
}: {
  accentColor: string;
  widthMm: number;
  heightMm: number;
  children: ReactNode;
}) => {
  return (
    <Box
      style={{
        WebkitPrintColorAdjust: 'exact',
        ['--main-color' as 'color']: accentColor
      }}
      position="relative"
      width={mm(widthMm)}
      height={mm(heightMm)}
      bgColor="white"
      overflow="hidden"
      _print={{
        pageBreakBefore: 'always',
        printColorAdjust: 'exact'
      }}
    >
      <Box position="absolute" top="0" left="0" width="50.5mm" height="50.5mm">
        <Box
          inset="0"
          position="absolute"
          backgroundImage="linear-gradient(135deg, #79aedd 0 7mm, #9ad68b 7mm 11.5mm, #f1b167 11.5mm 16mm, #79aedd 16mm 20.5mm, transparent 20.5mm 100%)"
          clipPath="polygon(0 0, 100% 0, 0 100%)"
        />
        <Box position="absolute" top="1.5mm" left="1.5mm" width="18mm" height="18mm">
          <Box
            inset="0"
            position="absolute"
            backgroundImage="radial-gradient(circle, rgba(236, 236, 236, 0.88) 0.35mm, transparent 0.36mm)"
            backgroundSize="3.5mm 3.5mm"
          />
        </Box>
      </Box>
      <Box position="absolute" right="0" bottom="0" width="50.5mm" height="50.5mm">
        <Box
          inset="0"
          position="absolute"
          backgroundImage="linear-gradient(-45deg, #79aedd 0 7mm, #9ad68b 7mm 11.5mm, #f1b167 11.5mm 16mm, #79aedd 16mm 20.5mm, transparent 20.5mm 100%)"
          clipPath="polygon(100% 0, 100% 100%, 0 100%)"
        />
        <Box position="absolute" right="1.5mm" bottom="1.5mm" width="18mm" height="18mm">
          <Box
            inset="0"
            position="absolute"
            backgroundImage="radial-gradient(circle, rgba(236, 236, 236, 0.88) 0.35mm, transparent 0.36mm)"
            backgroundSize="3.5mm 3.5mm"
          />
        </Box>
      </Box>
      {children}
    </Box>
  );
};

const Header = ({
  title,
  logos,
  showBrand
}: {
  title: string;
  logos: ProfileLogos;
  showBrand: boolean;
}) => {
  return (
    <HStack justifyContent="space-between" alignItems="center" h="8mm">
      <HStack gap="1.5mm" alignItems="center">
        <styled.img src={logos.top} objectFit="contain" width="9mm" height="9mm" />
        <styled.p
          style={textStrokeStyle}
          color="var(--main-color)"
          fontFamily='"Fredoka", "Helvetica Neue", Arial, sans-serif'
          fontSize="5mm"
          fontWeight="bold"
          lineHeight="1"
        >
          {title}
        </styled.p>
      </HStack>
      {showBrand && (
        <HStack gap="1.5mm" justifyContent="flex-end" alignItems="center">
          {logos.middle && <styled.img src={logos.middle} objectFit="contain" height="4mm" />}
          {logos.bottom && <styled.img src={logos.bottom} objectFit="contain" height="4mm" />}
        </HStack>
      )}
    </HStack>
  );
};

const MessageBox = ({
  label,
  message,
  widthMm,
  heightMm
}: {
  label: string;
  message: string;
  widthMm: number;
  heightMm: number;
}) => {
  return (
    <Box
      position="relative"
      borderColor="var(--main-color)"
      borderRadius="3mm"
      borderWidth="0.45mm"
      width={mm(widthMm)}
      height={mm(heightMm)}
      py="2mm"
      px="1mm"
      bgColor="white.a9"
    >
      <styled.p
        style={textStrokeStyle}
        position="absolute"
        top="-1.5mm"
        left="50%"
        transform="translateX(-50%)"
        width="fit-content"
        px="1mm"
        color="var(--main-color)"
        fontSize="2mm"
        fontWeight="bold"
        lineHeight="1"
        bgColor="white"
        whiteSpace="nowrap"
      >
        {label}
      </styled.p>
      <styled.p
        style={textStrokeStyle}
        color="var(--main-color)"
        fontSize="2mm"
        fontWeight="bold"
        lineHeight="1.25"
        whiteSpace="pre-wrap"
      >
        {message}
      </styled.p>
    </Box>
  );
};

export const ProfileNamecardFront = ({
  title,
  logos,
  labels,
  person,
  message,
  footer,
  illustration,
  showBrand,
  showFooter
}: {
  title: string;
  logos: ProfileLogos;
  labels: ProfileLabels;
  person: ProfilePerson;
  message: string;
  footer: string;
  illustration?: ProfileIllustration;
  showBrand: boolean;
  showFooter: boolean;
}) => {
  return (
    <>
      {illustration && (
        <styled.img
          src={illustration.src}
          zIndex="1"
          position="absolute"
          right="4.5mm"
          bottom="-14mm"
          scale="2.15"
          objectFit="contain"
          width="30mm"
          maxHeight="50mm"
          opacity={0.95}
          userSelect="none"
          pointerEvents="none"
        />
      )}
      <Stack
        zIndex="2"
        position="relative"
        justifyContent="space-between"
        h="full"
        py="3mm"
        px="3mm"
      >
        <Header title={title} logos={logos} showBrand={showBrand} />
        <Stack gap="2mm">
          <HStack gap="5mm">
            <styled.p
              style={textStrokeStyle}
              color="var(--main-color)"
              fontSize="2mm"
              fontWeight="bold"
            >
              {labels.name}
            </styled.p>
            <styled.p
              style={textStrokeStyle}
              color="var(--main-color)"
              fontSize="4mm"
              fontWeight="bold"
              lineHeight="1"
            >
              {person.name}
            </styled.p>
          </HStack>
          <HStack gap="2mm">
            <styled.p
              style={textStrokeStyle}
              color="var(--main-color)"
              fontSize="2mm"
              fontWeight="bold"
            >
              {labels.birthday}
            </styled.p>
            <styled.p
              style={textStrokeStyle}
              color="var(--main-color)"
              fontSize="2mm"
              fontWeight="bold"
              lineHeight="1.05"
            >
              {person.birthday}
            </styled.p>
          </HStack>
          <HStack gap="2mm">
            <styled.p
              style={textStrokeStyle}
              color="var(--main-color)"
              fontSize="2mm"
              fontWeight="bold"
            >
              {labels.location}
            </styled.p>
            <styled.p
              style={textStrokeStyle}
              color="var(--main-color)"
              fontSize="2mm"
              fontWeight="bold"
              lineHeight="1.05"
            >
              {person.location}
            </styled.p>
          </HStack>
        </Stack>
        <Stack gap="1.8mm">
          <MessageBox label={labels.message} message={message} widthMm={46} heightMm={20.5} />
        </Stack>
      </Stack>
    </>
  );
};

export const ProfileNamecardBack = ({
  title,
  logos,
  labels,
  person,
  message,
  footer,
  showBrand,
  showFooter,
  showValues
}: {
  title: string;
  logos: ProfileLogos;
  labels: ProfileLabels;
  person: ProfilePerson;
  message: string;
  footer: string;
  showBrand: boolean;
  showFooter: boolean;
  showValues: boolean;
}) => {
  return (
    <Stack
      zIndex="2"
      position="relative"
      gap="4.5mm"
      justifyContent="space-between"
      h="full"
      py="3mm"
      px="3mm"
    >
      <Header title={title} logos={logos} showBrand={showBrand} />
      <Stack gap="4.5mm" width="100%">
        <HStack gap="2mm">
          <styled.p
            style={textStrokeStyle}
            color="var(--main-color)"
            fontSize="2.4mm"
            fontWeight="bold"
          >
            {labels.name}
          </styled.p>
          {showValues && (
            <styled.p
              style={textStrokeStyle}
              color="var(--main-color)"
              fontSize="4mm"
              fontWeight="bold"
              lineHeight="1.05"
            >
              {person.name}
            </styled.p>
          )}
        </HStack>
        <HStack gap="20mm">
          <HStack gap="2mm">
            <styled.p
              style={textStrokeStyle}
              color="var(--main-color)"
              fontSize="2mm"
              fontWeight="bold"
            >
              {labels.birthday}
            </styled.p>
            {showValues && (
              <styled.p
                style={textStrokeStyle}
                color="var(--main-color)"
                fontSize="3.4mm"
                fontWeight="bold"
                lineHeight="1.05"
              >
                {person.birthday}
              </styled.p>
            )}
          </HStack>
          <HStack gap="2mm">
            <styled.p
              style={textStrokeStyle}
              color="var(--main-color)"
              fontSize="2.4mm"
              fontWeight="bold"
            >
              {labels.oshi}
            </styled.p>
            {showValues && (
              <styled.p
                style={textStrokeStyle}
                color="var(--main-color)"
                fontSize="3.4mm"
                fontWeight="bold"
                lineHeight="1.05"
              >
                {person.oshi}
              </styled.p>
            )}
          </HStack>
        </HStack>
      </Stack>
      <Stack gap="1.8mm" alignItems="center">
        <MessageBox label={labels.message} message={message} widthMm={85} heightMm={20} />
        {showFooter && (
          <styled.p style={textStrokeStyle} color="var(--main-color)" fontSize="2mm" lineHeight="1">
            {footer}
          </styled.p>
        )}
      </Stack>
    </Stack>
  );
};

export const mmToPx = (value: number) => (value * 96) / 25.4;

export const ProfileNamecard = ({
  side,
  accentColor = '#305483',
  widthMm = 91,
  heightMm = 55,
  logos,
  front,
  back
}: ProfileNamecardProps) => {
  const mergedFace = side === 'front' ? front : mergeFace(front, back);
  const labels = { ...defaultLabels, ...mergedFace.labels };
  const person = { ...emptyPerson, ...mergedFace.person };
  const title = mergedFace.title ?? 'PROFILE CARD';
  const footer = mergedFace.footer ?? '©IKZL';
  const message = mergedFace.message ?? person.message;
  const showBrand = mergedFace.showBrand ?? side === 'back';
  const showFooter = mergedFace.showFooter ?? true;
  const showValues = mergedFace.showValues ?? side === 'front';

  return (
    <CardShell widthMm={widthMm} heightMm={heightMm} accentColor={accentColor}>
      {side === 'front' ? (
        <ProfileNamecardFront
          title={title}
          logos={logos}
          labels={labels}
          person={person}
          message={message}
          footer={footer}
          illustration={mergedFace.illustration}
          showBrand={showBrand}
          showFooter={showFooter}
        />
      ) : (
        <ProfileNamecardBack
          title={title}
          logos={logos}
          labels={labels}
          person={person}
          message={message}
          footer={footer}
          showBrand={showBrand}
          showFooter={showFooter}
          showValues={showValues}
        />
      )}
    </CardShell>
  );
};
