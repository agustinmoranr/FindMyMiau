import { loadEnv } from 'vite';
const { DATABASE_URL } = loadEnv(process.env.NODE_ENV, process.cwd(), '');
// import * as schema from './schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
const client = postgres(DATABASE_URL!);
export const db = drizzle({ client });
