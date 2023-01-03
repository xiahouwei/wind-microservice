<template>
	<w-app-container>
		<fx-page-header title="数据初始化"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<div v-fx-auth:system-setting_data-initialization.initialize-bill class="import-btn-left" @click="onInitializeBill">
				<span class="import-btn-text">初始化单据</span>
			</div>
			<div v-fx-auth:system-setting_data-initialization.initialize-bill-archives class="import-btn-right" @click="onInitializeBillAndArchives">
				<span class="import-btn-text">初始化单据+档案</span>
			</div>
		</w-app-container>
	</w-app-container>
</template>
<script>
export const apiName = 'initialize'
export default {
	name: 'dataInitialization',
	data () {
		return {
		}
	},
	methods: {
		onInitializeBill () {
			this.$fxPrompt('该操作会影响当前系统已有的数据，且操作不可逆，请输入当前企业名称进行再次验证', '提示').then((value) => {
				return this.$fxApi(`${apiName}.check`, value.value).then(() => {
					const logger = this.$fxLogger.createInfo('system-setting.data-initialization.initializeBill')
					return this.$fxApi(`${apiName}.initializeBill`)({ logger })
				})
			}).catch(() => {})
		},
		onInitializeBillAndArchives () {
			this.$fxPrompt('该操作会影响当前系统已有的数据，且操作不可逆，请输入当前企业名称进行再次验证', '提示').then((value) => {
				this.$fxApi(`${apiName}.check`, value.value).then(this.onInitializeBillAndArchivesHanlder).then(() => {
					this.$store.commit('LOGIN_OUT')
					this.$fxConfirm({
						message: '初始化单据+档案成功，请重新登录！',
						option: {
							showCancelButton: false,
							closeOnClickModal: false,
							closeOnPressEscape: false,
							closeOnHashChange: false,
							showClose: false
						}
					}).then(() => {
						this.$fxAppTabs.clear()
						this.$fxRouter.routeLoginPage()
					})
				}).catch(() => {})
			}).catch(() => {})
		},
		onInitializeBillAndArchivesHanlder () {
			const logger = this.$fxLogger.createInfo('system-setting.data-initialization.initializeBillAndArchives')
			return this.$fxApi(`${apiName}.initializeBillAndArchives`)({ logger })
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.fx-page-first-container {
	justify-content space-evenly
	align-items center
	.import-btn-left, .import-btn-right {
		position relative
		height 270px
		width 300px
		cursor pointer
		border-radius 10px
	}
	.import-btn-left {
		background-image url('~images/img/initialize-bill.png')
	}
	.import-btn-right {
		background-image url('~images/img/initialize-bill-and-archives.png')
	}
	.import-btn-text {
		position absolute
		left 35px
		top 25px
		color #fff
		font-size 28px
		font-weight 500
	}
}
</style>
