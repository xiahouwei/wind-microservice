// 项目通用类型设置
export default {
	/**
	 * @name paymentOrderGenerateType
	 * @desc 财务应付单生成类型
	 * @author zz
	 * @date 2022/10/19
	 */
	paymentOrderGenerateType: [{
		id: 0,
		type: 'push-down-sub-payment-order',
		label: '下推生成的付款单',
		rule (subBillType) {
			return `${subBillType}` === '301-1'
		}
	}]
}
