import tailwindcss from '@tailwindcss/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => {
	const config = {
		plugins: [
			tailwindcss(),
			sveltekit(),
		],
	}
	if(command === 'build') {
		Object.assign(config, {
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
	}
	return config
})
