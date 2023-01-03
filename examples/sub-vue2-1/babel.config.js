module.exports = {
	presets: [
		['@vue/cli-plugin-babel/preset', { exclude: ['proposal-dynamic-import'] }]
	],
	env: {
		development: {
			plugins: ['dynamic-import-node']
		}
	}
}
