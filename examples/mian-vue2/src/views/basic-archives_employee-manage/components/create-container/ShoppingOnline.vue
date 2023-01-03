<template>
	<w-collapse v-model="collapseVisible" title="线上商城">
		<el-form size="mini" label-width="100px" inline>
			<fx-details-form-row>
				<el-form-item required label="员工类型：">
					<el-radio-group v-model="organDetails.employeeType" :disabled="disabled">
						<el-radio :label="0">内控</el-radio>
						<el-radio :label="1">业务</el-radio>
					</el-radio-group>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row class="detials-form-row-height">
				<el-form-item required label="自动打印：">
					<el-radio-group v-model="organDetails.autoPrint" :disabled="disabled">
						<el-radio :label="0">停用</el-radio>
						<el-radio :label="1">启用</el-radio>
					</el-radio-group>
					<w-select
						ref="autoPrintSelect"
						v-show="organDetails.autoPrint === 1"
						v-model="organDetails.printName"
						:optionlist="autoPrintSelect"
						class="form-item-input"
					>
					</w-select>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item required label="接收信息：">
					<el-radio-group v-model="organDetails.isReceiveInformation" :disabled="disabled" @change="onSubscribeChange">
						<el-radio :label="0">不接收</el-radio>
						<el-radio :label="1" :disabled="!showSubscribe">接收</el-radio>
					</el-radio-group>
					<div v-show="organDetails.isReceiveInformation===1" class="code-container">
						<div class="rebinding-container" v-show="showRebinding">
							<w-qr-code sourceText="SCM8.0" :width="140"></w-qr-code>
							<div class="code-mask"></div>
							<el-button :disabled="disabled" type="primary" class="rebinding-btn" @click="onRebindClick">重新绑定</el-button>
						</div>
						<div class="binding-container" v-show="!showRebinding && qrCodeUrl">
							<w-image :src="qrCodeUrl" class="qr-code" ></w-image>
							<div v-show="countdown === 0" class="code-disabled" @click="onRegainGetCodeClick">二维码已失效，点击重新获取！</div>
							<p v-show="countdown !== 0">{{countdown}}秒后失效</p>
						</div>
						<el-button v-show="!showRebinding && !qrCodeUrl" :disabled="disabled" type="primary" class="binding-btn" @click="onRegainGetCodeClick">点击获取</el-button>
						<span>说明：微信扫码绑定后，通过极速订公众号接收消息通知</span>
					</div>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row class="detials-form-row-height">
				<el-form-item required label="适用店铺：">
					<el-radio-group v-model="applyStore" :disabled="disabled">
						<el-radio :label="1">全部店铺</el-radio>
						<el-radio :label="0">自定义店铺</el-radio>
					</el-radio-group>
					<transition name="el-zoom-in-center">
						<el-button :disabled="disabled" v-show="applyStore===0" type="primary" @click="onApplyStoreSetting">自定义</el-button>
					</transition>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row class="detials-form-row-height">
				<el-form-item required label="管理下属：">
					<el-radio-group v-model="organDetails.manageSubordinates" :disabled="disabled">
						<el-radio :label="0">不可管理</el-radio>
						<el-radio :label="1">可管理</el-radio>
					</el-radio-group>
					<transition name="el-zoom-in-center">
						<el-button :disabled="disabled" v-show="organDetails.manageSubordinates===1" type="primary" @click="onSubordinatesSetting">自定义</el-button>
					</transition>
				</el-form-item>
			</fx-details-form-row>
		</el-form>
		<connectSubordinateDialog ref="connectSubordinateDialog"></connectSubordinateDialog>
		<connectStoreDialog ref="connectStoreDialog" @save-main="onSaveMain" @close="onConnectStoreDialogClose"></connectStoreDialog>
	</w-collapse>
</template>
<script>
import connectSubordinateDialog from '../connect-container-subordinate/connect-subordinate.vue'
import connectStoreDialog from '../connect-container-store/connect-store.vue'
export default {
	name: 'shoppingOnline',
	components: {
		connectSubordinateDialog,
		connectStoreDialog
	},
	props: {
		disabled: Boolean,
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			collapseVisible: false,
			countdown: 0,
			qrCodeUrl: '',
			ticket: '',
			wxUrl: 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=',
			wxBindingPolling: this.$fxUtils.polling(),
			autoPrintSelect: [{
				id: 'pdf',
				name: '打印为PDF'
			}],
			pollingEnd: null,
			applyStore: 1,
			originalApplyStore: 1
		}
	},
	watch: {
		applyStore (val) {
			this.organDetails.applyStore = val
		}
	},
	computed: {
		showSubscribe () {
			return !!this.organDetails.id
		},
		showRebinding () {
			return !!this.organDetails.jsdAppId
		}
	},
	methods: {
		getAutoPrintSelect () {
			this.$fxFastReport.init().then(this.$fxFastReport.getPrinter).then(res => {
				const list = res.map(item => {
					return {
						id: item.value,
						name: item.label
					}
				})
				if (this.autoPrintSelect.length === 1) {
					this.autoPrintSelect.push(...list)
				}
			})
		},
		isCollapse () {
			return this.collapseVisible
		},
		onSubscribeChange (val) {
			if (val === 0) {
				this.qrCodeUrl = ''
				this.pollingEnd && this.pollingEnd()
				this.organDetails.jsdAppId = ''
				this.organDetails.jsdOpenId = ''
			}
		},
		startCountdown () {
			this.countdown = 50
			this.wxBindingPolling.start(1000, (next, end) => {
				this.pollingEnd = end
				this.getBindResult().then(() => {
					if (!this.showRebinding && this.countdown > 1) {
						this.countdown--
						next()
					} else {
						end()
						this.countdown = 0
						this.showRebinding && this.$fxMessage.success('绑定微信成功!')
					}
				})
			})
		},
		onSubordinatesSetting () {
			this.emitConnectClick().then(() => {
				this.$refs.connectSubordinateDialog.open(this.organDetails)
			})
		},
		onApplyStoreSetting () {
			this.organDetails.applyStore = this.originalApplyStore
			this.emitConnectClick().then(() => {
				this.$refs.connectStoreDialog.open(this.organDetails)
			})
		},
		onSaveMain () {
			this.organDetails.applyStore = 0
			return new Promise(resolve => {
				this.$emit('on-connect-click', resolve)
			})
		},
		onConnectStoreDialogClose () {
			this.organDetails.applyStore = 0
		},
		emitConnectClick () {
			return new Promise(resolve => {
				this.$emit('on-connect-click', resolve)
			})
		},
		onRebindClick () {
			this.getQrCode()
		},
		onRegainGetCodeClick () {
			this.getQrCode()
		},
		getQrCode () {
			return this.$fxApi('employee.getQrCode', this.organDetails.id).then(res => {
				if (this.$fxUtils.isString(res)) {
					this.ticket = res
					this.qrCodeUrl = this.wxUrl + res
					this.organDetails.jsdAppId = ''
					this.organDetails.jsdOpenId = ''
					this.startCountdown()
				} else {
					this.$fxMessage.error('获取二维码失败，请稍后再试！')
				}
			})
		},
		getBindResult () {
			return this.$fxApi('employee.getBindResult')({ data: { ticket: this.ticket } }).then(res => {
				if (res.data && res.result) {
					this.organDetails.jsdAppId = res.data.subscriptionAppId
					this.organDetails.jsdOpenId = res.data.subscriptionOpenId
				}
				return Promise.resolve()
			})
		},
		setApplyStore () {
			this.applyStore = this.organDetails.applyStore
			this.originalApplyStore = this.organDetails.applyStore
		},
		stopCountdown () {
			this.qrCodeUrl = ''
			this.pollingEnd && this.pollingEnd()
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width: 186px
	box-sizing: border-box
}
.el-radio-group {
	margin-right 30px
}
.form-item-input-long {
	width: 535px
	box-sizing: border-box
}
.detials-form-row-height {
	height 47px
}
.code-container {
	display flex
	margin-top 10px
	.rebinding-container {
		display flex
		justify-content center
		align-items center
		margin-right 10px
		height 160px
		width 160px
		.code-mask {
			position absolute
			width 160px
			height 160px
			background-color rgba(229,229,229,.9)
		}
		.rebinding-btn {
			position absolute
		}
	}
	.binding-container {
		display flex
		flex-direction column
		align-items center
		margin-right 10px
		width 160px
		.qr-code {
			width 160px
			height 160px
		}
		.code-disabled {
			position absolute
			width 160px
			top 38px
			padding 52px 25px
			box-sizing border-box
			background-color rgba(229,229,229,.9)
			text-align center
			color $fxBlack1
			user-select none
			cursor pointer
		}
		p {
			font-size 12px
			color $fxRed
		}
	}
	span {
		font-size 12px
		color $fxGray4
	}
	.binding-btn {
		margin-right 10px
	}
}
</style>
