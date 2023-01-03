const IS_PROD = ['production', 'test'].includes(process.env.NODE_ENV)
const baseUrl = ''
export const devUrl = IS_PROD ? '' : 'fxApi'
export default baseUrl
