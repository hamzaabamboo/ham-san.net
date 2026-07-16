import type { HobbyLink } from './hobby-content';
import { extractMarkdownLinks } from './hobby-content';

export const dedupeHobbyLinks = (links: HobbyLink[]) => {
  const seen = new Set<string>();
  return links.filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
};

const typingProfilePattern = /(typingstats|keymash|monkeytype|typeracer|10fastfingers)/i;
const rubikResourcePattern =
  /(cube|cubing|\boll\b|\bpll\b|alg|speedcube|jperm|cstimer|cubeskills|bestsiteever)/i;
const photoSourcePattern = /(photo|photos|flickr|instagram|500px|imgur)/i;
const socialFeedPattern = /(x\.com|twitter\.com|bsky\.app|threads\.net|mastodon)/i;

const matchesLink = (pattern: RegExp) => (link: HobbyLink) =>
  pattern.test(`${link.label} ${link.href}`);

export const getTypingProfileLinks = (links: HobbyLink[]) => {
  const deduped = dedupeHobbyLinks(links);
  const profiles = deduped.filter(matchesLink(typingProfilePattern));
  return profiles.length > 0 ? profiles : deduped;
};

export const getRubikResourceLinks = (links: HobbyLink[]) =>
  dedupeHobbyLinks(links).filter(matchesLink(rubikResourcePattern));

export const getPhotoSourceLinks = (links: HobbyLink[]) => {
  const deduped = dedupeHobbyLinks(links);
  const photoLinks = deduped.filter(matchesLink(photoSourcePattern)).sort((a, b) => {
    const score = (link: HobbyLink) =>
      /photos\.app\.goo\.gl|photos\.google/i.test(link.href) ? 0 : 1;
    return score(a) - score(b);
  });
  return photoLinks.length > 0 ? photoLinks : deduped;
};

export const getSocialFeedLinks = (links: HobbyLink[]) =>
  dedupeHobbyLinks(links).filter((link) => socialFeedPattern.test(link.href));

const embedLinkSelectors: Record<string, (links: HobbyLink[]) => HobbyLink[]> = {
  'typing-stats': getTypingProfileLinks,
  'rubik-algorithms': getRubikResourceLinks,
  'photo-gallery': getPhotoSourceLinks,
  'twitter-feed': getSocialFeedLinks,
  'darts-board': () => [],
  'piano-chords': () => []
};

export const getHobbyEmbedLinks = (type: string, links: HobbyLink[]) =>
  (embedLinkSelectors[type] ?? dedupeHobbyLinks)(links);

export const getHobbyRenderedLinks = ({
  type,
  links,
  body = '',
  images = []
}: {
  type: string;
  links: HobbyLink[];
  body?: string;
  images?: string[];
}) => {
  const embedLinks =
    type === 'photo-gallery' && images.length > 0 ? [] : getHobbyEmbedLinks(type, links);
  return dedupeHobbyLinks([...embedLinks, ...extractMarkdownLinks(body)]);
};
