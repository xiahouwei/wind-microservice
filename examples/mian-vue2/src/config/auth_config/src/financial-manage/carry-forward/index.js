export default {
	'carry-forward': {
		id: 'carry-forward',
		label: '月末结转',
		code: '0007_0003',
		child: {
			carryForward: {
				id: 'carryForward',
				label: '会计期结转',
				code: '0007_0003_025_001'
			},
			reverseCarryForward: {
				id: 'reverseCarryForward',
				label: '会计期反结转',
				code: '0007_0003_026_001'
			}
		}
	}
}
