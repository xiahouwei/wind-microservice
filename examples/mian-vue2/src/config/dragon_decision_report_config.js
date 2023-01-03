import { FX_NODE_ENV } from './env.config'
const slCLoudConfig = {
	release: {
		host: 'https://bi.tcsl.com.cn',
		accessKey: '1bbbab11-4221-4d70-a7f3-9690fac15591'
	},
	production: {
		host: 'http://192.168.40.55:13747',
		accessKey: '1bbbab11-4221-4d70-a7f3-9690fac15591'
	},
	development: {
		host: 'http://192.168.40.55:9451',
		accessKey: '1bbbab11-4221-4d70-a7f3-9690fac15591'
	}
}

export default {
	host: slCLoudConfig[FX_NODE_ENV].host,
	accessKey: slCLoudConfig[FX_NODE_ENV].accessKey
}
