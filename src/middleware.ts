import { defineMiddleware } from 'astro:middleware';
import { supabase } from './lib/supabaseClient';
import { isProtectedRoute, ROUTES } from './lib/routes';

export const onRequest = defineMiddleware(
	async ({ request, redirect, locals, cookies }, next) => {
		const url = new URL(request.url);

		//1. try to get the current session
		const {
			data: { session },
		} = await supabase.auth.getSession();
		//2. If we don't have a session but we have tokens, try to set the session
		if (!session) {
			const accessToken = cookies.get('sb-access-token');
			const refreshToken = cookies.get('sb-refresh-token');

			if (accessToken && refreshToken) {
				try {
					const { data, error } = await supabase.auth.setSession({
						refresh_token: refreshToken.value,
						access_token: accessToken.value,
					});

					if (error) {
						// Clear invalid cookies
						cookies.delete('sb-access-token', { path: '/' });
						cookies.delete('sb-refresh-token', { path: '/' });
					} else {
						// Update our session variable with the newly set session
						locals.session = data.session;
						locals.user = data.session?.user || null;

						// Continue to the next middleware or route handler
						return next();
					}
				} catch (error) {
					// Clear cookies on any error
					cookies.delete('sb-access-token', { path: '/' });
					cookies.delete('sb-refresh-token', { path: '/' });
				}
			}
		} else {
			locals.session = session;
			locals.user = session?.user || null;
		}

		// 3. redirect if the user is not logged in and the route is protected
		if (isProtectedRoute(url.pathname) && !locals.session) {
			return redirect(
				`${ROUTES.LOGIN}?redirect=${encodeURIComponent(url.pathname)}`,
			);
		}

		return next();
	},
);
