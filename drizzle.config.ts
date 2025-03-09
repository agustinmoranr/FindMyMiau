import { defineConfig } from 'drizzle-kit';
import { loadEnv } from 'vite';
const { DATABASE_URL } = loadEnv(process.env.NODE_ENV, process.cwd(), '');

export default defineConfig({
	schema: './src/drizzle/schema.ts',
	out: './src/drizzle/supabase/migrations',
	dialect: 'postgresql',
	strict: true,
	verbose: true,
	dbCredentials: {
		url: DATABASE_URL!,
	},
});
