import { getRequestEvent, query } from '$app/server';
import { DISCORD_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_DISCORD_CLIENT_ID } from '$env/static/public';
import * as v from 'valibot';

export const discordOath = query(v.string(), async (code) => {
	const response = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			client_id: PUBLIC_DISCORD_CLIENT_ID,
			client_secret: DISCORD_CLIENT_SECRET,
			grant_type: 'authorization_code',
			code
		})
	});

	const { access_token } = (await response.json()) as {
		access_token: string;
	};

	return access_token;
});
