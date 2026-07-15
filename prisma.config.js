const { defineConfig } = require('prisma/config');
require('dotenv').config();

module.exports = defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Connect to the direct URL (session-mode pooler) for CLI schema migrations
    url: process.env.DIRECT_URL,
  },
});
