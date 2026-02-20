import { DEFAULT_NAMECARDS } from './default-cards';
import { PROFILE_NAMECARDS } from './profile-cards';
import type { NamecardData } from './types';

export * from './types';

export const NAMECARDS: NamecardData[] = [...DEFAULT_NAMECARDS, ...PROFILE_NAMECARDS];
