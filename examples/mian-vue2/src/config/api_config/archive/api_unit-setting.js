import { get, post, put, del, file } from '@/js/api/dataSource'
export default {
	// 单位使用场景设置接口
	unitSetting: {
		// {{{ 筛选条件获取
		// 查询所有的品项(包括停用的)
		getItemSelectList () {
			return get({ url: '/archive/item/v1/list', loading: false })
		},
		// }}}
		// 分页查询
		getPage () {
			return post({ url: '/archive/item_unit_set/v1/page' })
		},
		// 批量删除
		deleteMulity () {
			return del({ url: '/archive/item_unit_set/v1/delete', autoSuccessMsg: true })
		},
		// 获取品项列表
		getItemList (itemId) {
			return get({ url: `/archive/item_unit_set/v1/item/query/${itemId}` })
		},
		// 新增单位使用场景设置
		add () {
			return post({ url: '/archive/item_unit_set/v1', autoSuccessMsg: true })
		},
		// 查询单位使用场景设置详情
		getDetails (itemId, billClass) {
			return get({ url: `/archive/item_unit_set/v1/${itemId}/${billClass}` })
		},
		// 修改单位使用场景设置详情
		saveDetails () {
			return put({ url: '/archive/item_unit_set/v1', autoSuccessMsg: true })
		},
		// 获取自定义设置
		getCustomSetting (id) {
			return get({ url: `/archive/item_unit_set/v1/custom/${id}` })
		},
		// 保存自定义设置
		saveCustomSetting (id) {
			return post({ url: `/archive/item_unit_set/v1/custom/${id}` })
		},
		// 获取配送中心列表/门店列表
		getOragnList () {
			return post({ url: '/archive/organ/v1/all/simple/tab' })
		},
		// 导出空白模板
		exportModel () {
			return get({ url: '/excel/item_unit_set/v1/export', responseType: 'arraybuffer', responseComplete: true })
		},
		// 根据模板导入Excel数据
		importData () {
			return file({ url: '/excel/item_unit_set/v1/import', responseType: 'arraybuffer', responseComplete: true, autoSuccessMsg: true })
		}
	}
}
