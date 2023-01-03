import Vue from 'vue'
import utils from './js/lib/utils'
import common from './js/common'
declare module 'vue/types/vue' {
    interface Vue {
        $fxUtils: typeof utils,
        $fxCommon: typeof common,
        
    }
}
export { }