<script lang="ts">
	import { SortableItem } from '$lib/index.js'
	import { flip } from 'svelte/animate'
	import MoveIcon from '../assets/move-icon.svg'

	let users = $state([
		{ id: 1, name: 'John', age: 45 },
		{ id: 2, name: 'Mark', age: 33 },
		{ id: 3, name: 'Jonas', age: 56 },
		{ id: 4, name: 'Mary', age: 76 },
	])
	let hoveredIndex = $state<number | null>(null)
</script>

<svelte:head>
	<title>Sortable Svelte List</title>
	<script src="https://unpkg.com/svelte-drag-drop-touch"></script>
</svelte:head>

<ol>
	{#each users as user, idx (user.id)}
		<li animate:flip>
			<SortableItem index={idx} bind:data={users} bind:hoveredIndex>
				<img src={MoveIcon} class="handle" alt="⇵" />
				{user.name}
			</SortableItem>
		</li>
	{/each}
</ol>

<pre>{JSON.stringify(users, null, 2)}</pre>

<style>
	:root {
		color-scheme: light dark;
	}
	ol {
		list-style-type: none;
		margin: 0;
		padding-inline-start: 1rem;
	}
	:global(.item) {
		margin-block: 0.25rem;
		padding: 0.25em;
		cursor: move;

		:global(&:hover) {
			background-color: light-dark(#0006, #fff6);
			color: white;
		}
	}
	.hovered {
		background-color: lightblue;
		color: white;
	}
	.handle {
		max-height: 1em;
		margin-inline-end: 0.5em;
	}
</style>
