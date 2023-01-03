import { scrollbarWidth } from '../js/utils.js'
class TableLayout {
	constructor (options) {
		this.observers = []
		this.table = null
		this.columns = null
		this.store = null
		this.gutterWidth = scrollbarWidth()
		for (const name in options) {
			if (Object.prototype.hasOwnProperty.call(options, name)) {
				this[name] = options[name]
			}
		}
		if (!this.table) {
			throw new Error('table is required for Table Layout')
		}
		if (!this.store) {
			throw new Error('store is required for Table Layout')
		}
	}

	addObserver (observer) {
		this.observers.push(observer)
	}

	removeObserver (observer) {
		const index = this.observers.indexOf(observer)
		if (~index) {
			this.observers.splice(index, 1)
		}
	}

	notifyObservers (event) {
		this.observers.forEach((observer) => {
			switch (event) {
			case 'columns':
				observer.onColumnsChange(this)
				break
			case 'scrollable':
				observer.onScrollableChange(this)
				break
			default:
				throw new Error(`Table Layout don't have event ${event}.`)
			}
		})
	}

	updateScrollY () {
	}

	setHeight () {
	}

	setMaxHeight () {
	}

	getFlattenColumns () {
	}

	updateElsHeight () {
	}

	headerDisplayNone () {
	}

	updateColumnsWidth () {
	}
}

export default TableLayout
