import { post, get, put } from '@/js/api/dataSource'
export default {
	// 参数接口
	paramConfig: {
		// 获取系统参数数
		getTreeData () {
			return get({ url: '/param/config/v1/tree' })
		},
		// 根据枚举名称查询系统参数默认值
		getParamsByEnum () {
			return post({ url: '/param/config/v1/type/param/list' })
		},
		// 保存系统参数
		saveParams () {
			return put({ url: '/param/config/v1', autoSuccessMsg: true })
		},
		// 获取所有系统参数
		getParamsAll () {
			return get({ url: 'param/config/v1/all', loading: false })
		}
	}
}
