let fxNodeEnv = 'production'
let fxSendSRM = false
if (process.env.NODE_ENV === 'release') {
	fxNodeEnv = 'release'
	fxSendSRM = true
} else if (['production', 'test'].includes(process.env.NODE_ENV)) {
	fxNodeEnv = 'production'
	fxSendSRM = true
} else {
	fxNodeEnv = 'development'
	fxSendSRM = true
}

export const FX_NODE_ENV = fxNodeEnv

export const isRelease = function () {
	return FX_NODE_ENV === 'release'
}
export const isDevelopment = function () {
	return FX_NODE_ENV === 'development'
}
export const isProducton = function () {
	return FX_NODE_ENV === 'production'
}

export const isSendSrm = function () {
	return fxSendSRM
}

