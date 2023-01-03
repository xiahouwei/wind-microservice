<template>
	<div @click="onCellClick" :class='className'>
		<div v-if="!isEdit" class="fx-ellipsis fx-cursor"><slot>{{cellText}}</slot></div>
		<w-validate v-else class="cell-switch-container" ref="validate">
			<el-button
				v-show="isEdit"
				ref="cell-button"
				:disabled="disabled"
				class="cell-button"
				@click="onClick"
				:type='type'
			>{{this.buttonText}}
			</el-button>
		</w-validate>
	</div>
</template>
<script>
import cellMixin from '@/components/mixins/fxListCell.js'
export default {
	name: 'fx-list-cell-button',
	mixins: [cellMixin],
	props: {
		isEdit: Boolean,
		cellText: null,
		type: {
			type: String,
			default: 'primary'
		},
		stop: Boolean,
		disabled: Boolean,
		buttonText: {
			type: String,
			default: '点击设置'
		},
		className: String
	},
	computed: {
	},
	created () {
		this.initValidate({
			showValidate: this.showValidate,
			clearValidate: this.clearValidate,
			setFocus: this.focus
		})
	},
	watch: {
	},
	methods: {
		onCellClick () {
			if (this.stop) {
				event.stopPropagation()
			}
			this.$emit('click', this.row, this.rowIndex)
		},
		onClick (item) {
			this.$emit('on-click', item, this.row)
		},
		showValidate (message) {
			this.$refs.validate && this.$refs.validate.show(message)
		},
		clearValidate () {
			this.$refs.validate && this.$refs.validate.clear()
		},
		focus () {
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
</style>

