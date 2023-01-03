import app from '@/main.js'
const createFileMessage = function (file) {
	return file.appendixUrl
}
const createCrossOrgansMessage = function (crossOrgan) {
	return `机构名称：${crossOrgan.crossOrganName}，出库仓库：${crossOrgan.crossHouseName || '/'}`
}
export default {
	main: [{
		id: 'code',
		label: '方案编号',
		type: 'basic'
	}, {
		id: 'name',
		label: '方案名称',
		type: 'basic'
	}, {
		id: 'beginDate',
		label: '起始日期',
		type: 'basic'
	}, {
		id: 'endDate',
		label: '截止日期',
		type: 'basic'
	}, {
		id: 'limitFlag',
		label: '订货时间',
		type: 'basic',
		handler ({ pre, cur }) {
			const preState = pre ? '限制订货时间' : '不限制'
			const curState = cur ? '限制订货时间' : '不限制'
			return `订货时间由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'limitBeginTime',
		label: '限制订货时间起始时间',
		type: 'basic'
	}, {
		id: 'limitEndTime',
		label: '限制订货时间截止日期',
		type: 'basic'
	}, {
		id: 'organName',
		label: '买方机构',
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
		id: 'memo',
		label: '备注',
		type: 'basic'
	}, {
		id: 'appendixList',
		label: '附件资料',
		type: 'other',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '附件资料',
				pre,
				cur,
				msgHandler: createFileMessage
			})
		}
	}],
	details: [{
		id: 'sellerOrganInfo.name',
		label: '卖方机构'
	}, {
		id: 'sellerHouseInfo.name',
		label: '出库仓库',
		handler ({ pre, cur }) {
			return `出库仓库由"${pre || '/'}"改为"${cur || '/'}"`
		}
	}, {
		id: 'item.code',
		label: '品项编号'
	}, {
		id: 'item.name',
		label: '品项名称'
	}, {
		id: 'item.spec',
		label: '规格'
	}, {
		id: 'itemUnit.name',
		label: '单位'
	}, {
		id: 'stockWay',
		label: '订货方式',
		handler ({ pre, cur }) {
			const preState = pre === 1 ? '直发' : '越库'
			const curState = cur === 1 ? '直发' : '越库'
			return `订货方式由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'crossOrgans',
		label: '越库实际供货方',
		handler ({ pre, cur }) {
			if (Array.isArray(pre)) {
				pre.forEach(item => {
					delete item.id
					delete item.detailId
					delete item.tenantId
					if (item.house) {
						delete item.house
					}
					if (!item.crossHouse) {
						item.crossHouse = ''
					}
					if (!item.crossHouseName) {
						item.crossHouseName = ''
					}
				})
			}
			return this.createDiffMessage({
				label: '越库实际供货方',
				pre,
				cur,
				msgHandler: createCrossOrgansMessage,
				getKeyFn: item => item.crossOrgan
			})
		}
	}, {
		id: 'defaultCrossStock',
		label: '默认越库实际供货方'
	}, {
		id: 'roundingText',
		label: '订货倍数'
	}, {
		id: 'supperLimitText',
		label: '订货上限'
	}, {
		id: 'lowerLimitText',
		label: '订货下限'
	}, {
		id: 'mustFlag',
		label: '必订品项',
		handler ({ pre, cur }) {
			const preState = pre ? '必采' : '非必采'
			const curState = cur ? '必采' : '非必采'
			return `必订品项由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'cycleWayText',
		label: '订货周期'
	}, {
		id: 'arrivalCycle',
		label: '到货周期',
		handler ({ pre, cur }) {
			return `到货周期由"${pre}小时"改为"${cur}小时"`
		}
	}, {
		id: 'enableFlag',
		label: '启停用',
		handler ({ pre, cur }) {
			const preState = pre ? '启用' : '停用'
			const curState = cur ? '启用' : '停用'
			return `启停状态由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'memo',
		label: '明细备注'
	}]
}
