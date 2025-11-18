import { redirect, type Handle } from '@sveltejs/kit';
import { fetchCurrentUser } from '$lib/server/discord';
import { getSession } from '$lib/server/session';
import { prisma } from '$lib/server/prisma';

export const handle: Handle = async ({ event, resolve }) => {
	const session = await getSession(event.cookies);

	// Add session to locals so it's available in all routes
	event.locals.session = session;
	event.locals.user = null;

	// If we have a session, fetch and cache user data
	if (session) {
		try {
			const discord_user = await fetchCurrentUser(session);
			const user = await prisma.user.upsert({
				where: { id: discord_user.id },
				update: {},
				create: {
					id: discord_user.id,
					username: discord_user.username,
					avatar: discord_user.avatar
				}
			});

			event.locals.user = user;
		} catch (error) {
			console.error('Failed to fetch user data:', error);
			// Clear invalid session
			event.cookies.delete('discord_session', { path: '/' });
			event.locals.session = null;
		}
	}

	if (event.isRemoteRequest) {
		return resolve(event);
	}

	// Redirect to login if not authenticated and trying to access protected route
	if (!session && event.url.pathname !== '/login') {
		throw redirect(303, '/login');
	}

	// Redirect to home if authenticated and trying to access login page
	if (session && event.url.pathname === '/login') {
		throw redirect(303, '/');
	}

	return resolve(event);
};
