<script lang="ts">
  import GripVertical from 'lucide-svelte/icons/grip-vertical'
  import Pill from './Status.svelte'
  import type { Task } from '../../routes/+page.svelte'
  import type { Status } from '$lib/types.js';

  let { datum = $bindable(null) }: { datum: Task | null } = $props()
  let editing = $state(false)
  let value = $state(datum?.content)
  let input = $state<HTMLElement | null>(null)

  $effect(() => {
    if(editing) input?.focus()
  })

  const rename = (e?: Event) => {
    e?.preventDefault()
    if(datum && value) datum.content = value
    editing = false
  }
  const restatus = (
    ({ old, new: altered }: { old: Status, new: Status }) => {
      if(datum && altered) datum.status = altered
    }
  )
  const toggle = () => {
    editing = !editing
    if(editing) {
      value = datum?.content
    } else {
      rename()
    }
  }
</script>

<section
  role="button"
  tabindex={0}
  ondblclick={toggle}
  class="flex items-center justify-center"
>
  <span class="px-1">
    <GripVertical/>
  </span>
  {#if editing}
    <form
      onsubmit={rename}
      bind:this={input}
      class="grow flex gap-0.5"
    >
      <input
        onload={({ target }) => (target as HTMLElement).focus()}
        bind:value
        onkeydown={({ key }) => {
          if(key === 'Escape') {
            value = datum?.content
            editing = false
          }
        }}
        class={[
          'grow w-[fit-content] border-amber-200 border-2',
          'rounded-md px-2 py-1 bg-transparent'
        ]}
      />
      <button class="text-green-500">🗸️</button>
      <button onclick={() => value = datum?.content}>🗑️</button>
    </form>
  {:else}
    <span
      ondblclick={toggle}
      role="button"
      tabindex={0}
      class="truncate grow shrink pointer-events-none"
    >{datum?.content}</span>
  {/if}
  <Pill status={datum?.status} onChange={restatus}/>
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