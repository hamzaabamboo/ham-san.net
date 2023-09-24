import type { Schema, Attribute } from '@strapi/strapi';

export interface UtilsLink extends Schema.Component {
  collectionName: 'components_utils_links';
  info: {
    displayName: 'link';
    description: '';
  };
  attributes: {
    url: Attribute.String;
    title: Attribute.String;
    type: Attribute.Enumeration<['web', 'github', 'others']>;
  };
}

declare module '@strapi/strapi' {
  export module Shared {
    export interface Components {
      'utils.link': UtilsLink;
    }
  }
}
