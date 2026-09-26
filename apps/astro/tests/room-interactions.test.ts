import { describe, expect, test } from 'bun:test';
import { dartsScoreForRing, roomPhaseForTokyoHour } from '../src/components/home/room-logic';

describe('room interaction logic', () => {
  test('uses a manual light phase until automatic mode is restored', () => {
    expect(roomPhaseForTokyoHour(12)).toBe('day');
    expect(roomPhaseForTokyoHour(12, 'night')).toBe('night');
    expect(roomPhaseForTokyoHour(22, 'day')).toBe('day');
    expect(roomPhaseForTokyoHour(22, undefined)).toBe('night');
  });

  test('scores the darts board rings used by the mini-game', () => {
    expect(dartsScoreForRing('bullseye')).toBe(50);
    expect(dartsScoreForRing('outer')).toBe(25);
    expect(dartsScoreForRing('single')).toBe(10);
    expect(dartsScoreForRing('miss')).toBe(0);
  });
});
