<template>
	<w-app-container>
		<fx-page-header title="账户设置"></fx-page-header>
		<w-app-container direction="column" class="fx-page-first-container">
			<div class="account-binding">
				<div class="account-binding_wx-binding">
					<div class="account-binding_wx-binding-title">以下是您的第三方绑定账号信息，您在登录时，可以使用下面账号直接登录小程序</div>
					<div class="account-binding_wx-binding-content">
						<img src="~images/img/wx-logo.png" class="wx-logo">
						<div v-if="!bindedWechat" class="binding-info">
							<div class="binding-info__title">暂未绑定</div>
							<div>绑定时间：暂无</div>
						</div>
						<div v-else class="binding-info">
							<div class="binding-info__title">{{userInfo.weChatName}}</div>
							<div>绑定时间：{{userInfo.createDate}}</div>
						</div>
						<el-button v-if="!bindedWechat"  type="primary" class="binding-btn" @click="onBindClick">绑定</el-button>
						<el-button v-if="bindedWechat"  type="primary" class="binding-btn" @click="onUnbindClick">解绑</el-button>
					</div>
					<div v-if="isAdminUrser" class="account-binding_wx-binding-content">
						<img src="~images/img/wx-mini-logo.png" class="wx-logo">
						<div class="binding-info">
							<div class="binding-info__title">小程序二维码</div>
							<div class="wx-mini-bind-warning">注意：该二维码中包含当前餐饮企业供应链地址信息,请勿转发至非企业内部人员!</div>
						</div>
						<el-button type="primary" class="binding-btn" @click="onWxMiniBindClick">点击生成</el-button>
					</div>
				</div>
			</div>
			<qrCodeDailog ref="qrCodeDailog" @on-close="doWxBindingEnd"></qrCodeDailog>
			<miniQrCodeDailog v-model="miniQrCodeDialogVisible" :imgUrl="miniQrCodeImgUrl"></miniQrCodeDailog>
		</w-app-container>
	</w-app-container>
</template>
<script>
import qrCodeDailog from './components/QrCodeDailog.vue'
import miniQrCodeDailog from './components/MiniQrCodeDailog.vue'
import { mapState, mapGetters } from 'vuex'
export default {
	name: 'accountBinding',
	components: {
		qrCodeDailog,
		miniQrCodeDailog
	},
	data () {
		return {
			userInfo: {},
			wxBindingPolling: this.$fxUtils.polling(),
			wxBindingEndFunc: null,
			miniQrCodeImgUrl: '',
			miniQrCodeDialogVisible: false
		}
	},
	computed: {
		...mapState({
			token: state => state.loginer.token,
			entCode: state => state.loginer.entCode
		}),
		...mapGetters(['isAdminUrser']),
		bindedWechat () {
			return !!this.userInfo.openId
		}
	},
	created () {
		this.getWechatInfo()
	},
	methods: {
		onBindClick () {
			const qrSource = JSON.stringify({
				...this.userInfo,
				token: this.token
			})
			this.$refs.qrCodeDailog.open(qrSource).then(this.pollingWxBinding)
		},
		pollingWxBinding () {
			this.wxBindingPolling.start(5000, (next, end) => {
				this.wxBindingEndFunc = end
				this.getWechatInfo(false).then(() => {
					if (!this.bindedWechat) {
						next()
					} else {
						this.doWxBindingEnd()
						this.$refs.qrCodeDailog.close()
						this.$fxMessage.success('绑定微信成功!')
					}
				})
			})
		},
		getWechatInfo (loading) {
			return this.$fxApi('auth.getWechatInfo', loading).then(res => {
				this.userInfo = res
				return Promise.resolve()
			})
		},
		onUnbindClick () {
			this.$fxConfirm('是否确定解除微信绑定？').then(() => {
				this.$fxApi('auth.unbindWechat').then(this.getWechatInfo)
			})
		},
		doWxBindingEnd () {
			if (this.wxBindingEndFunc) {
				this.wxBindingEndFunc()
				this.wxBindingEndFunc = null
			}
		},
		onWxMiniBindClick () {
			this.$fxApi('auth.getWxMiniQRCode', this.entCode).then(res => {
				this.miniQrCodeImgUrl = window.URL.createObjectURL(res)
				this.miniQrCodeDialogVisible = true
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.account-binding{
	&_wx-binding {
		padding-left: 20px
		&-title{
			height: 40px
			line-height: 40px
		}
		&-content {
			height: 100px
			width: 800px
			display: flex
			flex-direction: row
			align-items: center
			border: 1px solid #ccc
			border-radius: 4px
			margin-bottom: 10px
			.wx-logo {
				width: 50px
				height: 50px
				margin-left: 20px
				margin-right: 20px
			}
			.binding-info {
				flex: 1
				&__title {
					font-size: 16px
					font-weight: bold
				}
				.wx-mini-bind-warning {
					color:$fxRed
				}
			}
			.binding-btn {
				width: 100px
				height: 30px
				margin-right: 20px
			}
		}
	}
}
</style>

