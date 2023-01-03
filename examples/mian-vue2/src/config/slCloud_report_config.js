import { FX_NODE_ENV } from './env.config'
const reportIdMap = {
	'report_report-current-store': '1985661031448006022',
	'report_report-purchase-sell-stock-summary': '1985661031448006021',
	'report_report-purchase-sell-stock-standing-book': '1985661031448006020',
	'report_report-shop-gross-profit': '2723528613111428337',
	'report_report-dish-cost': '2723528613111428336',
	'report_report-dish-gross-profit': '2723528613111428335',
	'report_report-raw-material-difference': '2723528613111428334',
	'report_report-warning-dull-products': '3083601491373190978'
}
const slCLoudConfig = {
	release: {
		host: 'https://b.tcsl.com.cn/home',
		reportMap: reportIdMap,
		loginParams: {
			username: '11111111110',
			password: 'aa123456'
		}
	},
	production: {
		host: 'https://btest.tcsl.com.cn/home',
		reportMap: reportIdMap,
		loginParams: {
			username: '11111111110',
			password: 'aa123456'
		}
	},
	development: {
		host: 'https://btest.tcsl.com.cn/home',
		reportMap: reportIdMap,
		loginParams: {
			username: '11111111110',
			password: 'aa123456'
		}
	}
}

export default {
	host: slCLoudConfig[FX_NODE_ENV].host,
	reportMap: slCLoudConfig[FX_NODE_ENV].reportMap,
	loginParams: slCLoudConfig[FX_NODE_ENV].loginParams
}
