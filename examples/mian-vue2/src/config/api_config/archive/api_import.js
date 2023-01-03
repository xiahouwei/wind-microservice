import { get, file } from '@/js/api/dataSource'
export default {
	// 基础数据导入接口
	import: {
		// 基础数据导入-模版下载
		downloadExcel () {
			return get({ url: '/excel/base_import/v1/download', responseType: 'arraybuffer', responseComplete: true })
		},
		// 基础数据导入-上传数据
		importData () {
			return file({ url: '/excel/base_import/v1/upload', autoErrorMsg: false })
		},
		// 基础数据导入-校验数据
		checkData () {
			return file({ url: '/excel/base_import/v1/check', autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 基础数据导入-迁移数据
		transferData () {
			return file({ url: '/excel/base_import/v1/transfer', autoSuccessMsg: true })
		}
	}
}
