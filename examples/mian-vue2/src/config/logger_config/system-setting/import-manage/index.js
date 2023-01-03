export default {
	id: 'import-manage',
	label: '基础数据导入',
	actions: [{
		id: 'downloadExcel',
		label: '下载EXCEL',
		messageHandler () {
			return '下载EXCEL'
		}
	}, {
		id: 'importData',
		label: '数据导入',
		messageHandler ({ name }) {
			return `数据导入,文件名称:${name}`
		}
	}, {
		id: 'checkData',
		label: '数据校验',
		messageHandler ({ name }) {
			return `数据校验,文件名称:${name}`
		}
	}, {
		id: 'transferData',
		label: '数据迁移',
		messageHandler ({ name }) {
			return `数据迁移,文件名称:${name}`
		}
	}]
}
