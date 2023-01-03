export default {
	props: {
		row: {
			type: Object,
			default: () => {
				return {}
			}
		},
		rowIndex: Number,
		columnProp: String
	},
	inject: ['tableEventBus'],
	data () {
		return {
			isInExpandCell: false
		}
	},
	created () {
		this.isInExpandCell = !!this.$fxUtils.vFindParentByName(this, 'fx-list-extend-cell')
	},
	methods: {
		initValidate (config) {
			this.tableEventBus.initEvent(this, '$fx-table-row-validate', this.onTableRowValidate(config.showValidate, config.clearValidate))
			this.tableEventBus.initEvent(this, '$fx-table-collection-validate', this.onTableCollectionValidate(config.showValidate, config.clearValidate))
			this.tableEventBus.initEvent(this, '$fx-list-cell-setfocus', this.setCellFocus(config.setFocus))
			this.tableEventBus.initEvent(this, '$fx-list-cell-setBlur', this.setCellBlur(config.setBlur))
		},
		onTableRowValidate (showValidate, clearValidate) {
			return (item) => {
				if (!item) {
					return false
				}
				if (this.rowIndex === item.index && this.columnProp === item.columnProp) {
					const parentTd = this.$fxUtils.findParentElement(this.$el, 'TD')
					if (!parentTd || !parentTd.classList.contains('tbody-td') || parentTd.classList.contains('is-hidden')) {
						return false
					}
					if (item.type === 'error') {
						showValidate(item.message)
					} else {
						clearValidate()
					}
				}
			}
		},
		onTableCollectionValidate (showValidate, clearValidate) {
			return (item) => {
				if (!item) {
					return false
				}
				if (this.rowIndex === item.index && this.columnProp === item.columnProp) {
					const parentTd = this.$fxUtils.findParentElement(this.$el, 'TD')
					if (!parentTd || !parentTd.classList.contains('collection-td')) {
						return false
					}
					if (item.type === 'error') {
						showValidate(item.message)
					} else {
						clearValidate()
					}
				}
			}
		},
		setCellFocus (setFocus) {
			return (item) => {
				if (!item) {
					return false
				}
				if (this.rowIndex === item.index && this.columnProp === item.columnProp) {
					setFocus()
				}
			}
		},
		setCellBlur (setBlur) {
			return (item) => {
				if (setBlur) {
					setBlur()
				}
			}
		},
		cellSelected (event) {
			const cellEvent = {
				columnProp: this.columnProp,
				row: this.row,
				index: this.rowIndex,
				isInExpandCell: this.isInExpandCell,
				event
			}
			this.tableEventBus.$emit('$fx-list-cell-selected', cellEvent)
		},
		cellEnter (event) {
			const cellEvent = {
				columnProp: this.columnProp,
				row: this.row,
				index: this.rowIndex,
				isInExpandCell: this.isInExpandCell,
				event
			}
			this.tableEventBus.$emit('$fx-list-cell-enter', cellEvent)
		},
		cellUp (event) {
			const cellEvent = {
				columnProp: this.columnProp,
				row: this.row,
				index: this.rowIndex,
				event
			}
			this.tableEventBus.$emit('$fx-list-cell-up', cellEvent)
		},
		cellDown (event) {
			const cellEvent = {
				columnProp: this.columnProp,
				row: this.row,
				index: this.rowIndex,
				event
			}
			this.tableEventBus.$emit('$fx-list-cell-down', cellEvent)
		},
		cellTab (event) {
			const cellEvent = {
				columnProp: this.columnProp,
				row: this.row,
				index: this.rowIndex,
				isInExpandCell: this.isInExpandCell,
				event
			}
			this.tableEventBus.$emit('$fx-list-cell-tab', cellEvent)
		}
	}
}
