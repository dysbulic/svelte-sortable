<script lang="ts">
  import SortableList from '$lib/components/SortableList.svelte'
  import { type Status } from '$lib/types'
  import Pill from '$lib/components/Status.svelte'
  import { GripVertical } from 'lucide-svelte'
  import { type DragStateType } from '$lib/components/Row.svelte'

  type Task = {
    id: number
    content: string
    status: Status
  }

  let tasks: Array<Task> = $state(
    [
      { content: 'Organize a team-building event', status: 'todo' } as const,
      { content: 'Create and maintain office inventory', status: 'in-progress' } as const,
      { content: 'Update company website content', status: 'done' } as const,
      { content: 'Plan and execute marketing campaigns', status: 'todo' } as const,
      { content: 'Coordinate employee training sessions', status: 'done' } as const,
      { content: 'Manage facility maintenance', status: 'done' } as const,
      { content: 'Organize customer feedback surveys', status: 'todo' } as const,
      { content: 'Coordinate travel arrangements', status: 'in-progress' } as const,
    ].map(({ content, status }, idx) => (
      { id: idx, content, status }
    ))
  )

  const stateStyles: { [Key in DragStateType]?: string } = {
    'is-dragging': 'opacity-40',
  }
</script>

<svelte:head>
  <title>Svelte Pragmatic Sort</title>
</svelte:head>

{#snippet row(datum: Task)}
  <div class="w-6 flex justify-center">
    <GripVertical size={10}/>
  </div>
  <span class="truncate flex-grow flex-shrink">{datum.content}</span>
  <Pill status={datum.status}/>
{/snippet}

{#snippet preview(datum: Task)}
  <div class="border-solid rounded p-2 bg-white">
    {datum.content}
  </div>
{/snippet}

<SortableList
  bind:data={tasks}
  {row}
  rowClasses={(type: DragStateType) => (
    `flex text-sm bg-white flex-row items-center border border-solid rounded p-2 pl-0 hover:bg-slate-100 hover:cursor-grab ${stateStyles[type] ?? ''}`
  )}
  {preview}
/>

<pre>
  {JSON.stringify(tasks, null, 2)}
</pre>