import { DISCORD_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_DISCORD_CLIENT_ID } from '$env/static/public';
import * as v from 'valibot';
import type { Session } from './session';

export async function exchangeCode(code: string): Promise<DiscordTokenResponse> {
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

	if (!response.ok) {
		console.error('Failed to exchange code for token:', await response.text());
		throw new Error('Failed to exchange code for token');
	}

	return v.parse(DiscordTokenResponseSchema, await response.json());
}

const DiscordTokenResponseSchema = v.object({
	access_token: v.string(),
	refresh_token: v.string(),
	expires_in: v.number(),
	token_type: v.string()
});
export type DiscordTokenResponse = v.InferOutput<typeof DiscordTokenResponseSchema>;

export async function refreshDiscordToken(
	refreshToken: string
): Promise<DiscordTokenResponse | null> {
	try {
		const response = await fetch('https://discord.com/api/oauth2/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				client_id: PUBLIC_DISCORD_CLIENT_ID,
				client_secret: DISCORD_CLIENT_SECRET,
				grant_type: 'refresh_token',
				refresh_token: refreshToken
			})
		});

		if (!response.ok) {
			return null;
		}

		return v.parse(DiscordTokenResponseSchema, await response.json());
	} catch (error) {
		console.error('Failed to refresh token:', error);
		return null;
	}
}

const DiscordUserSchema = v.object({
	id: v.string(),
	username: v.string(),
	avatar: v.nullable(v.string())
});

export async function fetchCurrentUser(session: Session) {
	const response = await fetch('https://discord.com/api/users/@me', {
		headers: {
			Authorization: `${session.token_type} ${session.access_token}`
		}
	});
	if (!response.ok) {
		throw new Error('Failed to fetch user data');
	}

	return v.parse(DiscordUserSchema, await response.json());
}
