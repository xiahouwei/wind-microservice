import { setStorage } from '../utils'
export function SET_ADDRESS (state, obj) {
	for (const key of Object.keys(obj)) {
		state[key] = obj[key]
		setStorage(key, obj[key])
	}
}
