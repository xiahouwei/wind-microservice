export default {
	id: 'account-period',
	label: '会计期',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ year, endDay }) {
			const endDayInfo = endDay === '0' ? '自然月' : `截止日期：${endDay}日`
			return `会计年度:${year}年, 核算方式:${endDayInfo}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ year }) {
			return `会计年度:${year}`
		}
	}, {
		id: 'edit',
		label: '修改',
		messageHandler ({ endDate, endDay }) {
			const endDayInfo = endDay === '0' ? '自然月' : `截止日期：${endDay}日`
			return `修改【${endDate.slice(0, 7)}】以及后续会计月,原始结束日期："${endDate}",修改后日期："${endDayInfo}"`
		}
	}, {
		id: 'mulityEnable',
		label: '批量启用',
		messageHandler ({ account }) {
			return `【${account.year}年-第${account.month}期】启用为【当前会计期】`
		}
	}, {
		id: 'mulityDisable',
		label: '批量停用',
		messageHandler () {
			return '批量取消启用会计期'
		}
	}, {
		id: 'enable',
		label: '启用',
		messageHandler ({ organName, account }) {
			return `机构名称:${organName},【${account.year}年-第${account.month}期】启用为【当前会计期】`
		}
	}, {
		id: 'disable',
		label: '停用',
		messageHandler ({ organName }) {
			return `机构名称:${organName},取消启用会计期`
		}
	}]
}
