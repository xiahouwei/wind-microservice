<template>
	<div :data-drag-container-key="currentDragKey" class="wind-drag-container">
		<slot></slot>
	</div>
</template>
<script>
/**
 * DragContainer by shang 2021/12/13
 * @desc DragContainer 拖拽容器容器
 * @param {String} direction 布局 column, row 垂直/水平
 */
import { dragObj, dragEnterCb, dragLeaveCb, dragCb } from './index.js'
export default {
	name: 'wind-drag-container',
	props: {
		dragKey: String,
		dragItemKey: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			uuid: this.$fxUtils.createUUID()
		}
	},
	computed: {
		currentDragKey () {
			return `${this.uuid}-${this.dragKey}`
		}
	},
	created () {
		dragEnterCb[this.currentDragKey] = this.onDragEnterHandler
		dragLeaveCb[this.currentDragKey] = this.onDragLeaveHandler
		dragCb[this.currentDragKey] = this.onDragHandler
	},
	destroyed () {
		if (dragEnterCb[this.currentDragKey]) {
			delete dragEnterCb[this.currentDragKey]
		}
		if (dragCb[this.currentDragKey]) {
			delete dragCb[this.currentDragKey]
		}
	},
	methods: {
		isDragContainer (target) {
			if (!target.dataset) {
				return false
			}
			const { dragContainerKey } = target.dataset
			return this.currentDragKey === dragContainerKey
		},
		onDragEnterHandler (e) {
			if (this.isDragContainer(e.target)) {
				const dragItemKey = dragObj.getDragItemKey(dragObj.dragDom)
				if (this.dragItemKey.includes(dragItemKey)) {
					this.$emit('on-drag-enter', {
						dragDom: dragObj.dragDom,
						dragItemKey
					})
				}
			}
		},
		onDragLeaveHandler (e) {
			if (this.isDragContainer(e.target)) {
				const dragItemKey = dragObj.getDragItemKey(dragObj.dragDom)
				if (this.dragItemKey.includes(dragItemKey)) {
					this.$emit('on-drag-leave', {
						dragDom: dragObj.dragDom,
						dragItemKey
					})
				}
			}
		},
		onDragHandler (e, dragDom) {
			if (this.isDragContainer(e.target)) {
				const dragItemKey = dragObj.getDragItemKey(dragDom)
				if (this.dragItemKey.includes(dragItemKey)) {
					this.$emit('on-drag', {
						dragDom,
						dragItemKey
					})
				}
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '../../style/varsty.styl'
.wind-drag-container {
}
</style>
