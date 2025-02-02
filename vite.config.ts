import tailwindcss from '@tailwindcss/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
	],
	resolve: {
		dedupe: ['@atlaskit/pragmatic-drag-and-drop'],
		alias: {
			'@atlaskit/pragmatic-drag-and-drop': '@atlaskit/pragmatic-drag-and-drop/dist/cjs/entry-point'
		},
	},
	optimizeDeps: {
		include: ['@atlaskit/pragmatic-drag-and-drop'],
	},
})
