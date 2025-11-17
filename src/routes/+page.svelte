<script lang="ts">
	import SectionCards from '$lib/components/section-cards.svelte';
	import { getAccessToken } from './context.js';
	import { getUser } from './user.remote.js';
	import BetsTable from '$lib/components/bets-table.svelte';
	import type { PageProps } from './$types.js';

	const access_token = getAccessToken();
	const user = await getUser(access_token);

	const { data }: PageProps = $props();
</script>

<div class="flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<SectionCards {user} />
			<BetsTable bets={user.bets} />
		</div>
	</div>
</div>
