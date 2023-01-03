import PERMISSIONS from './permissions/index.js'
export default {
	authority: {
		id: 'authority',
		label: '权限',
		code: '0009_0001',
		child: {
			...PERMISSIONS
		}
	}
}
