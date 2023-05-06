export default [
  "strapi::errors",
  "strapi::security",
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
