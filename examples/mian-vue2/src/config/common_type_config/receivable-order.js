// 项目通用类型设置
export default {
	/**
	 * @name receivableOrderGenerateType
	 * @desc 财务应收单生成类型
	 * @author ysl
	 * @date 2022/12/29
	 */
	receivableOrderGenerateType: [{
		id: 0,
		type: 'estimation-receivable-order',
		label: '暂估应收单',
		rule (billType) {
			return `${billType}` === '101'
		}
	}, {
		id: 1,
		type: 'formal-receivable-order',
		label: '标准应付单',
		rule (billType) {
			return `${billType}` === '102'
		}
	}, {
		id: 2,
		type: 'red-receivable-order',
		label: '红冲应收单',
		rule (billType) {
			return `${billType}` === '103'
		}
	}]
}
