<script lang="ts">
  import type { Status } from '$lib/types'

  let { status }: { status: Status } = $props()

  const bgColor: { [Key in Status]: string } = {
    todo: 'bg-violet-200 ',
    'in-progress': 'bg-amber-200',
    done: 'bg-green-200',
  }

  const label: { [Key in Status]: string } = {
    todo: 'TODO',
    'in-progress': 'In Progress',
    done: 'Done',
  }
</script>

<div class="justify-end whitespace-nowrap">
  <span
    class={`${bgColor[status]} uppercase p-1 rounded font-semibold flex-shrink-0 text-xs text-slate-900 `}
  >
    {label[status]}
  </span>
</div>
