import { get, post, put, del, file } from '@/js/api/dataSource'
export default {
	// BOM设置
	bom: {
		// 根据bom类别获取品项类别树
		getTypeTree (type) {
			return get({ url: `/archive/${type}/v1/itemType/tree` })
		},
		// 根据品项类别和bom类别获取品项及bom树
		getBomTree (type, id) {
			return get({ url: `/archive/${type}/v1/tree/${id}` })
		},
		// 新增bom时获取推荐编号
		getCode (type, itemId) {
			return get({ url: `/archive/${type}/v1/getCode/${itemId}` })
		},
		// 新增bom
		addBom (type) {
			return post({ url: `/archive/${type}/v1/add`, autoSuccessMsg: true })
		},
		// 删除bom
		deleteBom (type, bomId) {
			return del({ url: `/archive/${type}/v1/${bomId}`, autoSuccessMsg: true })
		},
		// 获取bom详情
		getBomDetail (type, bomId) {
			return get({
				url: `/archive/${type}/v1/${bomId}`,
				success: res => {
					// 获取参考成本增加4列
					res.details.forEach(item => {
						item.businessDate = ''
						item.organName = ''
						item.price = ''
						item.money = ''
					})
					return res
				}
			})
		},
		// 获取取价机构(tab分页数据结构)
		getOrganSelectTab () {
			const params = { organTypeList: ['2', '1'] }
			return post({ url: '/archive/organ/v1/manage/simple/tab', data: params })
		},
		// 获取参考成本价
		getConsultCost (type, bomId, organId) {
			return get({ url: `/archive/${type}/v1/getConsultCost/${bomId}/${organId}` })
		},
		// 编辑bom主表
		editBom (type) {
			return put({ url: `/archive/${type}/v1/mod` })
		},
		// 获取bom展示页信息
		getBomCard (type, bomId) {
			return get({ url: `/archive/${type}/v1/${bomId}/child/batching`, loading: true })
		},
		// 明细
		// 单项新增时获取品项列表
		getItemList (type, bomId) {
			return get({ url: `/archive/${type}/v1/itemList/${bomId}` })
		},
		// 单项新增时获取品项列表
		getItemListTab (type, bomId) {
			return get({ url: `/archive/${type}/v1/itemList/${bomId}/tab` })
		},
		// 批量新增时获取品项列表
		addMulityGetItem (type, bomId) {
			return get({ url: `/archive/${type}/v1/itemList/${bomId}` })
		},
		// 批量新增时获取品项列表(组合bom单独处理)
		addMulityGetItem4batch (type, bomId) {
			return get({ url: `/archive/${type}/v1/itemList4Batch/${bomId}` })
		},
		// 单项新增时获取品项的单位列表
		getUnitList (type, itemId) {
			return get({ url: `/archive/${type}/v1/itemUnitList/${itemId}` })
		},
		// 单行新增明细
		addDetail (type, bomId) {
			return post({ url: `/archive/${type}/${bomId}/details/v1/add` })
		},
		// 单项新增时获取下级BOM列表
		getChildBomList (type, bomId, itemId, childBomId = '') {
			return get({ url: `/archive/${type}/${bomId}/details/v1/${itemId}?requiredChildBomId=${childBomId}` })
		},
		// 批量新增明细
		addDetailsMulity (type, bomId) {
			return post({ url: `/archive/${type}/${bomId}/details/v1/batch/add`, autoSuccessMsg: true })
		},
		// 适用机构界面-左侧树
		getOrganTree (type) {
			return post({ url: `/archive/${type}_organ/v1/tree` })
		},
		// Bom适用机构-查询
		getConnectOrgan (type, bomId) {
			return get({ url: `/archive/${type}_organ/v1/organ/${bomId}` })
		},
		// Bom适用机构-保存
		saveConnectOrgan (type, bomId) {
			return put({ url: `/archive/${type}_organ/v1/organ/${bomId}`, autoSuccessMsg: true })
		},
		// 修改明细
		editDetail (type, bomId, autoSuccessMsg = false) {
			return put({ url: `/archive/${type}/${bomId}/details/v1`, autoSuccessMsg })
		},
		// 删除明细
		delDetail (type, bomId) {
			return del({ url: `/archive/${type}/${bomId}/details/v1`, autoSuccessMsg: true })
		},
		// 一致，复制详情-bom列表
		getCopyBomList (type, bomId) {
			return get({ url: `/archive/${type}/${bomId}/details/v1/copy/bomList` })
		},
		// 复制bom
		copyBom (type, bomId) {
			return post({ url: `/archive/${type}/${bomId}/details/v1/copy/bomList`, autoSuccessMsg: true })
		},
		// 与其他bom 一致
		copyWithBom (type, bomId) {
			return post({ url: `/archive/${type}/${bomId}/details/v1/consistent`, autoSuccessMsg: true })
		},
		// 批量设置
		setMulity (type, bomId) {
			return post({ url: `/archive/${type}/${bomId}/details/v1/batch/setting`, autoSuccessMsg: true })
		},
		// 保存冲减设置
		saveOffset (bomId) {
			return post({ url: `/archive/food_bom/v1/${bomId}/offset-relation`, autoSuccessMsg: true })
		},
		// 导出空白模板
		exportModel (type) {
			return get({ url: `/excel/bom/v1/${type}/model/export`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 导出BOM明细
		exportDetail (type) {
			return get({ url: `/excel/bom/v1/${type}/export`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 根据模板导入Excel数据
		importData (type) {
			return file({ url: `/excel/bom/v1/${type}/import`, responseType: 'arraybuffer', responseComplete: true, autoSuccessMsg: true })
		},
		// 推送中台
		pushMiddleGround () {
			return post({ url: '/archive/bill_center/food_bom/v1/send', autoSuccessMsg: true })
		},
		// 批量替换原料查询品项下拉列表tab
		getItemSelectTab (type) {
			return get({
				url: '/archive/item/v1/list/tab',
				success: res => {
					let data = res
					if (type === 'compose_bom' || type === 'split_bom') {
						data = res.filter(item => {
							return item.id !== '1'
						})
					}
					return data
				}
			})
		},
		// 批量替换原料
		replaceMulity (type) {
			return post({ url: `/archive/${type}/v1/batch_replace`, autoSuccessMsg: true })
		},
		// 批量替换原料查询BOM
		getReplaceBomList (type, itemId) {
			return get({ url: `/archive/${type}/v1/batch_replace/list/${itemId}` })
		}
	}
}
