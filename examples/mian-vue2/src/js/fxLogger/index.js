import utils from './src/utils.js'
import Vue from 'vue'
import { isProducton } from '@/config/env.config'
import loggerConfig from '@/config/logger_config/index'
const Log4jsApi = require('./src/log4js.js')
const R_QUOTE = /"/g
const createConfig = function (config) {
	return {
		appender: {
			ajax: {
				driver: 'log4js.ajax.AjaxAppender',
				remote: config.remote,
				level: 'all',
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
const getLoggerConfigMap = function (config) {
	const configMap = {}
	config.forEach(mainMenu => {
		if (Array.isArray(mainMenu.child)) {
			mainMenu.child.forEach(subMenu => {
				if (Array.isArray(subMenu.actions)) {
					subMenu.actions.forEach(action => {
						subMenu[action.id] = action
					})
				}
				if (Array.isArray(subMenu.child)) {
					subMenu.child.forEach(thirdMenu => {
						if (Array.isArray(thirdMenu.actions)) {
							thirdMenu.actions.forEach(action => {
								thirdMenu[action.id] = action
							})
						}
						subMenu[thirdMenu.id] = thirdMenu
					})
				}
				mainMenu[subMenu.id] = subMenu
			})
		}
		configMap[mainMenu.id] = mainMenu
	})
	return configMap
}
const loggerConfigMap = getLoggerConfigMap(loggerConfig)
class FxLogger {
	constructor (config) {
		Log4jsApi.config(createConfig(config))
		this.vueApp = config.vueApp
		this.curUUID = utils.getUUID()
		this.curUser = null
		this.tenantId = 0
		this.userId = ''
		this.hostId = ''
		this.employeeName = ''
		this.organName = ''
		this.domain = utils.getDomain()
		this.trans = 0
		this.used = 0
		this.mainMenu = ''
		this.subMenu = ''
		this.thirdMenu = ''
		this.actionType = ''
		this.resulteType = ''
		this.errorCause = ''
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
				userId: _this.userId,
				tenantId: _this.tenantId,
				hostId: _this.hostId,
				domain: _this.domain,
				userEmployeeName: _this.employeeName,
				userOrganName: _this.organName,
				used: e.used,
				trans: e.trans,
				mainMenu: e.mainMenu,
				subMenu: e.subMenu,
				thirdMenu: e.thirdMenu,
				actionType: e.actionType,
				resulteType: e.resulteType,
				logTime: e.logTime,
				userLogTime: e.userLogTime,
				message: e.message
			}).replace(/\\/g, '\\\\').replace(R_QUOTE, '\\"')
			return layoutFormat.call(this, e)
		}
		const fGetEvent = Logger.prototype.getEvent
		Logger.prototype.getEvent = function (logLevel, message, exception) {
			const res = fGetEvent.call(this, logLevel, message, exception)
			const logTime = utils.setDateTime(new Date(), 'HH:MM:SS')
			const userLogTime = parseInt(logTime.replace(':', '').replace(':', ''))
			res.used = _this.used
			res.trans = _this.trans
			res.mainMenu = _this.mainMenu
			res.subMenu = _this.subMenu
			res.thirdMenu = _this.thirdMenu
			res.actionType = _this.actionType
			res.resulteType = _this.resulteType
			res.logTime = logTime
			res.userLogTime = userLogTime
			_this.used = 0
			_this.trans = 0
			_this.mainMenu = ''
			_this.subMenu = ''
			_this.thirdMenu = ''
			_this.actionType = ''
			_this.resulteType = ''
			return res
		}
	}

	// logger初始化
	init (user) {
		this.actionMessage('系统准备就绪')
		if (user.username) {
			this.setUserInfo(user)
		}
		this.bindErrorLogger()
	}


	bindErrorLogger () {
		if (isProducton()) {
			Vue.config.warnHandler = this.runtimeInfo.bind(this)
		} else {
			window.onerror = this.runtimeInfo.bind(this)
		}
	}

	// 设置用户
	setUserInfo ({ username, tenantId, employeeName, organName, userId, hostId }) {
		this.curUser = username
		this.tenantId = tenantId
		this.employeeName = `${employeeName}`
		this.organName = `${organName}`
		this.userId = `${userId}`
		this.hostId = `${hostId}`
		this.actionMessage(`授权账号: ${username}`)
	}

	// actionInfo信息采集
	actionInfo ({ mainMenu, subMenu, thirdMenu, actionType, message }) {
		const start = new Date().getTime()
		const end = function (resulteType) {
			const end = new Date().getTime()
			this.used = end - start
			this.mainMenu = mainMenu
			this.subMenu = subMenu
			this.thirdMenu = thirdMenu
			this.actionType = actionType
			this.resulteType = resulteType
			this.actionLogger.info(message)
		}
		const success = function () {
			const resulteType = 1
			end.call(this, resulteType)
		}
		const error = function (errorCause) {
			const resulteType = 0
			end.call(this, resulteType, errorCause)
		}
		return {
			end: end.bind(this),
			success: success.bind(this),
			error: error.bind(this)
		}
	}

	// actionMessage信息采集
	actionMessage (message) {
		this.actionLogger.info(message)
	}

	// runtime信息采集
	runtimeInfo (errmsg, uri, row) {
		this.runtimeLogger.info(`err:${errmsg} uri:${uri || '-'} row: ${row}`)
	}

	// request信息采集
	requestInfoStart (message, data, query) {
		const trans = utils.getUUIDInt()
		const start = new Date().getTime()
		const _data = data ? JSON.stringify(data) : '-'
		const _query = query ? JSON.stringify(query) : '-'
		const end = function (url, res, error) {
			// let _res = res ? JSON.stringify(res) : '-'
			let _error = error ? JSON.stringify(error) : '-'
			const end = new Date().getTime()
			this.used = end - start
			this.trans = trans
			// this.requestLogger.info(`B:${url} R: ${_res} E: ${_error}`)
			this.requestLogger.info(`B:${url} E: ${_error}`)
			// _res = null
			_error = null
		}
		this.trans = trans
		this.requestLogger.info(`A:${message} P: ${_data} Q: ${_query}`)
		return {
			end: end.bind(this)
		}
	}

	// 菜单信息采集
	menuInfo (message) {
		this.actionMessage(`选择[${message}]菜单`)
	}

	// 按钮信息采集
	btnInfo (message) {
		this.actionMessage(`单击[${message}]按钮`)
	}

	// 窗口信息采集
	dialogOpenInfo (message) {
		this.actionMessage(`打开[${message}]窗口`)
	}

	dialogCloseInfo (message) {
		this.actionMessage(`关闭[${message}]窗口`)
	}

	// 创建日志信息Params
	createInfo (action, params) {
		const actions = action.split('.')
		const mainMenu = actions[0]
		const subMenu = actions[1]
		let thirdMenu = ''
		let actionType = ''
		let message = ''
		if (actions.length === 3) {
			actionType = actions[2]
			message = loggerConfigMap[mainMenu][subMenu][actionType].messageHandler.call(this, params)
		} else {
			thirdMenu = actions[2]
			actionType = actions[3]
			message = loggerConfigMap[mainMenu][subMenu][thirdMenu][actionType].messageHandler.call(this, params)
		}

		return {
			mainMenu,
			subMenu,
			thirdMenu,
			actionType,
			message
		}
	}

	// 创建差异日志文本
	createUpdateMessageByLibrary (library) {
		return (pre, cur) => {
			if (!utils.compare(pre, cur)) {
				const message = {}
				library.forEach(item => {
					const preVal = utils.getObjDeepValue(pre, item.id)
					const curVal = utils.getObjDeepValue(cur, item.id)
					if (!utils.compare(preVal, curVal)) {
						let _message = ''
						if (typeof item.handler === 'function') {
							_message = item.handler.apply(this, [{ pre: preVal, cur: curVal, preFull: pre, curFull: cur }])
						} else {
							const preValText = utils.isDef(preVal) ? preVal : '无'
							const curValText = utils.isDef(curVal) ? curVal : '无'
							_message = `${item.label}由"${preValText}"改为"${curValText}"`
						}
						const type = item.type || 'default'
						if (!message[type]) {
							message[type] = []
						}
						message[type].push(_message)
					}
				})
				return Object.keys(message).map(item => message[item].join(',\n'))
			} else {
				return '数据未发生改变'
			}
		}
	}

	createMessages (params, func) {
		return params.map(func).join(',')
	}

	createUpdateMessage (params, func) {
		return params.map(item => {
			return `"${func(item[0])}"改为"${func(item[1])}"`
		}).join(',')
	}

	createDiffMessage ({ label = '', pre, cur, msgHandler, getKeyFn }) {
		const data = utils.compareDiff(pre, cur, getKeyFn)
		const addMessage = data.add ? `新增${label}:"${this.createMessages(data.add, msgHandler)}"` : ''
		const delMessage = data.delete ? `删除${label}:"${this.createMessages(data.delete, msgHandler)}"` : ''
		const updateMessage = data.update ? `修改${label}:${this.createUpdateMessage(data.update, msgHandler)}` : ''
		return `${[addMessage, delMessage, updateMessage].filter(item => item).join(',\n')}`
	}

	compareDiff ({ pre, cur, getKeyFn }) {
		return utils.compareDiff(pre, cur, getKeyFn)
	}

	createCodeSpan (billData, billType) {
		let codeSpan = ''
		if (Array.isArray(billData)) {
			codeSpan = billData.map(item => {
				return item.id ? `<span class="fx-delegate-go" data-type="${billType}" data-billid="${item.id}">${item.sysBillCode}</span>` : item.sysBillCode
			}).join(',')
		} else {
			const { sysBillCode, id } = billData
			codeSpan = id ? `<span class="fx-delegate-go" data-type="${billType}" data-billid="${id}">${sysBillCode}</span>` : sysBillCode
		}
		return codeSpan
	}

	createDisableCodeSpan (billData, billType) {
		let codeSpan = ''
		if (Array.isArray(billData)) {
			codeSpan = billData.map(item => {
				return `<span class="fx-log-code__disable" data-type="${billType}" data-billid="${item.id}">${item.sysBillCode}</span>`
			}).join(',')
		} else {
			const { sysBillCode, id } = billData
			codeSpan = `<span class="fx-log-code__disable" data-type="${billType}" data-billid="${id}">${sysBillCode}</span>`
		}
		return codeSpan
	}
}
export default FxLogger
