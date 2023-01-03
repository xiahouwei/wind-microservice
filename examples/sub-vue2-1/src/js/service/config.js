export const requestConfig = {
	// 自定义的请求头
	headers: {
		post: {
			'Content-Type': 'application/json'
		}
	},
	timeout: 60000,
	withCredentials: false
}
export const requestFileConfig = {
	headers: {
		post: {
			'Content-Type': 'multipart/form-data'
		}
	},
	timeout: 60000,
	withCredentials: false
}
export const requestFileConfigFun = (config) => {
	return {
		headers: {
			post: {
				'Content-Type': 'multipart/form-data'
			},
			...config.headers
		},
		baseURL: config.baseURL,
		timeout: config.timeout || 60000,
		withCredentials: false
	}
}
export const requestConfigFun = (config) => {
	return {
		headers: config.headers,
		baseURL: config.baseURL,
		timeout: config.timeout || 60000,
		withCredentials: false
	}
}
