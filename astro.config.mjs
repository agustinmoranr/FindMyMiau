// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},

	site: 'https://www.encuentratugato.com',
	output: 'server',
	integrations: [react()],
	adapter: vercel(),
  server: {
    host: "0.0.0.0"
  }
});
