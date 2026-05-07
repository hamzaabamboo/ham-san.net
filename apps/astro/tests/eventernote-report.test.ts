import { describe, expect, test } from 'bun:test';
import {
  buildEventernoteReport,
  parseEventernoteEvents,
  parseEventernoteProfile
} from '../src/utils/eventernote-report';

const profileHtml = `
  <div class="gb_users_side_profile clearfix">
    <div class="thumb"><p><img width="50" height="50" alt="HamP_punipuni" src="https://eventernote.example/icon.jpg"></p></div>
    <div class="desc">
      <h2 class="name1">HamP_punipuni</h2>
      <h3 class="name2">ハムP</h3>
    </div>
    <div class="text"><p>タイ人らしい、イベント行きすぎました</p></div>
  </div>
  <div class="gb_score_table">
    <table>
      <tr>
        <td><p class="number"><a href="/users/HamP_punipuni/following">29</a></p></td>
        <td><p class="number"><a href="/users/HamP_punipuni/follower">21</a></p></td>
        <td><p class="number"><a href="/users/HamP_punipuni/events">453</a></p></td>
      </tr>
    </table>
  </div>
  <ul class="gb_actors_list">
    <li class="c3"><a href="/actors/a/1">Aqours</a></li>
    <li class="c1"><a href="/actors/b/2">Liella!</a></li>
  </ul>
`;

const eventsHtml = `
  <div class="gb_event_list clearfix">
    <ul>
      <li class="clearfix">
        <div class="date"><p class="day6">2026-11-14 (<span>土</span>)</p></div>
        <div class="event">
          <h4><a href="/events/464371">Future Live Day.1</a></h4>
          <div class="place">会場: <a href="/places/8">Nagoya Dome</a></div>
          <div class="actor">
            <ul>
              <li>出演者:</li>
              <li><a href="/actors/a/1">Aqours</a></li>
              <li><a href="/actors/b/2">Liella!</a></li>
            </ul>
          </div>
        </div>
      </li>
      <li class="clearfix">
        <div class="date"><p class="day0">2026-05-01 (<span>金</span>)</p></div>
        <div class="event">
          <h4><a href="/events/100">Past Live</a></h4>
          <div class="place">会場: <a href="/places/10">Tokyo Hall</a></div>
          <div class="actor">
            <ul>
              <li>出演者:</li>
              <li><a href="/actors/a/1">Aqours</a></li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>
`;

describe('eventernote report', () => {
  test('parses Eventernote profile and event list markup', () => {
    const profile = parseEventernoteProfile(profileHtml);
    const events = parseEventernoteEvents(eventsHtml);

    expect(profile).toMatchObject({
      username: 'HamP_punipuni',
      displayName: 'ハムP',
      following: 29,
      followers: 21,
      profileEventCount: 453
    });
    expect(events).toHaveLength(2);
    expect(events[0]).toMatchObject({
      title: 'Future Live Day.1',
      dateKey: '2026-11-14',
      venue: 'Nagoya Dome',
      artists: ['Aqours', 'Liella!']
    });
  });

  test('splits future and attended events from the fixed Japan date', () => {
    const report = buildEventernoteReport(
      parseEventernoteProfile(profileHtml),
      parseEventernoteEvents(eventsHtml),
      new Date('2026-05-06T00:00:00+09:00').getTime()
    );

    expect(report.totalEvents).toBe(1);
    expect(report.nextEvents.map((event) => event.title)).toEqual(['Future Live Day.1']);
    expect(report.topArtists[0]).toEqual({ name: 'Aqours', count: 1 });
    expect(report.uniqueVenues).toBe(1);
    expect(report.yearlyBreakdown).toEqual([{ year: '2026', count: 1, cumulative: 1 }]);
    expect(report.weekdayBreakdown.find((day) => day.name === 'Friday')).toEqual({
      name: 'Friday',
      count: 1
    });
  });

  test('builds parity analytics used by the Events dashboard', () => {
    const profile = parseEventernoteProfile(profileHtml);
    const events = [
      {
        id: '1',
        title: 'Friday favorite',
        url: 'https://example.com/events/1',
        dateText: '2026-05-01',
        dateKey: '2026-05-01',
        venue: 'Tokyo Hall',
        venueUrl: undefined,
        artists: ['Aqours']
      },
      {
        id: '2',
        title: 'Saturday first',
        url: 'https://example.com/events/2',
        dateText: '2026-05-02',
        dateKey: '2026-05-02',
        venue: 'Tokyo Hall',
        venueUrl: undefined,
        artists: ['Aqours']
      },
      {
        id: '3',
        title: 'Saturday second',
        url: 'https://example.com/events/3',
        dateText: '2026-05-02',
        dateKey: '2026-05-02',
        venue: 'Osaka Hall',
        venueUrl: undefined,
        artists: ['Original Artist']
      },
      {
        id: '4',
        title: 'Sunday favorite',
        url: 'https://example.com/events/4',
        dateText: '2026-05-03',
        dateKey: '2026-05-03',
        venue: 'Osaka Hall',
        venueUrl: undefined,
        artists: ['Liella!']
      }
    ];
    const report = buildEventernoteReport(
      {
        ...profile,
        favoriteArtists: profile.favoriteArtists.map((artist) =>
          artist.name === 'Aqours'
            ? {
                ...artist,
                totalEvents: 4,
                eventDates: ['2026-05-01', '2026-05-02', '2026-05-04', '2026-05-05']
              }
            : { ...artist, totalEvents: 2, eventDates: ['2026-05-03', '2026-05-05'] }
        )
      },
      events,
      new Date('2026-05-06T00:00:00+09:00').getTime()
    );

    expect(report.eventsWithoutFavorites).toBe(1);
    expect(report.eventsWithoutFavoritesPercentage).toBe(25);
    expect(report.avgEventsPerMonth).toBe(4);
    expect(report.weekendStats).toMatchObject({
      totalWeekends: 1,
      weekendsWithEvents: 1,
      weekendEventCount: 3,
      weekdayEventCount: 1
    });
    expect(report.multiEventDayStats).toMatchObject({
      daysWithMultipleEvents: 1,
      daysWithMultipleVenues: 1,
      totalDaysWithEvents: 3,
      maxEventsInDay: 2,
      maxEventsInDayDate: '2026-05-02',
      maxVenuesInDay: 2,
      maxVenuesInDayDate: '2026-05-02'
    });
    expect(report.streaks.daily.longestStreak).toBe(3);
    expect(report.favoriteArtistAttendance).toEqual([
      { name: 'Aqours', attended: 2, missed: 2, total: 4, pct: 50 },
      { name: 'Liella!', attended: 1, missed: 1, total: 2, pct: 50 }
    ]);
  });
});
