'use client';
import { useEffect } from 'react';
import { toast } from 'sonner';

const ErrorNotifier = () => {
	// Si Astro no provee useSearchParams, puedes usar una solución basada en window.location.search
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		if (params.has('signin_error')) {
			toast.error('Error durante el inicio de sesión', {
				description:
					'Lo sentimos, ocurrió un error durante el inicio de sesión. Inténtalo Nuevamente.',
				closeButton: true,
			});
		}
	}, []);

	return null;
};

export default ErrorNotifier;
