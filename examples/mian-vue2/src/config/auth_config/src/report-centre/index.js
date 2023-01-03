import REPORT_CURRENT_STORE from './report-current-store/index.js'
import REPORT_PURCHASE_SELL_STOCK_SUMMARY from './report-purchase-sell-stock-summary/index.js'
import REPORT_PURCHASE_SELL_STOCK_STANDING_BOOK from './report-purchase-sell-stock-standing-book/index.js'
import REPORT_STORE_GROSS_PROFIT from './report-shop-gross-profit/index.js'
import REPORT_DISH_COST from './report-dish-cost/index.js'
import REPORT_DISH_GROSS_PROFIT from './report-dish-gross-profit/index.js'
import REPORT_RAW_MATERIAL_DIFFERENCE from './report-raw-material-difference/index.js'
import REPORT_WARNING_DULL_PRODUCTS from './report-warning-dull-products/index.js'
export default {
	report: {
		id: 'report',
		label: '报表中心',
		code: '0008',
		child: {
			...REPORT_CURRENT_STORE,
			...REPORT_PURCHASE_SELL_STOCK_SUMMARY,
			...REPORT_PURCHASE_SELL_STOCK_STANDING_BOOK,
			...REPORT_STORE_GROSS_PROFIT,
			...REPORT_DISH_COST,
			...REPORT_DISH_GROSS_PROFIT,
			...REPORT_RAW_MATERIAL_DIFFERENCE,
			...REPORT_WARNING_DULL_PRODUCTS
		}
	}
}
