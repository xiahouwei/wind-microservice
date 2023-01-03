import { post, get } from '@/js/api/dataSource'
import { devUrl } from '@/js/service/baseUrl'
export default {
	// 营业数据查询
	businessDataSearch: {
		// {{{ 主列表筛选条件
		// 获取筛选条件中订货时间的默认值
		getAccountingPeriod () {
			return get({ url: '/archive/accounting_period/v1/managed_organ/begin_end' })
		},
		// 主列表筛选条件：营业机构下拉列表
		getOrganSelect () {
			const params = {
				organTypeList: [2, 1]
			}
			return post({
				url: '/archive/organ/v1/business/all/simple/tab',
				data: params,
				loading: false,
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
		getNotSyncCPList () {
			return get({ url: `${devUrl}/business/archive/cp/v1/notSyncCPList` })
		},
		getItemList () {
			return get({ url: '/archive/item/v1/getNotCPItemList' })
		},
		matchItem () {
			return post({ url: `${devUrl}/business/archive/cp/v1/manualMatchItem`, autoSuccessMsg: true })
		},
		// 获取筛选条件中营业时间的默认值
		getFilterAccountingPeriod () {
			return get({ url: '/archive/accounting_period/v1/managed_organ/begin_end' })
		},
		// 分页查询
		getPage () {
			return post({ url: `${devUrl}/business/archive/dish_business/v1/page` })
		},
		// 重新导入
		reImport () {
			return post({ url: `${devUrl}/business/archive/dish_business/v1/import`, autoSuccessMsg: true })
		},
		// 立即获取营业数据
		getBusinessData () {
			return get({ url: `${devUrl}/business/archive/dish_business/v1`, autoSuccessMsg: true })
		}
	}
}
