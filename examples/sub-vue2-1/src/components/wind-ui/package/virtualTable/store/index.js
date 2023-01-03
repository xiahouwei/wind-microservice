import Watcher from './watcher'
import { getSubColumns } from '../js/utils'

Watcher.prototype.mutations = {
	setData (states, data) {
		// const dataInstanceChanged = states._data !== data
		// states._data = data
		states.data = data
	},
	setCollectionMap (states, data) {
		states.collectionMap = data
	},
	setScrollState (states, state) {
		states.scrollState = state
	},
	insertColumn (states, column, index, parent) {
		let array = states._columns
		if (parent) {
			array = parent.childColumn
			if (!array) array = parent.childColumn = []
		}
		if (column.columnConfig.type === 'selection') {
			states.selectable = column.columnConfig.selectable
			states.reserveSelection = column.columnConfig.reserveSelection
		}
		if (typeof index !== 'undefined') {
			array.splice(index, 0, column)
		} else {
			array.push(this)
		}
		states.columns = getSubColumns(states._columns)
	},
	removeColumn (states, column, parent) {
		let array = states._columns
		if (parent) {
			array = parent.childColumn
			if (!array) array = parent.childColumn = []
		}
		if (array) {
			array.splice(array.indexOf(column), 1)
		}
		states.columns = getSubColumns(states._columns)
	},
	rowSelectedChanged (states, row) {
		this.toggleRowSelection(row)
		this.updateAllSelected()
	},
	toggleAllSelection () {
		this.toggleAllSelection()
	},
	rowRadioChanged (states, row) {
		this.radioSelection(row)
	},
	rowCollectionSelectedChanged (states, child) {
		this.rowCollectionSelectedChanged(child).then(() => {
			this.updateAllSelected()
		})
	},
	setHoverRow (states, row) {
		states.hoverRow = row
	},
	rowExpandedChanged (states, row) {
		this.toggleRowExpansion(row)
	},
	rowExpandHoverChange (states, index) {
		this.setRowExpandHover(index)
	}
}

Watcher.prototype.commit = function (name, ...args) {
	const mutations = this.mutations
	if (mutations[name]) {
		mutations[name].apply(this, [this.states].concat(args))
	} else {
		throw new Error(`Action not found: ${name}`)
	}
}

export default Watcher
