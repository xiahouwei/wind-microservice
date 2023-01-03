import app from '@/main.js'
const createAddressMessage = function (address) {
	return `省市区:${address.areaText || ''},详细地址:${address.location},联系人:${address.linkMan},联系电话:${address.tel},默认:${address.isDefault ? '是' : '否'}`
}
const createResourceMessage = function (resource) {
	return `证照类型:${resource.typeName},证照名称:${resource.name},证照编号:${resource.code || '-'},证照有效期:${resource.begin || '-'}至${resource.end || '-'},附件:${resource.appendixUrl || '无'}`
}
const createFileMessage = function (file) {
	return file.appendixUrl
}
const createConnectItemMessage = function (item) {
	return `品项名称:${item.name}`
}
export default {
	main: [{
		id: 'code',
		label: '供货商编号',
		type: 'basic'
	}, {
		id: 'name',
		label: '供货商名称',
		type: 'basic'
	}, {
		id: 'financeSortName',
		label: '财务分类',
		type: 'basic'
	}, {
		id: 'supplierTypeName',
		label: '所属类别',
		type: 'basic'
	}, {
		id: 'fatherName',
		label: '上级机构',
		type: 'basic'
	}, {
		id: 'pinYin',
		label: '助记符',
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
		id: 'taxPlayerFlag',
		label: '计价方式',
		type: 'basic',
		handler ({ pre, cur }) {
			const getTaxPlayerType = app.vue.$fxTypeMiddleware.getCommonTypeItemById('taxPlayerType')
			const preState = getTaxPlayerType(pre).name
			const curState = getTaxPlayerType(cur).name
			return `计价方式由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'relAllGoods',
		label: '该机构可管理哪些品项',
		type: 'connect',
		handler ({ pre, cur }) {
			const preState = pre ? '全部品项' : '自定义'
			const curState = cur ? '全部品项' : '自定义'
			return `该机构可管理哪些品项由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'defaultInFlag',
		label: '此机构的默认入库仓库',
		type: 'connect',
		handler ({ pre, cur }) {
			const preState = pre ? '是' : '否'
			const curState = cur ? '是' : '否'
			return `此机构的默认入库仓库由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'defaultOutFlag',
		label: '此机构的默认出库仓库',
		type: 'connect',
		handler ({ pre, cur }) {
			const preState = pre ? '是' : '否'
			const curState = cur ? '是' : '否'
			return `此机构的默认出库仓库由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'defaultInHouseName',
		label: '默认入库仓库',
		type: 'connect'
	}, {
		id: 'defaultOutHouseName',
		label: '默认出库仓库',
		type: 'connect'
	}, {
		id: 'accountPeriod',
		label: '账期',
		type: 'financial',
		handler ({ pre, cur }) {
			const preState = pre === 1 ? '现结' : '月结'
			const curState = cur === 1 ? '现结' : '月结'
			return `账期由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'monthBalanceWay',
		label: '月结方式',
		type: 'financial',
		handler ({ pre, cur, preFull, curFull }) {
			const getMonthBalanceType = app.vue.$fxTypeMiddleware.getCommonTypeItemById('monthBalanceType')
			const preState = getMonthBalanceType(pre).name
			const curState = getMonthBalanceType(cur).name
			const preNum = pre === '2-1' ? `${preFull.monthBalanceCycle}日` : `${preFull.monthBalanceCycle}天`
			const curNum = cur === '2-1' ? `${curFull.monthBalanceCycle}日` : `${curFull.monthBalanceCycle}天`
			return `月结方式由"${preState} ${preNum}"改为"${curState} ${curNum}"`
		}
	}, {
		id: 'monthBalanceCycle',
		label: '月结时长',
		type: 'financial',
		handler ({ pre, cur, preFull, curFull }) {
			const preNum = preFull.monthBalanceWay === '2-1' ? `${pre}日` : `${pre}天`
			const curNum = curFull.monthBalanceWay === '2-1' ? `${cur}日` : `${cur}天`
			return `月结时长由"${preNum}"改为"${curNum}"`
		}
	}, {
		id: 'contactList',
		label: '收货地址',
		type: 'other',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '收货地址',
				pre,
				cur,
				msgHandler: createAddressMessage
			})
		}
	}, {
		id: 'resourceList',
		label: '资质管理',
		type: 'other',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '资质管理',
				pre,
				cur,
				msgHandler: createResourceMessage
			})
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
		id: 'connectItem',
		label: '关联品项',
		type: 'connect',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '关联品项',
				pre,
				cur,
				msgHandler: createConnectItemMessage
			})
		}
	}],
	binding: [{
		id: 'code',
		label: '供货商编号',
		type: 'basic'
	}, {
		id: 'name',
		label: '供货商名称',
		type: 'basic'
	}]
}
