import API_ACCOUNT from './account'
import API_ARCHIVE from './archive'
import API_ASSIGN from './assign'
import API_AUTH from './auth'
import API_BILL from './bill'
import API_FOREIGN from './foreign'
import API_PARAM from './param'
import API_PLAN from './plan'
import API_PRINT from './print'
import API_STORE from './store'
import API_SUPPORT from './support'
import API_PRODUCTION from './production'
import API_INVOICE from './invoice'
import API_BUSINESS from './business'
import API_HOME from './home'
import API_FINANCIAL from './financial'
export default {
	...API_ACCOUNT,
	...API_ARCHIVE,
	...API_ASSIGN,
	...API_AUTH,
	...API_BILL,
	...API_FOREIGN,
	...API_PARAM,
	...API_PLAN,
	...API_PRINT,
	...API_STORE,
	...API_SUPPORT,
	...API_PRODUCTION,
	...API_INVOICE,
	...API_BUSINESS,
	...API_HOME,
	...API_FINANCIAL
}
