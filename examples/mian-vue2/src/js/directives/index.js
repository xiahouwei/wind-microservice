import fxAuth from './fx-auth'
import fxEnter from './fx-enter'
import fxTab from './fx-tab'
const directives = {
	'fx-auth': fxAuth,
	'fx-enter': fxEnter,
	'fx-tab': fxTab
}
export default function fxDirectives (vm) {
	Object.keys(directives).forEach(key => {
		vm.directive(key, directives[key])
	})
}
