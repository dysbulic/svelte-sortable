<script lang="ts" module>
  export type Task = {
    id: number
    content: string
    status: Status
  }
</script>

<script lang="ts">
  import { StateHistory } from 'runed'
  import SortableList from '$lib/components/SortableList.svelte'
  import { type DragStateType } from '$lib/components/Row.svelte'
  import row from '$lib/components/Line.svelte'
  import { type Status } from '$lib/types.js'
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
  let history = new StateHistory(
    () => tasks,
    (next: Array<Task>) => tasks = next
  )
  let histIdx = $state(1)

  $effect(() => { histIdx = history.log.length })

  const stateStyles: { [Key in DragStateType]?: string } = {
    'is-dragging': 'opacity-40',
  }

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
      Atlassian's Pragmatic Sort
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
      listClasses={[
        'my-4 mx-auto w-[420px] flex flex-col gap-2',
        'border border-solid rounded p-2',
      ]}
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
                history.undo()
                histIdx = history.log.length
              }}
              disabled={!history.canUndo}
              class={[
                'bg-blue-400 dark:bg-indigo-500',
                history.canUndo && 'hover:bg-amber-400 hover:text-gray-800',
                'transition-all px-3 py-1.5 rounded',
                !history.canUndo && 'opacity-50 cursor-not-allowed',
              ]}
            >Undo ⨯{history.log.length - 1}</button>
          </li>
        </ul>
      </nav>
    </section>
  </section>

  {#if history.log.length > 0}
    <section id="history" class="flex flex-col gap-2">
      <pre class="whitespace-pre-wrap">{
        display(history.log[histIdx - 1].snapshot)
      }</pre>
      <input
        type="range"
        min="1" max={history.log.length}
        bind:value={histIdx}
        class="grow"
      />
    </section>
  {/if}
</main>
