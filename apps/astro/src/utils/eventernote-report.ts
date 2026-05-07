import { parseHTML } from 'linkedom';

const BASE_URL = 'https://www.eventernote.com';
export const EVENTERNOTE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 12000;

export const EVENTERNOTE_USERNAME = 'HamP_punipuni';
export const EVENTERNOTE_PROFILE_URL = `${BASE_URL}/users/${EVENTERNOTE_USERNAME}`;

export type EventernoteEvent = {
  id: string;
  title: string;
  url: string;
  dateText: string;
  dateKey: string;
  venue: string;
  venueUrl: string | undefined;
  artists: string[];
};

export type RankedItem = {
  name: string;
  count: number;
  href?: string;
  totalEvents?: number;
  eventDates?: string[];
};

export type MonthlyItem = {
  month: string;
  count: number;
};

export type YearlyItem = {
  year: string;
  count: number;
  cumulative: number;
};

export type EventernoteProfile = {
  username: string;
  displayName: string;
  bio: string;
  following: number;
  followers: number;
  profileEventCount: number;
  favoriteArtists: RankedItem[];
  avatarUrl: string | undefined;
};

export type DateWindowItem = {
  label: string;
  count: number;
};

export type DailyActivityItem = {
  date: string;
  count: number;
};

export type CumulativeArtistItem = {
  month: string;
  values: RankedItem[];
};

export type WeekendStats = {
  totalWeekends: number;
  weekendsWithEvents: number;
  weekendPercentage: number;
  weekendEventCount: number;
  weekendEventPercentage: number;
  weekdayEventCount: number;
  weekdayEventPercentage: number;
};

export type MultiEventDayStats = {
  daysWithMultipleEvents: number;
  daysWithMultipleEventsPercentage: number;
  daysWithMultipleVenues: number;
  daysWithMultipleVenuesPercentage: number;
  totalDaysWithEvents: number;
  maxEventsInDay: number;
  maxEventsInDayDate?: string;
  maxVenuesInDay: number;
  maxVenuesInDayDate?: string;
};

export type StreakItem = {
  currentStreak: number;
  longestStreak: number;
  currentStreakStartDate?: string;
  currentStreakEndDate?: string;
  longestStreakStartDate?: string;
  longestStreakEndDate?: string;
  isActive: boolean;
};

export type FavoriteArtistAttendanceItem = {
  name: string;
  attended: number;
  missed: number;
  total: number;
  pct: number;
};

export type EventernoteReport = {
  profile: EventernoteProfile;
  events: EventernoteEvent[];
  attendedEvents: EventernoteEvent[];
  nextEvents: EventernoteEvent[];
  recentEvents: EventernoteEvent[];
  topArtists: RankedItem[];
  topVenues: RankedItem[];
  monthlyBreakdown: MonthlyItem[];
  yearlyBreakdown: YearlyItem[];
  weekdayBreakdown: RankedItem[];
  monthOfYearBreakdown: RankedItem[];
  dateWindows: DateWindowItem[];
  dailyActivity: DailyActivityItem[];
  cumulativeFavoriteArtists: CumulativeArtistItem[];
  totalEvents: number;
  uniqueVenues: number;
  uniqueArtists: number;
  totalArtistAppearances: number;
  activeDays: number;
  totalDaysInRange: number;
  daysSpentPercentage: number;
  avgEventsPerMonth: number;
  eventsWithoutFavorites: number;
  eventsWithoutFavoritesPercentage: number;
  multiEventDays: number;
  maxEventsInDay?: RankedItem;
  maxVenuesInDay?: RankedItem;
  weekendStats: WeekendStats;
  multiEventDayStats: MultiEventDayStats;
  streaks: {
    daily: StreakItem;
    weekly: StreakItem;
  };
  favoriteArtistAttendance: FavoriteArtistAttendanceItem[];
  weekendEvents: number;
  weekdayEvents: number;
  busiestMonth?: MonthlyItem;
  favoriteDay?: RankedItem;
  dateRange?: string;
  fetchedAt: string;
  cached: boolean;
};

type CachedReport = {
  report: EventernoteReport;
  fetchedAt: number;
};

let cachedReport: CachedReport | undefined;

export async function getEventernoteReport() {
  const now = Date.now();

  if (cachedReport && now - cachedReport.fetchedAt < EVENTERNOTE_CACHE_TTL_MS) {
    return {
      ...cachedReport.report,
      cached: true
    };
  }

  const [profileHtml, eventsHtml] = await Promise.all([
    fetchEventernoteHtml(EVENTERNOTE_PROFILE_URL),
    fetchEventernoteHtml(`${EVENTERNOTE_PROFILE_URL}/events?limit=10000`)
  ]);

  const profile = parseEventernoteProfile(profileHtml);
  const events = parseEventernoteEvents(eventsHtml);
  const favoriteArtistEvents = await fetchFavoriteArtistEvents(profile.favoriteArtists);
  const hydratedProfile = {
    ...profile,
    favoriteArtists: profile.favoriteArtists.map((artist) => {
      const eventData = favoriteArtistEvents.get(artist.name);
      return eventData ? { ...artist, ...eventData } : artist;
    })
  };
  const report = buildEventernoteReport(hydratedProfile, events, now);

  cachedReport = {
    report,
    fetchedAt: now
  };

  return report;
}

export async function fetchEventernoteHtml(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'ham-san.net eventernote report'
      }
    });

    if (!response.ok) {
      throw new Error(`Eventernote responded with ${response.status}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchFavoriteArtistEvents(artists: RankedItem[]) {
  const result = new Map<string, { totalEvents: number; eventDates: string[] }>();
  const artistsWithHref = artists.filter((artist) => artist.href);
  const batchSize = 3;

  for (let index = 0; index < artistsWithHref.length; index += batchSize) {
    const batch = artistsWithHref.slice(index, index + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (artist) => {
        try {
          const html = await fetchEventernoteHtml(`${BASE_URL}${artist.href}/events?limit=10000`);
          const eventDates = parseEventDates(html);
          return [artist.name, { totalEvents: eventDates.length, eventDates }] as const;
        } catch {
          return [artist.name, { totalEvents: 0, eventDates: [] as string[] }] as const;
        }
      })
    );

    for (const [name, eventData] of batchResults) {
      result.set(name, eventData);
    }

    if (index + batchSize < artistsWithHref.length) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  return result;
}

export function parseEventernoteEvents(html: string): EventernoteEvent[] {
  const { document } = parseHTML(html);
  const nodes = Array.from(document.querySelectorAll('.gb_event_list > ul > li'));

  return nodes
    .map((node) => {
      const eventLink = node.querySelector('.event h4 a');
      const title = cleanText(eventLink?.textContent);
      const href = eventLink?.getAttribute('href') ?? '';
      const id = href.match(/\/events\/([^/?#]+)/)?.[1] ?? title;
      const dateText = cleanText(node.querySelector('.date p')?.textContent);
      const dateKey = parseDateKey(dateText);
      const venueLink = node.querySelector('.event .place a');
      const venue = cleanText(venueLink?.textContent);
      const venueHref = venueLink?.getAttribute('href') ?? undefined;
      const artists = Array.from(node.querySelectorAll('.actor li a'))
        .map((artist) => cleanText(artist.textContent))
        .filter(Boolean);

      if (!title || !href || !dateKey) return undefined;

      return {
        id,
        title,
        url: toAbsoluteUrl(href),
        dateText,
        dateKey,
        venue,
        venueUrl: venueHref ? toAbsoluteUrl(venueHref) : undefined,
        artists
      };
    })
    .filter((event): event is EventernoteEvent => Boolean(event));
}

export function parseEventDates(html: string) {
  const { document } = parseHTML(html);

  return Array.from(document.querySelectorAll('.gb_event_list > ul > li .date p'))
    .map((node) => parseDateKey(cleanText(node.textContent)))
    .filter(Boolean);
}

export function parseEventernoteProfile(html: string): EventernoteProfile {
  const { document } = parseHTML(html);
  const profile = document.querySelector('.gb_users_side_profile');
  const scores = Array.from(document.querySelectorAll('.gb_score_table .number a')).map((node) =>
    parseNumber(node.textContent)
  );
  const favoriteArtists = Array.from(document.querySelectorAll('ul.gb_actors_list li'))
    .map((node): RankedItem | undefined => {
      const link = node.querySelector('a');
      const count = node.getAttribute('class')?.match(/c(\d+)/)?.[1];
      const name = cleanText(link?.textContent);

      if (!name) return undefined;

      const href = link?.getAttribute('href') ?? undefined;

      return {
        name,
        count: count ? Number.parseInt(count, 10) : 0,
        ...(href ? { href } : {})
      };
    })
    .filter((artist): artist is RankedItem => Boolean(artist));

  return {
    username: cleanText(profile?.querySelector('.name1')?.textContent) || EVENTERNOTE_USERNAME,
    displayName: cleanText(profile?.querySelector('.name2')?.textContent) || EVENTERNOTE_USERNAME,
    bio: cleanText(profile?.querySelector('.text')?.textContent),
    following: scores[0] ?? 0,
    followers: scores[1] ?? 0,
    profileEventCount: scores[2] ?? 0,
    favoriteArtists,
    avatarUrl: profile?.querySelector('img')?.getAttribute('src') ?? undefined
  };
}

export function buildEventernoteReport(
  profile: EventernoteProfile,
  events: EventernoteEvent[],
  now = Date.now()
): EventernoteReport {
  const today = toJstDateKey(now);
  const sorted = [...events].sort((a, b) => b.dateKey.localeCompare(a.dateKey));
  const attendedEvents = sorted.filter((event) => event.dateKey <= today);
  const nextEvents = [...events]
    .filter((event) => event.dateKey >= today)
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  const recentEvents = attendedEvents.slice(0, 8);
  const rankedArtists = rankItems(attendedEvents.flatMap((event) => event.artists));
  const rankedVenues = rankItems(attendedEvents.map((event) => event.venue).filter(Boolean));
  const topArtists = rankedArtists.slice(0, 50);
  const topVenues = rankedVenues.slice(0, 50);
  const monthlyBreakdown = rankMonths(attendedEvents);
  const yearlyBreakdown = rankYears(attendedEvents);
  const dayCounts = rankItems(attendedEvents.map((event) => weekdayName(event.dateKey)));
  const weekdayBreakdown = orderWeekdays(dayCounts);
  const monthOfYearBreakdown = orderMonths(
    rankItems(attendedEvents.map((event) => monthName(event.dateKey)))
  );
  const dateCounts = rankItems(attendedEvents.map((event) => event.dateKey));
  const venueCountsByDay = rankVenuesByDay(attendedEvents);
  const dateRange = buildDateRange(attendedEvents);
  const totalDaysInRange = countDaysInRange(attendedEvents);
  const dailyActivity = rankDailyActivity(attendedEvents);
  const favoriteArtists = profile.favoriteArtists.length
    ? profile.favoriteArtists
    : rankedArtists.slice(0, 5);
  const cumulativeFavoriteArtists = rankCumulativeFavoriteArtists(attendedEvents, favoriteArtists);
  const weekendEvents = attendedEvents.filter((event) => isWeekend(event.dateKey)).length;
  const favoriteArtistNames = new Set(profile.favoriteArtists.map((artist) => artist.name));
  const eventsWithoutFavorites = favoriteArtistNames.size
    ? attendedEvents.filter(
        (event) => !event.artists.some((artist) => favoriteArtistNames.has(artist))
      ).length
    : 0;
  const weekendStats = calculateWeekendStats(attendedEvents);
  const multiEventDayStats = calculateMultiEventDayStats(attendedEvents);
  const streaks = calculateStreaks(attendedEvents, today);

  return {
    profile,
    events: sorted,
    attendedEvents,
    nextEvents,
    recentEvents,
    topArtists,
    topVenues,
    monthlyBreakdown,
    yearlyBreakdown,
    weekdayBreakdown,
    monthOfYearBreakdown,
    dateWindows: rankDateWindows(attendedEvents, today),
    dailyActivity,
    cumulativeFavoriteArtists,
    totalEvents: attendedEvents.length,
    uniqueVenues: rankedVenues.length,
    uniqueArtists: rankedArtists.length,
    totalArtistAppearances: attendedEvents.reduce((sum, event) => sum + event.artists.length, 0),
    activeDays: dateCounts.length,
    totalDaysInRange,
    daysSpentPercentage: totalDaysInRange ? (dateCounts.length / totalDaysInRange) * 100 : 0,
    avgEventsPerMonth: monthlyBreakdown.length
      ? attendedEvents.length / monthlyBreakdown.length
      : 0,
    eventsWithoutFavorites,
    eventsWithoutFavoritesPercentage: attendedEvents.length
      ? (eventsWithoutFavorites / attendedEvents.length) * 100
      : 0,
    multiEventDays: dateCounts.filter((item) => item.count > 1).length,
    maxEventsInDay: dateCounts[0],
    maxVenuesInDay: venueCountsByDay[0],
    weekendStats,
    multiEventDayStats,
    streaks,
    favoriteArtistAttendance: calculateFavoriteArtistAttendance(profile, attendedEvents, today),
    weekendEvents,
    weekdayEvents: attendedEvents.length - weekendEvents,
    busiestMonth: monthlyBreakdown[0],
    favoriteDay: [...weekdayBreakdown].sort((a, b) => b.count - a.count)[0],
    dateRange,
    fetchedAt: new Date(now).toISOString(),
    cached: false
  };
}

function cleanText(value?: string | null) {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function parseNumber(value?: string | null) {
  const parsed = Number.parseInt((value ?? '').replace(/[^\d]/g, ''), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseDateKey(value: string) {
  return value.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? '';
}

function toAbsoluteUrl(href: string) {
  return new URL(href, BASE_URL).toString();
}

function rankItems(items: string[]): RankedItem[] {
  const counts = new Map<string, number>();

  for (const item of items) {
    const key = cleanText(item);
    if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts, ([name, count]) => ({ name, count })).sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name)
  );
}

function rankMonths(events: EventernoteEvent[]): MonthlyItem[] {
  return rankItems(events.map((event) => event.dateKey.slice(0, 7))).map(({ name, count }) => ({
    month: name,
    count
  }));
}

function rankYears(events: EventernoteEvent[]): YearlyItem[] {
  let cumulative = 0;

  return rankItems(events.map((event) => event.dateKey.slice(0, 4)))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ name, count }) => {
      cumulative += count;
      return {
        year: name,
        count,
        cumulative
      };
    });
}

function rankDailyActivity(events: EventernoteEvent[]): DailyActivityItem[] {
  return rankItems(events.map((event) => event.dateKey))
    .map(({ name, count }) => ({ date: name, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function rankVenuesByDay(events: EventernoteEvent[]) {
  const counts = new Map<string, Set<string>>();

  for (const event of events) {
    if (!counts.has(event.dateKey)) counts.set(event.dateKey, new Set());
    if (event.venue) counts.get(event.dateKey)?.add(event.venue);
  }

  return Array.from(counts, ([name, venues]) => ({ name, count: venues.size })).sort(
    (a, b) => b.count - a.count || b.name.localeCompare(a.name)
  );
}

function calculateWeekendStats(events: EventernoteEvent[]): WeekendStats {
  if (!events.length) {
    return {
      totalWeekends: 0,
      weekendsWithEvents: 0,
      weekendPercentage: 0,
      weekendEventCount: 0,
      weekendEventPercentage: 0,
      weekdayEventCount: 0,
      weekdayEventPercentage: 0
    };
  }

  const keys = events.map((event) => event.dateKey).sort();
  const weekendKeys = new Set<string>();
  const cursor = parseJstDate(keys[0]);
  const last = parseJstDate(keys[keys.length - 1]);

  while (cursor.getTime() <= last.getTime()) {
    const day = cursor.getUTCDay();
    if (day === 0 || day === 6) weekendKeys.add(weekendKey(toJstDateKey(cursor.getTime())));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  const weekendsWithEvents = new Set<string>();
  let weekendEventCount = 0;

  for (const event of events) {
    if (!isWeekend(event.dateKey)) continue;
    weekendEventCount++;
    weekendsWithEvents.add(weekendKey(event.dateKey));
  }

  const weekdayEventCount = events.length - weekendEventCount;

  return {
    totalWeekends: weekendKeys.size,
    weekendsWithEvents: weekendsWithEvents.size,
    weekendPercentage: weekendKeys.size ? (weekendsWithEvents.size / weekendKeys.size) * 100 : 0,
    weekendEventCount,
    weekendEventPercentage: events.length ? (weekendEventCount / events.length) * 100 : 0,
    weekdayEventCount,
    weekdayEventPercentage: events.length ? (weekdayEventCount / events.length) * 100 : 0
  };
}

function calculateMultiEventDayStats(events: EventernoteEvent[]): MultiEventDayStats {
  const byDate = new Map<string, EventernoteEvent[]>();

  for (const event of events) {
    byDate.set(event.dateKey, [...(byDate.get(event.dateKey) ?? []), event]);
  }

  let daysWithMultipleEvents = 0;
  let daysWithMultipleVenues = 0;
  let maxEventsInDay = 0;
  let maxEventsInDayDate: string | undefined;
  let maxVenuesInDay = 0;
  let maxVenuesInDayDate: string | undefined;

  for (const [date, dayEvents] of byDate) {
    const venueCount = new Set(dayEvents.map((event) => event.venue).filter(Boolean)).size;

    if (dayEvents.length > maxEventsInDay) {
      maxEventsInDay = dayEvents.length;
      maxEventsInDayDate = date;
    }

    if (venueCount > maxVenuesInDay) {
      maxVenuesInDay = venueCount;
      maxVenuesInDayDate = date;
    }

    if (dayEvents.length > 1) daysWithMultipleEvents++;
    if (venueCount > 1) daysWithMultipleVenues++;
  }

  return {
    daysWithMultipleEvents,
    daysWithMultipleEventsPercentage: byDate.size
      ? (daysWithMultipleEvents / byDate.size) * 100
      : 0,
    daysWithMultipleVenues,
    daysWithMultipleVenuesPercentage: byDate.size
      ? (daysWithMultipleVenues / byDate.size) * 100
      : 0,
    totalDaysWithEvents: byDate.size,
    maxEventsInDay,
    maxEventsInDayDate,
    maxVenuesInDay,
    maxVenuesInDayDate
  };
}

function calculateFavoriteArtistAttendance(
  profile: EventernoteProfile,
  events: EventernoteEvent[],
  today: string
): FavoriteArtistAttendanceItem[] {
  const counts = new Map<string, number>();
  const dateKeys = events.map((event) => event.dateKey).sort();
  const startDate = dateKeys[0];
  const endDate = today;

  for (const event of events) {
    for (const artist of event.artists) {
      counts.set(artist, (counts.get(artist) ?? 0) + 1);
    }
  }

  return profile.favoriteArtists
    .map((artist) => {
      const attended = counts.get(artist.name) ?? 0;
      const total = artist.eventDates?.length
        ? artist.eventDates.filter((date) => {
            if (startDate && date < startDate) return false;
            if (endDate && date > endDate) return false;
            return true;
          }).length
        : (artist.totalEvents ?? artist.count);
      const missed = Math.max(total - attended, 0);

      return {
        name: artist.name,
        attended,
        missed,
        total,
        pct: total ? Math.round((attended / total) * 1000) / 10 : 0
      };
    })
    .filter((artist) => artist.total > 0)
    .sort((a, b) => b.attended - a.attended || b.pct - a.pct || a.name.localeCompare(b.name));
}

function rankDateWindows(events: EventernoteEvent[], today: string): DateWindowItem[] {
  const windows = [
    { label: 'This year', start: `${today.slice(0, 4)}-01-01` },
    { label: 'Last 30 days', start: shiftDate(today, -30) },
    { label: 'Last 6 months', start: shiftDate(today, -183) },
    { label: 'Last year', start: shiftDate(today, -365) },
    { label: 'Last 2 years', start: shiftDate(today, -730) },
    { label: 'Last 3 years', start: shiftDate(today, -1095) },
    { label: 'All time', start: '0000-00-00' }
  ];

  return windows.map(({ label, start }) => ({
    label,
    count: events.filter((event) => event.dateKey >= start && event.dateKey <= today).length
  }));
}

function rankCumulativeFavoriteArtists(
  events: EventernoteEvent[],
  favoriteArtists: RankedItem[]
): CumulativeArtistItem[] {
  const tracked = favoriteArtists.slice(0, 5).map((artist) => artist.name);
  const cumulative = new Map(tracked.map((artist) => [artist, 0]));
  const months = [...new Set(events.map((event) => event.dateKey.slice(0, 7)))].sort();

  return months.map((month) => {
    for (const event of events.filter((item) => item.dateKey.startsWith(month))) {
      for (const artist of tracked) {
        if (event.artists.includes(artist))
          cumulative.set(artist, (cumulative.get(artist) ?? 0) + 1);
      }
    }

    return {
      month,
      values: tracked.map((artist) => ({
        name: artist,
        count: cumulative.get(artist) ?? 0
      }))
    };
  });
}

function calculateStreaks(events: EventernoteEvent[], today: string) {
  const dayKeys = [...new Set(events.map((event) => event.dateKey))].sort();
  const weekKeys = [...new Set(dayKeys.map(weekKey))].sort();

  return {
    daily: calculateSequentialStreaks(dayKeys, today, 1),
    weekly: calculateSequentialStreaks(weekKeys, weekKey(today), 7)
  };
}

function calculateSequentialStreaks(
  keys: string[],
  currentKey: string,
  stepDays: number
): StreakItem {
  if (!keys.length) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      isActive: false
    };
  }

  let longestStreak = 1;
  let longestStart = keys[0];
  let longestEnd = keys[0];
  let activeStart = keys[0];
  let activeLength = 1;
  const ranges: { start: string; end: string; length: number }[] = [];

  for (let index = 1; index < keys.length; index++) {
    if (daysBetween(keys[index - 1], keys[index]) === stepDays) {
      activeLength++;
    } else {
      ranges.push({ start: activeStart, end: keys[index - 1], length: activeLength });
      activeStart = keys[index];
      activeLength = 1;
    }
  }

  ranges.push({ start: activeStart, end: keys[keys.length - 1], length: activeLength });

  for (const range of ranges) {
    if (range.length > longestStreak) {
      longestStreak = range.length;
      longestStart = range.start;
      longestEnd = range.end;
    }
  }

  const latestRange = ranges[ranges.length - 1];
  const currentGap = daysBetween(keys[keys.length - 1], currentKey);
  const isActive = currentGap <= stepDays;

  return {
    currentStreak: isActive ? latestRange.length : 0,
    longestStreak,
    currentStreakStartDate: isActive ? latestRange.start : undefined,
    currentStreakEndDate: isActive ? latestRange.end : undefined,
    longestStreakStartDate: longestStart,
    longestStreakEndDate: longestEnd,
    isActive
  };
}

function weekdayName(dateKey: string) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'Asia/Tokyo' }).format(
    new Date(`${dateKey}T00:00:00+09:00`)
  );
}

function monthName(dateKey: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'Asia/Tokyo' }).format(
    new Date(`${dateKey}T00:00:00+09:00`)
  );
}

function orderWeekdays(items: RankedItem[]) {
  const order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return order.map((name) => items.find((item) => item.name === name) ?? { name, count: 0 });
}

function orderMonths(items: RankedItem[]) {
  const order = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  return order.map((name) => items.find((item) => item.name === name) ?? { name, count: 0 });
}

function isWeekend(dateKey: string) {
  const day = weekdayName(dateKey);
  return day === 'Saturday' || day === 'Sunday';
}

function weekendKey(dateKey: string) {
  const date = parseJstDate(dateKey);
  const day = date.getUTCDay();
  if (day === 0) date.setUTCDate(date.getUTCDate() - 1);
  return toJstDateKey(date.getTime());
}

function weekKey(dateKey: string) {
  const date = parseJstDate(dateKey);
  const day = date.getUTCDay();
  const distanceFromMonday = day === 0 ? 6 : day - 1;
  date.setUTCDate(date.getUTCDate() - distanceFromMonday);
  return toJstDateKey(date.getTime());
}

function parseJstDate(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function daysBetween(start: string, end: string) {
  return Math.round((parseJstDate(end).getTime() - parseJstDate(start).getTime()) / 86400000);
}

function toJstDateKey(value: number) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(value));
}

function shiftDate(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T00:00:00+09:00`);
  date.setUTCDate(date.getUTCDate() + days);
  return toJstDateKey(date.getTime());
}

function buildDateRange(events: EventernoteEvent[]) {
  if (!events.length) return undefined;

  const keys = events.map((event) => event.dateKey).sort();
  return `${keys[0]} - ${keys[keys.length - 1]}`;
}

function countDaysInRange(events: EventernoteEvent[]) {
  if (!events.length) return 0;

  const keys = events.map((event) => event.dateKey).sort();
  const first = new Date(`${keys[0]}T00:00:00+09:00`).getTime();
  const last = new Date(`${keys[keys.length - 1]}T00:00:00+09:00`).getTime();

  return Math.floor((last - first) / 86400000) + 1;
}
