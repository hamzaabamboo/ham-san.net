import { describe, expect, it } from 'bun:test';
import { pickLocale } from '../src/utils/fallbackLocale';
import { cleanProjectCopy } from '../src/utils/project-copy';

describe('cleanProjectCopy', () => {
  it('rewrites the Receipt Parcer title', () => {
    expect(cleanProjectCopy({ title: 'Receipt Parcer', description: 'x' }).title).toBe(
      'Receipt Parser'
    );
  });

  it('rewrites the Vibe Code Creations title and description', () => {
    const result = cleanProjectCopy({ title: 'Vibe Code Creations', description: 'old' });
    expect(result.title).toBe('Small Utility Apps');
    expect(result.description).toBe(
      'A set of small utility apps, including Pixelator, a darts counter, and print prep tools.'
    );
  });

  it('rewrites descriptions keyed on exact titles', () => {
    const cases: Record<string, string> = {
      'ham-san.net': 'Third version of my homepage, built while trying a newer frontend stack.',
      'Link! Like! LoveLive! Chart Viewer': 'Viewer for song charts from Link! Like! Love Live!.',
      'LoveLive! Sorter': 'Sorter for favorite seiyuu and characters.',
      'ぼっちラブカシミュレーター (Bocchi Loveca Simulator)':
        'Solo Loveca simulator with tuned score variance and readable challenge settings.',
      'Kingblade x10iii tuning tool':
        'Tooling for configuring Kingblade x10iii on modern devices with practical IR and QR workflows.',
      'Seiyuu Shirt Generator':
        'Shirt asset generator for seiyuu-themed templates, replacing manual PSD work with print-ready PNG output.',
      'Oshi Cropper (仮)': 'Cropper for preparing can badge files.',
      'Ijigen Day N':
        'Small event day counter with timezone-safe day boundaries and light maintenance.',
      'Kanji Phonetics Component Explorer': 'Tool for studying kanji phonetic components.',
      'Japanese Sentence Alignment Visualizer': 'Tool for viewing sentence alignment.'
    };
    for (const [title, description] of Object.entries(cases)) {
      expect(cleanProjectCopy({ title, description: 'raw' }).description).toBe(description);
    }
  });

  it('completes the truncated Receipt Parcer description only on exact match', () => {
    expect(
      cleanProjectCopy({ title: 'Receipt Parcer', description: 'Parse receipt screenshots into' })
        .description
    ).toBe('Parse receipt screenshots into structured expense data.');
    expect(
      cleanProjectCopy({ title: 'Receipt Parcer', description: 'Already fixed upstream.' })
        .description
    ).toBe('Already fixed upstream.');
  });

  it('rewrites the Homepage V4 placeholder only on exact match', () => {
    expect(
      cleanProjectCopy({
        title: 'Homepage V4',
        description: 'Brand new homepage (again) !\nComing soon...'
      }).description
    ).toBe('Homepage redesign, currently in planning.');
    expect(
      cleanProjectCopy({ title: 'Homepage V4', description: 'Real copy now.' }).description
    ).toBe('Real copy now.');
  });

  it('passes unknown projects through untouched', () => {
    const project = { title: 'Some Project', description: 'Fine as is.', extra: 1 };
    expect(cleanProjectCopy(project)).toEqual(project);
  });
});

describe('pickLocale', () => {
  const item = {
    locale: 'en',
    title: 'EN',
    localizations: [{ locale: 'ja', title: 'JA' }, null, { locale: 'th', title: 'TH' }]
  };

  it('returns the item when the locale already matches', () => {
    expect(pickLocale(item, 'en')?.title).toBe('EN');
  });

  it('returns the matching localization', () => {
    expect(pickLocale(item, 'ja')?.title).toBe('JA');
  });

  it('falls back to the base item for missing locales', () => {
    expect(pickLocale(item, 'fr')?.title).toBe('EN');
  });

  it('returns null for missing items', () => {
    expect(pickLocale(null, 'en')).toBeNull();
  });
});
