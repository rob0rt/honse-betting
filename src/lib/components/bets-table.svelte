<script lang="ts" module>
	import * as v from 'valibot';

	function getTotalBetAmount(bet: Bet): number {
		const b = v.parse(BetDataSchema, bet);
		if (b.type === BetType.EXACTA && b.data.box) {
			return bet.amount * 2;
		} else if (b.type === BetType.TRIFECTA && b.data.box) {
			return bet.amount * 6;
		}

		return bet.amount;
	}

	export const columns: ColumnDef<Bet>[] = [
		{
			accessorKey: 'type',
			header: 'Bet Type',
			cell: ({ row }) => row.original.type,
			enableHiding: false
		},
		{
			accessorKey: 'amount',
			header: 'Bet Amount',
			cell: ({ row }) => `$${row.original.amount}`,
			enableHiding: false
		},
		{
			header: 'Total Bet Amount',
			cell: ({ row }) => {
				const bet = v.parse(BetDataSchema, row.original);
				if (bet.type === BetType.EXACTA && bet.data.box) {
					return bet.amount * 2;
				} else if (bet.type === BetType.TRIFECTA && bet.data.box) {
					return bet.amount * 6;
				}

				return bet.amount;
			}
		},
		// {
		// 	accessorKey: 'header',
		// 	header: 'Header',
		// 	cell: ({ row }) => renderComponent(DataTableCellViewer, { item: row.original }),
		// 	enableHiding: false
		// },
		// {
		// 	accessorKey: 'type',
		// 	header: 'Section Type',
		// 	cell: ({ row }) => renderSnippet(DataTableType, { row })
		// },
		// {
		// 	accessorKey: 'status',
		// 	header: 'Status',
		// 	cell: ({ row }) => renderSnippet(DataTableStatus, { row })
		// },
		// {
		// 	accessorKey: 'target',
		// 	header: () =>
		// 		renderSnippet(
		// 			createRawSnippet(() => ({
		// 				render: () => '<div class="w-full text-right">Target</div>'
		// 			}))
		// 		),
		// 	cell: ({ row }) => renderSnippet(DataTableTarget, { row })
		// },
		// {
		// 	accessorKey: 'limit',
		// 	header: () =>
		// 		renderSnippet(
		// 			createRawSnippet(() => ({
		// 				render: () => '<div class="w-full text-right">Limit</div>'
		// 			}))
		// 		),
		// 	cell: ({ row }) => renderSnippet(DataTableLimit, { row })
		// },
		// {
		// 	accessorKey: 'reviewer',
		// 	header: 'Reviewer',
		// 	cell: ({ row }) => renderComponent(DataTableReviewer, { row })
		// },
		{
			id: 'actions',
			cell: () => renderSnippet(DataTableActions)
		}
	];
</script>

<script lang="ts">
	import {
		getCoreRowModel,
		getFacetedRowModel,
		getFacetedUniqueValues,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		type ColumnDef,
		type ColumnFiltersState,
		type PaginationState,
		type Row,
		type RowSelectionState,
		type SortingState,
		type VisibilityState
	} from '@tanstack/table-core';
	import type { Schema } from './schemas.js';
	import { createSvelteTable } from '$lib/components/ui/data-table/data-table.svelte.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { FlexRender, renderSnippet } from '$lib/components/ui/data-table/index.js';
	import LayoutColumnsIcon from '@tabler/icons-svelte/icons/layout-columns';
	import ChevronDownIcon from '@tabler/icons-svelte/icons/chevron-down';
	import PlusIcon from '@tabler/icons-svelte/icons/plus';
	import ChevronsLeftIcon from '@tabler/icons-svelte/icons/chevrons-left';
	import ChevronLeftIcon from '@tabler/icons-svelte/icons/chevron-left';
	import ChevronRightIcon from '@tabler/icons-svelte/icons/chevron-right';
	import ChevronsRightIcon from '@tabler/icons-svelte/icons/chevrons-right';
	import CircleCheckFilledIcon from '@tabler/icons-svelte/icons/circle-check-filled';
	import LoaderIcon from '@tabler/icons-svelte/icons/loader';
	import DotsVerticalIcon from '@tabler/icons-svelte/icons/dots-vertical';
	import { toast } from 'svelte-sonner';
	import DataTableCellViewer from './data-table-cell-viewer.svelte';
	import { createRawSnippet } from 'svelte';
	// import type { BetModel as Bet } from '$lib/server/db/models';
	import { BetType, type Bet } from '$lib/server/db/client';
	import { BetDataSchema } from '$lib/schemas/bet.js';

	let { bets }: { bets: Bet[] } = $props();
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let rowSelection = $state<RowSelectionState>({});
	let columnVisibility = $state<VisibilityState>({});

	const table = createSvelteTable({
		get data() {
			return bets;
		},
		columns,
		getCoreRowModel: getCoreRowModel()
		// state: {
		// 	get pagination() {
		// 		return pagination;
		// 	},
		// 	get sorting() {
		// 		return sorting;
		// 	},
		// 	get columnVisibility() {
		// 		return columnVisibility;
		// 	},
		// 	get rowSelection() {
		// 		return rowSelection;
		// 	},
		// 	get columnFilters() {
		// 		return columnFilters;
		// 	}
		// },
		// getRowId: (row) => row.id.toString(),
		// enableRowSelection: true,
		// getCoreRowModel: getCoreRowModel(),
		// getPaginationRowModel: getPaginationRowModel(),
		// getSortedRowModel: getSortedRowModel(),
		// getFacetedRowModel: getFacetedRowModel(),
		// getFacetedUniqueValues: getFacetedUniqueValues(),
		// getFilteredRowModel: getFilteredRowModel(),
		// onPaginationChange: (updater) => {
		// 	if (typeof updater === 'function') {
		// 		pagination = updater(pagination);
		// 	} else {
		// 		pagination = updater;
		// 	}
		// },
		// onSortingChange: (updater) => {
		// 	if (typeof updater === 'function') {
		// 		sorting = updater(sorting);
		// 	} else {
		// 		sorting = updater;
		// 	}
		// },
		// onColumnFiltersChange: (updater) => {
		// 	if (typeof updater === 'function') {
		// 		columnFilters = updater(columnFilters);
		// 	} else {
		// 		columnFilters = updater;
		// 	}
		// },
		// onColumnVisibilityChange: (updater) => {
		// 	if (typeof updater === 'function') {
		// 		columnVisibility = updater(columnVisibility);
		// 	} else {
		// 		columnVisibility = updater;
		// 	}
		// },
		// onRowSelectionChange: (updater) => {
		// 	if (typeof updater === 'function') {
		// 		rowSelection = updater(rowSelection);
		// 	} else {
		// 		rowSelection = updater;
		// 	}
		// }
	});

	let views = [
		{
			id: 'outline',
			label: 'Outline',
			badge: 0
		},
		{
			id: 'past-performance',
			label: 'Past Performance',
			badge: 3
		},
		{
			id: 'key-personnel',
			label: 'Key Personnel',
			badge: 2
		},
		{
			id: 'focus-documents',
			label: 'Focus Documents',
			badge: 0
		}
	];

	let view = $state('outline');
	let viewLabel = $derived(views.find((v) => view === v.id)?.label ?? 'Select a view');
</script>

<div class="flex items-center justify-between px-4 lg:px-6">
	<div class="flex items-center gap-2">
		<Button variant="outline" size="sm">
			<PlusIcon />
			<span class="lg:inline">Place Bet</span>
		</Button>
	</div>
</div>
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
		<Table.Body class="**:data-[slot=table-cell]:first:w-8">
			{#if table.getRowModel().rows?.length}
				{#each table.getRowModel().rows as row, index (row.id)}
					<Table.Row
						data-state={row.getIsSelected() && 'selected'}
						class="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
					>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell>
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
			{:else}
				<Table.Row>
					<Table.Cell colspan={columns.length} class="h-24 text-center">No bets placed.</Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>
</div>

{#snippet DataTableLimit({ row }: { row: Row<Schema> })}
	<form
		onsubmit={(e) => {
			e.preventDefault();
			toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
				loading: `Saving ${row.original.header}`,
				success: 'Done',
				error: 'Error'
			});
		}}
	>
		<Label for="{row.original.id}-limit" class="sr-only">Limit</Label>
		<Input
			class="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30"
			value={row.original.limit}
			id="{row.original.id}-limit"
		/>
	</form>
{/snippet}

{#snippet DataTableTarget({ row }: { row: Row<Schema> })}
	<form
		onsubmit={(e) => {
			e.preventDefault();
			toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
				loading: `Saving ${row.original.header}`,
				success: 'Done',
				error: 'Error'
			});
		}}
	>
		<Label for="{row.original.id}-target" class="sr-only">Target</Label>
		<Input
			class="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30"
			value={row.original.target}
			id="{row.original.id}-target"
		/>
	</form>
{/snippet}

{#snippet DataTableType({ row }: { row: Row<Schema> })}
	<div class="w-32">
		<Badge variant="outline" class="px-1.5 text-muted-foreground">
			{row.original.type}
		</Badge>
	</div>
{/snippet}

{#snippet DataTableStatus({ row }: { row: Row<Schema> })}
	<Badge variant="outline" class="px-1.5 text-muted-foreground">
		{#if row.original.status === 'Done'}
			<CircleCheckFilledIcon class="fill-green-500 dark:fill-green-400" />
		{:else}
			<LoaderIcon />
		{/if}
		{row.original.status}
	</Badge>
{/snippet}

{#snippet DataTableActions()}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class="flex size-8 text-muted-foreground data-[state=open]:bg-muted">
			{#snippet child({ props })}
				<Button variant="ghost" size="icon" {...props}>
					<DotsVerticalIcon />
					<span class="sr-only">Open menu</span>
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end" class="w-32">
			<DropdownMenu.Item>Edit</DropdownMenu.Item>
			<DropdownMenu.Item>Make a copy</DropdownMenu.Item>
			<DropdownMenu.Item>Favorite</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item variant="destructive">Delete</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet}
