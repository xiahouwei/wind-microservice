// 领料单
export default {
	/**
	 * @name pickLIstGenerateType
	 * @desc 领料单类型
	 * @author wzw
	 * @date 2022/7/28
	 */
	pickListGenerateType: [{
		id: 0,
		type: 'hand',
		label: '手工新建',
		rule (billType, subBillType) {
			return `${billType}` === '9100'
		}
	}]
}
