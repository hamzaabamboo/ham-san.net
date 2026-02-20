export type NamecardPageLink = {
  id: 'twitter' | 'discord' | 'eventernote' | 'github' | 'tierlist' | 'home' | 'spotify' | 'lastfm';
  url: string;
  labelKey?: string;
  label?: string;
  valueKey?: string;
  value?: string;
};

export const NAMECARD_PAGE_LINKS: NamecardPageLink[] = [
  {
    id: 'twitter',
    url: 'https://twitter.com/HamP_punipuni',
    labelKey: 'contact.twitter',
    value: '@HamP_punipuni'
  },
  {
    id: 'discord',
    url: 'https://discordapp.com/users/260776161032798208',
    label: 'Discord',
    value: 'hamp'
  },
  {
    id: 'eventernote',
    url: 'https://www.eventernote.com/users/HamP_punipuni',
    label: 'Eventernote',
    value: 'HamP_punipuni'
  },
  {
    id: 'github',
    url: 'https://github.com/hamzaabamboo',
    labelKey: 'contact.github',
    value: 'hamzaabamboo'
  },
  {
    id: 'tierlist',
    url: 'https://tiermaker.com/list/actors-actresses/love-live-seiyuu-2023-15476088/3747761',
    labelKey: 'name-card.tierlist',
    valueKey: 'name-card.tierlist-description'
  },
  {
    id: 'home',
    url: '/',
    labelKey: 'name-card.home'
  },
  {
    id: 'spotify',
    url: 'https://open.spotify.com/user/dick8a92koqqd6ti4sqtz40co?si=3c9b1b72a71a47be',
    label: 'Spotify'
  },
  {
    id: 'lastfm',
    url: 'https://www.last.fm/user/Betcrg',
    label: 'last.fm'
  }
];
