import fxHistoryBack from './fx-history-back'
const directives = {
	'fx-history-back': fxHistoryBack
}
export default function fxDirectives (vm) {
	Object.keys(directives).forEach(key => {
		vm.directive(key, directives[key])
	})
}
