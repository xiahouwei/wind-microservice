import { get, post, put } from '@/js/api/dataSource'
export default {
	// 品项自定义分组
	itemCustomGroup: {
		// 查询所有的品项(包括停用的)tab
		getItemSelectTab () {
			return get({ url: '/archive/item/v1/list/tab', loading: false })
		},
		// 新增品项自定义分组
		add () {
			return post({ url: '/archive/custom_group/v1', autoSuccessMsg: true })
		},
		// 修改品项自定义分组
		save () {
			return put({ url: 'archive/custom_group/v1', autoSuccessMsg: true })
		},
		// 删除接口
		delete () {
			return put({ url: '/archive/custom_group/v1/delete', autoSuccessMsg: true })
		},
		// 根据id查询单据详情
		get (id) {
			return get({ url: `/archive/custom_group/v1/${id}` })
		},
		// 分页查询接口
		getPage () {
			return post({ url: '/archive/custom_group/v1/page' })
		},
		// 修改适用品项接口
		settingItem (id) {
			return put({ url: `/archive/custom_group/v1/rel_item/${id}`, autoSuccessMsg: true })
		},
		// 根据分类id查询适用品项和品项
		getItemById (id) {
			return get({ url: `/archive/custom_group/v1/rel_item/${id}` })
		},
		// 获取品项类别树
		getItemTree () {
			return get({
				url: '/archive/item/type/v1/tree',
				success: (res) => {
					return [{
						name: '全部',
						treeType: 'root',
						fatherId: null,
						children: res,
						id: '1'
					}]
				}
			})
		},
		// 批量删除接口
		deleteMulity () {
			return put({ url: '/archive/custom_group/v1/delete', autoSuccessMsg: true })
		}
	}
}
