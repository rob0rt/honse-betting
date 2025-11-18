<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import BetsTable from '$lib/components/bets-table.svelte';
	import { BetType } from '$lib/prisma/enums';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let betType = $state<BetType>(BetType.WIN);
</script>

<div class="flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="flex flex-col gap-4 py-4">
			<Label for="bet-amount">Bet Amount</Label>
			<Input id="bet-amount" type="number" placeholder="Enter your bet amount" class="w-[200px]" />
			<Label for="bet-type">Bet Type</Label>
			<Tabs.Root bind:value={betType} class="w-[400px]" id="bet-type">
				<Tabs.List>
					<Tabs.Trigger value={BetType.WIN}>Win</Tabs.Trigger>
					<Tabs.Trigger value={BetType.PLACE}>Place</Tabs.Trigger>
					<Tabs.Trigger value={BetType.SHOW}>Show</Tabs.Trigger>
					<Tabs.Trigger value={BetType.EXACTA}>Exacta</Tabs.Trigger>
					<Tabs.Trigger value={BetType.TRIFECTA}>Trifecta</Tabs.Trigger>
				</Tabs.List>
			</Tabs.Root>
			<BetsTable bets={[]} />
		</div>
	</div>
</div>
