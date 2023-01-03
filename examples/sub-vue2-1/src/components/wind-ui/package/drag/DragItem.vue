<template>
	<div draggable='true' :data-drag-item-key="dragKey" class="wind-drag-item" @dragend="onDragEnd">
		<slot></slot>
	</div>
</template>
<script>
/**
 * DragItem by shang 2021/12/13
 * @desc DragItem 拖拽元素
 * @param {String} dragKey 布局 column, row 垂直/水平
 */
import { dragItemMap, dragObj } from './index.js'
export default {
	name: 'wind-drag-item',
	props: {
		dragKey: String
	},
	created () {
		dragItemMap[this.dragKey] = true
	},
	methods: {
		onDragEnd (e) {
			dragObj.dragDom = null
			this.$emit('dragend', e)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '../../style/varsty.styl'
.wind-drag-item {
}
</style>
