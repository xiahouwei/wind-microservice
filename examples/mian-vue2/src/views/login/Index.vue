<template>
	<div class="supplier-login">
		<div class="supplier-login__right">
			<div>rrrr{{aaa}}</div>
		</div>
		<el-button type="primary" size="medium" class="login-confirm" @click="onIframeClick">iframe</el-button>
		<iframe ref="iframe" src="/toolsprint/#/tickDesign"></iframe>
		<iframe ref="iframe" src="/testprint/#/print"></iframe>
	</div>
</template>
<script>
import { createStore, mapStates as printStates } from './store/helper'
export default {
	name: 'login',
	data () {
		this.store = createStore(this, {
			aaa: 0
		})
		return {
		}
	},
	computed: {
		...printStates({
			aaa: 'aaa'
		})
	},
	created () {
		window.$$printstore = this.store
	},
	methods: {
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

