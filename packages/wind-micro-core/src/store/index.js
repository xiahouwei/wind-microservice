import Vue from 'vue'
import { mapState } from './helper'

class Store {
	constructor (options) {
		this.vm = new Vue({
			data: {
				state: options.state
			}
		})
		const getters = options.getter || {}
		this.getters = {}
		Object.keys(getters).forEach(getterName => {
			Object.defineProperty(this.getters, getterName, {
				get: () => {
					return getters[getterName](this.state)
				}
			})
		})
		const mutations = options.mutations || {}
		this.mutations = {}
		Object.keys(mutations).forEach(mutationName => {
			this.mutations[mutationName] = (arg) => {
				mutations[mutationName](this.state, arg)
			}
		})
	}

	get state () {
		return this.vm.state
	}

	commit = (name, ...args) => {
		const mutations = this.mutations
		if (mutations[name]) {
			mutations[name].apply(this, [this.states].concat(args))
		} else {
			throw new Error(`Action not found: ${name}`)
		}
	}
}

export function createStore (initialState = {}) {
	const store = new Store(initialState)
	window.$$windMicroStore = store
	return store
}

export function createSubStore () {
	return createStore(window.parent.$$windMicroStore)
}

export { mapState }
