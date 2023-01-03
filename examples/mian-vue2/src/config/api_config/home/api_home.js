import { post, get } from '@/js/api/dataSource'
export default {
	// 首页接口
	home: {
		// {{{我的待办
		// 查询我的待办
		getTodo () {
			return get({ url: '/bill/home_page/v1/todo', loading: false })
		},
		// }}}

		// {{{我的日历
		// 查询我的日历
		getCalendar () {
			return post({ url: '/bill/home_page/v1/calendar', loading: false })
		},
		// 日历查询未盘仓库详情
		getStoreList (organId) {
			return get({ url: `/bill/home_page/v1/calendar/todoCheckHouse/${organId}`, loading: false })
		},
		// 查询可管理的机构列表
		getOrganList () {
			return post({ url: '/archive/bill/organ/v1/in_store/organ_list', loading: false })
		},
		// 获取当前登录人及所属机构
		getCurrentUser () {
			return get({ url: '/archive/employee/v1/currentUser', loading: false })
		},
		// }}}

		// {{{常用单据
		// 查询员工常用单据
		getMyBill () {
			return get({ url: '/bill/home_page/v1/favourite-bills', loading: false })
		},
		// 设置员工常用单据
		setMyBill () {
			return post({ url: '/bill/home_page/v1/favourite-bills', loading: false, autoSuccessMsg: true })
		},
		// 查询员工有权限的单据
		getMyBillSelect () {
			return get({ url: '/bill/home_page/v1/authorized-bills', loading: false })
		}
		// }}}
	}
}
