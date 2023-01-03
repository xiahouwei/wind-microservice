import { post } from '@/js/api/dataSource'
import app from '@/main.js'
export default {
	// 日志接口
	log: {
		// 分页查询
		getPage () {
			return post({
				url: '/archive/logger/v1/search',
				success: res => {
					res.data.forEach((item, index) => {
						item.expanded = false
						item.showExpandArrow = false
						item.id = app.vue.$fxUtils.createUUID() + item.userLogTime + item.used
					})
					return res
				}
			})
		}
	}
}
