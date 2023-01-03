import app from '@/main.js'
const createItemUnitListMessage = function (unit) {
	function isTrue (flag) { return flag ? '是' : '否' }
	return `单位名称:${unit.name},换算系数:${unit.ratio},是否建立成本卡:${isTrue(unit.costCardFlag)},条码:${unit.barcode || '/'},最小单位:${isTrue(unit.mainFlag)},采购单位:${isTrue(unit.purchaseFlag)},销售单位:${isTrue(unit.salesFlag)},盘点单位1:${isTrue(unit.checkFirstFlag)},盘点单位2:${isTrue(unit.checkSecondFlag)},报表默认单位:${isTrue(unit.reportFlag)},辅助单位:${isTrue(unit.assistFlag)},参考成本价:${unit.refCostPrice || '/'},参考销售价:${unit.refSellingPrice || '/'}`
}
const createFoodsProductionMethodListMessage = function (method) {
	function isTrue (flag) { return flag ? '是' : '否' }
	return `做法名称:${method.name},参考售价:${method.sellingPrice},参考成本:${method.costPrice},参考毛利:${method.grossProfit}%,是否建立成本卡:${isTrue(method.costCardFlag)}`
}
const createFileMessage = function (file) {
	return file.appendixUrl
}
const createConnectStoreMessage = function (item) {
	return `仓库名称:${item.houseName},最佳库存:${item.optimalStore || ''},库存上限:${item.maxStoreFlag === '1' ? item.maxStore : '无上限'},库存下限:${item.minStoreFlag === '1' ? item.minStore : '无下限'}`
}
const createConnectLocationMessage = function (item) {
	return `仓库名称:${item.houseName},默认存放货位:${item.houseItemLocationInfo || ''}`
}
export default {
	main: [{
		id: 'itemTypeAllName',
		label: '所属类别',
		type: 'basic'
	}, {
		id: 'imageUrl',
		label: '品项图片',
		type: 'basic'
	}, {
		id: 'code',
		label: '品项编号',
		type: 'basic'
	}, {
		id: 'name',
		label: '品项名称',
		type: 'basic'
	}, {
		id: 'offsetMethod',
		label: '耗用方式',
		type: 'basic',
		handler ({ pre, cur }) {
			const getEnableState = app.vue.$fxTypeMiddleware.getCommonTypeItemById('offsetMethodType')
			const preState = getEnableState(pre).label
			const curState = getEnableState(cur).label
			return `耗用方式由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'consumptionMethod',
		label: '冲减方式',
		type: 'basic',
		handler ({ pre, cur }) {
			const getEnableState = app.vue.$fxTypeMiddleware.getCommonTypeItemById('consumptionMethodType')
			const preState = getEnableState(pre).label || '无'
			const curState = getEnableState(cur).label || '无'
			return `冲减方式由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'relAllFinances',
		label: '财务分类关联',
		type: 'basic',
		handler ({ pre, cur }) {
			const preState = pre ? '全部' : '自定义'
			const curState = cur ? '全部' : '自定义'
			return `财务分类关联由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'financeSortName',
		label: '财务分类',
		type: 'basic'
	}, {
		id: 'enableFlag',
		label: '启停状态',
		type: 'basic',
		handler ({ pre, cur }) {
			const getEnableState = app.vue.$fxStateMiddleware.getStateObj('enableState')
			const preState = getEnableState(pre).label
			const curState = getEnableState(cur).label
			return `启停状态由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'spec',
		label: '品项规格',
		type: 'basic'
	}, {
		id: 'pinYin',
		label: '助记符',
		type: 'basic'
	}, {
		id: 'itemCategoryListSelect',
		label: '品项类型',
		type: 'basic',
		handler ({ pre, cur }) {
			const dataMap = { 0: '原料/物料', 1: '菜品', 2: '商品' }
			const preState = pre.map(item => dataMap[item])
			const curState = cur.map(item => dataMap[item])
			return `品项类型由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'shelfLifeFlag',
		label: '保质期标志',
		type: 'basic',
		handler ({ pre, cur }) {
			const preState = pre ? '开启' : '关闭'
			const curState = cur ? '开启' : '关闭'
			return `保质期标志由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'shelfLife',
		label: '保质期天数',
		type: 'basic'
	}, {
		id: 'itemUnitList',
		label: '品项单位',
		type: 'basic',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '品项单位',
				pre,
				cur,
				msgHandler: createItemUnitListMessage
			})
		}
	}, {
		id: 'foodsProductionMethodList',
		label: '菜品做法设置',
		type: 'basic',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '菜品做法设置',
				pre,
				cur,
				msgHandler: createFoodsProductionMethodListMessage
			})
		}
	}, {
		id: 'canWeigh',
		label: '参与称重',
		type: 'other',
		handler ({ pre, cur }) {
			const preState = pre ? '参与' : '不参与'
			const curState = cur ? '参与' : '不参与'
			return `参与称重由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'kgToMainUnit',
		label: '称重单位换算系数',
		type: 'other'
	}, {
		id: 'roundFlag',
		label: '取整领料',
		type: 'other',
		handler ({ pre, cur }) {
			const preState = pre ? '开启' : '关闭'
			const curState = cur ? '开启' : '关闭'
			return `取整领料由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'indexNum',
		label: '品项顺序号',
		type: 'other'
	}, {
		id: 'minCostMargin',
		label: '最小成本毛利目标',
		type: 'other',
		handler ({ pre, cur }) {
			return `最小成本毛利目标"${pre}%"改为"${cur}%"`
		}
	}, {
		id: 'maxCostMargin',
		label: '最大成本毛利目标',
		type: 'other',
		handler ({ pre, cur }) {
			return `最大成本毛利目标"${pre}%"改为"${cur}%"`
		}
	}, {
		id: 'minFoodMargin',
		label: '最小菜品参考毛利率',
		type: 'other',
		handler ({ pre, cur }) {
			return `最小菜品参考毛利率"${pre}%"改为"${cur}%"`
		}
	}, {
		id: 'maxFoodMargin',
		label: '最大菜品参考毛利率',
		type: 'other',
		handler ({ pre, cur }) {
			return `最大菜品参考毛利率"${pre}%"改为"${cur}%"`
		}
	}, {
		id: 'memo',
		label: '备注',
		type: 'append'
	}, {
		id: 'appendixList',
		label: '附件资料',
		type: 'append',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '附件资料',
				pre,
				cur,
				msgHandler: createFileMessage
			})
		}
	}],
	connect: [{
		id: 'connectStore',
		label: '关联仓库',
		type: 'connect',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '关联仓库',
				pre,
				cur,
				msgHandler: createConnectStoreMessage
			})
		}
	}],
	location: [{
		id: 'connectLocation',
		label: '默认存放货位',
		type: 'connect',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '默认存放货位',
				pre,
				cur,
				msgHandler: createConnectLocationMessage
			})
		}
	}]
}
