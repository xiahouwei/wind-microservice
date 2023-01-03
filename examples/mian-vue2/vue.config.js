const path = require('path')
const IS_PROD = ['production', 'test', 'release'].includes(process.env.NODE_ENV)
const PROXY_TARGET = process.env.PROXY_TARGET || 'CS'
const PROXY_HOST = process.env.npm_config_fxhost || 'dev10'
const testHost = '192.168.27.10'
const devHost = '192.168.7.237'
const XXW_HOST = '192.168.27.94'
const WQJ_HOST = '192.168.27.92'
const ZF_HOST = '192.168.27.99'
const LOG_HOST = 'action.fxscm.net'
const PROXY_URL = {
	CS: {
		archive: `http://${testHost}:8585`,
		auth: `http://${testHost}:8585`,
		plan: `http://${testHost}:8585`,
		bill: `http://${testHost}:8585`,
		finance: `http://${testHost}:8585`,
		setting: `http://${testHost}:8585`,
		excel: `http://${testHost}:8585`,
		business: `http://${testHost}:8585`,
		log: `http://${LOG_HOST}`,
		foreign: 'http://192.168.27.10:9999',
		report: `http://${testHost}:8585`
	},
	XXW: {
		archive: 'http://192.168.27.10:8888',
		auth: 'http://192.168.27.10:8881',
		plan: 'http://192.168.27.10:8883',
		bill: 'http://192.168.27.94:8886',
		setting: 'http://192.168.27.10:8887',
		excel: 'http://192.168.27.94:9991',
		business: 'http://192.168.27.94:8585',
		log: `http://${LOG_HOST}`,
		foreign: 'http://192.168.27.10:9999'
	},
	SHW: {
		archive: `http://${devHost}:8585`,
		auth: `http://${devHost}:8585`,
		plan: `http://${devHost}:8585`,
		bill: `http://${devHost}:8585`,
		setting: `http://${devHost}:8585`,
		excel: `http://${devHost}:9191`,
		business: `http://${devHost}:8585`,
		log: `http://${LOG_HOST}`,
		foreign: `http://${devHost}:9696`
	},
	WHY: {
		archive: `http://${devHost}:8282`,
		auth: `http://${devHost}:8585`,
		plan: `http://${devHost}:8585`,
		bill: `http://${devHost}:8585`,
		setting: `http://${devHost}:8585`,
		excel: `http://${devHost}:8585`,
		business: `http://${devHost}:8585`,
		log: `http://${LOG_HOST}`,
		foreign: `http://${devHost}:9696`
	},
	ZZC: {
		archive: 'http://192.168.6.143:8282',
		auth: 'http://192.168.6.143:8181',
		plan: 'http://192.168.6.143:8383',
		bill: 'http://192.168.6.143:8686',
		log: `http://${LOG_HOST}`
	},
	CC: {
		archive: `http://${testHost}:8585`,
		// archive: `http://192.168.131.87:8282`,
		auth: `http://${testHost}:8585`,
		plan: `http://${testHost}:8585`,
		// bill: `http://${testHost}:8585`,
		bill: `http://192.168.27.111:8686`,
		finance: `http://${testHost}:9696`,
		setting: `http://${testHost}:8585`,
		excel: `http://${testHost}:8585`,
		log: `http://${LOG_HOST}`,
		business: `http://${testHost}:8585`,
		foreign: `http://${testHost}:9999`,
		report: `http://${testHost}:8585`
	},
	LQ: {
		archive: `http://${testHost}:8585`,
		auth: `http://${testHost}:8585`,
		plan: `http://${testHost}:8585`,
		bill: `http://${testHost}:8585`,
		setting: `http://${testHost}:8585`,
		excel: `http://${testHost}:8585`,
		log: `http://${LOG_HOST}`,
		foreign: `http://${testHost}:9999`
	},
	WYT: {
		// archive: `http://${devHost}:8282`,
		archive: 'http://dev10.fxscm.com:8282',
		auth: `http://${devHost}:8881`,
		// auth: 'http://dev10.fxscm.com:8881',
		plan: `http://${devHost}:8883`,
		// plan: 'http://dev10.fxscm.com:8883',
		bill: `http://${devHost}:8886`,
		// bill: 'http://dev10.fxscm.com:8886',
		setting: `http://${devHost}:8887`,
		// setting: `http://dev10.fxscm.com:8887`,
		excel: `http://${devHost}:9991`,
		// excel: `http://dev10.fxscm.com:9991`,
		// excel: `http://dev10.fxscm.com:8585`,
		log: `http://${LOG_HOST}`,
		business: `http://${devHost}:9992`,
		foreign: `http://${devHost}:9999`
	}
}
const PROXY_HOST_MAP = {
	origin: '0.0.0.0',
	dev10: 'dev10.fxscm.com',
	test10: 'test10.fxscm.com',
	test20: 'test20.fxscm.com',
	test30: 'test30.fxscm.com',
	test40: 'test40.fxscm.com',
	test50: 'test50.fxscm.com'
}
console.log('proxy:', PROXY_TARGET)
console.log('PROXY_URL:', PROXY_URL[PROXY_TARGET])
console.log('PROXY_HOST:', PROXY_HOST_MAP[PROXY_HOST])
function resolve (dir) {
	return path.join(__dirname, dir)
}
const vueConfig = {
	publicPath: '',

	outputDir: 'dist',

	assetsDir: './src/assets',

	lintOnSave: 'error',

	indexPath: './index.html',

	productionSourceMap: false,

	css: {
		extract: IS_PROD,

		sourceMap: false,

		loaderOptions: {},

		modules: false,

		loaderOptions: {
			less: {
			}
		}
	},
	chainWebpack: (config) => {
		config.resolve.alias
			.set('$assets', resolve('src/assets'))
			.set('images', resolve('src/assets/images'))
			.set('$json', resolve('src/json'))
	},
	devServer: {
		// host: PROXY_HOST_MAP[PROXY_HOST],
		port: 8866,
		https: false,
		hotOnly: true,
		proxy: {
			'/toolsprint': {
				target: 'http://localhost:8877',
				changeOrigin: true,
				pathRewrite: { '^/toolsprint': '' }
			},
			'/testprint': {
				target: 'http://localhost:8855',
				changeOrigin: true,
				pathRewrite: { '^/testprint': '' }
			},
			'/fxApi/print': {
				target: PROXY_URL[PROXY_TARGET].excel,
				changeOrigin: true,
				pathRewrite: { '^/fxApi/print': '/print' }
			},
			'/fxApi/business': {
				target: PROXY_URL[PROXY_TARGET].business,
				changeOrigin: true,
				pathRewrite: { '^/fxApi/business': '/business' }
			},
			'/archive': {
				target: PROXY_URL[PROXY_TARGET].archive,
				changeOrigin: true,
				pathRewrite: { '^/archive': '/archive' }
			},
			'/fxApi/api': {
				target: PROXY_URL[PROXY_TARGET].foreign,
				changeOrigin: true,
				pathRewrite: { '^/fxApi/api': '/api' }
			},
			'/auth': {
				target: PROXY_URL[PROXY_TARGET].auth,
				changeOrigin: true,
				pathRewrite: { '^/auth': '/auth' }
			},
			'/plan': {
				target: PROXY_URL[PROXY_TARGET].plan,
				changeOrigin: true,
				pathRewrite: { '^/plan': '/plan' }
			},
			'/bill': {
				target: PROXY_URL[PROXY_TARGET].bill,
				changeOrigin: true,
				pathRewrite: { '^/bill': '/bill' }
			},
			'/finance': {
				target: PROXY_URL[PROXY_TARGET].finance,
				changeOrigin: true,
				pathRewrite: { '^/finance': '/finance' }
			},
			'/param': {
				target: PROXY_URL[PROXY_TARGET].setting,
				changeOrigin: true,
				pathRewrite: { '^/param': '/param' }
			},
			'/excel': {
				target: PROXY_URL[PROXY_TARGET].excel,
				changeOrigin: true,
				pathRewrite: { '^/excel': '/excel' }
			},
			'/searcher': {
				target: PROXY_URL[PROXY_TARGET].log,
				changeOrigin: true,
				pathRewrite: { '^/searcher': '/searcher' }
			},
			'/report': {
				target: PROXY_URL[PROXY_TARGET].report,
				changeOrigin: true,
				pathRewrite: { '^/report': '/report' }
			}
		},
		before: app => {},
		disableHostCheck: true
	}
}

module.exports = vueConfig
