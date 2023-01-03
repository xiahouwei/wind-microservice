<template>
    <div :style="style">
			<slot>{{item.textContent}}</slot>
		</div>
</template>
<script>
import { POSITION_X_STEP } from '../Index.vue'
export default {
	name: 'print-props-editer-text',
	props: {
		item: {
			type: Object,
			default () {
				return {}
			}
		}
	},
	computed: {
		style () {
			const alignType = ['left', 'center', 'right']
			return {
				width: `${this.item.width * POSITION_X_STEP}px`,
				textAlign: alignType[this.item.align]
			}
		}
	}
}
</script>
