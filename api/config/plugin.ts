module.exports = {
  graphql: {
    config: {
      endpoint: "/graphql",
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 7,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
        introspection: true
      },
    },
  },
  slugify: {
    enabled: true,
    config: {
      contentTypes: {
        projects: {
          field: "slug",
          references: "title",
        },
        tags: {
          field: "slug",
          references: "title",
        },
        blogs: {
          field: "slug",
          references: "title",
        },
      },
    },
  },
};
