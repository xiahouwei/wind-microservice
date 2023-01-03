import { setLocalStorage } from '../utils'
export function SET_PAGE_INDEX (state, pageIndex) {
	state.pageIndex = pageIndex
	setLocalStorage('pageIndex', pageIndex)
}
