<script lang="ts" generics="R extends Record<string | symbol, unknown>">
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
  import type { Snippet } from 'svelte'
  import Row, { type DragStateType } from './Row.svelte'

  type IdedR = { id: number } & R

  let {
    data = $bindable([]),
    history = $bindable([]),
    isDatum: externalIsDatum,
    listClasses,
    row,
    rowClasses,
    preview,
  }: {
    data: Array<IdedR>
    history?: Array<Array<R>>
    isDatum?: (datum: unknown) => datum is IdedR,
    listClasses?: string,
    row: Snippet<[R]>,
    rowClasses?: (type: DragStateType) => string,
    preview: Snippet<[R]>,
  } = $props()

  const isDatum = (datum: unknown): datum is IdedR => (
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

        history.push([...data])
        data = reorderWithEdge({
          list: data,
          startIndex: indexOfSource,
          indexOfTarget,
          closestEdgeOfTarget,
          axis: 'vertical',
        })

        // Being simple and just querying for the task after the drop.
        // We could use react context to register the element in a lookup,
        // and then we could retrieve that element after the drop and use
        // `triggerPostMoveFlash`. But this gets the job done.
        const element = document.querySelector(`[data-element-id="${sourceData.id}"]`)
        if(element instanceof HTMLElement) {
          triggerPostMoveFlash(element)
        }
      },
    })
  ))
</script>

<ul class={listClasses}>
  {#each data as datum (datum.id)}
    <Row {row} {rowClasses} {preview} {isDatum} {datum}/>
  {/each}
</ul>
