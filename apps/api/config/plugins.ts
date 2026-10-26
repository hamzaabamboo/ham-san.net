module.exports = ({ env }) => {
  const s3Variables = [
    'S3_ENDPOINT',
    'S3_REGION',
    'S3_BUCKET',
    'S3_ACCESS_KEY_ID',
    'S3_SECRET_ACCESS_KEY',
    'S3_PUBLIC_BASE_URL'
  ];
  const configuredS3Variables = s3Variables.filter((name) => env(name));

  if (configuredS3Variables.length > 0 && configuredS3Variables.length !== s3Variables.length) {
    throw new Error(`Incomplete S3 upload provider configuration: ${s3Variables.join(', ')}`);
  }

  return {
    graphql: {
      enabled: true,
      config: {
        endpoint: '/graphql',
        shadowCRUD: true,
        v4CompatibilityMode: true,
        playgroundAlways: false,
        depthLimit: 10,
        amountLimit: 100,
        apolloServer: {
          tracing: false,
          introspection: true
        }
      }
    },
    ...(configuredS3Variables.length === s3Variables.length
      ? {
          upload: {
            config: {
              provider: 'aws-s3',
              providerOptions: {
                baseUrl: env('S3_PUBLIC_BASE_URL'),
                rootPath: env('S3_ROOT_PATH'),
                s3Options: {
                  endpoint: env('S3_ENDPOINT'),
                  region: env('S3_REGION'),
                  forcePathStyle: true,
                  credentials: {
                    accessKeyId: env('S3_ACCESS_KEY_ID'),
                    secretAccessKey: env('S3_SECRET_ACCESS_KEY')
                  },
                  params: {
                    Bucket: env('S3_BUCKET'),
                    ACL: undefined,
                    CacheControl: 'public, max-age=31536000, immutable'
                  }
                }
              }
            }
          }
        }
      : {})
  };
};
