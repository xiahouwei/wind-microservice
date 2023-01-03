import { get, post, put, del, file } from '@/js/api/dataSource'
export default {
	// 品项接口
	item: {
		// {{{ 筛选条件获取
		// 查询所有的品项(包括停用的)
		getItemSelectList () {
			return get({ url: '/archive/item/v1/list', loading: false })
		},
		// 查询所有的品项(包括停用的)tab
		getItemSelectTab () {
			return get({ url: '/archive/item/v1/list/tab', loading: false })
		},
		// 查询所有的财务分类(包括停用的)
		getFinanceSortList () {
			return get({ url: '/archive/finance_sort/v1/all/search?searchKey=', loading: false })
		},
		// }}}
		// 新增品项
		add () {
			return post({ url: '/archive/item/v1', autoSuccessMsg: true })
		},
		// 删除品项
		delete (id) {
			return del({ url: `/archive/item/v1/${id}`, autoSuccessMsg: true })
		},
		// 删除品项(回收站)
		recyclingDelete (id) {
			return del({ url: `/archive/item/v1/${id}/remove`, autoSuccessMsg: true })
		},
		// 批量删除
		deleteMulity () {
			return put({ url: '/archive/item/v1/delete', autoSuccessMsg: true })
		},
		// 批量删除品项(回收站)
		recyclingDeleteMulity () {
			return put({ url: '/archive/item/v1/remove', autoSuccessMsg: true })
		},
		// 修改品项详情
		saveDetails (id) {
			return put({ url: `/archive/item/v1/${id}`, autoSuccessMsg: true })
		},
		// 查询品项详情
		getDetails (id) {
			return get({
				url: `/archive/item/v1/${id}`,
				success: res => {
					res.financeSortId || (res.financeSortId = '')
					return res
				}
			})
		},
		// 查询品项详情(回收站)
		getDetailsRecycling (id) {
			return get({
				url: `/archive/item/v1/recycle/${id}`,
				success: res => {
					res.financeSortId || (res.financeSortId = '')
					return res
				}
			})
		},
		// 分页查询
		getItemList () {
			return post({ url: '/archive/item/v1/page' })
		},
		// 分页查询(回收站)
		getItemListRecycling () {
			return post({ url: '/archive/item/v1/page', query: { del_flag: true } })
		},
		// 批量启用
		enabelMulity () {
			return put({ url: '/archive/item/v1/enable', autoSuccessMsg: true })
		},
		// 批量停用
		disableMulity () {
			return put({ url: '/archive/item/v1/disable', autoSuccessMsg: true })
		},
		// 恢复品项(回收站)
		recover (id) {
			return put({ url: `/archive/item/v1/${id}/restore`, autoSuccessMsg: true })
		},
		// 批量恢复品项(回收站)
		recoverMulity () {
			return put({ url: '/archive/item/v1/restore', autoSuccessMsg: true })
		},
		// excel 导出
		exportData () {
			return get({ url: '/excel/item/v1/model/export', responseType: 'arraybuffer', responseComplete: true })
		},
		// 导出空白模板
		exportModel (type) {
			return post({ url: `/excel/item_${type}_rel/v1/export`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 根据模板导入Excel数据
		importData (type) {
			return file({ url: `/excel/item_${type}_rel/v1/import`, responseType: 'arraybuffer', responseComplete: true, autoSuccessMsg: true })
		},
		// 保存品项与仓库关联关系
		saveConnectStore (id) {
			return put({ url: `/archive/item/v1/itemhouse/${id}`, autoSuccessMsg: true })
		},
		// 根据品项查询关联仓库
		getConnectStore (id) {
			return get({ url: `/archive/item/v1/itemhouse/${id}` })
		},
		// 根据品项复制关联仓库关系到其他品项接口
		copyConnectWithItem (id) {
			return put({ url: `/archive/item/v1/itemhouse/${id}/copy`, autoSuccessMsg: true })
		},
		// 查询除了传入id的所有已经有关联关系的品项
		getConnectExcludeId (id) {
			return get({ url: `/archive/item/v1/itemhouse/except/${id}/all` })
		},
		// 查询除了传入id的所有的品项
		getItemExcludeId (id) {
			return get({ url: `/archive/item/v1/except/${id}/all` })
		},
		// 复制关联关系—品项到品项
		copyConnectItem2Item (sourceItemId, targetItemId) {
			return put({ url: `/archive/item/v1/itemhouse/${sourceItemId}/copy/${targetItemId}`, autoSuccessMsg: true })
		},
		// 判断单位是否已被使用
		getItemUsingState (itemId, unitId) {
			return get({ url: `/archive/item_unit/v1/item/${itemId}/unit/${unitId}/using_state` })
		},
		// 获取品项默认编号
		getItemCode () {
			return post({ url: '/archive/item/v1/code' })
		},
		// 打印条码
		printBarCode () {
			return get({ url: 'http://localhost:3100/barCodePrint' })
		},
		// 品项批量设置
		settingMulity () {
			return put({ url: 'archive/item/v1/set' })
		},
		// 判断单位是否已被使用（批量修改单位时校验）
		settingUnitCheck (itemId) {
			return put({ url: `/archive/item_unit/v1/item/${itemId}/unit/using_state`, autoErrorMsg: false })
		},
		// 添加品项财务分类关联
		settingItemFinance (itemId) {
			return post({ url: `/archive/item_finance/v1/${itemId}`, autoSuccessMsg: true })
		},
		// 获取品项财务分类关联仓库
		getItemFinanceHouse (itemId) {
			return get({
				url: `/archive/item_finance/v1/itemhouse/${itemId}`,
				success: res => {
					res.forEach(item => {
						item.houseId = item.id
						item.financeSortId || (item.financeSortId = '')
					})
					return res
				}
			})
		},
		// 获取品项默认货位仓库
		getConnectLocation (id) {
			return get({ url: `/archive/item_location/v1/itemhouse/${id}` })
		},
		// 添加品项默认货位关系
		saveConnectLocation (id) {
			return post({ url: `/archive/item_location/v1/${id}`, autoSuccessMsg: true })
		},
		// 获取品项默认货位
		getLocationList () {
			return post({ url: '/archive/item_location/v1/itemLocation' })
		},
		// {{{ 品项设置向导
		// {{{ 品项设置向导——采购方案
		// 品项向导查询方案
		getItemStockPlanList (itemId) {
			return get({ url: `/plan/stock/v1/item/${itemId}/list` })
		},
		// 品项向导批量新增方案明细
		setItemStockPlan () {
			return post({ url: '/plan/stock_detail/v1/main/1/item/batch_add', autoSuccessMsg: true })
		},
		// 查询品项单位列表
		getItemUnitList (itemId, planType) {
			return get({ url: `/archive/item_unit/v1/item/${itemId}/list/${planType}` })
		},
		// 查询机构列表信息(卖方)
		getSellerList (itemId) {
			return post({ url: `/archive/plan/price/v1/seller/query?tab_flag=false&itemId=${itemId}` })
		},
		// 查询机构列表信息(卖方Tab形式)
		getSellerTabList (itemId) {
			return post({ url: `/archive/plan/price/v1/seller/query?tab_flag=true&itemId=${itemId}` })
		},
		// 查询卖方机构下品项关联仓库
		getSellerHouseList (organId, itemId) {
			return post({ url: `/archive/house/v1/organId/${organId}/${itemId}`, loading: false })
		},
		// }}}
		// {{{ 品项设置向导——价格方案
		// 品项向导查询方案
		getItemPricePlanList (itemId) {
			return get({ url: `/plan/price/v1/item/${itemId}/list` })
		},
		// 品项向导批量新增方案明细
		setItemPricePlan () {
			return post({ url: '/plan/price/v1/item/batch_add', autoSuccessMsg: true })
		},
		// }}}
		// {{{ 品项设置向导——盘点分类
		// 品项向导查询盘点分类
		getItemTakeStockClassList (itemId) {
			return get({ url: `/bill/check/class/v1/item/${itemId}/list` })
		},
		// 品项向导批量设置关联盘点分类
		setItemTakeStockClass (itemId) {
			return post({ url: `/bill/check/class/v1/item/${itemId}/batch_add`, autoSuccessMsg: true })
		}
		// }}}
		// }}}
	}
}
