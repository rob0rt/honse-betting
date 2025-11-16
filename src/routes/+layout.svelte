<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	import { setAccessToken } from './context';

	let { children, data }: LayoutProps = $props();
	const { access_token } = data;
	setAccessToken(access_token);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
