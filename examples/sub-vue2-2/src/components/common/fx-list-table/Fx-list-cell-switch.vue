<template>
	<div class="fx-list-cell-switch" @click="onCellClick">
		<div v-if="!isEdit" class="fx-ellipsis fx-cursor"><slot>{{cellTextComputed}}</slot></div>
		<div v-else class="cell-switch-container">
			<w-switch
				ref="cell-switch"
				v-model="currentInputValue"
				:active-value="activeValue"
				:inactive-value="inactiveValue"
				:active-text="activeText"
				:inactive-text="inactiveText"
				:disabled="disabled"
				:width="width"
				class="cell-switch"
				@change="onSwitchChange"
			>
			</w-switch>
		</div>
	</div>
</template>
<script>
export default {
	name: 'fx-list-cell-switch',
	props: {
		isEdit: Boolean,
		value: null,
		row: {
			type: Object,
			default: () => {
				return {}
			}
		},
		rowIndex: Number,
		stop: Boolean,
		disabled: Boolean,
		activeText: String,
		inactiveText: String,
		cellText: null,
		activeValue: {
			type: [String, Number, Boolean],
			default: 1
		},
		inactiveValue: {
			type: [String, Number, Boolean],
			default: 0
		},
		width: {
			type: Number,
			default: 70
		}
	},
	data () {
		return {
			currentInputValue: ''
		}
	},
	computed: {
		cellTextOrigin () {
			if (this.value === this.activeValue) {
				return this.activeText
			} else {
				return this.inactiveText
			}
		},
		cellTextComputed () {
			if (!this.$fxUtils.isDef(this.cellText)) {
				return this.cellTextOrigin
			}
			return this.cellText
		}
	},
	watch: {
		value: {
			immediate: true,
			handler (val) {
				this.currentInputValue = val
			}
		}
	},
	methods: {
		focus () {
			this.$refs['cell-switch'] && this.$refs['cell-switch'].focus()
		},
		onCellClick () {
			if (this.stop) {
				event.stopPropagation()
			}
			this.$emit('click', this.row, this.rowIndex)
		},
		onSwitchChange (item) {
			this.$emit('input', item)
			this.$emit('on-change', item, this.row)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.fx-list-cell-switch {
	.cell-switch-container {
		.cell-switch-text {
			margin-right: 10px
		}
	}
}
</style>

