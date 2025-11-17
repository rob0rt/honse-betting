import { redirect, type Handle } from '@sveltejs/kit';
import * as v from 'valibot';
import { PrismaClient } from '$lib/server/db/client';
import { DATABASE_URL } from '$env/static/private';

const GetCurrentUserSchema = v.object({
	id: v.string(),
	username: v.string()
});

export const handle: Handle = async ({ event, resolve }) => {
	const access_token = event.cookies.get('access_token');
	if (!access_token) {
		redirect(302, '/login');
	}

	const response = await fetch('https://discord.com/api/users/@me', {
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
	if (response.status === 401) {
	}

	const discord_user = v.parse(GetCurrentUserSchema, await response.json());

	const prisma = new PrismaClient({
		datasourceUrl: DATABASE_URL
	});
	const user = await prisma.user.upsert({
		where: { id: discord_user.id },
		update: {},
		create: {
			id: discord_user.id,
			username: discord_user.username
		}
	});

	return await resolve(event);
};
