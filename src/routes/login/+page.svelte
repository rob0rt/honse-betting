<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { DiscordSDK } from '@discord/embedded-app-sdk';
	import { PUBLIC_DISCORD_CLIENT_ID } from '$env/static/public';
	import { login } from './oauth.remote';

	const discordSdk = new DiscordSDK(PUBLIC_DISCORD_CLIENT_ID);

	onMount(async () => {
		await setupDiscord();
	});

	async function setupDiscord() {
		try {
			// Initialize the SDK
			await discordSdk.ready();

			// Authorize with Discord
			const { code } = await discordSdk.commands.authorize({
				client_id: PUBLIC_DISCORD_CLIENT_ID,
				response_type: 'code',
				state: '',
				prompt: 'none',
				scope: ['applications.commands', 'identify']
			});

			// Exchange code for token on the server
			await login(code);

			// Redirect to home page after successful auth
			await goto('/', { replaceState: true });
		} catch (err) {
			console.error('Discord auth error:', err);
		}
	}
</script>
