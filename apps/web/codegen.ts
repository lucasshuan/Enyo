import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "../api/src/schema.gql",
  documents: "src/lib/apollo/queries/**/*.ts",
  generates: {
    "src/lib/apollo/generated/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
