import { get, post } from '@/js/api/dataSource'
export default {
	// 月末结转接口
	carryForward: {
		// {{{ 主列表筛选条件
		// 获取机构列表
		getFilterOrganSelectList () {
			const params = { organTypeList: ['1', '2'] }
			return post({ url: '/archive/organ/v1/all/simple/tab', data: params, loading: false })
		},
		// 获取全部会计期接口
		getFilterPeriodSelectList () {
			return get({ url: '/archive/accounting_period/v1/all/year/month', loading: false })
		},
		// }}}

		// 分页查询
		getPageList () {
			return post({ url: '/archive/accounting_period/v1/organ/balance/page' })
		},

		// 获取当前登陆人是否操作月结
		verify () {
			return get({ url: '/bill/month/balance/v1/verify' })
		},
		// 获取当前登陆人是否操作反月结
		unVerify () {
			return get({ url: '/bill/un/month/balance/v1/verify' })
		},
		// 获取月结队列接口/反月结队列接口
		getQueue (type) {
			if (type === 'carryForward') {
				return get({ url: '/bill/month/balance/v1/queue' })
			} else {
				return get({ url: '/bill/un/month/balance/v1/queue' })
			}
		},
		// 月结接口
		carryForward () {
			return post({ url: '/bill/month/balance/v1/do', loading: false })
		},
		// 反月结接口
		reverseCarryForward () {
			return post({ url: '/bill/un/month/balance/v1/do', loading: false })
		},
		// 获取机构月结失败原因接口/反月结失败原因接口
		getReason (organId, type) {
			if (type === 'carryForward') {
				return get({ url: `/bill/month/balance/v1/failed/reason/${organId}` })
			} else {
				return get({ url: `/bill/un/month/balance/v1/failed/reason/${organId}` })
			}
		}
	}
}
