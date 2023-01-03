export default {
	id: 'out-assign',
	label: '出库分派',
	actions: [{
		id: 'lock',
		label: '锁定并汇总',
		messageHandler ({ data }) {
			return `锁定并汇总,系统单号:${data.map(i => { return this.createCodeSpan(i, 'SalesOrder') }).join(',')}`
		}
	}, {
		id: 'unlock',
		label: '解除锁定',
		messageHandler ({ data }) {
			return `解除锁定,系统单号:${data.map(i => { return this.createCodeSpan(i, 'SalesOrder') }).join(',')}`
		}
	}, {
		id: 'giveUpAll',
		label: '整单放弃',
		messageHandler ({ data }) {
			return `整单放弃,系统单号:${data.map(i => { return this.createCodeSpan(i, 'SalesOrder') }).join(',')}`
		}
	}, {
		id: 'recover',
		label: '恢复',
		messageHandler ({ data }) {
			return data.map(i => {
				return `系统单号：${this.createCodeSpan(i.collectionData, 'SalesOrder')}，品项名称：${i.itemName}，单位：${i.unitName}，恢复放弃数量：${i.thisAmount}`
			}).join('；')
		}
	}, {
		id: 'assgin',
		label: '分派',
		messageHandler ({ data }) {
			return data.map(i => {
				const item = {
					id: i.billId,
					sysBillCode: i.sysBillCode
				}
				if (i.stockWay === 1) {
					return `系统单号：${this.createCodeSpan(item, 'SalesOrder')}，品项名称：${i.collectionData.itemName}，单位：${i.collectionData.unitName}，订货方式：直发， 本次出库数量：${i.thisAmount}，卖方仓库：${i.outStore}`
				} else {
					return `系统单号：${this.createCodeSpan(item, 'SalesOrder')}，品项名称：${i.collectionData.itemName}，单位：${i.collectionData.unitName}，订货方式：越库， 本次出库数量：${i.thisAmount}，卖方仓库：${i.outStore}，实际供货方：${i.crossOrganName || '/'}`
				}
			}).join('；')
		}
	}, {
		id: 'giveUp',
		label: '放弃',
		messageHandler ({ data }) {
			return data.map(i => {
				return `系统单号：${this.createCodeSpan(i, 'SalesOrder')}，品项名称：${i.collectionData.itemName}，单位：${i.collectionData.unitName}，本次放弃数量：${i.thisGiveupAmount}`
			}).join('；')
		}
	}]
}
