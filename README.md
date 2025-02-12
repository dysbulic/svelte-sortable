# Pragmatic Drag and Drop in Svelte

This is an adaptation of the [Pragmatic Drag and Drop](https://atlassian.design/components/pragmatic-drag-and-drop/) from [Atlassian's UI Kit](https://atlaskit.atlassian.com/)'s [simple example](https://github.com/atlassian/pragmatic-drag-and-drop/discussions/71) to work with Svelte 5, with some modifications to make the code more easily reusable and to allow reversing operations.

## Development Server

To start a local development version of the application, run:

```bash
pnpm dev
```

Assuming you've already run `pnpm install` to download the dependencies.

## Use

For an example of how to use this library, see the [`src/routes/+page.svelte`](src/routes/+page.svelte) file in this project.

That code is what drives [the sample page](https://dysbulic.github.io/svelte-pragmatic-sortable/).

It creates a a state variable to hold the tasks. Then it binds that variable to the `data` property of `SortableList`. By looking at the [`Line` component](src/lib/components/Line.svelte) & [`DragPreview` component](src/lib/components/DragPreview.svelte), which are also passed to SortableList, it should be possible to understand how to configure the rendering components for your data type.

## Credits

Most of the Pragmatic Drag & Drop code was copied whole cloth from [`pdnd-react-tailwind`](https://github.com/alexreardon/pdnd-react-tailwind) by [@alexreardon](https://github.com/alexreardon/).
