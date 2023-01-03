<template>
	<div class="supplier-login">
		<div class="supplier-login__left">
			<div class="supplier-login__welcome-img"></div>
		</div>
		<div class="supplier-login__right">
			<div>rrrr{{aaa}}</div>
			<loginForm ref="loginForm" :logining="logining" class="supplier-login__login-form" @on-login="onLogin"></loginForm>
		</div>
		<el-button type="primary" size="medium" class="login-confirm" @click="onIframeClick">iframe</el-button>
		<iframe ref="iframe" src="/toolsprint/#/tickDesign"></iframe>
		<iframe ref="iframe" src="/testprint/#/print"></iframe>
	</div>
</template>
<script>
import loginForm from './components/LoginForm.vue'
import { mapState, mapActions } from 'vuex'
import { createStore, mapStates as printStates } from './store/helper'
export default {
	name: 'login',
	components: {
		loginForm
	},
	data () {
		this.store = createStore(this, {
			aaa: 0
		})
		return {
			logining: false
		}
	},
	computed: {
		...mapState({
			token: state => state.loginer.token
		}),
		...printStates({
			aaa: 'aaa'
		})
	},
	created () {
		window.$$printstore = this.store
	},
	methods: {
		...mapActions(['syncModuleAuth', 'getFilterConfigAction', 'getTenantInfo', 'syncGetProduction', 'syncJSDModuleAuth']),
		onLogin (data) {
			if (this.logining) {
				return false
			}
			this.loginMethod(data)
				.then(this.loginFinishHandler)
				.then(() => {
					this.resetAppMenuHiddenFlag()
					this.getJSDModuleAuth()
					this.logining = false
					this.$router.replace({ path: 'main' })
				}).catch(() => {
					this.logining = false
				})
		},
		loginMethod (data) {
			this.logining = true
			this.$store.commit('SET_LOGINER', {
				token: ''
			})
			return this.loginHandler(data).then(res => {
				this.$store.commit('SET_LOGINER', {
					token: res.token,
					username: data.username
				})
				return Promise.resolve()
			})
		},
		loginHandler (data) {
			if (data.loginType === 'username') {
				return this.$fxApi('auth.login')({ data })
			} else {
				return this.$fxApi('auth.loginByPhone')({ data })
			}
		},
		loginFinishHandler () {
			return Promise.all([this.getCurrentUser(), this.getModuleAuth(), this.getFilterConfig(), this.getTenantInfo(), this.getProductionAuth()])
		},
		getCurrentUser () {
			return this.$store.dispatch('syncLoginer', this.$refs.loginForm.getHostId())
		},
		getModuleAuth () {
			return this.syncModuleAuth()
		},
		getFilterConfig () {
			return this.getFilterConfigAction()
		},
		getProductionAuth () {
			return this.$store.dispatch('syncGetProduction')
		},
		getJSDModuleAuth () {
			return this.syncJSDModuleAuth()
		},
		resetAppMenuHiddenFlag () {
			this.$store.commit('SET_SYSTEM', {
				appMenuHiddenFlag: false
			})
		},
		onIframeClick () {
			console.dir(this.$refs.iframe)
			this.store.commit('setA')
		}
	}
}
</script>
<style lang="stylus" scoped>
.supplier-login {
	display :flex
	flex-direction: row
	height: 100%;
	align-items: center;
	&__left, &__right {
		flex: 1
	}
	&__left {
		text-align: right
	}
	&__right {
		text-align: left
	}
	&__welcome-img {
		display:inline-block;
		background-image: url('~images/img/login-welcome.png')
		background-repeat: no-repeat
		background-position: center
		background-size: contain
		width: 632px
		height: 408px
		margin-right:30px
	}
	&__login-form {
		margin-left:200px
	}
}
</style>

