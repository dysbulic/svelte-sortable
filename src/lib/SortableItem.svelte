<script lang="ts">
	import type { Snippet } from 'svelte'

	type TargetedEvent = DragEvent & {
		currentTarget: EventTarget & HTMLElement
	}

	let {
		index,
		data = $bindable(),
		hoveredIndex = $bindable(null),
		children,
		...props
	}: {
		index: number
		data: Array<unknown>
		hoveredIndex?: number | null
		children: Snippet
	} & Partial<typeof HTMLSpanElement> = $props()

	const start = function (evt: TargetedEvent, start: number) {
		if (evt.dataTransfer == null) {
			console.warn('No `dataTransfer` on `event`.')
			return
		}
		evt.dataTransfer.effectAllowed = 'move'
		evt.dataTransfer.dropEffect = 'move'
		evt.dataTransfer.setData('text/plain', start.toString())
	}
	const drop = function (evt: TargetedEvent, target: number) {
		if (evt.dataTransfer == null) {
			console.warn('No `dataTransfer` on `event`.')
			return
		}
		evt.dataTransfer.dropEffect = 'move'
		const start = Number(evt.dataTransfer.getData('text/plain'))

		const [removed] = data.splice(start, 1)
		if (start < target) --target
		data.splice(target, 0, removed)

		hoveredIndex = null
	}
</script>

<span
	{...props}
	role="listitem"
	draggable="true"
	ondragstart={(evt) => start(evt, index)}
	ondrop={(evt) => drop(evt, index)}
	ondragover={(evt: DragEvent) => evt.preventDefault()}
	ondragenter={(evt: DragEvent) => {
		evt.preventDefault()
		hoveredIndex = index
	}}
>
	{@render children()}
</span>
