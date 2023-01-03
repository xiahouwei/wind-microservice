import { post } from '@/js/api/dataSource'
export default {
	warn: {
		// 查询机构
		getOrganSelectTab (typeList = []) {
			const params = { organTypeList: ['2', '1', '5', '6'] }
			if (typeList.length > 0) {
				params.organTypeList = typeList
			}
			return post({ url: '/archive/organ/v1/manage/simple/tab', data: params })
		},
		// 查询仓库
		getInhouseSelect (typeList = []) {
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
		// 查询品项
		getItemSelect (params) {
			return post({ url: '/archive/item/v1/list/type/tab', data: params })
		},
		// 获取保质期预警列表
		getShelfLifeListData (params) {
			return post({ url: '/report/worn/shelf_life', data: params })
		},
		// 获取库存预警列表
		getStoreWarnListData (params) {
			return post({ url: '/report/worn/reserve', data: params })
		},
		// 导出保质期预警
		exportShelfLifeExcel (query) {
			return post({ url: '/excel/worn/v1/shelf_life/export', query, responseType: 'arraybuffer', responseComplete: true })
		},
		// 导出库存预警
		exportStoreWarnExcel (query) {
			return post({ url: '/excel/worn/v1/reserve/export', query, responseType: 'arraybuffer', responseComplete: true })
		}
	}
}
