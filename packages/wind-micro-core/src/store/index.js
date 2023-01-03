import Vue from 'vue'
import { mapStates } from './helper'

const Store = Vue.extend({
	data () {
		return {
			states: {
				aaa: 0
			}
		}
	},

	methods: {
		testA () {
			debugger
		}
	}
})


Store.prototype.mutations = {
	setData (states, data) {
		states.data = data
	},
	setA (states) {
		states.aaa++
	}
}

Store.prototype.commit = function (name, ...args) {
	const mutations = this.mutations
	if (mutations[name]) {
		mutations[name].apply(this, [this.states].concat(args))
	} else {
		throw new Error(`Action not found: ${name}`)
	}
}

export function createStore (initialState = {}) {
	const store = new Store()
	Object.keys(initialState).forEach(key => {
		store.states[key] = initialState[key]
	})
	window.$$windMicroStore = store
	return store
}

export { mapStates }
