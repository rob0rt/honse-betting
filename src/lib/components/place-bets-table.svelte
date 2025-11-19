<script lang="ts">
	import {
		getCoreRowModel,
		type ColumnDef,
		type Row,
		type RowSelectionState
	} from '@tanstack/table-core';
	import { createSvelteTable } from '$lib/components/ui/data-table/data-table.svelte.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { FlexRender, renderSnippet } from '$lib/components/ui/data-table/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import type { RaceHorseModel, HorseModel } from '$lib/prisma/models';
	import { BetType } from '$lib/prisma/enums';

	type Horse = RaceHorseModel & { horse: HorseModel };

	let {
		horses,
		selected = $bindable(),
		betType
	}: { horses: Horse[]; selected: string[]; betType: BetType } = $props();
	let rowSelection = $state<RowSelectionState>({});

	$effect(() => {
		selected = Object.keys(rowSelection).filter((key) => rowSelection[key]);
	});

	const columns: ColumnDef<Horse>[] = [
		{
			id: 'select',
			header: () => 'Select',
			cell: ({ row }) => renderSnippet(PlaceBetsTableCheckbox, { row }),
			enableHiding: false
		},
		{
			accessorKey: 'name',
			header: 'Horse Name',
			cell: ({ row }) => row.original.horse.name,
			enableHiding: false
		},
		{
			accessorKey: 'saddleNumber',
			header: 'Saddle Number',
			cell: ({ row }) => row.original.saddleNumber,
			enableHiding: false
		}
	];

	const table = createSvelteTable({
		get data() {
			return horses;
		},
		columns,
		state: {
			get rowSelection() {
				return rowSelection;
			}
		},
		getCoreRowModel: getCoreRowModel(),
		enableRowSelection: true,
		enableMultiRowSelection: ([BetType.EXACTA, BetType.TRIFECTA] as BetType[]).includes(betType),
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
		getRowId: (row) => String(row.horse.id)
	});
</script>

<div class="overflow-hidden rounded-lg border">
	<Table.Root>
		<Table.Header class="sticky top-0 z-10 bg-muted">
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row>
					{#each headerGroup.headers as header (header.id)}
						<Table.Head colspan={header.colSpan}>
							{#if !header.isPlaceholder}
								<FlexRender
									content={header.column.columnDef.header}
									context={header.getContext()}
								/>
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#if table.getRowModel().rows?.length}
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell>
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
			{:else}
				<Table.Row>
					<Table.Cell colspan={columns.length} class="h-24 text-center"
						>No horses available.</Table.Cell
					>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>
</div>

{#snippet PlaceBetsTableCheckbox({ row }: { row: Row<Horse> })}
	<div class="flex items-center justify-center">
		<Checkbox bind:checked={() => row.getIsSelected(), row.toggleSelected} />
	</div>
{/snippet}
