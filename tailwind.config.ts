import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				white: '#efeff3',
				border: 'rgba(181, 181, 181, 0.1)',
				primary: '#6F3AFF',
			},
			padding: {
				layout: '1.25rem',
			},
		},
	},
	plugins: [],
}
export default config
