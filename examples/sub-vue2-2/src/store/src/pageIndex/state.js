import { getLocalStorage } from '../utils'
const pageIndexState = {
	pageIndex: getLocalStorage('pageIndex', '')
}
export default pageIndexState
