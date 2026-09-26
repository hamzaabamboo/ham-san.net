export type RoomPhase = 'day' | 'night';
export type DartsRing = 'bullseye' | 'outer' | 'single' | 'miss';

export const roomPhaseForTokyoHour = (hour: number, manualPhase?: RoomPhase): RoomPhase =>
  manualPhase ?? (hour < 6 || hour >= 18 ? 'night' : 'day');

export const dartsScoreForRing = (ring: DartsRing) =>
  ({ bullseye: 50, outer: 25, single: 10, miss: 0 })[ring];
