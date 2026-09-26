import cache from '~/constants/kameko-posts.json';

export type KamekoMedia = {
  url: string;
  width: number | null;
  height: number | null;
  alt: string | null;
};

export type KamekoPost = {
  id: string;
  url: string;
  createdAt: string;
  text: string;
  author: { userName: string; name: string };
  hashtags: string[];
  mentions: Array<{ userName: string; name: string }>;
  media: KamekoMedia[];
};

export type KamekoSubject = { name: string; handle: string | null };

export type KamekoEntry = {
  id: string;
  url: string;
  postedAt: string;
  shotOn: string;
  event: string;
  subjects: KamekoSubject[];
  caption: string;
  tags: string[];
  media: KamekoMedia[];
};

const galleryTag = 'カメコしてみた';
const dateLine =
  /^(?:(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})|(\d{1,2})月(\d{1,2})日(?:[（(][^）)]*[）)])?)\s*(.*)$/;
const performerTags: Record<string, string> = {
  楡井希実: '楡井希実',
  楡井陽菜: '楡井希実',
  櫻井陽菜: '櫻井陽菜',
  櫻井ひな: '櫻井陽菜',
  葉山風花: '葉山風花',
  野中ここな: '野中ここな',
  来栖りん: '来栖りん',
  菅叶和: '菅叶和',
  百瀬安由未: '百瀬安由未'
};
const handlePattern = /@([A-Za-z0-9_]{1,15})/g;
const hashtagOnly = /^(#\S+\s*)+$/;
const honorific = /(さん|様)$/;
const endearment = /ちゃん$/;
const dayMs = 86_400_000;

const decode = (text: string) =>
  text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');

const blocksOf = (text: string) =>
  decode(text)
    .replace(/https:\/\/t\.co\/\S+/g, '')
    .split(/\n\s*\n/)
    .map((block) =>
      block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
    )
    .filter((block) => block.length > 0);

const stripHandles = (line: string) => line.replace(handlePattern, '').replace(/\s+/g, ' ').trim();
const plainName = (name: string) => name.replace(/^#/, '').replace(honorific, '').trim();
const handlesIn = (line: string) => [...line.matchAll(handlePattern)].map((match) => match[1]);

const shotDate = (line: string, postedAt: string) => {
  const [, fullYear, fullMonth, fullDay, shortMonth, shortDay] = line.match(dateLine) ?? [];
  const postedJst = new Date(Date.parse(postedAt) + 9 * 3_600_000);
  const month = fullMonth ?? shortMonth;
  const day = fullDay ?? shortDay;
  const year =
    fullYear ??
    String(
      Number(month) > postedJst.getUTCMonth() + 1
        ? postedJst.getUTCFullYear() - 1
        : postedJst.getUTCFullYear()
    );
  const parsed = Date.parse(
    `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00+09:00`
  );
  const posted = Date.parse(postedAt);
  const postedYear = new Date(posted).getUTCFullYear();
  const shifted = Date.parse(
    `${postedYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00+09:00`
  );
  const date =
    posted - parsed > 300 * dayMs && Math.abs(posted - shifted) < 14 * dayMs ? shifted : parsed;
  return new Date(date + 9 * 3_600_000).toISOString().slice(0, 10);
};

const knownNames = (posts: KamekoPost[]) => {
  const byHandle = new Map<string, string>();
  const handleCounts = new Map<string, Map<string, number>>();
  posts.forEach((post) =>
    blocksOf(post.text)
      .flat()
      .forEach((line) => {
        const handles = handlesIn(line);
        const name = plainName(stripHandles(line));
        if (
          handles.length === 1 &&
          name &&
          !name.includes('#') &&
          name !== handles[0] &&
          name.length <= 12
        ) {
          byHandle.set(handles[0].toLowerCase(), name);
          const counts = handleCounts.get(name) ?? new Map<string, number>();
          counts.set(handles[0], (counts.get(handles[0]) ?? 0) + 1);
          handleCounts.set(name, counts);
        }
      })
  );
  const canonicalHandle = new Map(
    [...handleCounts].map(([name, counts]) => [name, [...counts].sort((a, b) => b[1] - a[1])[0][0]])
  );
  return { byHandle, canonicalHandle };
};

const isSubsequence = (needle: string, haystack: string) => {
  let index = 0;
  for (const char of haystack) if (char === needle[index]) index += 1;
  return index === needle.length;
};

const looksLikeName = (line: string) =>
  line.length <= 12 &&
  !/[、。！!？?〜～ーw…]$/.test(line) &&
  !line.includes('#') &&
  !/\s/.test(line);

export const parseKamekoPosts = (posts: KamekoPost[]): KamekoEntry[] => {
  const { byHandle, canonicalHandle } = knownNames(posts);
  const names = [...new Set(byHandle.values())];
  const nameFor = (handle: string, fallback: string) =>
    byHandle.get(handle.toLowerCase()) ?? (plainName(fallback) || handle);
  const matchName = (line: string) => {
    const candidate = plainName(line).replace(endearment, '');
    return names.find(
      (name) => name === candidate || (candidate.length >= 2 && isSubsequence(candidate, name))
    );
  };

  return [...posts]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .map((post): KamekoEntry => {
      const blocks = blocksOf(post.text);
      const lines = blocks.flat();
      const hasDate = dateLine.test(lines[0] ?? '');
      const template = post.hashtags.includes(galleryTag);
      const inlineEvent = hasDate ? (lines[0].match(dateLine)?.[6] ?? '').trim() : '';
      const eventLines = !hasDate
        ? []
        : inlineEvent
          ? [inlineEvent]
          : blocks[0].length > 1
            ? blocks[0].slice(1)
            : (blocks[1]?.slice(0, 1) ?? []);
      const consumed = new Set<string>(hasDate ? [lines[0], ...eventLines] : []);
      const subjects = new Map<string, KamekoSubject>();
      const addSubject = (subject: KamekoSubject) => {
        const key = subject.handle?.toLowerCase() ?? subject.name;
        if (![...subjects.values()].some((item) => item.name === subject.name))
          subjects.set(key, subject);
      };

      const knownHandlesIn = (line: string) =>
        handlesIn(line).filter((handle) => byHandle.has(handle.toLowerCase()));
      eventLines.forEach((line) =>
        knownHandlesIn(line).forEach((handle) =>
          addSubject({ name: nameFor(handle, handle), handle })
        )
      );
      lines
        .filter((line) => !consumed.has(line) && !hashtagOnly.test(line))
        .forEach((line, index) => {
          const performerLine = (line.match(/#\S+/g) ?? []).some(
            (tag) => performerTags[tag.slice(1)]
          );
          if (performerLine && line.replace(/#\S+/g, '').trim().length <= 12) {
            consumed.add(line);
            return;
          }
          const handles = handlesIn(line);
          const rest = stripHandles(line);
          if (handles.length > 0 && (rest === '' || rest.length <= 12)) {
            handles.forEach((handle) =>
              addSubject({ name: nameFor(handle, handles.length === 1 ? rest : ''), handle })
            );
            consumed.add(line);
            return;
          }
          const parts = line.split(/[、,]/).map((part) => part.trim());
          const matched = parts.map(matchName);
          if (matched.every(Boolean) && (hasDate || index === 0)) {
            matched.forEach((name) =>
              addSubject({
                name: name as string,
                handle: [...byHandle].find(([, value]) => value === name)?.[0] ?? null
              })
            );
            consumed.add(line);
            return;
          }
          if (template && hasDate && index === 0 && subjects.size === 0 && looksLikeName(line)) {
            addSubject({ name: plainName(line), handle: null });
            consumed.add(line);
          }
        });

      post.hashtags.forEach((tag) => {
        const name = performerTags[tag];
        if (name)
          addSubject({
            name,
            handle: [...byHandle].find(([, value]) => value === name)?.[0] ?? null
          });
      });

      const caption = lines
        .filter((line) => !consumed.has(line) && !hashtagOnly.test(line))
        .map((line) => line.replace(new RegExp(`#${galleryTag}`, 'g'), '').trim())
        .filter(Boolean)
        .join('\n');

      return {
        id: post.id,
        url: post.url,
        postedAt: post.createdAt,
        shotOn: hasDate
          ? shotDate(lines[0], post.createdAt)
          : new Date(Date.parse(post.createdAt) + 9 * 3_600_000).toISOString().slice(0, 10),
        event: eventLines
          .join(' ')
          .replace(/#/g, '')
          .replace(handlePattern, (match, handle: string) =>
            byHandle.has(handle.toLowerCase()) ? '' : match
          )
          .replace(/\s+/g, ' ')
          .trim(),
        subjects: [...subjects.values()].map((subject) => ({
          name: subject.name,
          handle: canonicalHandle.get(subject.name) ?? subject.handle
        })),
        caption,
        tags: [...new Set(post.hashtags.filter((tag) => tag !== galleryTag))],
        media: post.media
      };
    });
};

export const kamekoAccount = cache.account;
export const kamekoFetchedAt = cache.fetchedAt;
const unifyEvents = (entries: KamekoEntry[]) => {
  const keyOf = (event: string) => event.replace(/\s+/g, '');
  const variants = new Map<string, Map<string, number>>();
  entries.forEach((entry) => {
    const counts = variants.get(keyOf(entry.event)) ?? new Map<string, number>();
    counts.set(entry.event, (counts.get(entry.event) ?? 0) + 1);
    variants.set(keyOf(entry.event), counts);
  });
  return entries.map((entry) => ({
    ...entry,
    event:
      [...(variants.get(keyOf(entry.event)) ?? [])].sort((a, b) => b[1] - a[1])[0]?.[0] ??
      entry.event
  }));
};

export const kamekoEntries = unifyEvents(
  parseKamekoPosts(cache.posts as KamekoPost[]).filter((entry) => entry.subjects.length > 0)
);
