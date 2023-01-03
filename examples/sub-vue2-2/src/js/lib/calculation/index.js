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
// 总价运算 = 数量 * 单价
const compSumPrice = function (a, p) {
	return parseFixed(a * p)
}
// 税额运算 = 含税金额 - 非税金额
const compTaxes = function (tm, m) {
	return parseFixed(tm - m)
}
// 含税运算 = 价格 * (1 + 税率)
const compWithTaxes = function (p, t) {
	return parseFixed(p * (1 + translatTax(t)))
}
// 除税运算 = 金额 / (1 + 税率)
const compNoTaxes = function (tp, t) {
	return parseFixed(tp / (1 + translatTax(t)))
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
			item[this.sumPrice] = compSumPrice(item[this.amount], item[this.price])
			item[this.sumPriceWithTax] = compSumPrice(item[this.amount], item[this.priceWithTax])
			item[this.taxMoney] = compTaxes(item[this.sumPriceWithTax], item[this.sumPrice])
		}
	}

	// 修改非税单价
	changePrice (item) {
		item[this.sumPrice] = compSumPrice(item[this.amount], item[this.price])
		this.changeTaxes(item)
	}

	// 修改非税金额
	changeSumPrice (item) {
		if (item[this.amount] === 0) {
			app.vue.$nextTick(() => {
				item[this.sumPrice] = 0
			})
		} else {
			item[this.price] = compPrice(item[this.sumPrice], item[this.amount])
			item[this.sumPriceWithTax] = compWithTaxes(item[this.sumPrice], item[this.taxes])
			item[this.priceWithTax] = compPrice(item[this.sumPriceWithTax], item[this.amount])
			item[this.taxMoney] = compTaxes(item[this.sumPriceWithTax], item[this.sumPrice])
		}
	}

	// 修改含税单价
	changePriceWithTax (item) {
		item[this.sumPriceWithTax] = compSumPrice(item[this.amount], item[this.priceWithTax])
		item[this.sumPrice] = compNoTaxes(item[this.sumPriceWithTax], item[this.taxes])
		if (item[this.amount] === 0) {
			item[this.price] = compNoTaxes(item[this.priceWithTax], item[this.taxes])
		} else {
			item[this.price] = compPrice(item[this.sumPrice], item[this.amount])
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
			item[this.sumPrice] = compNoTaxes(item[this.sumPriceWithTax], item[this.taxes])
			item[this.price] = compPrice(item[this.sumPrice], item[this.amount])
			item[this.taxMoney] = compTaxes(item[this.sumPriceWithTax], item[this.sumPrice])
		}
	}

	// 修改税率
	changeTaxes (item) {
		item[this.sumPriceWithTax] = compWithTaxes(item[this.sumPrice], item[this.taxes])
		if (item[this.amount] === 0) {
			item[this.priceWithTax] = compWithTaxes(item[this.price], item[this.taxes])
		} else {
			item[this.priceWithTax] = compPrice(item[this.sumPriceWithTax], item[this.amount])
		}
		item[this.taxMoney] = compTaxes(item[this.sumPriceWithTax], item[this.sumPrice])
	}

	// 修改单位
	changeUnit (item, unit) {
		const unitRate = compUnitRate(unit.ratio, item.itemUnit.ratio)
		item[this.price] = compPriceByUnitRate(item[this.price], unitRate)
		item[this.priceWithTax] = compWithTaxes(item[this.price], item[this.taxes])
		item[this.sumPrice] = compSumPrice(item[this.amount], item[this.price])
		item[this.sumPriceWithTax] = compWithTaxes(item[this.sumPrice], item[this.taxes])
		item[this.taxMoney] = compTaxes(item[this.sumPriceWithTax], item[this.sumPrice])
		item.itemUnit = unit
		this.calculateAssistAmount(item, item.itemUnitList)
	}

	// 计算辅助数量
	calculateAssistAmount (item, unitList) {
		if (Array.isArray(unitList) && unitList.length > 0 && item.item.assistUnit) {
			const mainUnit = item.itemUnit || unitList[0]
			item[this.assistUnitAmount] = mainUnit.ratio / item.item.assistUnitRatio * item[this.amount]
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

export default fxCalculation
