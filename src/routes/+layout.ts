import type { LayoutLoad } from './$types';
import { DiscordSDK } from '@discord/embedded-app-sdk';
import { discordOath } from './oauth.remote';
import { PUBLIC_DISCORD_CLIENT_ID } from '$env/static/public';

export const ssr = false;

export const load: LayoutLoad = async () => {
	const discordSdk = new DiscordSDK(PUBLIC_DISCORD_CLIENT_ID);
	await discordSdk.ready();
	const { code } = await discordSdk.commands.authorize({
		client_id: PUBLIC_DISCORD_CLIENT_ID,
		response_type: 'code',
		state: '',
		prompt: 'none',
		// More info on scopes here: https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
		scope: [
			// Activities will launch through app commands and interactions of user-installable apps.
			// https://discord.com/developers/docs/tutorials/developing-a-user-installable-app#configuring-default-install-settings-adding-default-install-settings
			'applications.commands',

			// "applications.builds.upload",
			// "applications.builds.read",
			// "applications.store.update",
			// "applications.entitlements",
			// "bot",
			'identify',
			// "connections",
			// "email",
			// "gdm.join",
			'guilds',
			// "guilds.join",
			'guilds.members.read',
			// "messages.read",
			// "relationships.read",
			// 'rpc.activities.write',
			// "rpc.notifications.read",
			// "rpc.voice.write",
			'rpc.voice.read'
			// "webhook.incoming",
		]
	});

	const access_token = await discordOath(code);

	// Authenticate with Discord client (using the access_token)
	const auth = await discordSdk.commands.authenticate({
		access_token
	});

	if (auth == null) {
		throw new Error('Authenticate command failed');
	}

	cookies.set('access_token', access_token, {
		httpOnly: true,
		secure: true
	});

	return auth;
};
