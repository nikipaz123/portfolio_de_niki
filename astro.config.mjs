import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://nikiipaz.github.io',
  publicDir: 'public',
  srcDir: 'src',
  outDir: 'dist',
  devToolbar: {
    enabled: false,
  },
});
