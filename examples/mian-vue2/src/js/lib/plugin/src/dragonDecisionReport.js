import config from '@/config/dragon_decision_report_config'

export default {
	getRemote ({ userId, entCode }) {
		return `${config.host}/redirectPage?scm8UserId=${userId}&entCode=${entCode}&target=rcReportForm&accessKey=${config.accessKey}&needDeleteNavigation=true&from=scm8`
	}
}
