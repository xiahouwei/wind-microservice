let scrollBarWidth
const scrollbarWidth = function () {
	if (scrollBarWidth !== undefined) return scrollBarWidth
	const outer = document.createElement('div')
	outer.className = 'el-scrollbar__wrap'
	outer.style.visibility = 'hidden'
	outer.style.width = '100px'
	outer.style.position = 'absolute'
	outer.style.top = '-9999px'
	document.body.appendChild(outer)
	const widthNoScroll = outer.offsetWidth
	outer.style.overflow = 'scroll'
	const inner = document.createElement('div')
	inner.style.width = '100%'
	outer.appendChild(inner)
	const widthWithScroll = inner.offsetWidth
	outer.parentNode.removeChild(outer)
	scrollBarWidth = widthNoScroll - widthWithScroll
	return scrollBarWidth
}
/*
 * @ 节流函数 SHW
 * @ wait 延迟毫秒数
 */
const throttle = function () {
	let previous = 0
	let timeout = null
	return function (wait, final) {
		return new Promise(resolve => {
			const now = Date.now()
			if (now - previous > wait) {
				if (timeout) {
					clearTimeout(timeout)
				}
				previous = now
				resolve()
			}
			if (final) {
				if (timeout) {
					clearTimeout(timeout)
				}
				timeout = setTimeout(() => {
					resolve()
				}, wait)
			}
		})
	}
}

/*
 * @ 防抖函数 SHW
 * @ wait 延迟毫秒数
 * @ immediate 立即执行
 */
const debounce = function () {
	let timeout = null
	return function (wait, immediate = true, final = false) {
		return new Promise(resolve => {
			if (timeout) {
				clearTimeout(timeout)
			}
			if (immediate) {
				const immediateAction = !timeout
				timeout = setTimeout(() => {
					if (final && !immediateAction) {
						resolve()
					}
					timeout = null
				}, wait)
				if (immediateAction) {
					resolve()
				}
			} else {
				timeout = setTimeout(() => {
					resolve()
					timeout = null
				}, wait)
			}
		})
	}
}
/*
 * @ 精准四舍五入及补零 SHW
 * @ number 操作的数据
 * @ len 保留位数
 * @ pushZero 是否补领
 */
const toFixedSHW = function (number, len = 0, pushZero = true) {
	if (isNaN(number)) {
		return number
	}
	const num = number - 0 + 0.0000000001
	const _len = len - 0
	const mathPow = Math.pow(10, _len)
	let _num = Math.round(num * mathPow) / mathPow + ''
	if (pushZero && _len > 0) {
		let dot = _num.indexOf('.')
		if (!~dot) {
			_num += '.'
			dot = _num.length - 1
		}
		// 获取当前小数点后位数,跟参数_len比较一下,如果不等用0补齐
		const dotLen = _num.length - (dot + 1)
		// 需要补0的个数
		const zeroLen = _len - dotLen
		if (dotLen < _len) {
			for (let i = 0; i < zeroLen; i++) {
				_num += '0'
			}
		}
	}
	return _num
}
const getCell = function (event) {
	let cell = event.target
	while (cell && cell.tagName.toUpperCase() !== 'HTML') {
		if (cell.tagName.toUpperCase() === 'TD') {
			return cell
		}
		cell = cell.parentNode
	}
	return null
}
const getColumnByCell = function (table, cell) {
	const matches = (cell.className || '').match(/wind-virtual-table-column-[^\s]+/gm)
	if (matches) {
		return getColumnById(table, matches[0])
	}
	return null
}
const getColumnById = function (table, columnId) {
	const prop = columnId.replace(/wind-virtual-table-column-/, '')
	return table.columnArr.find(item => {
		return item.type === prop || item.prop === prop
	})
}
const trim = function (string) {
	return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}
const hasClass = function (el, cls) {
	if (!el || !cls) return false
	if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
	if (el.classList) {
		return el.classList.contains(cls)
	} else {
		return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
	}
}
const addClass = function (el, cls) {
	if (!el) return
	var curClass = el.className
	var classes = (cls || '').split(' ')

	for (var i = 0, j = classes.length; i < j; i++) {
		var clsName = classes[i]
		if (!clsName) continue

		if (el.classList) {
			el.classList.add(clsName)
		} else if (!hasClass(el, clsName)) {
			curClass += ' ' + clsName
		}
	}
	if (!el.classList) {
		el.className = curClass
	}
}
const removeClass = function (el, cls) {
	if (!el || !cls) return
	var classes = cls.split(' ')
	var curClass = ' ' + el.className + ' '
	for (var i = 0, j = classes.length; i < j; i++) {
		var clsName = classes[i]
		if (!clsName) continue
		if (el.classList) {
			el.classList.remove(clsName)
		} else if (hasClass(el, clsName)) {
			curClass = curClass.replace(' ' + clsName + ' ', ' ')
		}
	}
	if (!el.classList) {
		el.className = trim(curClass)
	}
}
const toggleRowStatus = function (statusArr, row, newVal) {
	let changed = false
	const index = statusArr.indexOf(row)
	const included = index !== -1
	const addRow = () => {
		statusArr.push(row)
		changed = true
	}
	const removeRow = () => {
		statusArr.splice(index, 1)
		changed = true
	}
	if (typeof newVal === 'boolean') {
		if (newVal && !included) {
			addRow()
		} else if (!newVal && included) {
			removeRow()
		}
	} else {
		if (included) {
			removeRow()
		} else {
			addRow()
		}
	}
	return changed
}
const toggleSubRowStatus = function (statusMap, subRow, newVal) {
	let changed = false
	if (!statusMap[subRow.detailProductId]) {
		statusMap[subRow.detailProductId] = []
	}
	delete statusMap[undefined]
	const index = statusMap[subRow.detailProductId].indexOf(subRow)
	const included = index !== -1
	const addRow = () => {
		statusMap[subRow.detailProductId].push(subRow)
		changed = true
	}
	const removeRow = () => {
		statusMap[subRow.detailProductId].splice(index, 1)
		if (statusMap[subRow.detailProductId].length === 0) {
			delete statusMap[subRow.detailProductId]
		}
		changed = true
	}
	if (typeof newVal === 'boolean') {
		if (newVal && !included) {
			addRow()
		} else if (!newVal && included) {
			removeRow()
		}
	} else {
		if (included) {
			removeRow()
		} else {
			addRow()
		}
	}
	return changed
}
const getRowIdentity = function (row, rowKey) {
	if (!row) throw new Error('row is required when get row identity')
	if (typeof rowKey === 'string') {
		if (rowKey.indexOf('.') < 0) {
			return row[rowKey]
		}
		const key = rowKey.split('.')
		let current = row
		for (let i = 0; i < key.length; i++) {
			current = current[key[i]]
		}
		return current
	} else if (typeof rowKey === 'function') {
		return rowKey(row)
	}
}
const getKeysMap = function (array = [], rowKey) {
	const arrayMap = {}
	array.forEach((row, index) => {
		arrayMap[getRowIdentity(row, rowKey)] = { row, index }
	})
	return arrayMap
}
const getSubColumns = function (arr) {
	return arr.reduce((pre, cur) => {
		const child = cur.childColumn
		if (Array.isArray(child) && child.length > 0) {
			return pre.concat([].concat(getSubColumns(child)))
		} else {
			return pre.concat(cur)
		}
	}, [])
}
// 数组扁平化 by shw
const arrFlatten = function (arr, fn) {
	if (typeof fn === 'function') {
		return arr.reduce((pre, cur) => {
			const child = fn(cur)
			return pre.concat(Array.isArray(child) ? [cur].concat(arrFlatten(child, fn)) : cur)
		}, [])
	} else {
		return arr.reduce((pre, cur) => {
			return pre.concat(cur)
		}, [])
	}
}
const pythagorasTheorem = function (a, b) {
	return Math.floor(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)))
}
const cosa = function (a, b, c) {
	return Math.acos((Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2)) / (2 * b * c)) * 180 / Math.PI
}
const isInView = function (el, father) {
	const scrollTop = father.scrollTop
	const clientHeight = father.clientHeight
	const offsetTop = el.offsetTop
	return !(scrollTop > offsetTop || offsetTop > (scrollTop + clientHeight))
}
const objectToString = Object.prototype.toString
const toTypeString = (value) => objectToString.call(value)
// 通过toString获取原始类型, 转化为[object RawType] by shw
const toRawType = (value) => {
	return toTypeString(value).slice(8, -1)
}
// 判断是否为一个纯粹对象 by shw
const isPlainObject = (val) => toTypeString(val) === '[object Object]'

export {
	scrollbarWidth,
	throttle,
	debounce,
	toFixedSHW,
	getCell,
	getColumnByCell,
	hasClass,
	addClass,
	removeClass,
	toggleRowStatus,
	toggleSubRowStatus,
	getRowIdentity,
	getKeysMap,
	getSubColumns,
	arrFlatten,
	pythagorasTheorem,
	cosa,
	isInView,
	toRawType,
	isPlainObject
}
