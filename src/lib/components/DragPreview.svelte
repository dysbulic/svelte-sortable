<script lang="ts">
  import { type TTask } from '$lib/task-data'

  let { task }: { task: TTask } = $props()
</script>

<div class="border-solid rounded p-2 bg-white">
  {task.content}
</div>
