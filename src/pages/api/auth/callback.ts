import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabaseClient';
import { createUser, getUserByEmail } from '@/drizzle/queries/user';

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
	try {
		const authCode = url.searchParams.get('code');

		if (!authCode) {
			console.error('No code provided', { authCode });
			throw new Error('No code provided');
		}

		const { data, error } = await supabase.auth.exchangeCodeForSession(
			authCode,
		);

		if (error) {
			console.error(error.message, { error });
			throw new Error(error.message);
		}

		const { access_token, refresh_token } = data.session;
		//1. verificar que el usuario no exista previamente
		const userData = await getUserByEmail(data.user.email!).catch((error) => {
			console.error('Error querying user', error);
			throw new Error('Database query failed');
		});

		//2. si el usuario no existe, se inserta en un nuevo registro en la tabla.
		if (!userData || !userData.length) {
			await createUser({
				id: data.user.id,
				name: data.user.user_metadata.full_name,
				email: data.user.email!,
				profile_image_url: data.user.user_metadata.avatar_url,
			}).catch((error) => {
				console.error('Error inserting user', error);
				throw new Error('Database insert failed');
			});
		}

		//3. añadir cookies de acceso
		cookies.set('sb-access-token', access_token, {
			path: '/',
		});
		cookies.set('sb-refresh-token', refresh_token, {
			path: '/',
		});

		return redirect('/dashboard');
	} catch (error: any) {
		console.error('Unhandled error in callback:', error);
		return redirect('/signin?signin_error=unexpected_error');
	}
};
