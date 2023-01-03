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
import { mapStates } from '@wind-microservice/wind-micro-core'
export default {
	name: 'login',
	data () {
		return {
		}
	},
	computed: {
		...mapStates({
			aaa: 'aaa'
		})
	},
	methods: {
		onIframeClick () {
			this.$printstore.commit('setA')
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
}
</style>

