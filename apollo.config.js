module.exports = {
  client: {
    service: {
      name: "ares-local",
      localSchemaFile: "apps/api/src/schema.gql",
    },
    includes: ["apps/web/src/**/*.{ts,tsx,graphql,gql}"],
    excludes: [
      "**/node_modules/**",
      "**/__tests__/**",
      "**/*.test.*",
      "**/*.spec.*",
    ],
  },
};
