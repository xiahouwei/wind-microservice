// 项目page导航设置(暂未使用)
export default {
	home: {
		id: 'home',
		label: '主页',
		path: '/main/home',
		children: {
			organMange: {
				id: 'organMange',
				label: '机构管理',
				path: '/main/organMange',
				parentId: 'home'
			}
		}
	}
}
