module.exports = [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      // Strapi-Response-Format lets the web app request the v4 response shape
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'Strapi-Response-Format'],
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
