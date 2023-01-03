// import { get, post, put, del } from '@/js/api/dataSource'
import { get } from '@/js/api/dataSource'
export default {
	// 档案编号
	archiveCode: {
		// 获取机构档案编号
		get (type) {
			return get({ url: `/archive/archive_code/v1/${type}` })
		}
	}
}
