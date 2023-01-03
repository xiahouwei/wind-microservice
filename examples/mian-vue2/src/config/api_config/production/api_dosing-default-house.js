import { get, post, put, del } from '@/js/api/dataSource'

export default {
	// 默认仓库
	dosingDefaultHouse: {
		// 获取加工机构
		getStoreOrganList () {
			return post({ url: '/archive/organ/v1/subProduct/organ_list', loading: false })
		},
		// 分页查询品项下拉列表tab
		getItemSelectTab () {
			return get({ url: '/archive/item/v1/list/tab' })
		},
		// 筛选条件--获取仓库tab列表
		getHouseSelectTab () {
			// 2: 'Shop' 门店, 1: 'Center' 中心
			const params = { organTypeList: [2, 1] }
			return post({
				url: '/archive/house/v1/manage/simple/tab',
				data: params,
				success: res => {
					res.forEach(item => {
						if (!item.listData) {
							item.listData = []
						}
					})
					return res
				}
			})
		},
		// 新增默认仓库
		add () {
			return post({
				url: '/bill/production/dosingDefaultHouse/v1',
				autoSuccessMsg: true
			})
		},
		edit (id) {
			return put({
				url: `/bill/production/dosingDefaultHouse/v1/${id}`,
				autoSuccessMsg: true
			})
		},
		//  获取详情
		getDetails (id) {
			return get({ url: `/bill/production/dosingDefaultHouse/v1/${id}`, loading: false })
		},
		// 分页查询
		getPage () {
			return post({ url: '/bill/production/dosingDefaultHouse/v1/page' })
		},
		// 删除
		delete (id) {
			return del({ url: `/bill/production/dosingDefaultHouse/v1/${id}`, autoSuccessMsg: true })
		},
		// 批量删除明细
		deleteMulity () {
			return post({ url: '/bill/production/dosingDefaultHouse/v1/batch/delete', autoSuccessMsg: true })
		},
		// 绑定品项
		saveRelationItem (id) {
			return post({ url: `/bill/production/dosingDefaultHouse/v1/saveRelationItem/${id}`, autoSuccessMsg: true })
		},
		// 默认仓库绑定品项
		getHouseSelectItem (id) {
			return get({ url: `/bill/production/dosingDefaultHouse/v1/selectItem/${id}` })
		}
	}
}
