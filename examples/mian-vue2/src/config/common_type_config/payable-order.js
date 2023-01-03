// 项目通用类型设置
export default {
	/**
	 * @name peyableOrderGenerateType
	 * @desc 财务应付单生成类型
	 * @author zz
	 * @date 2022/9/28
	 */
	peyableOrderGenerateType: [{
		id: 0,
		type: 'provisional-estimate-order',
		label: '暂估应付单',
		rule (billType) {
			return `${billType}` === '101'
		}
	}, {
		id: 1,
		type: 'formal-payable-order',
		label: '正式应付单',
		rule (billType) {
			return `${billType}` === '102'
		}
	}, {
		id: 2,
		type: 'red-payable-order',
		label: '红冲应付单',
		rule (billType) {
			return `${billType}` === '103'
		}
	}, {
		id: 3,
		type: 'push-down-payable-order',
		label: '财务入库单下推生成的应付单',
		rule (parentBillType) {
			return `${parentBillType}` === 'CWInStoreBill'
		}
	}, {
		id: 4,
		type: 'provisional-estimate-push-down-payable-order',
		label: '暂估应付单下推生成的标准应付单',
		rule (billClass) {
			return `${billClass}` === 'PayableBill'
		}
	}]
}
