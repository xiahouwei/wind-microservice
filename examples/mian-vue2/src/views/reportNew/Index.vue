<template>
	<fx-teleport-child to="report">
		<iframe :src="iframeSrc" class="report-iframe"></iframe>
	</fx-teleport-child>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'reportNew',
	data () {
		return {
			iframeSrc: ''
		}
	},
	computed: {
		...mapState({
			userId: state => state.loginer.userId,
			entCode: state => state.loginer.entCode
		})
	},
	created () {
		this.initReport()
	},
	activated () {
		this.$store.commit('SET_APP_CONTAINER_VISIBLE', 'report')
	},
	deactivated () {
		this.$store.commit('SET_APP_CONTAINER_VISIBLE', 'default')
	},
	methods: {
		initReport () {
			this.getReportIframe()
		},
		getReportIframe () {
			this.iframeSrc = this.$fxDragonDecisionReport.getRemote({ userId: this.userId, entCode: this.entCode })
			return this.iframeSrc
		}
	}
}
</script>
<style lang="stylus" scoped>
.report-iframe {
	width: 100%;
	height: 100%;
	border: none;
}
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
<style lang="stylus">
body: {
	position relative !important
}
</style>

