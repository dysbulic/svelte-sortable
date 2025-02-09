<script lang="ts">
  import type { Status } from '$lib/types'

  let { status, onChange }: {
    status: Status
    onChange?: (
      (params: { old: Status; new: Status }) => void
    )
  } = $props()

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

  const rotate = () => {
    const statuses = Object.keys(label)
    const index = statuses.indexOf(status)
    const old = status
    status = statuses[(index + 1) % statuses.length] as Status
    onChange?.({ old, new: status })
  }
</script>

<div class="justify-end whitespace-nowrap">
  <button
    onclick={rotate}
    ondblclick={(evt: Event) => evt.stopPropagation()}
    type="button"
    class={[
      bgColor[status],
      'uppercase p-1 rounded font-semibold flex-shrink-0',
      'text-xs text-slate-900',
    ]}
  >
    {label[status]}
  </button>
</div>
