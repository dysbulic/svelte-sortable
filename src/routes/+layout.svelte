<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<nav>
	<ul>
		<li><a href="/">Skeleton Example</a></li>
		<li><a href="/table">Bootstrap 5 Table Example</a></li>
	</ul>
</nav>

{@render children()}

<style>
	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
		padding-left: 12px;
		overflow: hidden;
		background-color: #dddddd;
		margin-bottom: 15px;
	}

	li {
		float: left;
	}

	li a {
		display: block;
		padding: 8px;
	}
</style>
