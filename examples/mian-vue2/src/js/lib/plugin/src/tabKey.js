import { TABKEY_CONFIG } from '@/config/tabkey_config'

const contexts = {}

const init = function (moduleName, context) {
	contexts[moduleName] = context
}

const tabChangeHandler = function (moduleName, refName) {
	const context = contexts[moduleName]
	const [main, sub, type] = moduleName.split('_')
	const tabConfig = TABKEY_CONFIG[main][sub][type]
	const tabConfigList = Object.keys(tabConfig)
	let index = tabConfigList.findIndex(item => item === refName)
	const handler = function () {
		if (index === tabConfigList.length - 1) {
			index = 0
		} else {
			index++
		}
		const tabConfigKey = tabConfigList[index]
		const tabConfigItem = tabConfig[tabConfigKey]
		if (tabConfigKey !== refName) {
			const visiable = typeof tabConfigItem.visiable === 'function' ? tabConfigItem.visiable.call(context) : tabConfigItem.visiable
			if (visiable) {
				tabConfigItem.focus.call(context)
			} else {
				handler.call(context)
			}
		}
	}
	handler.call(context)
}

export default {
	init,
	tabChangeHandler
}
