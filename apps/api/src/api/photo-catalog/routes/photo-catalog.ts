import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::photo-catalog.photo-catalog', {
  config: {
    find: { auth: false },
  },
});
