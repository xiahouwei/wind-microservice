<template>
	<div class="fx-list-cell-select-tab" @click="onCellClick">
		<div v-if="!isEdit" class="fx-ellipsis fx-cursor"><slot>{{cellTextComputed}}</slot></div>
		<w-validate v-else ref="validate">
			<w-select-tab
				ref="cell-select"
				v-model="currentInputValue"
				:optionlist="selectOptionList"
				:optionProp="optionProp"
				:disabled="disabled"
				:filterKeys="filterKeys"
				:activeTagKey="activeTagKey"
				:defaultText="cellText"
				class="cell-select-input"
				@blur="onBlur"
				@change="onSelectChange"
				@on-select-enter="onSelectEnter"
				@on-select-click="onSelectClick"
				@keydown.native.tab.prevent="onSelectTab"
			></w-select-tab>
		</w-validate>
	</div>
</template>
<script>
import cellMixin from '@/components/mixins/fxListCell.js'
export default {
	name: 'fx-list-cell-select-tab',
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
		optionProp: {
			type: Object,
			default: () => {
				return {
					tabName: 'name',
					name: 'name',
					disabled: 'disabled',
					visibleFlag: 'visibleFlag'
				}
			}
		},
		disabled: Boolean,
		asyncChange: Function,
		filterKeys: null,
		activeTagKey: String,
		asyncClick: Function
	},
	data () {
		return {
			currentInputValue: ''
		}
	},
	computed: {
		cellTextComputed () {
			if (!this.$fxUtils.isDef(this.cellText)) {
				let select = {}
				for (let i = 0; i < this.selectOptionList.length; i++) {
					const index = this.selectOptionList[i].listData.findIndex(listItem => {
						return `${this.value}` === `${listItem.id}`
					})
					if (~index) {
						select = this.selectOptionList[i].listData[index]
						break
					}
				}
				return select.name
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
			if (typeof this.asyncChange === 'function') {
				this.asyncChange(selectItem, this.row)
			} else {
				this.$emit('input', selectId)
				this.$emit('on-change', selectItem, this.row)
			}
		},
		onSelectEnter (event, selectItem) {
			this.$refs['cell-select'].blur()
			this.$fxUtils.fxDebounce(200).then(() => {
				this.fireEnterEvent(selectItem)
			})
		},
		fireEnterEvent (selectItem) {
			if (typeof this.$listeners['on-select-enter'] === 'function') {
				this.$emit('on-select-enter', this.row, this.rowIndex, selectItem)
			} else {
				this.cellEnter(event)
			}
		},
		onSelectClick (selectId, selectItem) {
			if (typeof this.asyncClick === 'function') {
				this.asyncClick(selectItem, this.row, this.rowIndex).then(() => {
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
.fx-list-cell-select-tab {
	.cell-select-input {
		width: 100%
	}
}
</style>

