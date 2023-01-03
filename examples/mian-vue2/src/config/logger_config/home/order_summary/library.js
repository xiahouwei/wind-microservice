const createMessage = function (item) {
	return item.map(_item => _item.name).join('，')
}
export default {
	summaryArr: [{
		id: 'summaryArr',
		label: '摘要',
		type: 'other',
		handler ({ pre, cur }) {
			const diff = this.compareDiff({
				pre,
				cur,
				getKeyFn: item => item.id
			})
			const addMessage = diff.add ? `新增：${createMessage(diff.add)}\n` : ''
			const delMessage = diff.delete ? `删除：${createMessage(diff.delete)}\n` : ''
			return `${addMessage}${(addMessage && delMessage) ? '；' : ''}${delMessage}`
		}
	}]
}
