const path = require('path')
const IS_PROD = process.env.NODE_ENV === 'production'

function resolve (dir) {
	return path.join(__dirname, dir)
}
const vueConfig = {
	publicPath: '',

	outputDir: 'dist',

	assetsDir: './src/assets',

	lintOnSave: 'error',

	indexPath: './index.html',

	css: {
		extract: IS_PROD,

		sourceMap: true,

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
		port: 8877,
		https: false,
		hotOnly: true,
		proxy: {
			'/preview': {
				target: 'http://192.168.26.240:8086',
				changeOrigin: true,
				pathRewrite: { '^/preview': '/preview' }
			}
		},
		before: app => {},
		disableHostCheck: true
	}
}
module.exports = vueConfig
