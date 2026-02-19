import type { Schema, Struct } from '@strapi/strapi';

export interface UtilsLink extends Struct.ComponentSchema {
  collectionName: 'components_utils_links';
  info: {
    description: '';
    displayName: 'link';
  };
  attributes: {
    title: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['web', 'github', 'others']>;
    url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'utils.link': UtilsLink;
    }
  }
}
