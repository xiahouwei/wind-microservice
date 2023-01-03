export default [{
	path: '/',
	redirect: '/login'
}, {
	path: '/login',
	name: 'login',
	component: r => require.ensure([], function (require) { r(require('@/views/login/Index.vue')) }, 'login')
}]
