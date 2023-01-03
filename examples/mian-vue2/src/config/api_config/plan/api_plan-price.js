import { get, post, put, del, file } from '@/js/api/dataSource'
export default {
	// 价格方案
	planPrice: {
		// 新增接口
		add () {
			return post({ url: '/plan/price/v1', autoSuccessMsg: true })
		},
		// 修改接口
		save (id) {
			return put({ url: `/plan/price/v1/${id}`, autoSuccessMsg: true })
		},
		// 删除接口
		del (id) {
			return del({ url: `/plan/price/v1/${id}`, autoSuccessMsg: true })
		},
		// 批量启用
		enabelMulity () {
			return put({ url: '/plan/price/v1/enable', autoSuccessMsg: true })
		},
		// 批量停用
		disableMulity () {
			return put({ url: '/plan/price/v1/disable', autoSuccessMsg: true })
		},
		// 查询接口
		get (id) {
			return get({
				url: `/plan/price/v1/${id}`,
				success: res => {
					res.organIds = res.buyerOrganList.map(item => {
						return item.organId
					})
					res.sellerOrganIds = res.sellerOrganList.map(item => {
						return item.organId
					})
					return res
				}
			})
		},
		// 筛选条件--获取机构tab列表
		getOrganSelectTab () {
			const params = { organTypeList: ['1', '2', '5', '6'] }
			return post({ url: '/archive/organ/v1/all/simple/tab', data: params })
		},
		// 筛选条件--获取品项列表
		getItemSelect () {
			return get({ url: '/archive/item/v1/list' })
		},
		// 查询已经启用的机构和传入的id列表信息(买方)
		getBuyerList () {
			return post({ url: '/archive/plan/price/v1/buyer/query?tab_flag=false' })
		},
		getBuyerTabList () {
			return post({ url: '/archive/plan/price/v1/buyer/query?tab_flag=true' })
		},
		// 查询已经启用的机构和传入的id列表信息(卖方)
		getSellerList () {
			return post({ url: '/archive/plan/price/v1/seller/query?tab_flag=false' })
		},
		getSellerTabList () {
			return post({ url: '/archive/plan/price/v1/seller/query?tab_flag=true' })
		},
		// 分页查询接口
		getPage () {
			return post({ url: '/plan/price/v1/page' })
		},
		// 批量删除
		deleteMulity () {
			return put({ url: '/plan/price/v1/delete', autoSuccessMsg: true })
		},
		// 删除(回收站)
		recyclingDelete (id) {
			return put({ url: `/plan/price/v1/remove/${id}`, autoSuccessMsg: true })
		},
		// 批量删除(回收站)
		recyclingDeleteMulity () {
			return put({ url: '/plan/price/v1/batch/remove', autoSuccessMsg: true })
		},
		// 批量恢复(回收站)
		recoverMulity () {
			return put({ url: '/plan/price/v1/restore', autoSuccessMsg: true })
		},
		// 根据时间、卖方、买方、品项 查询价格
		searchPrice () {
			return post({ url: '/plan/price/v1/price' })
		},
		// 批量审核
		checkMulity () {
			return put({ url: '/plan/price/v1/check', autoSuccessMsg: true })
		},
		// 批量反审
		uncheckMulity () {
			return put({ url: '/plan/price/v1/uncheck', autoSuccessMsg: true })
		},
		// 根据时间、卖方、买方、品项 导出价格单
		exportPriceExcel (query) {
			return get({ url: '/plan/price/v1/download/price', query, responseType: 'arraybuffer', responseComplete: true })
		},
		// 根据时间、卖方、买方、品项 导出价格履历
		exportPriceHistoryExcel (query) {
			return get({ url: '/excel/price_plan/v1/resume/export', query, responseType: 'arraybuffer', responseComplete: true })
		},
		// 删除空单据接口
		delEmptyBill (id) {
			return del({ url: `/plan/price/v1/empty/detail/${id}`, loading: false, autoErrorMsg: false })
		},
		// 明细
		// 新增接口
		addDetails (planId) {
			return post({ url: `/plan/price_detail/${planId}/detail/v1` })
		},
		// 批量新增接口
		addDetailsMulity (planId) {
			return post({ url: `/plan/price_detail/${planId}/detail/v1/add_batch`, autoSuccessMsg: true })
		},
		// 修改接口
		saveDetails (planId, id) {
			return put({ url: `/plan/price_detail/${planId}/detail/v1/${id}` })
		},
		// 删除明细接口
		delDetail (planId, id) {
			return del({ url: `/plan/price_detail/${planId}/detail/v1/${id}`, autoSuccessMsg: true })
		},
		// 批量删除明细接口
		delDetailMulity (planId) {
			return put({ url: `/plan/price_detail/${planId}/detail/v1/delete`, autoSuccessMsg: true })
		},
		// 获取明细接口
		getDetailsPage (planId) {
			return get({ url: `/plan/price_detail/${planId}/detail/v1` })
		},
		// 查询已经启用的品项和传入的id列表信息
		getItemList () {
			return post({ url: '/archive/plan/price/v1/item/query', data: [] })
		},
		// 批量更新价格方案明细税率接口
		settingMulityTax (planId) {
			return put({ url: `/plan/price_detail/${planId}/detail/v1/batch/tax_rate`, autoSuccessMsg: true })
		},
		// 批量更新价格方案明细备注接口
		settingMulityMemo (planId) {
			return put({ url: `/plan/price_detail/${planId}/detail/v1/batch/memo`, autoSuccessMsg: true })
		},
		// 批量更新价格方案明细价格策略接口
		settingMulityStrategy (planId) {
			return put({ url: `/plan/price_detail/${planId}/detail/v1/batch/strategy`, autoSuccessMsg: true })
		},
		// 审核接口
		check (id) {
			return put({ url: `/plan/price/v1/check/${id}`, autoSuccessMsg: true })
		},
		uncheck (id) {
			return put({ url: `/plan/price/v1/uncheck/${id}`, autoSuccessMsg: true })
		},
		// 防错校验接口
		checkMistake (id) {
			return post({ url: `/plan/price/v1/mistake_proofing/${id}`, query: { error_check: true } })
		},
		// 批量删除重复品项
		delCheckDetailsMulity (planId) {
			return put({ url: `/plan/price_detail/${planId}/detail/v1/delete` })
		},
		// 复制方案
		copyPlan (id) {
			return get({ url: `/plan/price/v1/copy/${id}` })
		},
		// 导出空白模板
		exportModel (planId) {
			return get({ url: `/excel/price_plan/v1/export/model/${planId}`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 按模板导出数据
		exportData (planId) {
			return get({ url: `/excel/price_plan/v1/export/${planId}`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 根据模板导入Excel数据
		importData (planId) {
			return file({ url: `/excel/price_plan/v1/${planId}/import/model`, responseType: 'arraybuffer', responseComplete: true, autoSuccessMsg: true })
		}
	}
}
