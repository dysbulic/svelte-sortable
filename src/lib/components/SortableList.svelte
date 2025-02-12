<script lang="ts" generics="D extends Record<string | symbol, unknown> & { id: number }">
  import {
    monitorForElements
  } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
  import {
    extractClosestEdge
  } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
  import {
    reorderWithEdge
  } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge'
  import {
    triggerPostMoveFlash
  } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash'
  import type { Component } from 'svelte'
  import Row, { type DragStateType } from './Row.svelte'

  let {
    data = $bindable([]),
    isDatum: externalIsDatum,
    listClasses,
    row,
    rowClasses,
    preview,
  }: {
    data: Array<D>
    isDatum?: (datum: unknown) => datum is D
    listClasses?: string | Array<string>
    row: Component
    rowClasses?: (type: DragStateType) => string | Array<string>
    preview: Component
  } = $props()

  const isDatum = (datum: unknown): datum is D => (
    externalIsDatum ? externalIsDatum(datum) : true
  )

  $effect(() => (
    monitorForElements({
      canMonitor({ source }) {
        return isDatum(source.data)
      },
      onDrop({ location, source }) {
        const [target] = location.current.dropTargets
        if(!target) return

        const { data: sourceData } = source
        const { data: targetData } = target

        if(!isDatum(sourceData) || !isDatum(targetData)) {
          return
        }

        const indexOfDatum = (id: number) => (
          data.findIndex(({ id: current }) => current === id)
        )
        const indexOfSource = indexOfDatum(sourceData.id)
        const indexOfTarget = indexOfDatum(targetData.id)

        if(indexOfTarget < 0 || indexOfSource < 0) {
          return
        }

        const closestEdgeOfTarget = (
          extractClosestEdge(targetData)
        )

        data = reorderWithEdge({
          list: data,
          startIndex: indexOfSource,
          indexOfTarget,
          closestEdgeOfTarget,
          axis: 'vertical',
        })

        const element = document.querySelector(
          `[data-element-id="${sourceData.id}"]`
        )
        if(element instanceof HTMLElement) {
          triggerPostMoveFlash(element)
        }
      },
    })
  ))
</script>

<ul class={listClasses}>
  {#each data as datum, idx (datum.id)}
    <Row {row} {rowClasses} {preview} {isDatum} bind:datum={data[idx]}/>
  {/each}
</ul>
