<script lang="ts" module>
  type DragState = (
    {
      type: 'idle'
    } | {
      type: 'preview'
      container: HTMLElement
    } | {
      type: 'is-dragging'
    } | {
      type: 'is-dragging-over'
      closestEdge: Edge | null
    }
  )
  export type DragStateType = DragState['type']
</script>

<script lang="ts" generics="R extends Record<string | symbol, unknown>">
  import {
    draggable,
    dropTargetForElements,
  } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
  import {
    setCustomNativeDragPreview
  } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview'
  import {
    pointerOutsideOfPreview
  } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview'
  import {
    combine
  } from '@atlaskit/pragmatic-drag-and-drop/combine'
  import invariant from 'tiny-invariant'
  import {
    attachClosestEdge,
    type Edge,
    extractClosestEdge,
  } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
  import { mount, type Component, type Snippet } from 'svelte'
  import DropIndicator from './DropIndicator.svelte'
  import DragPreview from './DragPreview.svelte'

  const idle: DragState = { type: 'idle' }

  let {
    datum, isDatum, row, rowClasses, preview,
  }: {
    datum: R
    isDatum: (datum: unknown) => datum is R
    row: Component<R>
    rowClasses?: (type: DragStateType) => string
    preview: Component<R>
  } = $props()
  let element = $state<HTMLDivElement | null>(null)
  let status = $state<DragState>(idle)

  $effect(() => {
    invariant(element)
    return combine(
      draggable({
        element,
        getInitialData() {
          return datum as Record<string, unknown>
        },
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: '1rem',
              y: '0.5rem',
            }),
            render({ container }) {
              status = { type: 'preview', container }
              mount(DragPreview, {
                target: container,
                props: { preview, datum },
              })
            },
          })
        },
        onDragStart() {
          status = { type: 'is-dragging' }
        },
        onDrop() {
          status = idle
        },
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          if(source.element === element) {
            return false // no drop on self
          }
          return isDatum(source.data)
        },
        getData({ input }) {
          if(element == null) return datum
          return attachClosestEdge(datum, {
            element,
            input,
            allowedEdges: ['top', 'bottom'],
          })
        },
        getIsSticky() {
          return true
        },
        onDragEnter({ self }) {
          const closestEdge = extractClosestEdge(self.data)
          status = { type: 'is-dragging-over', closestEdge }
        },
        onDrag({ self }) {
          const closestEdge = extractClosestEdge(self.data)
          status = { type: 'is-dragging-over', closestEdge }
        },
        onDragLeave() {
          status = idle
        },
        onDrop() {
          status = idle
        },
      }),
    )
  })
</script>

<li class="relative">
  <div
    data-element-id={datum.id}
    bind:this={element}
    class={rowClasses?.(status.type)}
  >
    <row {datum}></row>
  </div>
  {#if status.type === 'is-dragging-over' && status.closestEdge}
    <DropIndicator edge={status.closestEdge} gap={'0.5rem'}/>
  {/if}
</li>
