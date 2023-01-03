import { get, post, file, put, del } from '@/js/api/dataSource'
export default {
	// 商品管理接口
	goods: {
		// {{{ 主列表
		getPage () {
			return post({ url: '/archive/goods/v1/page' })
		},
		// 获取导入页面的品项list
		getItemList () {
			return post({ url: '/archive/goods/v1/import/page' })
		},
		// list页导入
		importMulity () {
			return post({ url: '/archive/goods/v1/import', autoSuccessMsg: true })
		},
		// 批量启用
		enabelMulity () {
			return put({ url: '/archive/goods/v1/enable', autoSuccessMsg: true })
		},
		// 批量停用
		disableMulity () {
			return put({ url: '/archive/goods/v1/disable', autoSuccessMsg: true })
		},
		// 批量删除
		deleteMulity () {
			return put({ url: '/archive/goods/v1/delete', autoSuccessMsg: true })
		},
		// 批量解绑
		unbindMulity () {
			return put({ url: '/archive/goods/v1/unbind', autoSuccessMsg: true })
		},
		// 批量推送
		pushMulity () {
			return post({ url: '/archive/goods/v1/push', autoSuccessMsg: true })
		},
		// }}}
		// {{{ 新增/编辑页面
		// 新增商品
		addGoods () {
			return post({ url: '/archive/goods/v1/', autoSuccessMsg: true })
		},
		// 编辑商品
		editGoods (id) {
			return put({ url: `/archive/goods/v1/${id}`, autoSuccessMsg: true })
		},
		// 获取SPU编号
		getSPUCode () {
			return get({ url: '/archive/goods/v1/code' })
		},
		// 上传
		upload () {
			return file({ url: '/archive/goods/v1/upload' })
		},
		// 获取商品详情
		getGoods (id) {
			return get({ url: `/archive/goods/v1/${id}` })
		},
		// 明细中关联品项档案
		importSku () {
			return post({ url: '/archive/goods/v1/importSku' })
		},
		// 获取SKU单位列表接口
		getSkuUnitlist (skuId) {
			return get({ url: `/archive/goods/v1/sku/${skuId}/units` })
		},
		// 单条删除
		delete (id) {
			return del({ url: `/archive/goods/v1/${id}`, autoSuccessMsg: true })
		},
		// 单条推送接口
		push (id) {
			return put({ url: `/archive/goods/v1/push/${id}`, autoSuccessMsg: true })
		},
		// 单条推送接口
		unbind (id) {
			return put({ url: `/archive/goods/v1/unbind/${id}`, autoSuccessMsg: true })
		}
		// }}}
	}
}
