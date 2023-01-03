export default {
	name: 'rendDom',
	props: {
		rendNode: null
	},
	render (h) {
		return h('div', this.rendNode)
	}
}
