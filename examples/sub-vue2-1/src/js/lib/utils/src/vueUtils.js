/**
 * @name vFindParentByName
 * @desc 根据name找父组件
 * @author shw
 * @date 2021/9/18
 */
const vFindParentByName = function (_this, name) {
	let parent = _this.$parent
	while (parent) {
		if (parent.$options.name === name) {
			return parent
		}
		parent = parent.$parent
	}
}
/**
 * @name vDoRefMethod
 * @desc 执行当前refs实例的方法
 * @author shw
 * @date 2021/9/18
 */
const vDoRefMethod = function (context, ref, method) {
	if (context.$refs[ref]) {
		return context.$refs[ref][method]()
	}
}

/**
 * @name vDoRefFocus
 * @desc 执行当前refs实例的focus方法
 * @author shw
 * @date 2021/11/30
 */
const vDoRefFocus = function (context, ref) {
	const _ref = context.$refs[ref]
	if (_ref) {
		return typeof _ref.focus === 'function' ? _ref.focus() : _ref.$el.focus()
	}
}

export default {
	vFindParentByName,
	vDoRefMethod,
	vDoRefFocus
}
