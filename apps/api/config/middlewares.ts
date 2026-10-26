export default ({ env }) => [
  'strapi::errors',
  ...(env('S3_PUBLIC_BASE_URL')
    ? [
        {
          name: 'strapi::security',
          config: {
            contentSecurityPolicy: {
              useDefaults: true,
              directives: {
                'img-src': [
                  "'self'",
                  'data:',
                  'blob:',
                  'https://market-assets.strapi.io',
                  new URL(env('S3_PUBLIC_BASE_URL')).origin
                ],
                'media-src': ["'self'", 'data:', 'blob:', new URL(env('S3_PUBLIC_BASE_URL')).origin]
              }
            }
          }
        }
      ]
    : ['strapi::security']),
  'strapi::poweredBy',
  {
    name: 'strapi::cors',
    config: {
      headers: '*',
      origin: [
        'http://localhost:5173',
        'http://localhost:1337',
        'https://api.ham-san.net',
        'https://v3.ham-san.net',
        'https://ham-san.net',
        'https://hamzaabamboo.github.io'
      ]
    }
  },
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public'
];
