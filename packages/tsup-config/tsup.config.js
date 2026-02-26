import { defineConfig } from "tsup";

const config = defineConfig({
  entry: [ "src/index.ts", "src/index.tsx", "index.tsx"],
  format: ["cjs", "esm"],
  external: [
    // Always exclude node_modules and core packages
    /^node:.*/,
    /^react($|\/)/,
    /^@tanstack\/react-query/,
    /^@mui\/.*/,

    // Bun-proofing: Prevent nested node_modules bundling
    /^.*\/node_modules\/.*/,
  ], // Specify which modules are external
  splitting: false, // Set to true if you want code splitting in your ESM bundle
  sourcemap: true, // Generates source maps
  clean: true, // Cleans the outDir before building
  // Consider enabling dts if you want to generate declaration files
  dts: true,
});
export const makeConfigWithExternals = (pkg) => {
  return {
    ...config,
    external: [
      ...(config.external || []),
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  };
};

export default config;
