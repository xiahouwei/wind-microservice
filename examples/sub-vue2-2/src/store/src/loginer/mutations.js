import { setLocalStorage } from '../utils'
export function SET_LOGINER (state, obj) {
	for (const key of Object.keys(obj)) {
		state[key] = obj[key]
		setLocalStorage(key, obj[key])
	}
}
