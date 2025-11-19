<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import BetsTable from '$lib/components/bets-table.svelte';
	import { BetType } from '$lib/prisma/enums';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { PageProps } from '../$types';
	import PlaceBetsTable from '$lib/components/place-bets-table.svelte';

	const { data }: PageProps = $props();
	const { race, user } = data;

	let betType = $state<BetType>(BetType.WIN);
	let betAmount = $state<number>(10);
	let selected = $state<string[]>([]);

	const expectedPayout = $derived.by(() => {
		switch (betType) {
			case BetType.WIN:
				return race!.horses.length * betAmount + betAmount;
			case BetType.PLACE:
				return (race!.horses.length * betAmount) / 2 + betAmount;
			case BetType.SHOW:
				return (race!.horses.length * betAmount) / 3 + betAmount;
			case BetType.EXACTA:
				return race!.horses.length * race!.horses.length - 1 * betAmount + betAmount;
			case BetType.TRIFECTA:
				return (
					race!.horses.length * (race!.horses.length - 1) * (race!.horses.length - 2) * betAmount +
					betAmount
				);
		}
	});
</script>

<div class="flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="flex flex-col gap-4 py-4">
			<Label for="bet-amount">Bet Amount</Label>
			<Input
				id="bet-amount"
				type="number"
				placeholder="Enter your bet amount"
				class="w-[200px]"
				bind:value={betAmount}
			/>
			<Label for="bet-type">Bet Type</Label>
			<Tabs.Root bind:value={betType} class="w-[400px]" id="bet-type">
				<Tabs.List>
					{#each Object.values(BetType) as type}
						<Tabs.Trigger value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</Tabs.Trigger>
					{/each}
				</Tabs.List>
			</Tabs.Root>
			<PlaceBetsTable horses={race!.horses} {betType} bind:selected />
			Total Wagered: {selected.length * betAmount}
			Possible Payout: {expectedPayout}
		</div>
	</div>
</div>
