import { getRequestEvent, command } from '$app/server';
import { exchangeCode } from '$lib/server/discord';
import { createSession } from '$lib/server/session';
import * as v from 'valibot';

export const login = command(v.string(), async (code) => {
	const tokens = await exchangeCode(code);
	await createSession(tokens, getRequestEvent().cookies);
});
