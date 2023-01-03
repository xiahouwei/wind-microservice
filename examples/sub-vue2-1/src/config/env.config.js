let fxNodeEnv = 'production'
if (process.env.NODE_ENV === 'release') {
	fxNodeEnv = 'release'
} else if (['production', 'test'].includes(process.env.NODE_ENV)) {
	fxNodeEnv = 'production'
} else {
	fxNodeEnv = 'development'
}

export const FX_NODE_ENV = fxNodeEnv
