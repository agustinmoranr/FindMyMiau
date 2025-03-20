interface ImportMetaEnv {
	readonly DATABASE_URL: string;
	readonly PUBLIC_SUPABASE_URL: string;
	readonly PUBLIC_SUPABASE_ANON_KEY: string;
	readonly PUBLIC_DOMAIN_URL: string;
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare namespace App {
	interface Locals {
		session: import('@supabase/supabase-js').Session | null;
		user: import('@supabase/supabase-js').Session['user'] | null;
	}
}
