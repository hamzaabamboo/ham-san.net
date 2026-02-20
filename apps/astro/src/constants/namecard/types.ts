import type { ReactNode } from 'react';

export type NamecardRenderable = ReactNode | (() => ReactNode);

export type NamecardProfileLabels = {
  name?: NamecardRenderable;
  birthday?: NamecardRenderable;
  location?: NamecardRenderable;
  oshi?: NamecardRenderable;
  message?: NamecardRenderable;
};

export type NamecardProfilePerson = {
  name: NamecardRenderable;
  birthday: NamecardRenderable;
  location: NamecardRenderable;
  oshi: NamecardRenderable;
  message: NamecardRenderable;
};

type NamecardProfileIllustrationProp = string | number | Record<string, string | number>;

export type NamecardProfileIllustration = {
  src: string;
  props?: Record<string, NamecardProfileIllustrationProp>;
};

export type NamecardProfileFace = {
  title?: NamecardRenderable;
  footer?: NamecardRenderable;
  labels?: NamecardProfileLabels;
  person?: Partial<NamecardProfilePerson>;
  message?: NamecardRenderable;
  illustration?: NamecardProfileIllustration;
  showFooter?: boolean;
  backTop?: NamecardRenderable;
};

export type NamecardProfile = {
  accentColor?: string;
  cornerStripeColors?: string[];
  front: NamecardProfileFace;
  back?: NamecardProfileFace;
};

export type NamecardDefaultContent = {
  frontMain: NamecardRenderable;
  frontRail?: NamecardRenderable;
  backMain: NamecardRenderable;
};

type NamecardBase = {
  variant: string;
  color: string;
};

export type DefaultNamecardData = NamecardBase & {
  theme: 'default';
  content: NamecardDefaultContent;
};

export type ProfileNamecardData = NamecardBase & {
  theme: 'profile';
  logos: {
    top: string;
    middle?: string;
    bottom: string;
  };
  profile: NamecardProfile;
};

export type NamecardData = DefaultNamecardData | ProfileNamecardData;
