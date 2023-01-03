<template>
	<div class="redictPage-body">
		页面加载中,请稍等...
	</div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
	name: 'redictPage',
	data () {
		return {
			routerPath: '',
			app: '',
			token: ''
		}
	},
	created () {
		this.hideMenu()
		this.initPageQuery()
		this.loginMethod()
	},
	methods: {
		...mapActions(['syncModuleAuth', 'getFilterConfigAction', 'getTenantInfo']),
		initPageQuery () {
			const { token = '', routerPath = '/main/home', app = '', query } = this.$route.query
			this.routerPath = routerPath
			this.app = app
			this.token = token
			if (query) {
				this.pathQuery = this.$fxUtils.JSONparse(query) || {}
			}
		},
		hideMenu () {
			this.$store.commit('SET_SYSTEM', {
				appMenuHiddenFlag: true
			})
		},
		getHostId () {
			if (this.$route.query.hostId) {
				return this.$route.query.hostId
			}
			return this.$fxRouter.getLastDomain()
		},
		loginMethod () {
			this.$store.commit('SET_LOGINER', {
				token: this.token
			})
			return this.syncLoginerHandler().then(() => {
				if (/biubiuorder/.test(this.routerPath)) {
					this.$fxAppTabs.tabsPush({
						path: this.routerPath,
						query: { ...this.pathQuery, t: Date.now() }
					})
				} else if (/reportNew/.test(this.routerPath)) {
					this.$fxAppTabs.tabsPush({
						path: '/main/reportNew'
					})
				} else if (/report/.test(this.routerPath)) {
					this.$fxAppTabs.tabsPush({
						path: this.routerPath,
						query: { ...this.pathQuery, t: Date.now() }
					})
				} else {
					this.$fxAppTabs.tabsPush(this.routerPath)
				}
			})
		},
		syncLoginerHandler () {
			return Promise.all([this.getCurrentUser(), this.syncModuleAuth(), this.getFilterConfigAction(), this.getTenantInfo()])
		},
		getCurrentUser () {
			return this.$store.dispatch('syncLoginer', this.getHostId())
		}
	}
}

</script>
<style lang="stylus" scoped>
.redictPage-body{
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size:30px
}
</style>
