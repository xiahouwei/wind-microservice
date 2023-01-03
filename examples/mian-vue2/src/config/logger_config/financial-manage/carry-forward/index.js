export default {
	id: 'carry-forward',
	label: '月末结转',
	actions: [{
		id: 'carryForward',
		label: '结转',
		messageHandler ({ names }) {
			return `机构名称:${names}`
		}
	}, {
		id: 'reverseCarryForward',
		label: '反结转',
		messageHandler ({ names }) {
			return `机构名称:${names}`
		}
	}]
}
