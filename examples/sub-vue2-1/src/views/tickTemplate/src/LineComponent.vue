<template>
	<div :style="style" class="print-template__line">
	</div>
</template>
<script>
import { POSITION_X_STEP } from '../Index.vue'
export default {
	name: 'print-props-editer-line',
	props: {
		item: {
			type: Object,
			default: () => {}
		}
	},
	computed: {
		style () {
			return {
				width: `${this.item.width * POSITION_X_STEP}px`
			}
		}
	}
}
</script>
<style scoped lang="stylus">
.print-template__line {
	display: inline-block
	height: 7px;
    border-bottom: 1px dashed #666666;
}
</style>
