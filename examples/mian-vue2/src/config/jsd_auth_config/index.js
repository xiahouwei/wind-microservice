import SELLER_CENTER from './seller-center/index.js'
import COMMODITY_CENTER from './commodity-center/index.js'
import STORE_CENTER from './store-center/index.js'
import CUSTOMER_CENTER from './customer-center/index.js'
import PAY_CENTER from './pay-center/index.js'
import ORDER_CENTER from './order-center/index.js'
import SALE_CENTER from './sale-center/index.js'
import MARKET_CENTER from './market-center/index.js'
import REPORT_CENTER from './report-center/index.js'
import SYSTEM_CENTER from './system-center/index.js'
import MESSAGE_CENTER from './message-center/index.js'
export default {
	...SELLER_CENTER,
	...COMMODITY_CENTER,
	...STORE_CENTER,
	...CUSTOMER_CENTER,
	...PAY_CENTER,
	...ORDER_CENTER,
	...SALE_CENTER,
	...MARKET_CENTER,
	...REPORT_CENTER,
	...SYSTEM_CENTER,
	...MESSAGE_CENTER
}
