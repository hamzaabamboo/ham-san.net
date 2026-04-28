type HobbyCard = {
  id?: string;
  title?: string | null;
  description?: string | null;
  banner?: string;
};

type HobbySlot = 'hero' | 'learning' | 'sound' | 'flow';

const slotOrder: HobbySlot[] = ['hero', 'learning', 'sound', 'flow'];

const slotKeywords: Record<HobbySlot, string[]> = {
  hero: ['camera', 'photo', 'film', 'photography', 'analog', 'lens', 'gallery', 'street'],
  learning: ['study', 'language', 'japanese', 'typing', 'kanji', 'grammar', 'writing', 'learning'],
  sound: ['music', 'piano', 'sound', 'audio', 'ambient', 'synth', 'guitar', 'drum', 'studio'],
  flow: ['darts', 'kendama', 'yoyo', 'yo-yo', 'flow', 'skill toy', 'skill toys', 'movement']
};

const normalize = (value?: string | null) => (value ?? '').trim().toLowerCase();

const scoreHobby = (slot: HobbySlot, hobby: HobbyCard) => {
  const haystack = `${normalize(hobby.title)} ${normalize(hobby.description)}`;
  const keywordScore = slotKeywords[slot].reduce((score, keyword) => {
    return haystack.includes(keyword) ? score + 10 : score;
  }, 0);

  if (slot === 'hero' && hobby.banner) {
    return keywordScore + 3;
  }

  return keywordScore;
};

const pickBestHobby = (slot: HobbySlot, hobbies: HobbyCard[]) => {
  let bestIndex = -1;
  let bestScore = -1;

  hobbies.forEach((hobby, index) => {
    const score = scoreHobby(slot, hobby);

    if (score > bestScore) {
      bestIndex = index;
      bestScore = score;
    }
  });

  if (bestScore > 0 && bestIndex >= 0) {
    return hobbies.splice(bestIndex, 1)[0];
  }

  if (slot === 'hero') {
    const bannerIndex = hobbies.findIndex((hobby) => hobby.banner);
    if (bannerIndex >= 0) {
      return hobbies.splice(bannerIndex, 1)[0];
    }
  }

  return hobbies.shift();
};

export const orderHobbyCards = <T extends HobbyCard>(hobbies: T[]) => {
  const remaining = [...hobbies];
  const ordered: T[] = [];

  slotOrder.forEach((slot) => {
    const selected = pickBestHobby(slot, remaining);
    if (selected) {
      ordered.push(selected as T);
    }
  });

  return ordered;
};
