import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::kameko-post.kameko-post', {
  config: {
    find: { auth: false },
    findOne: { auth: false },
  },
});
