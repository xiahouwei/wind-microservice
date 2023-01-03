export default [{
	path: '/',
	redirect: '/print'
}, {
	path: '/print',
	name: 'print',
	component: r => require.ensure([], function (require) { r(require('@/views/print/Index.vue')) }, 'print')
}]
