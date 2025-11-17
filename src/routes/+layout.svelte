<script lang="ts">
	import '../app.css';
	import type { LayoutProps } from './$types';
	import { setAccessToken } from './context';

	let { children, data }: LayoutProps = $props();
	const { access_token } = data;
	setAccessToken(access_token);
</script>

{@render children()}
