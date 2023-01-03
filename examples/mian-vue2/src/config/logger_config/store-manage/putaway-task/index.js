export default {
	id: 'putaway-task',
	label: '上架任务',
	actions: [{
		id: 'putaway',
		label: '上架',
		messageHandler ({ orderInfo, row }) {
			return `系统单号:${orderInfo.sysBillCode},品项名称:${row.item.name},上架数量:${row.putawayAmount},上架货位:${row.houseItemLocation.houseItemLocationInfo},入库单位:${row.unit.name}`
		}
	}]
}
