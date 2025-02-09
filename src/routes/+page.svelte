<script lang="ts" module>
  export type Task = {
    id: number
    content: string
    status: Status
  }
</script>

<script lang="ts">
  import clsx from 'clsx'
  import SortableList from '$lib/components/SortableList.svelte'
  import { type DragStateType } from '$lib/components/Row.svelte'
  import row from '$lib/components/Line.svelte'
  import { type Status } from '$lib/types'
  import GitHub from '../github.svg?raw'
  import preview from '$lib/components/DragPreview.svelte';

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
  let history: Array<Array<Task>> = $state([])
  let histIdx = $state(0)
  let disabled = $derived(history.length === 0)

  const stateStyles: { [Key in DragStateType]?: string } = {
    'is-dragging': 'opacity-40',
  }

  $effect(() => {
    histIdx = history.length
  })

  $effect(() => {
    const listener = (event: Event) => {
      const evt = event as CustomEvent<{ old: Task }>
      const state = tasks.map((task) => ({ ...task }))
      const index = state.findIndex(
        (task) => task.id === evt.detail.old.id
      )
      if(index < 0) {
        console.warn('Couldn’t find edited Task:', evt.detail.old)
      } else {
        state.splice(index, 1, evt.detail.old)
        history.push(state)
      }
    }
    document.addEventListener('datum-changed', listener)

    return () => {
      document.removeEventListener('datum-changed', listener)
    }
  })

  const display = (tasks: Array<Task>) => (
    JSON.stringify(
      tasks.map(({ id, content, status }) => (
        `${id}: ${content} (${status})`
      )),
      null,
      2,
    )
  )
</script>

<svelte:head>
  <title>Svelte Pragmatic Sort</title>
</svelte:head>

<a
  href="https://github.com/dysbulic/svelte-sortable"
  class="fixed top-4 right-4 h-10 w-10 hover:text-blue-500"
  style:--hover-stroke-1="color-mix(in oklab, yellow, transparent)"
  style:--hover-stroke-2="color-mix(in oklab, white 80%, transparent 25%)"
>
  {@html GitHub}
</a>

<header>
  <h1 class="text-3xl font-bold text-center my-10">
    <a
      href="https://atlassian.design/components/pragmatic-drag-and-drop/about"
      target="_blank"
      class="text-blue-300 hover:text-green-700"
    >
      Atlasian's Pragmatic Sort
    </a>
    in
    <a
      href="https://svelte.dev"
      target="_blank"
      class="text-blue-300 hover:text-green-700"
    >
      Svelte
    </a>
  </h1>
  <ul class="list-disc pl-7 max-w-96 mx-auto my-5">
    <li>Drag and drop list items to reorder them.</li>
    <li>Double click a list item to edit it.</li>
    <li>Click the status to switch to the next option.</li>
    <li>Drag the slider to view the historical states.</li>
    <li>Click <q>Undo</q> to revert the most recent change.</li>
  </ul>
</header>
<main class="flex flex-wrap justify-center gap-12 items-center">
  <section id="list">
    <SortableList
      bind:data={tasks}
      bind:history
      listClasses={clsx(
        'my-4 mx-auto w-[420px] flex flex-col gap-2',
        'border border-solid rounded p-2',
      )}
      {row}
      rowClasses={(type: DragStateType) => [
        'text-sm bg-white dark:bg-gray-800 dark:text-white/75',
        'border border-solid rounded p-2 pl-0',
        'hover:bg-slate-100 dark:hover:bg-gray-600 hover:cursor-grab',
        stateStyles[type] as string,
      ]}
      {preview}
    />

    <section id="controls">
      <nav>
        <ul class="flex justify-center">
          <li class="contents">
            <button
              onclick={() => {
                const past = history.pop()
                if(past) tasks = past
              }}
              {disabled}
              class={[
                'bg-blue-400 dark:bg-indigo-500',
                !disabled && 'hover:bg-amber-400 hover:text-gray-800',
                'transition-all px-3 py-1.5 rounded',
                disabled && 'opacity-50 cursor-not-allowed',
              ]}
            >Undo ⨯{history.length}</button>
          </li>
        </ul>
      </nav>
    </section>
  </section>

  <section id="history" class="flex flex-col gap-2">
    {#if histIdx >= history.length}
      <pre>{display(tasks)}</pre>
    {:else}
      <pre>{display(history[histIdx])}</pre>
    {/if}
    <input
      type="range"
      min="0" max={history.length}
      bind:value={histIdx}
      class="grow"
    />
  </section>
</main>
