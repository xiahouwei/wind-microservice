import utils from './src/utils.js'
const Log4jsApi = require('./src/log4js.js')
const R_QUOTE = /"/g
const createConfig = function (config) {
	return {
		appender: {
			ajax: {
				driver: 'log4js.ajax.AjaxAppender',
				remote: config.remote,
				level: 'all',
				threshold: 20,
				layout: {
					app: config.app,
					name: 'log4js.json.JSONLayout'
				}
			},
			browser: {
				driver: 'log4js.browser.BrowserConsoleAppender',
				level: 'all'
			}
		},
		logger: {
			action: {
				level: 'all',
				appender: ['ajax']
			},
			runtime: {
				level: 'all',
				appender: ['ajax']
			},
			request: {
				level: 'all',
				appender: ['ajax']
			}
		}
	}
}
class FxLogger {
	constructor (config) {
		Log4jsApi.config(createConfig(config))
		this.curUUID = utils.getUUID()
		this.curUser = null
		this.domain = utils.getDomain()
		this.trans = 0
		this.used = 0
		this.actionLogger = Log4jsApi.getLogger('action')
		this.runtimeLogger = Log4jsApi.getLogger('runtime')
		this.requestLogger = Log4jsApi.getLogger('request')
		const _this = this
		const Logger = Log4jsApi.Logger
		const JSONLayout = Log4jsApi.JSONLayout
		const layoutFormat = JSONLayout.prototype.format
		JSONLayout.prototype.format = function (e) {
			e.message = JSON.stringify({
				sid: _this.curUUID,
				uid: _this.curUser || '*',
				used: e.used,
				trans: e.trans,
				domain: _this.domain,
				message: e.message
			}).replace(/\\/g, '\\\\').replace(R_QUOTE, '\\"')
			return layoutFormat.call(this, e)
		}
		const fGetEvent = Logger.prototype.getEvent
		Logger.prototype.getEvent = function (logLevel, message, exception) {
			const res = fGetEvent.call(this, logLevel, message, exception)
			res.used = _this.used
			res.trans = _this.trans
			_this.used = 0
			_this.trans = 0
			return res
		}
	}

	// logger初始化
	init (user) {
		this.actionInfo('系统准备就绪')
		if (user) {
			this.setUserInfo(user)
		}
		this.bindErrorLogger()
	}


	bindErrorLogger () {
		window.onerror = this.runtimeInfo.bind(this)
	}

	// 设置用户
	setUserInfo (user) {
		this.curUser = user
		this.actionInfo(`授权账号: ${user}`)
	}

	// action信息采集
	actionInfo (message) {
		this.actionLogger.info(message)
	}

	// runtime信息采集
	runtimeInfo (errmsg, uri, row, col, errobj) {
		this.runtimeLogger.info(`err:${errmsg} uri:${uri || '-'} row: ${row} col: ${col} errobj`)
	}

	// request信息采集
	requestInfoStart (message, data, query) {
		const trans = utils.getUUIDInt()
		const start = new Date().getTime()
		const _data = data ? JSON.stringify(data) : '-'
		const _query = query ? JSON.stringify(query) : '-'
		const end = function () {
			const end = new Date().getTime()
			this.used = end - start
			this.trans = trans
			this.requestLogger.info(`B:${message}`)
		}
		this.trans = trans
		this.requestLogger.info(`A:${message} P: ${_data} Q: ${_query}`)
		return {
			end: end.bind(this)
		}
	}

	// 菜单信息采集
	menuInfo (message) {
		this.actionInfo(`选择[${message}]菜单`)
	}

	// 按钮信息采集
	btnInfo (message) {
		this.actionInfo(`单击[${message}]按钮`)
	}

	// 窗口信息采集
	dialogOpenInfo (message) {
		this.actionInfo(`打开[${message}]窗口`)
	}

	dialogCloseInfo (message) {
		this.actionInfo(`关闭[${message}]窗口`)
	}
}
export default FxLogger
