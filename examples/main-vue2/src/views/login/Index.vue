<template>
	<div class="supplier-login">
		<div class="supplier-login__right">
			<div>rrrr{{aaa}}</div>
		</div>
		<el-button type="primary" size="medium" class="login-confirm" @click="onIframeClick">iframe</el-button>
		<el-button type="primary" size="medium" class="login-confirm" @click="onSub1Show">显示sub1</el-button>
		<el-button type="text" @click="onDialogOpen">点击打开 Dialog</el-button>
		<el-button type="text" @click="onIframeMountClick">iframe Mount</el-button>
		<el-dialog
			title="提示"
			:visible.sync="dialogVisible"
			width="30%">
			<iframe src="/toolsprint/#/tickDesign"></iframe>
			<!-- <div id="div1">111</div> -->
		</el-dialog>
		<!-- <iframe v-show="showIframe1" ref="iframe" src="/toolsprint/#/tickDesign"></iframe> -->
		<iframe ref="iframe" src="/toolsprint/#/tickDesign"></iframe>
		<iframe src="/testprint/#/print"></iframe>
	</div>
</template>
<script>
import { mapState } from '@wind-microservice/wind-micro-core'
export default {
	name: 'login',
	data () {
		return {
			showIframe1: false,
			dialogVisible: false
		}
	},
	computed: {
		...mapState({
			aaa: 'aaa'
		})
	},
	mounted () {
		setTimeout(() => {
			this.onIframeMountClick()
		}, 1000)
		setTimeout(() => {
			this.onIframeMountClick()
			// this.$refs.iframe.contentWindow.stop()
			console.log(this.$refs.iframe.contentWindow)
			// window.fetch('/toolsprint/src/assets/js/app.js', {
			// 	credentials: 'omit'
			// })
			// window.fetch('/toolsprint/src/assets/js/chunk-vendors.js', {
			// 	credentials: 'omit'
			// })
			// window.fetch('/toolsprint/src/assets/js/systemManage-printSetting.js', {
			// 	credentials: 'omit'
			// })
		}, 1000)
	},
	methods: {
		onIframeClick () {
			this.$printstore.commit('setA')
		},
		onSub1Show () {
			this.showIframe1 = !this.showIframe1
		},
		onDialogOpen () {
			this.dialogVisible = true
			this.$nextTick(() => {
				document.querySelector('#div1').innerHTML = ''
				const iframe = this.$refs.iframe.cloneNode(true)
				// const iframe = this.$refs.iframe
				iframe.style.display = 'block'
				document.querySelector('#div1').appendChild(iframe)
			})
		},
		onIframeMountClick () {
			this.$refs.iframe.contentWindow.$$windMicroMount()
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

