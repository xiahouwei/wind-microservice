import app from '@/main.js'
import utils from '@/js/lib/utils/index'
const moneyFixed = function (n) {
	return utils.toFixedParseNumber(n, app.vue.$store.state.system.sysMoneyPointSize)
}
const amountFixed = function (n) {
	return utils.toFixedParseNumber(n, app.vue.$store.state.system.sysPointSize)
}
const parseFixed = function (n) {
	return utils.toFixedParseNumber(n, app.vue.$store.state.system.sysMoneyPointSize)
}
const priceFixed = function (n) {
	return utils.toFixedParseNumber(n, app.vue.$store.state.system.sysPricePointSize)
}
// 总价运算 = 数量 * 单价
const compSumPrice = function (a, p) {
	return a * p
}
// 税额运算 = 含税金额 - 非税金额
const compTaxes = function (tm, m) {
	return parseFixed(tm - m)
}
// 含税运算 = 价格 * (1 + 税率)
const compWithTaxes = function (p, t) {
	return p * (1 + translatTax(t))
}
// 除税运算 = 金额 / (1 + 税率)
const compNoTaxes = function (tp, t) {
	return tp / (1 + translatTax(t))
}
// 单价运算 = 金额 / 数量
const compPrice = function (p, a) {
	return priceFixed(p / a)
}
// 单换换算系数 = 新单位换算率 / 旧单位换算率
const compUnitRate = function (na, oa) {
	return na / oa
}
// 单位换算价格 = 原价格 * 单换换算系数
const compPriceByUnitRate = function (p, u) {
	return priceFixed(p * u)
}
// 单位换算数量 = 原数量 / 单换换算系数
const compAmountByUnitRate = function (a, u) {
	return priceFixed(a / u)
}
// 单位换算上下限 = 原上下限 / 单换换算系数
const compSupperLimitOrLowerLimitByUnitRate = function (a, u) {
	return amountFixed(a / u)
}
// 税率换算 : 云供应链 税率 均为整数 z5税率 均为小数 因此计算前转成小数
const translatTax = function (tax) {
	return tax < 1 ? tax : tax / 100
}
/*
 * 项目通用计算函数
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
	// 入库单退货计算函数
	inStoreReturnGoods: {
		init: {
			// 退货数量
			amount: 'amount',
			// 当前剩余数量
			storeAmount: 'storeAmount',
			// 入库数量
			inStoreAmount: 'inStoreAmount',
			// 入库成本单价
			costPrice: 'price',
			// 入库成本金额
			costMoney: 'money',
			// 含税单价
			priceWithTax: 'inTaxPrice',
			// 含税金额
			sumPriceWithTax: 'inTaxMoney',
			// 非税单价
			price: 'inPrice',
			// 非税金额
			sumPrice: 'inMoney',
			// 税率
			taxes: 'taxRate',
			// 税额
			taxMoney: 'inTaxRateMoney',
			// 辅助退货数量
			assistUnitAmount: 'assistUnitAmount',
			// 辅助数量
			inStoreAssistUnitAmount: 'inStoreAssistUnitAmount'
		},
		// 修改单位
		changeUnit (item, unit) {
			const unitRate = compUnitRate(unit.ratio, item.itemUnit.ratio)
			item[this.init.inStoreAmount] = compAmountByUnitRate(item[this.init.inStoreAmount], unitRate)
			item[this.init.costPrice] = compPriceByUnitRate(item[this.init.costPrice], unitRate)
			item[this.init.costMoney] = compSumPrice(item[this.init.inStoreAmount], item[this.init.costPrice])
			item[this.priceWithTax] = compPriceByUnitRate(item[this.priceWithTax], unitRate)
			const _sumPriceWithTax = compSumPrice(item[this.init.inStoreAmount], item[this.priceWithTax])
			item[this.sumPriceWithTax] = parseFixed(_sumPriceWithTax)
			const _sumPrice = compNoTaxes(_sumPriceWithTax, item[this.taxes])
			item[this.sumPrice] = parseFixed(_sumPrice)
			item[this.price] = compPrice(item[this.sumPrice], item[this.init.inStoreAmount])
			item[this.taxMoney] = compTaxes(item[this.sumPriceWithTax], item[this.sumPrice])
			item.itemUnit = unit
		},
		// 计算辅助数量
		calculateAssistAmount (item, unitList) {
			if (item.item.assistUnit) {
				let mainUnit = item.itemUnit
				if (!mainUnit) {
					if (!(Array.isArray(unitList) && unitList.length > 0)) {
						item[this.assistUnitAmount] = ''
						return false
					}
					mainUnit = unitList[0]
				}
				item[this.init.inStoreAssistUnitAmount] = amountFixed(mainUnit.ratio / item.item.assistUnitRatio * item[this.init.inStoreAmount])
				item[this.assistUnitAmount] = amountFixed(mainUnit.ratio / item.item.assistUnitRatio * item[this.amount])
			} else {
				item[this.assistUnitAmount] = ''
				item[this.init.inStoreAssistUnitAmount] = ''
			}
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
	// 财务出库单计算函数
	financialOutStore: {
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
		},
		// 修改价税合计
		changeSumPriceWithTax (item) {
			// 含税单价=价税合计/数量
			item[this.priceWithTax] = priceFixed(item[this.sumPriceWithTax] / item[this.amount])
			this.changeTaxes(item)
		},

		// 修改税率
		changeTaxes (item) {
			item[this.taxMoney] = moneyFixed(item[this.sumPriceWithTax] / (1 + item[this.taxes]) * item[this.taxes])
			this.changeTaxMoney(item)
		},

		// 修改税额
		changeTaxMoney (item) {
			// 非税金额=价税合计-税额
			item[this.sumPrice] = item[this.sumPriceWithTax] - item[this.taxMoney]
			// 非税单价=非税金额/数量
			item[this.price] = priceFixed(item[this.sumPrice] / item[this.amount])
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
			// 计算实盘金额
			if ((row.realCheckAmount1 - 0) === row.stockAmount1 && (row.realCheckAmount2 - 0) === row.stockAmount2) {
				// 实盘数量 等于 账存数量时，实盘金额 = 账存金额
				row.realCheckMoney = row.stockMoney
				// 消除小数计算误差，使最小单位实盘数量 = 最小单位账存数量
				row.mainUnitAmount = row.mainUnitStockAmount
			} else {
				// 实盘金额 = 最小单位单价 × 实盘数量（最小单位）
				row.realCheckMoney = moneyFixed(row.mainUnitPrice * row.mainUnitAmount)
			}
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
	},
	// 采购计划单计算函数
	stockPlanOrder: {
		init: {
			...COMMON_PARAMS
		},
		// 修改单位-计算订货方案里的上下限
		changeUnitCompSupperLimitOrLowerLimit (item, unit) {
			const calculationCache = app.vue.$fxCalculation.getCache()
			const unitRate = compUnitRate(unit.ratio, item.itemUnit.ratio)
			if (`${calculationCache[item.$fxCalculation].itemUnit.id}` === `${unit.id}`) {
				const row = calculationCache[item.$fxCalculation]
				// 修改下限
				item.stockPlanDetail.lowerLimit = row.stockPlanDetail.lowerLimit
				// 修改上限
				item.stockPlanDetail.supperLimit = row.stockPlanDetail.supperLimit
			} else {
				// 修改下限
				item.stockPlanDetail.lowerLimit = compSupperLimitOrLowerLimitByUnitRate(item.stockPlanDetail.lowerLimit, unitRate)
				// 修改上限
				item.stockPlanDetail.supperLimit = compSupperLimitOrLowerLimitByUnitRate(item.stockPlanDetail.supperLimit, unitRate)
			}
		}
	},
	// 采购询定价单计算函数
	stockInquiryOrder: {
		init: {
			...COMMON_PARAMS
		},
		// 修改单位
		changeInquiryUnit (item, unit) {
			const unitRate = compUnitRate(unit.ratio, item.itemUnit.ratio)
			item[this.priceWithTax] = compPriceByUnitRate(item[this.priceWithTax], unitRate)
			this.compInquiryPriceWithTaxes(item)
			item.itemUnit = unit
		},
		// 修改含税单价/税率-通过税率计算非税单价
		compInquiryPriceWithTaxes (item) {
			item[this.price] = priceFixed(compNoTaxes(item[this.priceWithTax], item[this.taxes]))
		},
		// 修改非税单价
		changeInquiryPrice (item) {
			item[this.priceWithTax] = priceFixed(compWithTaxes(item[this.price], item[this.taxes]))
		}
	},
	// 应付单计算函数
	payableOrder: {
		init: {
			// 数量
			amount: 'amount',
			// 非税单价
			price: 'price',
			// 非税金额
			sumPrice: 'money',
			// 含税单价
			priceWithTax: 'taxPrice',
			// 税率
			taxes: 'taxRate',
			// 含税金额
			sumPriceWithTax: 'taxMoney',
			// 税额
			taxMoney: 'taxRateMoney',
			// 辅助数量
			assistUnitAmount: 'assistUnitAmount'
		},

		// 修改折扣率（财务模块使用）
		changeDiscountRate (item) {
			item.discountMoney = moneyFixed(item[this.amount] * item[this.priceWithTax] * item.discountRate / 100)
			this.calculatePriceAndMoneyWithDiscount(item)
		},

		// 修改折扣额（财务模块使用）
		changeDiscountMoney (item) {
			item.discountRate = moneyFixed(item.discountMoney * 100 / item[this.amount] / item[this.priceWithTax])
			this.calculatePriceAndMoneyWithDiscount(item)
		},

		// 修改折扣额/折扣率后计算 价税合计 、非税金额 、税额（财务模块使用）
		calculatePriceAndMoneyWithDiscount (item) {
			item[this.sumPriceWithTax] = moneyFixed(item[this.amount] * item[this.priceWithTax] - item.discountMoney)
			item[this.sumPrice] = moneyFixed(item[this.amount] * item[this.price] * (1 - item.discountRate / 100))
			item[this.taxMoney] = item[this.sumPriceWithTax] - item[this.sumPrice]
			this.changeSumPriceWithTax(item)
		},

		// 修改价税合计
		changeSumPriceWithTax (item) {
			// 含税单价=价税合计/数量
			item[this.priceWithTax] = priceFixed(item[this.sumPriceWithTax] / item[this.amount])
			this.changeTaxes(item)
		},

		// 修改税率
		changeTaxes (item) {
			item[this.taxMoney] = moneyFixed(item[this.sumPriceWithTax] / (1 + item[this.taxes]) * item[this.taxes])
			this.changeTaxMoney(item)
		},

		// 修改税额
		changeTaxMoney (item) {
			// 非税金额=价税合计-税额
			item[this.sumPrice] = item[this.sumPriceWithTax] - item[this.taxMoney]
			// 非税单价=非税金额/数量
			item[this.price] = priceFixed(item[this.sumPrice] / item[this.amount])
		}
	},
	// 应付核销
	verificationOrder: {
		init: {
			...COMMON_PARAMS
		},
		// 修改本次核销金额
		changeWriteOffMoney (item, billType) {
			// 未核销金额=待核销金额-本次核销金额
			item.noWriteOffMoney = item[billType].waitWriteOffMoney - item.writeOffMoney
		}
	},
	// 应收单计算函数
	receivableOrder: {
		init: {
			// 数量
			amount: 'amount',
			// 非税单价
			price: 'salesPrice',
			// 非税金额
			sumPrice: 'salesMoney',
			// 含税单价
			priceWithTax: 'taxSalesPrice',
			// 税率
			taxes: 'taxRate',
			// 含税金额
			sumPriceWithTax: 'totalMoney',
			// 税额
			taxMoney: 'taxRateMoney',
			// 辅助数量
			assistUnitAmount: 'assistUnitAmount'
		},

		// 修改折扣率（财务模块使用）
		changeDiscountRate (item) {
			item.discountMoney = moneyFixed(item[this.amount] * item[this.priceWithTax] * item.discountRate / 100)
			this.calculatePriceAndMoneyWithDiscount(item)
		},

		// 修改折扣额（财务模块使用）
		changeDiscountMoney (item) {
			item.discountRate = moneyFixed(item.discountMoney * 100 / item[this.amount] / item[this.priceWithTax])
			this.calculatePriceAndMoneyWithDiscount(item)
		},

		// 修改折扣额/折扣率后计算 价税合计 、非税金额 、税额（财务模块使用）
		calculatePriceAndMoneyWithDiscount (item) {
			item[this.sumPriceWithTax] = moneyFixed(item[this.amount] * item[this.priceWithTax] - item.discountMoney)
			item[this.sumPrice] = moneyFixed(item[this.amount] * item[this.price] * (1 - item.discountRate / 100))
			item[this.taxMoney] = item[this.sumPriceWithTax] - item[this.sumPrice]
			this.changeSumPriceWithTax(item)
		},

		// 修改价税合计
		changeSumPriceWithTax (item) {
			// 含税单价=价税合计/数量
			item[this.priceWithTax] = priceFixed(item[this.sumPriceWithTax] / item[this.amount])
			this.changeTaxes(item)
		},

		// 修改税率
		changeTaxes (item) {
			item[this.taxMoney] = moneyFixed(item[this.sumPriceWithTax] / (1 + item[this.taxes]) * item[this.taxes])
			this.changeTaxMoney(item)
		},

		// 修改税额
		changeTaxMoney (item) {
			// 非税金额=价税合计-税额
			item[this.sumPrice] = item[this.sumPriceWithTax] - item[this.taxMoney]
			// 非税单价=非税金额/数量
			item[this.price] = priceFixed(item[this.sumPrice] / item[this.amount])
		}
	},
	// BOM设置计算函数
	bomSet: {
		init: COMMON_PARAMS,

		// 修改净料用量
		changeMaterialDosage (row) {
			row.materialRateZoom = moneyFixed(row.materialDosage / row.rawMaterialDosage * 100)
			row.materialRate = amountFixed(row.materialRateZoom / 100)
		},

		// 修改净料率
		changeMaterialRate (materialRateZoom, row) {
			if (materialRateZoom === moneyFixed(row.materialRate * 100)) return
			row.rawMaterialDosage = amountFixed(row.materialDosage / materialRateZoom * 100)
			row.materialRate = amountFixed(materialRateZoom / 100)
		},

		// 修改毛料用量
		changeRawMaterialDosage (row) {
			row.materialRateZoom = moneyFixed(row.materialDosage / row.rawMaterialDosage * 100)
			row.materialRate = amountFixed(row.materialRateZoom / 100)
		},

		// 计算参考成本金额
		countMoney (row) {
			if (row.price === '') return
			row.money = moneyFixed(row.rawMaterialDosage * row.price)
		}
	}
}
