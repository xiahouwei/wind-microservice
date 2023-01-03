export default {
	'process-task': {
		id: 'process-task',
		label: '工序任务单',
		code: '0010_0005',
		child: {
			'claim-processTask': {
				id: 'claim-processTask',
				label: '工序任务单认领',
				code: '0010_0005_201_001'
			},
			'startWork-processTask': {
				id: 'startWork-processTask',
				label: '工序任务单开工',
				code: '0010_0005_202_001',
				controlled: 'add-processTask'
			},
			'reportWork-processTask': {
				id: 'reportWork-processTask',
				label: '工序任务单报工',
				code: '0010_0005_203_001'
			},
			'sendBack-processTask': {
				id: 'sendBack-processTask',
				label: '工序任务单退回认领',
				code: '0010_0005_204_001'
			}
		}
	}
}
