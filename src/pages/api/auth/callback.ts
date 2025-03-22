import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabaseClient';
import {
	createUser,
	createUserImage,
	getUserByEmail,
	updateUser,
} from '@/drizzle/queries/user';
import { ROUTES } from '@/lib/routes';

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
	try {
		const authCode = url.searchParams.get('code');
		const hasRedirectParam = url.searchParams.has('redirect');
		const redirectParam = url.searchParams.get('redirect') ?? '';

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
				// profile_image_url: data.user.user_metadata.avatar_url,
			}).catch((error) => {
				console.error('Error inserting user', error);
				throw new Error('Database insert failed');
			});
		}

		//3. creamos imagen de perfil si el usuario no cuenta con una y su provider si
		if (
			userData.length > 0 &&
			!userData[0].profile_image_id &&
			data.user.user_metadata.avatar_url
		) {
			const userProfileImageResponse = await createUserImage({
				user_id: data.user.id,
				url: data.user.user_metadata.avatar_url,
				thumbnail_url: data.user.user_metadata.avatar_url,
				alt_text: 'Photo de perfil del usuario',
				content_type: 'image/*',
			}).catch((error) => {
				console.error('Error creating user profile image', error);
				throw new Error('Database insert failed');
			});

			//4. relacionamos update del usuario para añadir id de la imagen
			if (userProfileImageResponse.length > 0) {
				const userProfileImage = userProfileImageResponse[0];
				await updateUser(userProfileImage.user_id, {
					profile_image_id: userProfileImage.id,
				}).catch((error) => {
					console.error('Error updating user profile image reference', error);
					throw new Error('Database update failed');
				});
			}
		}

		//5. añadir cookies de acceso
		cookies.set('sb-access-token', access_token, {
			path: '/',
		});
		cookies.set('sb-refresh-token', refresh_token, {
			path: '/',
		});

		return redirect(hasRedirectParam ? redirectParam : ROUTES.DASHBOARD);
	} catch (error: any) {
		console.error('Unhandled error in callback:', error);
		return redirect(`${ROUTES.LOGIN}?signin_error=unexpected_error`);
	}
};
