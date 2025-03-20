// With `output: 'static'` configured:
// export const prerender = false;
import { ROUTES } from '@/lib/routes';
import { supabase } from '@/lib/supabaseClient';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies, redirect, locals }) => {
	await supabase.auth.signOut();
	locals.session = null;
	locals.user = null;
	cookies.delete('sb-access-token', { path: '/' });
	cookies.delete('sb-refresh-token', { path: '/' });
	return redirect(ROUTES.LOGIN);
};
