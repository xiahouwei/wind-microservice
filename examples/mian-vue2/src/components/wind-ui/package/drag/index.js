import WindDragContainer from './DragContainer.vue'
import WindDragItem from './DragItem.vue'

export const dragItemMap = {}
export const dragEnterCb = {}
export const dragLeaveCb = {}
export const dragCb = {}

export const dragObj = {}

const getDragItemKey = function (target) {
	return target.dataset && target.dataset.dragItemKey
}

const hasDragItem = function (target) {
	if (!target.dataset) {
		return false
	}
	const { dragItemKey } = target.dataset
	return dragItemMap[dragItemKey]
}

const dragDomIsValidity = function () {
	if (!dragObj.dragDom.dataset) {
		return false
	}
	const { dragItemKey } = dragObj.dragDom.dataset
	return dragItemMap[dragItemKey]
}
const fireDrag = function (e, dragDom) {
	Object.values(dragCb).forEach(cb => {
		if (cb) {
			cb(e, dragDom)
		}
	})
}
const fireDragEnter = function (e) {
	Object.values(dragEnterCb).forEach(cb => {
		if (cb) {
			cb(e)
		}
	})
}

const fireDragLeave = function (e) {
	Object.values(dragLeaveCb).forEach(cb => {
		if (cb) {
			cb(e)
		}
	})
}

const initDrag = function (vue) {
	Object.assign(dragObj, {
		dragDom: null,
		hasDragItem,
		getDragItemKey,
		dragDomIsValidity,
		fireDrag,
		fireDragEnter,
		fireDragLeave
	})
	vue.prototype.$fxDrag = dragObj
}
export { WindDragContainer, WindDragItem, initDrag }
