<template>
	<div class="production-manage">
		<iframe :src="iframeSrc" class="production-manage-iframe" name="mes"></iframe>
	</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'production-manage',
	data () {
		return {
			iframeSrc: ''
		}
	},
	computed: {
		...mapState({
			token: state => state.loginer.token
		})
	},
	created () {
		const billId = this.$route.query.id || ''
		this.$fxRouter.clearAppointRouterQuery('id')
		this.iframeSrc = this.$fxProductionManage.getRemote({ token: this.token, router: this.$route.query.router, billId })
	}
}
</script>
<style lang="stylus" scoped>
.production-manage {
	height: 100%;
	width: 100%
	.production-manage-iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
}
</style>

