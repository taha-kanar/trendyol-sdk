import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts', drift: 'src/drift/index.ts' },
  format: ['esm', 'cjs'],
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.js' }),
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  shims: true, // import.meta.url in the CJS build, for locating openapi/
  external: ['node:fs', 'node:url', 'node:path'],
  target: 'es2022',
});
