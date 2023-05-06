export default [
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": ["'self'", "data:", "blob:", "s3.ham-san.net"],
          "media-src": ["'self'", "data:", "blob:", "s3.ham-san.net"],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  "strapi::poweredBy",
  {
    name: "strapi::cors",
    config: {
      headers: "*",
      origin: [
        "http://localhost:5173",
        "http://localhost:1337",
        "https://api.ham-san.net",
        "https://v3.ham-san.net",
        "https://ham-san.net",
        "https://hamzaabamboo.github.io",
      ],
    },
  },
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
