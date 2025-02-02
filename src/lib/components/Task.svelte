<script lang="ts">
  import { GripVertical } from 'lucide-svelte'
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
  import { mount } from 'svelte'
  import DropIndicator from './DropIndicator.svelte'
  import DragPreview from './DragPreview.svelte'
  import { getTaskData, isTaskData, type TTask } from '$lib/task-data'
  import Status from './Status.svelte'

  type TaskState = (
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

  const stateStyles: { [Key in TaskState['type']]?: string } = {
    'is-dragging': 'opacity-40',
  }

  const idle: TaskState = { type: 'idle' }

  let { task }: { task: TTask } = $props()
  let element = $state<HTMLDivElement | null>(null)
  let status = $state<TaskState>(idle)

  $effect(() => {
    invariant(element)
    return combine(
      draggable({
        element,
        getInitialData() {
          return getTaskData(task)
        },
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: '16px',
              y: '8px',
            }),
            render({ container }) {
              status = { type: 'preview', container }
              mount(DragPreview, {
                target: container,
                props: { task },
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
          // not allowing dropping on yourself
          if(source.element === element) {
            return false
          }
          // only allowing tasks to be dropped on me
          return isTaskData(source.data)
        },
        getData({ input }) {
          const data = getTaskData(task)
          if(element == null) return data
          return attachClosestEdge(data, {
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

<div class="relative">
  <div
    data-task-id={task.id}
    bind:this={element}
    class={`flex text-sm bg-white flex-row items-center border border-solid rounded p-2 pl-0 hover:bg-slate-100 hover:cursor-grab ${stateStyles[status.type] ?? ''}`}
  >
    <div class="w-6 flex justify-center">
      <GripVertical size={10} />
    </div>
    <span class="truncate flex-grow flex-shrink">{task.content}</span>
    <Status status={task.status} />
  </div>
  {#if status.type === 'is-dragging-over' && status.closestEdge}
    <DropIndicator edge={status.closestEdge} gap={'8px'}/>
  {/if}
</div>
