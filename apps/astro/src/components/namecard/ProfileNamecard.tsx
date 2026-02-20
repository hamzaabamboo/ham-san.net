import type { ReactNode } from 'react';
import { Box, HStack, Stack, styled } from 'styled-system/jsx';

type Renderable = ReactNode | (() => ReactNode);

type ProfileLabels = {
  name: Renderable;
  birthday: Renderable;
  location: Renderable;
  oshi: Renderable;
  message: Renderable;
};

type ProfilePerson = {
  name: Renderable;
  birthday: Renderable;
  location: Renderable;
  oshi: Renderable;
  message: Renderable;
};

type ProfileLogos = {
  top: string;
  middle?: string;
  bottom?: string;
};

type ProfileCornerStripeStop = {
  start: number;
  end: number;
  color: string;
};

type ProfileIllustration = {
  src: string;
  props?: Record<string, string | number | Record<string, string | number>>;
};

type ProfileFace = {
  title?: Renderable;
  footer?: Renderable;
  labels?: Partial<ProfileLabels>;
  person?: Partial<ProfilePerson>;
  message?: Renderable;
  illustration?: ProfileIllustration;
  showFooter?: boolean;
  backTop?: Renderable;
};

export type ProfileNamecardProps = {
  side: 'front' | 'back';
  accentColor?: string;
  cornerStripeColors?: string[];
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
const cornerStripeSizeMm = 50.5;
const cornerDotBoxSizeMm = 18;
const cornerDotRadiusMm = 0.5;
const cornerDotStepMm = 3.5;
const cornerDotGridCount = 5;
const cornerStripeRanges = [
  { start: 0, end: 7 },
  { start: 7, end: 11.5 },
  { start: 11.5, end: 16 },
  { start: 16, end: 20.5 }
] as const;
const defaultCornerStripeColors = ['#ef701c', '#fbe67c', '#ba2635', '#f8b500'];
const textStrokeStyle = {
  WebkitTextStroke: '0.5mm rgba(255, 255, 255, 0.95)',
  paintOrder: 'stroke fill'
} as const;
const resolveRenderable = (value: Renderable) => (typeof value === 'function' ? value() : value);

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

const CornerStripes = ({
  corner,
  stops
}: {
  corner: 'top-left' | 'bottom-right';
  stops: ProfileCornerStripeStop[];
}) => {
  return (
    <svg
      aria-hidden="true"
      width={mm(cornerStripeSizeMm)}
      height={mm(cornerStripeSizeMm)}
      viewBox={`0 0 ${cornerStripeSizeMm} ${cornerStripeSizeMm}`}
    >
      {stops.map(({ start, end, color }) => (
        <polygon
          key={`${start}-${end}-${corner}`}
          points={
            corner === 'top-left'
              ? `0,${end} ${end},0 ${start},0 0,${start}`
              : `${cornerStripeSizeMm},${cornerStripeSizeMm - start} ${cornerStripeSizeMm - start},${cornerStripeSizeMm} ${cornerStripeSizeMm - end},${cornerStripeSizeMm} ${cornerStripeSizeMm},${cornerStripeSizeMm - end}`
          }
          fill={color}
        />
      ))}
    </svg>
  );
};

const CornerDots = () => {
  const dotGridSizeMm = cornerDotRadiusMm * 2 + cornerDotStepMm * (cornerDotGridCount - 1);
  const offsetMm = (cornerDotBoxSizeMm - dotGridSizeMm) / 2;

  return (
    <svg
      aria-hidden="true"
      width={mm(cornerDotBoxSizeMm)}
      height={mm(cornerDotBoxSizeMm)}
      viewBox={`0 0 ${cornerDotBoxSizeMm} ${cornerDotBoxSizeMm}`}
    >
      {Array.from({ length: cornerDotGridCount }, (_, y) =>
        Array.from({ length: cornerDotGridCount }, (_, x) => (
          <circle
            key={`${x}-${y}`}
            cx={offsetMm + cornerDotRadiusMm + cornerDotStepMm * x}
            cy={offsetMm + cornerDotRadiusMm + cornerDotStepMm * y}
            r={cornerDotRadiusMm}
            fill="rgba(236, 236, 236, 0.88)"
          />
        ))
      )}
    </svg>
  );
};

const CardShell = ({
  accentColor,
  cornerStripeColors,
  widthMm,
  heightMm,
  children
}: {
  accentColor: string;
  cornerStripeColors: string[];
  widthMm: number;
  heightMm: number;
  children: ReactNode;
}) => {
  const cornerStripeStops = cornerStripeRanges.map((range, index) => ({
    ...range,
    color: cornerStripeColors[index] ?? defaultCornerStripeColors[index]
  }));

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
      <Box
        position="absolute"
        top="0"
        left="0"
        width={mm(cornerStripeSizeMm)}
        height={mm(cornerStripeSizeMm)}
      >
        <CornerStripes corner="top-left" stops={cornerStripeStops} />
        <Box
          position="absolute"
          top="1.5mm"
          left="1.5mm"
          width={mm(cornerDotBoxSizeMm)}
          height={mm(cornerDotBoxSizeMm)}
        >
          <CornerDots />
        </Box>
      </Box>
      <Box
        position="absolute"
        right="0"
        bottom="0"
        width={mm(cornerStripeSizeMm)}
        height={mm(cornerStripeSizeMm)}
      >
        <CornerStripes corner="bottom-right" stops={cornerStripeStops} />
        <Box
          position="absolute"
          right="1.5mm"
          bottom="1.5mm"
          width={mm(cornerDotBoxSizeMm)}
          height={mm(cornerDotBoxSizeMm)}
        >
          <CornerDots />
        </Box>
      </Box>
      {children}
    </Box>
  );
};

const Header = ({ title, logos }: { title: Renderable; logos: ProfileLogos }) => {
  return (
    <HStack justifyContent="space-between" alignItems="center" h="8mm">
      <HStack gap="1.5mm" alignItems="center">
        <styled.img src={logos.top} objectFit="contain" width="9mm" height="9mm" />
        <Box
          style={textStrokeStyle}
          color="var(--main-color)"
          fontFamily='"Fredoka", "Helvetica Neue", Arial, sans-serif'
          fontSize="5mm"
          fontWeight="bold"
          lineHeight="1"
        >
          {resolveRenderable(title)}
        </Box>
      </HStack>
      <HStack gap="1.5mm" justifyContent="flex-end" alignItems="center">
        {logos.middle && <styled.img src={logos.middle} objectFit="contain" height="8mm" />}
      </HStack>
    </HStack>
  );
};

const MessageBox = ({
  label,
  message,
  widthMm,
  heightMm
}: {
  label: Renderable;
  message: Renderable;
  widthMm: number;
  heightMm: number;
}) => {
  return (
    <Box
      style={{
        width: mm(widthMm),
        height: mm(heightMm)
      }}
      position="relative"
      borderColor="var(--main-color)"
      borderRadius="3mm"
      borderWidth="0.45mm"
      py="2mm"
      px="1mm"
      bgColor="white.a9"
    >
      <Box
        style={textStrokeStyle}
        position="absolute"
        top="-1.25mm"
        left="50%"
        transform="translateX(-50%)"
        width="fit-content"
        color="var(--main-color)"
        fontSize="2mm"
        fontWeight="bold"
        lineHeight="1"
        bgColor="white"
        whiteSpace="nowrap"
      >
        {resolveRenderable(label)}
      </Box>
      <Box
        style={textStrokeStyle}
        display="flex"
        alignItems="center"
        height="100%"
        color="var(--main-color)"
        fontSize="1.95mm"
        fontWeight="bold"
        whiteSpace="pre-wrap"
      >
        {resolveRenderable(message)}
      </Box>
    </Box>
  );
};

export const ProfileNamecardFront = ({
  title,
  logos,
  labels,
  person,
  message,
  illustration
}: {
  title: Renderable;
  logos: ProfileLogos;
  labels: ProfileLabels;
  person: ProfilePerson;
  message: Renderable;
  illustration?: ProfileIllustration;
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
          scale={2.15}
          objectFit="contain"
          width="30mm"
          maxHeight="50mm"
          opacity={0.95}
          userSelect="none"
          pointerEvents="none"
          {...illustration.props}
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
        <Header title={title} logos={logos} />
        <Stack gap="2mm">
          <HStack gap="5mm">
            <Box style={textStrokeStyle} color="var(--main-color)" fontSize="2mm" fontWeight="bold">
              {resolveRenderable(labels.name)}
            </Box>
            <Box
              style={textStrokeStyle}
              color="var(--main-color)"
              fontSize="4mm"
              fontWeight="bold"
              lineHeight="1"
            >
              {resolveRenderable(person.name)}
            </Box>
          </HStack>
          <HStack gap="2mm">
            <Box style={textStrokeStyle} color="var(--main-color)" fontSize="2mm" fontWeight="bold">
              {resolveRenderable(labels.birthday)}
            </Box>
            <Box
              style={textStrokeStyle}
              color="var(--main-color)"
              fontSize="2mm"
              fontWeight="bold"
              lineHeight="1.05"
            >
              {resolveRenderable(person.birthday)}
            </Box>
          </HStack>
          <HStack gap="2mm">
            <Box style={textStrokeStyle} color="var(--main-color)" fontSize="2mm" fontWeight="bold">
              {resolveRenderable(labels.location)}
            </Box>
            <Box
              style={textStrokeStyle}
              color="var(--main-color)"
              fontSize="2mm"
              fontWeight="bold"
              lineHeight="1.05"
            >
              {resolveRenderable(person.location)}
            </Box>
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
  backTop,
  message,
  footer,
  showFooter
}: {
  title: Renderable;
  logos: ProfileLogos;
  labels: ProfileLabels;
  backTop: Renderable;
  message: Renderable;
  footer: Renderable;
  showFooter: boolean;
}) => {
  return (
    <Stack
      zIndex="2"
      position="relative"
      gap="3.5mm"
      justifyContent="space-between"
      h="full"
      py="3mm"
      px="3mm"
    >
      <Header title={title} logos={logos} />
      <Box width="100%">{resolveRenderable(backTop)}</Box>
      <Stack gap="1mm">
        <MessageBox label={labels.message} message={message} widthMm={85} heightMm={18} />
        {showFooter && (
          <Box style={textStrokeStyle} color="var(--main-color)" fontSize="2mm" lineHeight="1">
            {resolveRenderable(footer)}
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export const mmToPx = (value: number) => (value * 96) / 25.4;

export const ProfileNamecard = ({
  side,
  accentColor = '#305483',
  cornerStripeColors,
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
  const message = mergedFace.message ?? (side === 'front' ? person.message : '');
  const stripeColors = cornerStripeColors ?? defaultCornerStripeColors;
  const showFooter = mergedFace.showFooter ?? true;
  const backTop = mergedFace.backTop ?? '';

  return (
    <CardShell
      widthMm={widthMm}
      heightMm={heightMm}
      cornerStripeColors={stripeColors}
      accentColor={accentColor}
    >
      {side === 'front' ? (
        <ProfileNamecardFront
          title={title}
          logos={logos}
          labels={labels}
          person={person}
          message={message}
          illustration={mergedFace.illustration}
        />
      ) : (
        <ProfileNamecardBack
          title={title}
          logos={logos}
          labels={labels}
          backTop={backTop}
          message={message}
          footer={footer}
          showFooter={showFooter}
        />
      )}
    </CardShell>
  );
};
