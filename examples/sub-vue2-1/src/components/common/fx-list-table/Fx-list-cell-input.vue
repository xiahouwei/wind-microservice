<template>
	<div class="fx-list-cell-input" @click="onCellClick">
		<div v-if="!isEdit" class="fx-ellipsis fx-cursor"><slot>{{cellTextComputed}}</slot></div>
		<w-validate v-else ref="validate">
			<w-input
				ref="w-input"
				v-model="currentInputValue"
				:maxlength="maxlength"
				:regType="regType"
				:placeholder="placeholder"
				:disabled="disabled"
				:prefix-icon="prefixIcon"
				:suffix-icon='suffixIcon'
				class="form-item-input"
				@keyup.enter.native="onInputEnter"
				@keyup.up.native.prevent="onInputUp"
				@keyup.down.native.prevent="onInputDown"
				@keydown.tab.native.prevent="onInputTab"
				@change="onInputChange"
				@blur="onBlur"
			>
				<slot></slot>
				<slot name="suffix"></slot>
			</w-input>
		</w-validate>
	</div>
</template>
<script>
import cellMixin from '@/components/mixins/fxListCell.js'
export default {
	name: 'fx-list-cell-input',
	mixins: [cellMixin],
	props: {
		isEdit: Boolean,
		cellText: null,
		value: null,
		stop: Boolean,
		disabled: Boolean,
		maxlength: Number,
		regType: String,
		placeholder: {
			type: String,
			default: '请输入'
		},
		prefixIcon: null,
		suffixIcon: null
	},
	data () {
		return {
			currentInputValue: '',
			validateFlag: false,
			validateMessage: ''
		}
	},
	computed: {
		cellTextComputed () {
			if (!this.$fxUtils.isDef(this.cellText)) {
				return this.currentInputValue
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
	watch: {
		value: {
			immediate: true,
			handler (val) {
				this.currentInputValue = val
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
			this.$refs['w-input'] && this.$refs['w-input'].focus()
		},
		onBlur () {
			this.$refs.validate.clear()
		},
		onCellClick () {
			if (this.stop) {
				event.stopPropagation()
			}
			this.$emit('click', this.row, this.rowIndex)
		},
		onInputEnter () {
			if (this.$fxLoading.fxIsLoading) return false
			this.$fxUtils.fxDebounce(200).then(() => {
				if (typeof this.$listeners['on-input-enter'] === 'function') {
					this.$emit('on-input-enter', this.row, this.rowIndex)
				} else {
					this.cellEnter(event)
				}
			})
		},
		onInputChange () {
			this.$emit('input', this.currentInputValue)
			this.$emit('on-change', this.currentInputValue, this.row)
		},
		onInputUp () {
			this.$fxUtils.fxDebounce(300).then(() => {
				if (typeof this.$listeners['on-input-up'] === 'function') {
					this.$emit('on-input-up', this.row, this.rowIndex)
				} else {
					this.cellUp(event)
				}
			})
		},
		onInputDown () {
			this.$fxUtils.fxDebounce(300).then(() => {
				if (typeof this.$listeners['on-input-down'] === 'function') {
					this.$emit('on-input-down', this.row, this.rowIndex)
				} else {
					this.cellDown(event)
				}
			})
		},
		onInputTab (e) {
			this.$fxUtils.fxDebounce(200).then(() => {
				if (typeof this.$listeners['on-input-tab'] === 'function') {
					this.$emit('on-input-tab', this.row, this.rowIndex)
				} else {
					this.cellTab(e)
				}
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.fx-list-cell-input {
	display: flex;
	flex-direction: row;
	align-items: center;
	.form-item-input {
		width: 150px
		box-sizing: border-box
	}
}
</style>
