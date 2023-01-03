<template>
	<div class="fx-list-cell-select" @click="onCellClick">
		<div v-if="!isEdit" class="fx-ellipsis fx-cursor"><slot>{{cellTextComputed}}</slot></div>
		<w-validate v-else ref="validate">
			<w-select
				ref="cell-select"
				v-model="currentInputValue"
				:optionlist="selectOptionList"
				:optionRender="optionRender"
				:optionProp="selectOptionProp"
				:disabled="disabled"
				:filterKeys="filterKeys"
				:dropdownWidth="dropdownWidth"
				:clearable='clearable'
				:loading="loading"
				:fpSelectShow="fpSelectShow"
				:defaultText="cellText"
				poperClass="cell-select-item-poper"
				class="cell-select-input"
				@blur="onBlur"
				@change="onSelectChange"
				@on-select-enter="onSelectEnter"
				@on-select-click="onSelectClick"
				@visible-change="onVisibleChange"
				@keydown.native.tab.prevent="onSelectTab"
			>
			</w-select>
		</w-validate>
	</div>
</template>
<script>
import cellMixin from '@/components/mixins/fxListCell.js'
export default {
	name: 'fx-list-cell-select',
	mixins: [cellMixin],
	props: {
		isEdit: Boolean,
		cellText: null,
		value: null,
		stop: Boolean,
		optionRender: Function,
		clearable: Boolean,
		loading: Boolean,
		fpSelectShow: Function,
		filterKeys: Array,
		selectOptionList: {
			type: Array,
			default: () => {
				return []
			}
		},
		selectOptionProp: {
			type: Object,
			default: () => {
				return {
					name: 'name',
					disabled: 'disabled',
					visibleFlag: 'visibleFlag'
				}
			}
		},
		disabled: Boolean,
		asyncChange: Function,
		dropdownWidth: null,
		asyncClick: Function
	},
	data () {
		return {
			currentInputValue: '',
			emitEnterOnce: false
		}
	},
	computed: {
		cellTextComputed () {
			if (!this.$fxUtils.isDef(this.cellText)) {
				const selectItem = this.selectOptionList.find(item => {
					return `${this.value}` === `${item.id}`
				}) || {}
				return selectItem[this.selectOptionProp.name]
			}
			return this.cellText
		}
	},
	created () {
		this.initValidate({
			showValidate: this.showValidate,
			clearValidate: this.clearValidate,
			setFocus: this.focus,
			setBlur: this.blur
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
			this.$refs['cell-select'] && this.$refs['cell-select'].focus()
		},
		blur () {
			this.$refs['cell-select'] && this.$refs['cell-select'].blur()
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
		onSelectChange (selectId, selectItem) {
			if (this.$fxUtils.isEnterCode(event.code)) {
				this.emitEnterOnce = true
				if (typeof this.asyncChange === 'function') {
					this.asyncChange(selectItem, this.row).then(() => {
						this.fireEnterEvent(selectItem)
					})
				} else {
					this.$emit('input', selectId)
					this.$emit('on-change', selectItem, this.row)
					this.fireEnterEvent(selectItem)
				}
			} else {
				if (typeof this.asyncChange === 'function') {
					this.asyncChange(selectItem, this.row)
				} else {
					this.$emit('input', selectId)
					this.$emit('on-change', selectItem, this.row)
				}
			}
		},
		onSelectEnter (event, selectItem) {
			if (this.$fxLoading.fxIsLoading || this.emitEnterOnce) {
				this.emitEnterOnce = false
				return false
			}
			this.$refs['cell-select'].blur()
			this.$fxUtils.fxDebounce(200).then(() => {
				this.fireEnterEvent(selectItem, true)
			})
		},
		fireEnterEvent (selectItem, unchangedFlag) {
			if (typeof this.$listeners['on-select-enter'] === 'function') {
				this.$emit('on-select-enter', this.row, this.rowIndex, selectItem, unchangedFlag)
			} else {
				this.cellEnter(event)
			}
		},
		onVisibleChange (visible) {
			this.$emit('on-visible-change', visible)
		},
		onSelectClick (selectId, selectItem, unchangedFlag) {
			if (typeof this.asyncClick === 'function') {
				this.asyncClick(selectItem, this.row, this.rowIndex, unchangedFlag).then(() => {
					this.cellSelected(event)
				})
			} else {
				this.cellSelected(event)
			}
		},
		onSelectTab (e) {
			this.$fxUtils.fxDebounce(200).then(() => {
				if (typeof this.$listeners['on-select-tab'] === 'function') {
					this.$emit('on-select-tab', this.row, this.rowIndex)
				} else {
					this.cellTab(e)
				}
				this.$refs['cell-select'].handleClose()
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.fx-list-cell-select {
	.cell-select-input {
		width: 100%
	}
}
</style>

