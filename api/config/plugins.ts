module.exports = ({ env }) => ({
  graphql: {
    config: {
      endpoint: "/graphql",
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 10,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
        introspection: true,
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
  "strapi-chatgpt": {
    enabled: true,
  },
  upload: {
    config: {
      provider: "aws-s3", // For community providers pass the full package name (e.g. provider: 'strapi-provider-upload-google-cloud-storage')
      providerOptions: {
        // baseUrl: env("S3_ENDPOINT"),
        s3Options: {
          accessKeyId: env("AWS_ACCESS_KEY_ID"),
          secretAccessKey: env("AWS_ACCESS_SECRET"),
          endpoint: env("S3_ENDPOINT"), // e.g. "s3.fr-par.scw.cloud"
          region: env("AWS_REGION"),
          params: {
            ACL: "private",
            signedUrlExpires: 60 * 60 * 24 * 7,
            Bucket: env("AWS_BUCKET"),
          },
        },
        s3ForcePathStyle: true,
      },
    },
  },
});
