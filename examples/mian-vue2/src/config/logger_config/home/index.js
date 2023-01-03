import FAVOURITE_BILL from './favourite-bill/index.js'
import ORDER_SUMMARY from './order_summary/index.js'
export default {
	id: 'home',
	label: '首页',
	child: [
		FAVOURITE_BILL,
		ORDER_SUMMARY
	]
}
