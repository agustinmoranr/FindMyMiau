export const ROUTES = {
	// Public routes
	HOME: '/',
	LOGIN: '/login',
	REGISTER: '/register',
	ABOUT: '/about',
	API_SIGN_OUT: '/api/auth/signout',
	API_SIGN_IN: '/api/auth/signin',
	API_SIGN_IN_CALLBACK: '/api/auth/callback',

	// Protected routes
	DASHBOARD: '/dashboard',
	PROFILE: '/profile',
	SETTINGS: '/settings',
} as const;

export const PROTECTED_ROUTES = [
	ROUTES.DASHBOARD,
	ROUTES.PROFILE,
	ROUTES.SETTINGS,
	ROUTES.API_SIGN_OUT,
] as const;

// Helper to determine if a route is protected
export const isProtectedRoute = (path: string): boolean => {
	// Check if the path starts with any protected route
	return PROTECTED_ROUTES.some(
		(route) => path === route || path.startsWith(`${route}/`),
	);
};
