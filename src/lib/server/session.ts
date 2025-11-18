import type { Cookies } from '@sveltejs/kit';
import * as v from 'valibot';
import { refreshDiscordToken, type DiscordTokenResponse } from './discord';
import { PUBLIC_DISCORD_CLIENT_ID } from '$env/static/public';

export const SessionSchema = v.object({
	access_token: v.string(),
	refresh_token: v.string(),
	expires_at: v.number(),
	token_type: v.string()
});
export type Session = v.InferOutput<typeof SessionSchema>;

const SESSION_COOKIE_NAME = 'session';

export async function createSession(
	discordTokens: DiscordTokenResponse,
	cookies: Cookies
): Promise<Session> {
	const session = mapDiscordTokenResponseToSession(discordTokens);

	cookies.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
		path: '/',
		sameSite: 'none',
		domain: `${PUBLIC_DISCORD_CLIENT_ID}.discordsays.com`
	});

	return session;
}

export async function getSession(cookies: Cookies): Promise<Session | null> {
	const sessionCookie = cookies.get(SESSION_COOKIE_NAME);

	if (!sessionCookie) {
		return null;
	}

	try {
		let session = v.parse(SessionSchema, JSON.parse(sessionCookie));

		// Refresh 5 min before expiry
		if (Date.now() >= session.expires_at - 5 * 60 * 1000) {
			const tokens = await refreshDiscordToken(session.refresh_token);
			if (!tokens) {
				cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
				return null;
			}

			session = mapDiscordTokenResponseToSession(tokens);

			cookies.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
				path: '/',
				sameSite: 'none',
				domain: `${PUBLIC_DISCORD_CLIENT_ID}.discordsays.com`
			});
		}

		return session;
	} catch (error) {
		console.error('Failed to parse session:', error);
		cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
		return null;
	}
}

function mapDiscordTokenResponseToSession(tokenResponse: DiscordTokenResponse): Session {
	return {
		access_token: tokenResponse.access_token,
		refresh_token: tokenResponse.refresh_token,
		expires_at: Date.now() + tokenResponse.expires_in * 1000,
		token_type: tokenResponse.token_type
	};
}
