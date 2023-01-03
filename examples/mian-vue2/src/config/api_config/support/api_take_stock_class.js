import { get, post, put, del } from '@/js/api/dataSource'
export default {
	// 盘点分类
	takeStockClass: {
		// 新增盘点分类
		add () {
			return post({ url: '/bill/check/class/v1', autoSuccessMsg: true })
		},
		// 修改盘点分类
		save (id) {
			return put({ url: `/bill/check/class/v1/${id}`, autoSuccessMsg: true })
		},
		// 删除接口
		del (id) {
			return del({ url: `/bill/check/class/v1/${id}`, autoSuccessMsg: true })
		},
		// 根据id查询单据详情
		get (id) {
			return get({ url: `/bill/check/class/v1/${id}` })
		},
		// 分页查询接口
		getPage () {
			return post({ url: '/bill/check/class/v1/page' })
		},
		// 修改适用仓库接口
		settingHouse (id) {
			return put({ url: `/bill/check/class/house/v1/${id}`, autoSuccessMsg: true })
		},
		// 修改适用品项接口
		settingItem (id) {
			return put({ url: `/bill/check/class/item/v1/${id}`, autoSuccessMsg: true })
		},
		// 修改必盘品项接口
		settingMustItem (id) {
			return put({ url: `/bill/check/class/item/v1/must/${id}`, autoSuccessMsg: true })
		},
		// 根据分类id查询适用仓库和仓库
		getStoreById (id) {
			return get({ url: `/bill/check/class/house/v1/all/${id}` })
		},
		// 根据分类id查询适用品项和品项
		getItemById (id) {
			return get({ url: `/bill/check/class/item/v1/all/${id}` })
		},
		// 根据分类id查询必盘品项和品项
		getMustItemById (id) {
			return get({ url: `/bill/check/class/item/v1/all/must/${id}` })
		},
		// 获取品项类别树
		getItemTree () {
			return get({ url: '/archive/item/type/v1/tree' })
		},
		// 主列表筛选条件：机构
		getFilterOrganList (typeList = []) {
			const params = { organTypeList: ['2', '1', '5', '6'] }
			if (typeList.length > 0) {
				params.organTypeList = typeList
			}
			return post({ url: '/archive/organ/v1/manage/simple/tab', data: params })
		},
		// 主列表筛选条件：仓库
		// getFilterStoreList () {
		// 	return post({ url: '/archive/house/v1/simple/all', data: [1, 2, 5, 6] })
		// },
		getFilterStoreList (typeList = []) {
			const params = {
				organTypeList: [2, 1, 5, 6]
			}
			if (typeList.length > 0) {
				params.organTypeList = typeList
			}
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
		// 批量停用接口
		disableMulity () {
			return put({ url: '/bill/check/class/v1/disable', autoSuccessMsg: true })
		},
		// 批量启用接口
		enabelMulity () {
			return put({ url: '/bill/check/class/v1/enable', autoSuccessMsg: true })
		},
		// 批量删除接口
		deleteMulity () {
			return put({ url: '/bill/check/class/v1/delete', autoSuccessMsg: true })
		},
		// 导出Excel数据
		exportData (id) {
			return get({ url: `/excel/check_class/v1/${id}/export`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 获取盘点分类顺序号
		getTakeStockSort () {
			return post({ url: '/bill/check/class/sort/v1/search' })
		},
		// 添加盘点分类顺序号
		saveTakeStockSort () {
			return post({ url: '/bill/check/class/sort/v1' })
		}
	}
}
