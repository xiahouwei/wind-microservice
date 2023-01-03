import app from '@/main.js'
import utils from '@/js/lib/utils/index'
const moneyFixed = function (n) {
	return utils.toFixedParseNumber(n, app.vue.$store.state.system.sysMoneyPointSize)
}
const amountFixed = function (n) {
	return utils.toFixedParseNumber(n, app.vue.$store.state.system.sysPointSize)
}
/*
 * 掌中宝项目通用计算函数
 * 1.init为配置单据对应字段名, 此字段名为最终提交保存参数
 * 2.init以外属性为 追加函数
 */
const COMMON_PARAMS = {
	// 数量
	amount: 'amount',
	// 非税单价
	price: 'price',
	// 非税金额
	sumPrice: 'money',
	// 含税单价
	priceWithTax: 'taxPrice',
	// 含税金额
	sumPriceWithTax: 'taxMoney',
	// 税率
	taxes: 'taxRate',
	// 税额
	taxMoney: 'taxRateMoney',
	// 辅助数量
	assistUnitAmount: 'assistUnitAmount'
}
export default {
	// 通用计算函数
	common: {
		init: COMMON_PARAMS
	},
	// 入库单计算函数
	inStore: {
		init: {
			// 数量
			amount: 'amount',
			// 非税单价
			price: 'inPrice',
			// 非税金额
			sumPrice: 'inMoney',
			// 含税单价
			priceWithTax: 'inTaxPrice',
			// 税率
			taxes: 'taxRate',
			// 含税金额
			sumPriceWithTax: 'inTaxMoney',
			// 税额
			taxMoney: 'inTaxRateMoney',
			// 辅助数量
			assistUnitAmount: 'assistUnitAmount'
		}
	},
	// 出库单计算函数
	outStore: {
		init: {
			// 数量
			amount: 'amount',
			// 非税单价
			price: 'salesPrice',
			// 非税金额
			sumPrice: 'salesMoney',
			// 含税单价
			priceWithTax: 'salesTaxPrice',
			// 税率
			taxes: 'salesTaxRate',
			// 含税金额
			sumPriceWithTax: 'salesTaxMoney',
			// 税额
			taxMoney: 'salesTaxRateMoney',
			// 辅助数量
			assistUnitAmount: 'assistUnitAmount'
		}
	},
	// 盘点单计算函数
	takeStock: {
		init: {
			// 数量[实盘数量1]
			amount: 'realCheckAmount1',
			// 辅助数量
			assistUnitAmount: 'assistUnitAmount'
		},
		// 计算实盘金额
		computeRealCheckMoney (row) {
			// 最小单位实盘数量=实盘数量1*盘点单位1的ratio + 实盘数量2*盘点单位2的ratio
			const amount1 = row.realCheckAmount1 * row.checkUnit1.ratio
			const amount2 = row.checkUnit2 ? (row.realCheckAmount2 * row.checkUnit2.ratio) : 0
			row.mainUnitAmount = amountFixed(amount1 + amount2)
			// 实盘金额 = 最小单位单价 × 实盘数量（最小单位）
			row.realCheckMoney = moneyFixed(row.mainUnitPrice * row.mainUnitAmount)
		},
		// 计算差异数量
		// 差异数量 = 最小单位实盘数量 -  最小单位账存数量
		computeDiffAmount (row) {
			return amountFixed(row.mainUnitAmount - row.mainUnitStockAmount)
		},
		// 根据最小单位数量换算盘点单位1的数量
		computedCheckUnit1Amount (amount, row) {
			return amountFixed(amount * row.mainUnit.ratio / row.checkUnit1.ratio)
		},
		// 计算辅助数量
		computeAssistAmount (row) {
			row.assistUnitAmount = amountFixed(row.mainUnitAmount / row.item.assistUnitRatio)
		},
		// 计算差异金额
		// 差异金额 = 实盘金额 -  账存金额
		computedDiffMoney (row) {
			return moneyFixed(row.realCheckMoney - row.stockMoney)
		}

	}
}
