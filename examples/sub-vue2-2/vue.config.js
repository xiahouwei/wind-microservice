const path = require('path')
const IS_PROD = ['production', 'test'].includes(process.env.NODE_ENV)
const PROXY_TARGET = process.env.PROXY_TARGET || 'CS'
const testHost = '192.168.27.10'
const devHost = '192.168.7.237'
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
	HZL: {
		archive: 'http://192.168.6.147:8282',
		auth: 'http://192.168.6.147:8181',
		plan: 'http://192.168.6.147:8383',
		bill: 'http://192.168.6.147:8686',
		excel: 'http://192.168.13.206:9191'
	}
}
console.log('proxy:', PROXY_TARGET)
console.log('PROXY_URL:', PROXY_URL[PROXY_TARGET])
function resolve (dir) {
	return path.join(__dirname, dir)
}
module.exports = {
	publicPath: '',

	outputDir: 'dist',

	assetsDir: './src/assets',

	lintOnSave: 'error',

	indexPath: './index.html',

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
		host: '0.0.0.0',
		port: 6666,
		https: false,
		hotOnly: true,
		proxy: {
			'/fxprint/fxApi/print': {
				target: PROXY_URL[PROXY_TARGET].archive,
				changeOrigin: true,
				pathRewrite: { '^/fxprint/fxApi/print': '/print' }
			},
			'/fxprint/fxApi/schedule': {
				target: PROXY_URL[PROXY_TARGET].archive,
				changeOrigin: true,
				pathRewrite: { '^/fxprint/fxApi/schedule': '/schedule' }
			},
			'/fxprint/fxApi/archive': {
				target: PROXY_URL[PROXY_TARGET].archive,
				changeOrigin: true,
				pathRewrite: { '^/fxprint/fxApi/archive': '/archive' }
			},
			'/fxprint/fxApi/bill': {
				target: PROXY_URL[PROXY_TARGET].bill,
				changeOrigin: true,
				pathRewrite: { '^/fxprint/fxApi/bill': '/bill' }
			}
		},
		before: app => {},
		disableHostCheck: true
	}
}
