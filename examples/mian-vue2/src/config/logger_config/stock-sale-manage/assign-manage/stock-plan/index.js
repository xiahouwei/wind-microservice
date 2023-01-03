export default {
	id: 'stock-plan',
	label: '采购计划单分派',
	actions: [{
		id: 'lock',
		label: '锁定并汇总',
		messageHandler ({ data }) {
			return `锁定并汇总,系统单号:${data.map(i => { return this.createCodeSpan(i, 'StockPlan') }).join(',')}`
		}
	}, {
		id: 'unlock',
		label: '解除锁定',
		messageHandler ({ data }) {
			return `解除锁定,系统单号:${data.map(i => { return this.createCodeSpan(i, 'StockPlan') }).join(',')}`
		}
	}, {
		id: 'giveUpAll',
		label: '整单放弃',
		messageHandler ({ data }) {
			return `整单放弃,系统单号:${data.map(i => { return this.createCodeSpan(i, 'StockPlan') }).join(',')}`
		}
	}, {
		id: 'assgin',
		label: '分派',
		messageHandler ({ data }) {
			return data.map(i => {
				return `系统单号：${this.createCodeSpan(i.collectionData, 'StockPlan')}，品项名称：${i.itemName}，单位：${i.unitName}，本次订货数量：${i.thisAmount}，入库仓库：${i.inHouseName}`
			}).join('；')
		}
	}, {
		id: 'giveUp',
		label: '放弃',
		messageHandler ({ data }) {
			return data.map(i => {
				return `系统单号：${this.createCodeSpan(i.collectionData, 'StockPlan')}，品项名称：${i.itemName}，单位：${i.unitName}，本次放弃数量：${i.thisGiveupAmount}`
			}).join('；')
		}
	}]
}
