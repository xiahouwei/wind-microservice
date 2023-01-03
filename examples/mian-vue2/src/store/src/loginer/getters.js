import typeMiddleware from '@/js/typeMiddleware'
const adminType = typeMiddleware.getCommonTypeItemById('userType')('adminUser')
export default {
	isProductionPro: (state) => () => {
		return state.productionVersion === 'pro'
	},
	isAdminUrser: state => {
		return state.username === adminType.username
	}
}
