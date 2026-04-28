import { describe, expect, test } from 'bun:test';
import { orderHobbyCards } from '../src/utils/hobby-cards';

describe('orderHobbyCards', () => {
  test('maps current hobby titles into the Stitch card layout order', () => {
    const hobbies = [
      { id: '1', title: 'Piano', description: 'Practicing keys and melody.' },
      { id: '2', title: 'Camera', description: 'Street shooting and gear tests.', banner: '/camera.jpg' },
      { id: '3', title: 'Darts', description: 'Rhythm, repetition, and form.' },
      { id: '4', title: 'Typing', description: 'Daily typing drills and language practice.' }
    ];

    expect(orderHobbyCards(hobbies).map((hobby) => hobby.title)).toEqual([
      'Camera',
      'Typing',
      'Piano',
      'Darts'
    ]);
  });

  test('prefers the photography-like entry for the hero slot', () => {
    const hobbies = [
      { id: '1', title: 'Notebook', description: 'General notes.' },
      { id: '2', title: 'Film Photography', description: 'Analog camera work.', banner: '/film.jpg' },
      { id: '3', title: 'Language Study', description: 'Daily study.' },
      { id: '4', title: 'Skill Toys', description: 'Flow and movement.' }
    ];

    expect(orderHobbyCards(hobbies)[0]?.title).toBe('Film Photography');
  });
});
