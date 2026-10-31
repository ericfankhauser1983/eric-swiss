import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://eric.swiss',
  trailingSlash: 'always',
  build: { format: 'directory', assets: 'assets' },
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: (info) => 'assets/a-' + String((info.names && info.names[0]) || 'file').replace(/\.[^.]+$/, '').replace(/[^A-Za-z0-9-]/g, '') + '.[hash][extname]',
        },
      },
    },
  },
});
