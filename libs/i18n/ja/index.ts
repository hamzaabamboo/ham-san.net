import aboutMe from './about-me.json';
import blog from './blog.json';
import common from './common.json';
import contact from './contact.json';
import home from './home.json';
import nameCard from './name-card.json';
import note from './note.json';
import project from './project.json';

export default {
  'about-me': aboutMe,
  blog: blog,
  common: common,
  contact: contact,
  home: home,
  'name-card': nameCard,
  note: note,
  project: project
} as const;
