<template>
	<div class="fx-list-cell-select-mulity" @click="onCellClick">
		<div v-if="!isEdit" class="fx-ellipsis fx-cursor"><slot>{{cellTextComputed}}</slot></div>
		<w-validate v-else ref="validate">
			<w-select-mulity
				ref="cell-select-mulity"
				v-model="currentInputValue"
				:optionlist="selectOptionList"
				:optionProp="selectOptionProp"
				:disabled="disabled"
				:showEmpty="false"
				:dropdownWidth="dropdownWidth"
				class="cell-select-mulity-input"
				@blur="onBlur"
				@change="onSelectChange"
				@on-select-enter="onSelectEnter"
			>
			</w-select-mulity>
		</w-validate>
	</div>
</template>
<script>
import cellMixin from '@/components/mixins/fxListCell.js'
export default {
	name: 'fx-list-cell-select-mulity',
	mixins: [cellMixin],
	props: {
		isEdit: Boolean,
		cellText: null,
		value: null,
		stop: Boolean,
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
		dropdownWidth: String
	},
	data () {
		return {
			currentInputValue: []
		}
	},
	computed: {
		cellTextComputed () {
			if (!this.$fxUtils.isDef(this.cellText)) {
				const selectItem = this.selectOptionList.filter(item => {
					return this.value.includes(item.id)
				}) || []
				return selectItem.map(item => item[this.selectOptionProp.name]).join(',')
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
		},
		isEdit (val) {
			if (val) {
				this.$nextTick(() => {
					this.bindWSelectMulityPopperTabEvent()
				})
			}
		}
	},
	methods: {
		bindWSelectMulityPopperTabEvent () {
			const popperEl = this.$refs['cell-select-mulity'].$refs.popper.$refs.popper
			popperEl.addEventListener('keydown', this.onWSelectMulityHanlder)
		},
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
			this.$refs['cell-select-mulity'] && this.$refs['cell-select-mulity'].focus()
		},
		blur () {
			this.$refs['cell-select-mulity'] && this.$refs['cell-select-mulity'].blur()
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
		onSelectChange (selectIds) {
			if (typeof this.asyncChange === 'function') {
				this.asyncChange(selectIds, this.row)
			} else {
				const	item = this.selectOptionList.filter(i => {
					return selectIds.includes(i.id)
				})
				this.$emit('input', selectIds)
				this.$emit('on-change', item, this.row)
			}
		},
		onSelectEnter (event) {
			this.$fxUtils.fxDebounce(200).then(() => {
				if (typeof this.$listeners['on-select-enter'] === 'function') {
					this.$emit('on-select-enter', this.row, this.rowIndex)
				} else {
					this.cellEnter(event)
				}
			})
		},
		onWSelectMulityHanlder (e) {
			e.preventDefault()
			if (e.code === 'Tab') {
				this.$fxUtils.fxDebounce(200).then(() => {
					if (typeof this.$listeners['on-select-tab'] === 'function') {
						this.$emit('on-select-tab', this.row, this.rowIndex)
					} else {
						this.cellTab(e)
					}
					this.$refs['cell-select-mulity'].handleClose()
				})
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.fx-list-cell-select-mulity {
	.cell-select-mulity-input {
		width: 100%
	}
}
</style>

