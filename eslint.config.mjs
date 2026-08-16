import next from "eslint-config-next";

const config = [
  ...next,
  {
    ignores: [".next/**", "node_modules/**", "src/types/supabase.ts"]
  }
];

export default config;
