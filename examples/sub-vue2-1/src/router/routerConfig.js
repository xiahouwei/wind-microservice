
export default [{
	path: '/',
	redirect: '/tickDesign'
}, {
	path: '/tickDesign',
	name: 'tickDesign',
	component: () => import(/* webpackChunkName: "systemManage-printSetting" */ '@/views/tickTemplate/Index.vue')
}]
