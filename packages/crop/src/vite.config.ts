import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import dts from 'vite-plugin-dts';

export default defineConfig({
  root: 'packages/crop/src/vite-serve',
  server: {
    open: false,
    port: 4300,
  },
  build: {
    outDir: 'dist/out-tsc',
  },
  plugins: [
    nxViteTsPaths(),
    dts({
      entryRoot: 'packages/crop/src/vite-serve',
      tsconfigPath: 'packages/crop/src/tsconfig.lib.json',
    }),
  ],
});
