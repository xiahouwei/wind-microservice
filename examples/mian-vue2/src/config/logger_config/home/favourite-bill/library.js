import billRouterConfig from '@/router/billRouterConfig.js'
const createFavouriteBillMessage = function (billList) {
	return billList.map(item => {
		return billRouterConfig[item.billType].name
	}).join('，')
}
export default {
	favouriteBill: [{
		id: 'favouriteBill',
		label: '设置常用单据',
		type: 'setting',
		handler ({ pre, cur }) {
			const diff = this.compareDiff({
				pre,
				cur,
				getKeyFn: item => item.billType
			})
			const addMessage = diff.add ? `新增常用单据：${createFavouriteBillMessage(diff.add)}\n` : ''
			const delMessage = diff.delete ? `删除常用单据：${createFavouriteBillMessage(diff.delete)}\n` : ''
			return `${addMessage}${(addMessage && delMessage) ? '；' : ''}${delMessage}`
		}
	}]
}
