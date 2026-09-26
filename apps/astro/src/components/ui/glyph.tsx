import type { IconBaseProps } from 'react-icons';
import {
  MdOutlineArrowBack,
  MdOutlineInsertChartOutlined,
  MdOutlineBolt,
  MdOutlineCategory,
  MdOutlineClose,
  MdOutlineCloudOff,
  MdOutlineDarkMode,
  MdOutlineDescription,
  MdOutlineEmojiEvents,
  MdOutlineEvent,
  MdOutlineEventBusy,
  MdOutlineExplore,
  MdOutlineHome,
  MdOutlineLocalFireDepartment,
  MdOutlineMail,
  MdOutlineMenu,
  MdOutlineMilitaryTech,
  MdOutlineNorthEast,
  MdOutlineOpenInNew,
  MdOutlinePerson,
  MdOutlinePhotoCamera,
  MdOutlinePhotoLibrary,
  MdOutlineSend,
  MdOutlineTimeline,
  MdOutlineWeekend,
  MdOutlineWorkOutline
} from 'react-icons/md';

// Replaces the Material Symbols icon font, which shipped 320,688 B of variable font on every
// route behind a render-blocking stylesheet to draw these glyphs. These render to inline SVG
// in the SSR output, so the `.astro` call sites cost no request and no client JS.
//
// The OUTLINED Material cut, not Font Awesome Solid: the first migration silently swapped
// hairline strokes for solid masses, which reads wrong in a system built on exposed
// structural borders and 1px rules.
const ICONS = {
  arrow_back: MdOutlineArrowBack,
  // `MdOutlineBarChart` is byte-identical to the solid cut; this one is a real outline.
  bar_chart: MdOutlineInsertChartOutlined,
  bolt: MdOutlineBolt,
  category: MdOutlineCategory,
  close: MdOutlineClose,
  cloud_off: MdOutlineCloudOff,
  crown: MdOutlineEmojiEvents,
  dark_mode: MdOutlineDarkMode,
  description: MdOutlineDescription,
  event: MdOutlineEvent,
  event_busy: MdOutlineEventBusy,
  explore: MdOutlineExplore,
  home: MdOutlineHome,
  local_fire_department: MdOutlineLocalFireDepartment,
  mail: MdOutlineMail,
  menu: MdOutlineMenu,
  north_east: MdOutlineNorthEast,
  open_in_new: MdOutlineOpenInNew,
  person: MdOutlinePerson,
  photo_camera: MdOutlinePhotoCamera,
  photo_library: MdOutlinePhotoLibrary,
  send: MdOutlineSend,
  social_leaderboard: MdOutlineMilitaryTech,
  timeline: MdOutlineTimeline,
  weekend: MdOutlineWeekend,
  work: MdOutlineWorkOutline
} as const;

export type GlyphName = keyof typeof ICONS;

// `name` is typed, not `string`: an unmapped name must be a build error. A silent fallback
// made a wrong icon unrepresentable as a failure, and eight `/events` cards shipped drawing
// a chain-link because of it.
export const Glyph = ({ name, style, ...rest }: { name: GlyphName } & IconBaseProps) => {
  const Drawn = ICONS[name];
  // `style` is destructured so a call site passing one cannot silently drop what we merge.
  return <Drawn aria-hidden="true" {...rest} style={style} />;
};
