<template>
	<div class="fx-list-cell-date" @click="onCellClick">
		<div v-if="!isEdit" class="fx-ellipsis fx-cursor"><slot>{{cellTextComputed}}</slot></div>
		<w-validate v-else ref="validate" placement="bottom">
			<w-date-picker
				ref="date-picker"
				v-model="currentValue"
				type="datetime"
				align="right"
				:value-format="valueFormat"
				:format="format"
				:placeholder="placeholder"
				:disabled="disabled"
				:clearable="clearable"
				:pickerOptions="pickerOptions"
				class="cell-input-date"
				@change="onDateChange"
				@focus="onFocus"
				@blur="onBlur"
			></w-date-picker>
		</w-validate>
		<input ref="location-input" type="text" class="location-input"/>
	</div>
</template>
<script>
import cellMixin from '@/components/mixins/fxListCell.js'
export default {
	name: 'fx-list-cell-date',
	mixins: [cellMixin],
	props: {
		isEdit: Boolean,
		cellText: null,
		value: null,
		stop: Boolean,
		disabled: Boolean,
		clearable: Boolean,
		placeholder: {
			type: String,
			default: '选择日期'
		},
		valueFormat: {
			type: String,
			default: 'yyyy-MM-dd HH:mm'
		},
		format: {
			type: String,
			default: 'yyyy-MM-dd HH:mm'
		},
		pickerOptions: Object
	},
	data () {
		return {
			currentValue: '',
			validateFlag: false,
			validateMessage: '',
			pickerVisible: ''
		}
	},
	computed: {
		cellTextComputed () {
			if (!this.$fxUtils.isDef(this.cellText)) {
				return this.currentValue
			}
			return this.cellText
		}
	},
	created () {
		this.initValidate({
			showValidate: this.showValidate,
			clearValidate: this.clearValidate,
			setFocus: this.focus
		})
	},
	destroyed () {
		this.pickerVisible = ''
		document.body.removeEventListener('keyup', this.handleKeyup)
	},
	watch: {
		value: {
			immediate: true,
			handler (val) {
				this.currentValue = val
			}
		}
	},
	methods: {
		showValidate (message) {
			this.focus()
			setTimeout(() => {
				this.$refs.validate && this.$refs.validate.show(message)
			}, 100)
		},
		clearValidate () {
			this.$refs.validate && this.$refs.validate.clear()
		},
		focus () {
			this.$refs['location-input'].focus()
			setTimeout(() => {
				this.$refs['date-picker'] && this.$refs['date-picker'].focus()
			}, 100)
		},
		onFocus () {
			const pickerVisible = this.$refs['date-picker'].pickerVisible
			if (this.pickerVisible !== pickerVisible && pickerVisible) {
				this.pickerVisible = pickerVisible
				setTimeout(() => {
					document.body.addEventListener('keyup', this.handleKeyup)
				}, 100)
			}
		},
		onBlur () {
			this.$refs.validate.clear()
			const pickerVisible = this.$refs['date-picker'].pickerVisible
			if (this.pickerVisible !== pickerVisible && !pickerVisible) {
				this.pickerVisible = ''
				setTimeout(() => {
					document.body.removeEventListener('keyup', this.handleKeyup)
				}, 300)
			}
		},
		onCellClick () {
			if (this.stop) {
				event.stopPropagation()
			}
			this.$emit('click', this.row, this.rowIndex)
		},
		onInputEnter () {
			this.$refs['date-picker'].handleClose()
			this.$fxUtils.fxDebounce(200).then(() => {
				if (typeof this.$listeners['on-input-enter'] === 'function') {
					this.$emit('on-input-enter', this.row, this.rowIndex)
				} else {
					this.cellEnter(event)
				}
			})
		},
		onDateChange (date) {
			this.$emit('input', this.currentValue)
			this.$emit('on-change', this.currentValue, this.row)
		},
		handleKeyup (event) {
			const keyCode = event.keyCode
			if (keyCode === 13) {
				this.onInputEnter(event)
			} else if (keyCode === 9) {
				this.onDatePickerTab(event)
			}
		},
		onDatePickerTab (event) {
			this.$fxUtils.fxDebounce(200).then(() => {
				if (typeof this.$listeners['on-input-tab'] === 'function') {
					this.$emit('on-input-tab', this.row, this.rowIndex)
				} else {
					this.cellTab(event)
				}
				this.$refs['date-picker'].handleClose()
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.fx-list-cell-date {
	position relative
	.cell-input-date {
		width: 100%
	}
	.location-input {
		position absolute
		top 0
		left 0
		height 0
		width 100%
		border 0
	}
}
</style>

