import app from '@/main.js'
import utils from '@/js/lib/utils/index'
import config from '@/config/calculation_config'
const calculationCache = {}
const parseFixed = function (n) {
	return utils.toFixedParseNumber(n, app.vue.$store.state.system.sysMoneyPointSize)
}
const priceFixed = function (n) {
	return utils.toFixedParseNumber(n, app.vue.$store.state.system.sysPricePointSize)
}
const amountFixed = function (n) {
	return utils.toFixedParseNumber(n, app.vue.$store.state.system.sysPointSize)
}
// 总价运算 = 数量 * 单价
const compSumPrice = function (a, p) {
	return a * p
}
// 非税金额计算 = 含税金额 - 税额
const compFinancialSumPrice = function (tm, t) {
	return parseFixed(tm - t)
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
// 税率换算 : 云供应链 税率 均为整数 z5税率 均为小数 因此计算前转成小数
const translatTax = function (tax) {
	return tax < 1 ? tax : tax / 100
}
class CopmutedFunc {
	constructor ({
		// 数量
		amount,
		// 非税单价
		price,
		// 非税金额
		sumPrice,
		// 含税单价
		priceWithTax,
		// 含税金额
		sumPriceWithTax,
		// 税率
		taxes,
		// 税额
		taxMoney,
		// 辅助数量
		assistUnitAmount
	}) {
		this.amount = amount
		this.price = price
		this.sumPrice = sumPrice
		this.priceWithTax = priceWithTax
		this.sumPriceWithTax = sumPriceWithTax
		this.taxes = taxes
		this.taxMoney = taxMoney
		this.assistUnitAmount = assistUnitAmount
	}

	// 修改数量
	changeAmount (item) {
		if (
			`${calculationCache[item.$fxCalculation][this.amount]}` === `${item[this.amount]}` &&
			`${calculationCache[item.$fxCalculation][this.price]}` === `${item[this.price]}` &&
			`${calculationCache[item.$fxCalculation][this.priceWithTax]}` === `${item[this.priceWithTax]}`
		) {
			const row = calculationCache[item.$fxCalculation]
			item[this.sumPrice] = row[this.sumPrice]
			item[this.sumPriceWithTax] = row[this.sumPriceWithTax]
			item[this.taxMoney] = row[this.taxMoney]
		} else {
			item[this.sumPrice] = parseFixed(compSumPrice(item[this.amount], item[this.price]))
			item[this.sumPriceWithTax] = parseFixed(compSumPrice(item[this.amount], item[this.priceWithTax]))
			item[this.taxMoney] = compTaxes(item[this.sumPriceWithTax], item[this.sumPrice])
		}
	}

	// 修改非税单价
	changePrice (item) {
		const _sumPrice = compSumPrice(item[this.amount], item[this.price])
		const _sumPriceWithTax = compWithTaxes(_sumPrice, item[this.taxes])
		item[this.sumPrice] = parseFixed(_sumPrice)
		item[this.sumPriceWithTax] = parseFixed(_sumPriceWithTax)
		if (item[this.amount] === 0) {
			item[this.priceWithTax] = priceFixed(compWithTaxes(item[this.price], item[this.taxes]))
		} else {
			item[this.priceWithTax] = compPrice(_sumPriceWithTax, item[this.amount])
		}
		item[this.taxMoney] = compTaxes(item[this.sumPriceWithTax], item[this.sumPrice])
	}

	// 修改非税金额
	changeSumPrice (item) {
		if (item[this.amount] === 0) {
			app.vue.$nextTick(() => {
				item[this.sumPrice] = 0
			})
		} else {
			item[this.price] = compPrice(item[this.sumPrice], item[this.amount])
			item[this.sumPriceWithTax] = parseFixed(compWithTaxes(item[this.sumPrice], item[this.taxes]))
			item[this.priceWithTax] = compPrice(item[this.sumPriceWithTax], item[this.amount])
			item[this.taxMoney] = compTaxes(item[this.sumPriceWithTax], item[this.sumPrice])
		}
	}

	// 修改含税单价
	changePriceWithTax (item) {
		const _sumPriceWithTax = compSumPrice(item[this.amount], item[this.priceWithTax])
		const _sumPrice = compNoTaxes(_sumPriceWithTax, item[this.taxes])
		item[this.sumPriceWithTax] = parseFixed(_sumPriceWithTax)
		item[this.sumPrice] = parseFixed(_sumPrice)
		if (item[this.amount] === 0) {
			item[this.price] = priceFixed(compNoTaxes(item[this.priceWithTax], item[this.taxes]))
		} else {
			item[this.price] = compPrice(_sumPrice, item[this.amount])
		}
		item[this.taxMoney] = compTaxes(item[this.sumPriceWithTax], item[this.sumPrice])
	}

	// 修改含税金额
	changeSumPriceWithTax (item) {
		if (item[this.amount] === 0) {
			app.vue.$nextTick(() => {
				item[this.sumPriceWithTax] = 0
			})
		} else {
			item[this.priceWithTax] = compPrice(item[this.sumPriceWithTax], item[this.amount])
			item[this.sumPrice] = parseFixed(compNoTaxes(item[this.sumPriceWithTax], item[this.taxes]))
			item[this.price] = compPrice(item[this.sumPrice], item[this.amount])
			item[this.taxMoney] = compTaxes(item[this.sumPriceWithTax], item[this.sumPrice])
		}
	}

	// 修改含税金额(财务模块使用)
	changeFinancialSumPriceWithTax (item) {
		item[this.sumPrice] = parseFixed(compFinancialSumPrice(item[this.sumPriceWithTax], item[this.taxMoney]))
		if (item[this.amount] !== 0) {
			item[this.priceWithTax] = compPrice(item[this.sumPriceWithTax], item[this.amount])
			item[this.price] = compPrice(item[this.sumPrice], item[this.amount])
		}
	}

	// 修改税额(财务模块使用)
	changeFinancialTaxMoney (item) {
		item[this.sumPrice] = parseFixed(compFinancialSumPrice(item[this.sumPriceWithTax], item[this.taxMoney]))
		if (item[this.amount] !== 0) {
			item[this.priceWithTax] = compPrice(item[this.sumPriceWithTax], item[this.amount])
			item[this.price] = compPrice(item[this.sumPrice], item[this.amount])
		}
	}

	// 修改税率
	changeTaxes (item) {
		const _sumPrice = compNoTaxes(item[this.sumPriceWithTax], item[this.taxes])
		item[this.sumPrice] = parseFixed(_sumPrice)
		if (item[this.amount] === 0) {
			item[this.price] = priceFixed(compNoTaxes(item[this.priceWithTax], item[this.taxes]))
		} else {
			item[this.price] = compPrice(_sumPrice, item[this.amount])
		}
		item[this.taxMoney] = compTaxes(item[this.sumPriceWithTax], item[this.sumPrice])
	}

	// 修改单位
	changeUnit (item, unit) {
		const unitRate = compUnitRate(unit.ratio, item.itemUnit.ratio)
		item[this.priceWithTax] = compPriceByUnitRate(item[this.priceWithTax], unitRate)
		this.changePriceWithTax(item)
		item.itemUnit = unit
		this.calculateAssistAmount(item, item.itemUnitList)
	}

	// 修改单位（不重新计算辅助单位数量）
	changeUnitNotCalculateAssistAmount (item, unit) {
		const unitRate = compUnitRate(unit.ratio, item.itemUnit.ratio)
		item[this.priceWithTax] = compPriceByUnitRate(item[this.priceWithTax], unitRate)
		this.changePriceWithTax(item)
		item.itemUnit = unit
	}

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
			item[this.assistUnitAmount] = amountFixed(mainUnit.ratio / item.item.assistUnitRatio * item[this.amount])
		} else {
			item[this.assistUnitAmount] = ''
		}
	}

	// 赠品设置
	calculateGift (item) {
		if (item.giftFlag) {
			item[this.price] = 0
			item[this.taxes] = 0
			this.changePrice(item)
		}
	}

	// 业务单位与辅助单位一致时，修改辅助数量
	changeAssistAmount (item) {
		item[this.amount] = item[this.assistUnitAmount]
		this.changeAmount(item)
	}
}

const fxCalculation = function (billType) {
	const billConfig = config[billType]
	const computedFunc = new CopmutedFunc(billConfig.init)
	Object.keys(billConfig).forEach(item => {
		computedFunc[item] = billConfig[item]
	})
	return computedFunc
}
fxCalculation.setCache = function (row) {
	if (!calculationCache[row.$fxCalculation]) {
		calculationCache[row.$fxCalculation] = utils.deepClone(row)
	}
}
fxCalculation.getCache = function (row) {
	return calculationCache
}

export default fxCalculation
