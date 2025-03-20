// With `output: 'static'` configured:
// export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabaseClient';
import type { Provider } from '@supabase/supabase-js';
import { ROUTES } from '@/lib/routes';

const PUBLIC_DOMAIN_URL = import.meta.env.PUBLIC_DOMAIN_URL;

export const POST: APIRoute = async ({ request, url, cookies, redirect }) => {
	const hasRedirectParam = url.searchParams.has('redirect');
	const redirectParam = url.searchParams.get('redirect') ?? '';

	const apiSignInCallbackUrl = `${PUBLIC_DOMAIN_URL}${ROUTES.API_SIGN_IN_CALLBACK}`;
	const urlWithRedirect = `${apiSignInCallbackUrl}?redirect=${encodeURIComponent(
		redirectParam,
	)}`;

	const formData = await request.formData();
	// const email = formData.get('email')?.toString();
	// const password = formData.get('password')?.toString();
	const provider = formData.get('provider')?.toString();
	const validProviders = ['google', 'facebook'];
	if (provider && validProviders.includes(provider)) {
		const redirectTo = hasRedirectParam
			? urlWithRedirect
			: apiSignInCallbackUrl;
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: provider as Provider,
			options: {
				redirectTo,
			},
		});

		if (error) {
			return new Response(error.message, { status: 500 });
		}

		return redirect(data.url);
	}

	// if (!email || !password) {
	// 	return new Response('Email and password are required', { status: 400 });
	// }

	// const { data, error } = await supabase.auth.signInWithPassword({
	// 	email,
	// 	password,
	// });

	// if (error) {
	// 	return new Response(error.message, { status: 500 });
	// }

	// const { access_token, refresh_token } = data.session;
	// cookies.set('sb-access-token', access_token, {
	// 	path: '/',
	// });
	// cookies.set('sb-refresh-token', refresh_token, {
	// 	path: '/',
	// });
	return redirect(hasRedirectParam ? redirectParam : ROUTES.DASHBOARD);
};
