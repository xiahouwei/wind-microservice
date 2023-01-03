import Vue from 'vue'
import expand from './expand'
import { toggleRowStatus, getKeysMap, getRowIdentity, debounce, toggleSubRowStatus } from '../js/utils.js'
import { FIXED_WIDTH_COLUNM } from '../js/config.js'
const selectAllDebounce = debounce()
export default Vue.extend({
	data () {
		return {
			states: {
				rowKey: '',
				trHeight: 0,
				data: [],
				columns: [],
				_columns: [],
				scrollState: 'scroll-left',
				hoverRow: null,
				// {{{ 选择
				isAllSelected: false,
				selection: [],
				subSelectMap: {},
				reserveSelection: false,
				selectOnIndeterminate: false,
				selectable: null,
				radioValue: '',
				// }}}
				// {{{ 固定宽度列
				fixedWidthCol: FIXED_WIDTH_COLUNM,
				/// }}}
				// {{{ 集合数据
				collectionMap: {}
				// }}}
			}
		}
	},

	mixins: [expand],

	methods: {
		assertRowKey () {
			const rowKey = this.states.rowKey
			if (!rowKey) throw new Error('[fxTable] prop row-key is required')
		},
		isSelected (row) {
			const { selection = [] } = this.states
			return selection.indexOf(row) > -1
		},
		isSubSelected (subRow) {
			const { subSelectMap = {} } = this.states
			return subSelectMap[subRow.detailProductId] ? subSelectMap[subRow.detailProductId].indexOf(subRow) > -1 : false
			// return subSelectMap[subRow.detailProductId] ? subSelectMap[subRow.detailProductId].indexOf(subRow) : false
			// const { subSelectMap = {} } = this.states
			// return subSelectMap.indexOf(row) > -1
		},
		isCollectionSelected (child) {
			const { selection = [] } = this.states
			return child.every(item => ~selection.findIndex(select => select.id === item))
		},
		isCollectionIndeterminateSelected (child) {
			const { selection = [] } = this.states
			return !!~selection.findIndex(select => child.includes(select.id)) && !this.isCollectionSelected(child)
		},
		getRadioValue () {
			return this.states.radioValue
		},
		clearSubSelection () {
			this.states.subSelectMap = {}
		},
		clearCurrentSelection (rowId) {
			this.states.subSelectMap[rowId] = []
		},
		clearSelection () {
			const states = this.states
			states.isAllSelected = false
			// states.subSelectMap = {}
			const oldSelection = states.selection
			if (oldSelection.length) {
				states.selection = []
				this.table.$emit('selection-change', [])
			}
			const oldRadio = states.radioValue
			if (oldRadio) {
				states.radioValue = ''
				this.table.$emit('selection-radio-change', [])
			}
		},
		cleanSelection () {
			const states = this.states
			const { data, rowKey, selection } = states
			let deleted
			if (rowKey) {
				deleted = []
				const selectedMap = getKeysMap(selection, rowKey)
				const dataMap = getKeysMap(data, rowKey)
				for (const key in selectedMap) {
					if (Object.prototype.hasOwnProperty.call(selectedMap, key) && !dataMap[key]) {
						deleted.push(selectedMap[key].row)
					}
				}
			} else {
				deleted = selection.filter(item => data.indexOf(item) === -1)
			}
			if (deleted.length) {
				const newSelection = selection.filter(item => deleted.indexOf(item) === -1)
				states.selection = newSelection
				this.table.$emit('selection-change', newSelection.slice())
			}
		},
		updateAllSelected () {
			const states = this.states
			const { selection, rowKey, selectable } = states
			const data = states.data || []
			if (data.length === 0) {
				states.isAllSelected = false
				return
			}
			let selectedMap
			if (rowKey) {
				selectedMap = getKeysMap(selection, rowKey)
			}
			const isSelected = function (row) {
				if (selectedMap) {
					return !!selectedMap[getRowIdentity(row, rowKey)]
				} else {
					return selection.indexOf(row) !== -1
				}
			}
			let isAllSelected = true
			let selectedCount = 0
			for (let i = 0, j = data.length; i < j; i++) {
				const item = data[i]
				const isRowSelectable = selectable && selectable(item, i)
				if (!isSelected(item)) {
					if (!selectable || isRowSelectable) {
						isAllSelected = false
						break
					}
				} else {
					selectedCount++
				}
			}
			if (selectedCount === 0) isAllSelected = false
			states.isAllSelected = isAllSelected
		},
		toggleRowSelection (row, selected, emitChange = true) {
			const changed = toggleRowStatus(this.states.selection, row, selected)
			if (changed) {
				const newSelection = (this.states.selection || []).slice()
				// 调用 API 修改选中值，不触发 select 事件
				if (emitChange) {
					this.table.$emit('select', newSelection, row)
				}
				this.table.$emit('selection-change', newSelection)
			}
		},
		toggleSubRowSelection (subRow, selected, emitChange = true) {
			const changed = toggleSubRowStatus(this.states.subSelectMap, subRow, selected)
			if (changed) {
				const newSelection = this.$fxUtils.deepClone(this.states.subSelectMap || [])
				// 调用 API 修改选中值，不触发 select 事件
				// if (emitChange) {
				// 	this.table.$emit('select', newSelection, subRow)
				// }
				this.table.$emit('subSelect', newSelection, subRow)
			}
		},
		toggleAllSelection () {
			selectAllDebounce(10).then(() => {
				const states = this.states
				const { data = [], selection } = states
				const value = states.selectOnIndeterminate
					? !states.isAllSelected
					: !(states.isAllSelected || selection.length)
				states.isAllSelected = value
				let selectionChanged = false
				data.forEach((row, index) => {
					if (states.selectable) {
						if (states.selectable.call(null, row, index) && toggleRowStatus(selection, row, value)) {
							selectionChanged = true
						}
					} else {
						if (toggleRowStatus(selection, row, value)) {
							selectionChanged = true
						}
					}
				})

				if (selectionChanged) {
					this.table.$emit('selection-change', selection ? selection.slice() : [])
				}
				this.table.$emit('select-all', selection)
			})
		},
		radioSelection (row, emitChange = true) {
			const changed = this.states.radioValue !== row.id
			if (changed) {
				this.states.radioValue = row.id
				if (emitChange) {
					this.table.$emit('select', row.id, row)
				}
				this.table.$emit('selection-change', row.id)
			}
		},
		rowCollectionSelectedChanged (child) {
			return selectAllDebounce(10).then(() => {
				const states = this.states
				const { data = [], selection } = states
				const value = !this.isCollectionSelected(child)
				let selectionChanged = false
				data.forEach((row, index) => {
					if (child.includes(row.id)) {
						if (states.selectable) {
							if (states.selectable.call(null, row, index) && toggleRowStatus(selection, row, value)) {
								selectionChanged = true
							}
						} else {
							if (toggleRowStatus(selection, row, value)) {
								selectionChanged = true
							}
						}
					}
				})
				if (selectionChanged) {
					this.table.$emit('selection-change', selection ? selection.slice() : [])
				}
				this.table.$emit('select-collection', selection)
				return Promise.resolve()
			})
		},
		getRealWidth () {
			if (this.colWidthSum < (this.$refs.table && this.$refs.table.clientWidth)) {
				const tableWidth = this.$refs.table.clientWidth
				const width = parseInt(tableWidth / this.columnArr.length, 10)
				const firstWidth = tableWidth - (width * (this.columnArr.length - 1))
				return [firstWidth, width]
			} else {
				return []
			}
		},
		setExpandRowKeysAdapter (val) {
			this.setExpandRowKeys(val)
		}
	}
})
