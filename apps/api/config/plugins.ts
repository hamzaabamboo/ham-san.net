module.exports = {
  graphql: {
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 10,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
        introspection: true
      }
    }
  },
  slugify: {
    enabled: false,
    config: {
      contentTypes: {
        projects: {
          field: 'slug',
          references: 'title'
        },
        tags: {
          field: 'slug',
          references: 'title'
        },
        blogs: {
          field: 'slug',
          references: 'title'
        }
      }
    }
  },
  'local-image-sharp': {
    config: {
      cacheDir: '.image-cache'
    }
  },
  'strapi-chatgpt': {
    enabled: true
  }
};
