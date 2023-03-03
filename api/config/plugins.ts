import responseCachePlugin from "apollo-server-plugin-response-cache";

// set this to whatever you believe should be the max age for your cache control
const MAX_AGE = 60;

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
        introspection: true,
        persistedQueries: { ttl: 10 * MAX_AGE }, // we set this to be a factor of 10, somewhat arbitrary
        cacheControl: { defaultMaxAge: MAX_AGE },
        plugins: [responseCachePlugin()],
      },
    },
  },
  slugify: {
    enabled: false,
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
  "local-image-sharp": {
    config: {
      cacheDir: ".image-cache",
    },
  },
};
