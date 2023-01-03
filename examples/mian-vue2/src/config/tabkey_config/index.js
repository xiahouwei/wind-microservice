import BASIC_ARCHIVES from './src/basic-archives/index.js'
import STORE_MANAGE from './src/store-manage/index.js'
import STOCK_SALE_MANAGE from './src/stock-sale-manage/index.js'
import BUSINESS_DATA from './src/business-data/index.js'
import FINANCIAL_MANAGE from './src/financial-manage/index.js'

export const TABKEY_CONFIG = {
	...BASIC_ARCHIVES,
	...STORE_MANAGE,
	...STOCK_SALE_MANAGE,
	...BUSINESS_DATA,
	...FINANCIAL_MANAGE
}
