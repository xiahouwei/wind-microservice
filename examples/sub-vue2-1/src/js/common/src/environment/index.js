export const getEnvironmentVariable = (key) => {
	return process.env[key] || ''
}
export default {
	getEnvironmentVariable
}
