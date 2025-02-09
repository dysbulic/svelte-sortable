<script lang="ts">
  import type { Task } from '../../routes/+page.svelte';

  let { datum }: { datum: Task } = $props()
</script>

<div class="border-solid rounded p-2 bg-white dark:bg-white/25">
  {datum.content}
</div>
