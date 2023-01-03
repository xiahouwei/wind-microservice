import { get, post, del, put, file } from '@/js/api/dataSource'
export default {
	// 货架、货位管理接口
	storageManage: {
		// {{{货架接口
		// 获取货架树
		getRackTree () {
			return get({
				url: '/archive/shelves/v1/tree',
				success (res) {
					return [
						{
							id: '1',
							treeType: 'root',
							name: '全部',
							children: res
						}
					]
				}
			})
		},
		// 新增货架
		addRack () {
			return post({ url: '/archive/shelves/v1', autoSuccessMsg: true })
		},
		// 编辑货架
		editRack (id) {
			return put({ url: `/archive/shelves/v1/${id}`, autoSuccessMsg: true })
		},
		// 删除货架
		delRack (id) {
			return del({ url: `/archive/shelves/v1/${id}`, autoSuccessMsg: true })
		},
		// 获取货架信息
		getRack (id) {
			return get({ url: `/archive/shelves/v1/${id}` })
		},
		// 获取所属机构列表
		getOrganList () {
			return post({ url: '/archive/bill/organ/v1/in_store/organ_list' })
		},
		// 获取某机构下当前用户可管辖的仓库库列表
		getHouseList (organId) {
			return post({ url: `/archive/bill/house/v1/organ/${organId}/houseList` })
		},
		// }}}

		// {{{ 货位主列表筛选条件
		// 获取筛选条件货位列表
		getFilterSpaceList () {
			return post({
				url: '/archive/house_item_location/v1/search',
				data: {
					codeLike: '',
					hasHouseDetail: true,
					houseId: '',
					mustShowId: ''
				}
			})
		},
		// 获取筛选条件货架列表
		getFilterRackList () {
			return post({
				url: '/archive/shelves/v1/search',
				data: {
					codeLike: '',
					hasHouseDetail: true,
					houseId: '',
					mustShowId: ''
				}
			})
		},
		// 获取机构列表
		getFilterOrganSelectList () {
			return post({ url: '/archive/organ/v1/page/organ/tab', data: [1, 2], loading: false })
		},
		// 获取仓库列表
		getFilterStoreSelectList () {
			const params = {
				organTypeList: [2, 1]
			}
			return post({
				url: '/archive/house/v1/all/simple/tab',
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
		// 获取货位分页数据
		getListData () {
			return post({ url: '/archive/house_item_location/v1/page' })
		},
		// }}}

		// {{{ 货位详情
		// 获取货架列表
		getRackList (houseId, mustShowId) {
			return post({
				url: '/archive/shelves/v1/search',
				data: {
					codeLike: '',
					hasHouseDetail: false,
					houseId,
					enableFlag: 1,
					mustShowId,
					sysFlag: 0
				}
			})
		},
		// 获取货位详情
		getDetails (id) {
			return get({ url: `/archive/house_item_location/v1/${id}` })
		},
		// 新增货位
		add () {
			return post({ url: '/archive/house_item_location/v1' })
		},
		// 修改货位
		update (id) {
			return put({ url: `/archive/house_item_location/v1/${id}` })
		},
		// 批量启用货位
		enable () {
			return put({ url: '/archive/house_item_location/v1/enabled', autoSuccessMsg: true })
		},
		// 批量停用货位
		disable () {
			return put({ url: '/archive/house_item_location/v1/disable', autoSuccessMsg: true })
		},
		// 批量删除货位
		delete () {
			return put({ url: '/archive/house_item_location/v1/delete', autoSuccessMsg: true })
		},
		// }}}

		// {{{ 关联品项
		// 根据货位查询关联品项
		getConnectItem (id) {
			return get({ url: `/archive/location_item/v1/location/${id}` })
		},
		// 修改货位与品项关联关系接口
		saveConnectItem (id) {
			return put({ url: `/archive/location_item/v1/location/${id}`, autoSuccessMsg: true })
		},
		// }}}

		// excel导入
		importData () {
			return file({ url: '/excel/house_location/v1/import', responseType: 'arraybuffer', responseComplete: true, autoSuccessMsg: true })
		},
		// excel 导出
		exportData () {
			return get({ url: '/excel/house_location/v1/export', responseType: 'arraybuffer', responseComplete: true })
		}
	}
}
