<script lang="ts">
  import type { TStatus } from '$lib/task-data'

  let { status }: { status: TStatus } = $props()

  const bgColor: { [Key in TStatus]: string } = {
    todo: 'bg-violet-200 ',
    'in-progress': 'bg-amber-200',
    done: 'bg-green-200',
  }

  const label: { [Key in TStatus]: string } = {
    todo: 'TODO',
    'in-progress': 'In progress',
    done: 'Done',
  }
</script>

<div class="flex w-[100px] justify-end">
  <span
    class={`${bgColor[status]} uppercase p-1 rounded font-semibold flex-shrink-0 text-xs text-slate-900 `}
  >
    {label[status]}
  </span>
</div>
