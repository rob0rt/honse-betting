import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';
import { PrismaClient, type Session } from '$lib/server/db/client';
import { DATABASE_URL, DISCORD_CLIENT_SECRET } from '$env/static/private';
import { AES } from '$lib/server/auth/encryption';
import { AccessTokenResponseSchema, type AccessTokenResponse } from '$lib/schemas/discord';
import * as v from 'valibot';
import { PUBLIC_DISCORD_CLIENT_ID } from '$env/static/public';

function generateSessionId(): string {
	const bytes = new Uint8Array(25);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(
	userId: string,
	discordAccessToken: AccessTokenResponse
): Promise<Session> {
	const now = new Date();
	const sessionId = generateSessionId();

	const prisma = new PrismaClient({
		datasourceUrl: DATABASE_URL
	});
	return await prisma.session.create({
		data: {
			id: sessionId,
			userId: userId,
			accessToken: await AES.encrypt(discordAccessToken.access_token),
			refreshToken: await AES.encrypt(discordAccessToken.refresh_token),
			expiresAt: new Date(now.getTime() + 1000 * discordAccessToken.expires_in)
		}
	});
}

export async function validateSession(sessionId: string): Promise<string | null> {
	const now = Date.now();
	const prisma = new PrismaClient({
		datasourceUrl: DATABASE_URL
	});

	let session = await prisma.session.findUnique({
		where: {
			id: sessionId
		}
	});

	// No session by this ID - maybe it was invalidated?
	if (!session) {
		return null;
	}

	// Check for expiration
	if (now >= session.expiresAt.getTime()) {
		await prisma.session.delete({
			where: {
				id: session.id
			}
		});
		return null;
	}

	let access_token: string;
	if (session.expiresAt.getTime() - now <= 1000 * 60 * 60) {
		// Refresh the access token
		const response = await fetch('https://discord.com/api/oauth2/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				client_id: PUBLIC_DISCORD_CLIENT_ID,
				client_secret: DISCORD_CLIENT_SECRET,
				grant_type: 'refresh_token',
				refresh_token: await AES.decrypt(session.refreshToken)
			})
		});

		if (!response.ok) {
			// Refresh failed, invalidate session
			await prisma.session.delete({
				where: {
					id: session.id
				}
			});
			return null;
		}

		const { access_token, refresh_token, expires_in } = v.parse(
			AccessTokenResponseSchema,
			await response.json()
		);

		// Update session with new tokens and expiration
		session = await prisma.session.update({
			where: {
				id: session.id
			},
			data: {
				accessToken: await AES.encrypt(access_token),
				refreshToken: await AES.encrypt(refresh_token),
				expiresAt: new Date(now + 1000 * expires_in)
			}
		});
	} else {
		access_token = await AES.decrypt(session.accessToken);
	}

	return access_token;
}

export async function invalidateSession(sessionId: string): Promise<void> {
	const prisma = new PrismaClient({
		datasourceUrl: DATABASE_URL
	});
	await prisma.session.delete({
		where: {
			id: sessionId
		}
	});
}

export async function invalidateAllSessions(userId: string): Promise<void> {
	const prisma = new PrismaClient({
		datasourceUrl: DATABASE_URL
	});
	await prisma.session.deleteMany({
		where: {
			userId: userId
		}
	});
}
