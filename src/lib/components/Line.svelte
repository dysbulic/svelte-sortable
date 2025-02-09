<script lang="ts">
  import { GripVertical } from 'lucide-svelte'
  import { DatumChangedEvent } from '$lib/types';
  import Pill from './Status.svelte'
  import type { Task } from '../../routes/+page.svelte'

  let { datum }: { datum: Task } = $props()
  let editing = $state(false)
  let original = datum.content
  let input = $state<HTMLElement | null>(null)

  $effect(() => {
    if(editing) input?.focus()
  })

  const rename = (e: Event) => {
    e.preventDefault()
    const detail = {
      old: { ...datum, content: original } as Task,
      new: { ...datum },
    }
    console.info({ Dispatching: detail })
    document.dispatchEvent(new CustomEvent(
      'datum-changed',
      { detail },
    ))
    editing = false
  }
  const toggle = () => {
    editing = !editing
    if(editing) original = datum.content
  }
</script>

<section
  role="button"
  tabindex={0}
  ondblclick={toggle}
  class="flex items-center justify-center"
>
  <span class="px-3">
    <GripVertical size={10}/>
  </span>
  {#if editing}
    <form
      onsubmit={rename}
      bind:this={input}
      class="grow flex gap-0.5"
    >
      <input
        onload={({ target }) => (target as HTMLElement).focus()}
        bind:value={datum.content}
        onkeydown={({ key }) => {
          if(key === 'Escape') {
            datum.content = original
            editing = false
          }
        }}
        class={[
          'grow w-[fit-content] border-amber-200 border-2',
          'rounded-md px-2 py-1 bg-transparent'
        ]}
      />
      <button class="text-green-500">🗸️</button>
      <button onclick={() => datum.content = original}>🗑️</button>
    </form>
  {:else}
    <span
      ondblclick={toggle}
      role="button"
      tabindex={0}
      class="truncate grow shrink pointer-events-none"
    >{datum.content}</span>
  {/if}
  <Pill status={datum.status}/>
</section>

<style>
  button {
    padding-inline: 0.25rem;
    border-radius: 0.25rem;
    &:hover {
      background-color: light-dark(white, black);
    }
  }
</style>