export default {
	OrganManage: {
		label: '机构管理',
		mainFilterItem: {
			organ: {
				id: 'organ',
				type: 'select',
				name: '机构',
				position: 'basic'
			},
			fatherOrgan: {
				id: 'fatherOrgan',
				type: 'input',
				name: '上级机构',
				position: 'basic'
			},
			organType: {
				id: 'organType',
				type: 'select',
				name: '启停状态',
				position: 'basic'
			},
			enableFlag: {
				id: 'enableFlag',
				type: 'select',
				name: '机构类型',
				position: 'basic'
			},
			tagKey: {
				id: 'tagKey',
				type: 'input',
				name: '标签',
				position: 'basic'
			},
			memo: {
				id: 'memo',
				type: 'input',
				name: '备注',
				position: 'more'
			}
		}
	}
}
