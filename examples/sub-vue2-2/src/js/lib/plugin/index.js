import promisePro from './src/promisePro'
import eventBus from './src/eventBus'
import stylusDynamic from './src/stylusDynamic'
export { eventBus as $fxEventBus }
export { createEventBus as $fxCreateEventBus } from './src/eventBus'
export { go as $fxGo, goBlank as $fxGoBlank, goToBillBlank as $fxGoToBillBlank, goPrint as $fxGoPrint } from './src/router'
export { stylusDynamic as $fxStylusDynamic }
export default () => {
	promisePro()
}
