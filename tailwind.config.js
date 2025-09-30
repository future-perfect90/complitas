// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
	// Add 'class' to enable dark mode toggling via a class on the <html> tag
	darkMode: 'class',
	content: [
		'./index.html',
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
		'./src/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			// Define the color palette using our CSS variables
			colors: {
				background: 'rgb(var(--color-bg-primary) / <alpha-value>)',
				surface: 'rgb(var(--color-bg-secondary) / <alpha-value>)',
				primary: {
					DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
					hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
				},
				text: {
					primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
					secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
				},
				border: 'rgb(var(--color-border) / <alpha-value>)',
				success: 'rgb(var(--color-success) / <alpha-value>)',
				warning: 'rgb(var(--color-warning) / <alpha-value>)',
				danger: 'rgb(var(--color-danger) / <alpha-value>)',
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};
