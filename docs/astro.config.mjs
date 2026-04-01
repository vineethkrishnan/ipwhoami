// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'ipwhoami',
			description: 'IP geolocation lookup from your terminal',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/vineethkrishnan/ipwhoami' },
			],
			editLink: {
				baseUrl: 'https://github.com/vineethkrishnan/ipwhoami/edit/main/docs/',
			},
			head: [
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: '/og.png' },
				},
			],
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{
					label: 'Start Here',
					items: [
						{ label: 'Getting Started', slug: 'getting-started' },
						{ label: 'Installation', slug: 'installation' },
					],
				},
				{
					label: 'Usage',
					items: [
						{ label: 'Basic Usage', slug: 'usage/basic' },
						{ label: 'Compare Mode', slug: 'usage/compare' },
						{ label: 'Raw JSON Output', slug: 'usage/raw-output' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'CLI Options', slug: 'reference/cli-options' },
						{ label: 'Providers', slug: 'reference/providers' },
						{ label: 'Self-Hosted API', slug: 'reference/self-hosted-api' },
						{ label: 'Standalone Scripts', slug: 'reference/standalone-scripts' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Adding a Provider', slug: 'guides/adding-a-provider' },
						{ label: 'Contributing', slug: 'guides/contributing' },
					],
				},
			],
		}),
	],
});
