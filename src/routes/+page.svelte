<script lang="ts">
	import data from './data.js';
	import SectionCards from '$lib/components/section-cards.svelte';
	import DataTable from '$lib/components/data-table.svelte';
	import { getAccessToken } from './context.js';
	import { getUser } from './user.remote.js';

	const access_token = getAccessToken();
	const { user, bets } = await getUser(access_token);
	console.log('User:', user);
	console.log('Bets:', bets);
</script>

<div class="flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<SectionCards />
			<DataTable {data} />
		</div>
	</div>
</div>
