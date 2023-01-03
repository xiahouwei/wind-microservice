<template>
	<div class="report">
		<iframe :src="iframeSrc" class="report-iframe"></iframe>
	</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'report',
	data () {
		return {
			iframeSrc: ''
		}
	},
	computed: {
		...mapState({
			SLCloudToken: state => state.loginer.SLCloudToken
		})
	},
	created () {
		this.initReport()
	},
	watch: {
		'$route' () {
			this.initReport()
		}
	},
	methods: {
		initReport () {
			if (this.SLCloudToken) {
				this.refreshReportIframe()
			} else {
				this.getReportIframe()
			}
		},
		getReportIframe () {
			return this.$fxApi('foreign.getSLCloudToken')({ data: this.$fxSlCloudReport.getTokenParams() }).then(res => {
				const reportId = this.$route.query.reportId
				this.$store.commit('SET_LOGINER', { SLCloudToken: res })
				this.iframeSrc = `${this.$fxSlCloudReport.getRemote({ token: res, reportId })}&time=${new Date().getTime()}`
			})
		},
		refreshReportIframe () {
			return this.$fxApi('foreign.refreshSLCloudToken')({ data: { token: this.SLCloudToken } }).then(res => {
				const reportId = this.$route.query.reportId
				this.$store.commit('SET_LOGINER', { SLCloudToken: res })
				this.iframeSrc = `${this.$fxSlCloudReport.getRemote({ token: res, reportId })}&time=${new Date().getTime()}`
			}).catch(this.getReportIframe)
		}
	}
}
</script>
<style lang="stylus" scoped>
.report {
	height: 100%;
	width: 100%
	.report-iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
}
</style>

