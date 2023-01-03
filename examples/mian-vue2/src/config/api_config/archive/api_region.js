import { get, post, put, del } from '@/js/api/dataSource'
export default {
	// 机构接口
	region: {
		// 新增区域
		regionAdd () {
			return post({ url: '/archive/region/v1' })
		},
		// 修改区域
		regionSave (id) {
			return put({ url: `/archive/region/v1/${id}` })
		},
		// 删除区域
		regionDelete (id) {
			return del({ url: `/archive/region/v1/${id}` })
		},
		// 查询区域list
		getAreaList () {
			return get({ url: '/archive/region/v1/search' })
		},
		// 获取上级区域
		getFathersList (id = 0) {
			return get({ url: `/archive/region/v1/${id}/fathers` })
		}
	}
}
