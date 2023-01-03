<template>
	<fx-bill-container
		title="商品详情"
		:moreBtnOption="moreBtnOption"
	>
		<div class="create-organ">
			<w-scroll-bar>
				<basicInfo
					ref="basicInfo"
					:organDetails="organDetails"
					:disabled="disabled"
				></basicInfo>
				<detailsInfo
					ref="detailsInfo"
					:organDetails="organDetails"
					:disabled="disabled"
				></detailsInfo>
			</w-scroll-bar>
		</div>
		<template slot="footer-right">
			<el-button
				ref="cancelBtn"
				@click="onCancelClick"
			>取消</el-button>
			<el-button
				ref="saveBtn"
				type="primary"
				v-fx-auth:basic-archives_goods-manage.edit-goods="canEditAuth"
				@click="onSaveClick"
			>保存</el-button>
			<el-button
				ref="saveBtn"
				type="primary"
				v-fx-auth:basic-archives_goods-manage.add-goods="!disabled"
				@click="onSaveAndAddClick"
			>保存并新增</el-button>
		</template>
	</fx-bill-container>
</template>
<script>
import { mapGetters } from 'vuex'
import basicInfo from './BasicInfo.vue'
import detailsInfo from './DetailsInfo.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'createGoods',
	components: {
		basicInfo,
		detailsInfo
	},
	data () {
		return {
			organDetails: {},
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			disabled: false
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		isAdd () {
			return !this.organDetails.id
		},
		currentState () {
			return this.$fxStateMiddleware.getStateObj('planState')(this.organDetails.billState)
		},
		canEditAuth () {
			return this.detailsAuthGetter('basic-archives_goods-manage.edit-goods')
		},
		canEdit () {
			return !this.organDetails.enable_flag && this.canEditAuth
		},
		moreBtnOption () {
			return [{
				show: !this.isAdd && this.detailsAuthGetter('basic-archives_goods-manage.delete-goods'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}, {
				show: !this.isAdd && this.detailsAuthGetter('basic-archives_goods-manage.push-goods'),
				label: '推送',
				icon: 'goods-push',
				click: this.onPushClick
			}, {
				show: !this.isAdd && this.detailsAuthGetter('basic-archives_goods-manage.unbind-goods'),
				label: '解绑',
				icon: 'goods-unbind',
				click: this.onUnbindClick
			}]
		}
	},
	created () {
		this.initBill()
		this.bindTabBeforeDeactivated()
	},
	methods: {
		initBill () {
			if (this.$route.query.openType === 'add') {
				this.add()
			} else if (this.$route.query.openType === 'edit') {
				this.edit(this.$route.query.id)
			}
		},
		bindTabBeforeDeactivated () {
			this.$fxAppTabs.onTabBeforeDeactivated(() => {
				return this.verificationDetails()
			}, this)
		},
		async add () {
			const code = await this.getSPUCode()
			this.organDetails = {
				id: '',
				name: '',
				secondary_name: '',
				enable_flag: false,
				code,
				pic: [],
				video: []
			}
			this.disabled = false
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				this.$refs.detailsInfo.init()
			})
		},
		getSPUCode () {
			return this.$fxApi(`${apiName}.getSPUCode`)
		},
		async edit (id) {
			this.organDetails = await this.getGoodsDetails(id)
			this.$fxAppTabs.setTabTitle({ name: this.organDetails.name })
			this.disabled = !this.canEdit
			this.$nextTick(() => {
				this.$refs.detailsInfo.onEdit().then(() => {
					this.fxDataVerification.resetData(this.organDetails)
				})
			})
		},
		getGoodsDetails (id) {
			return this.$fxApi(`${apiName}.getGoods`, id)
		},
		onSaveClick () {
			return this.onValidateFormData().then(() => {
				this.organDetails.spec = this.$refs.detailsInfo.specInfoForm.specInfo
				this.organDetails.spu_sku = this.$refs.detailsInfo.detailsTableForm.tableData
				if (this.isAdd) {
					const logger = this.$fxLogger.createInfo('basic-archives.goods-manage.add', { item: this.organDetails.name, code: this.organDetails.code })
					return this.$fxApi(`${apiName}.addGoods`)({ data: this.organDetails, logger }).then(res => {
						this.$fxAppTabs.setTabTitle({ name: this.organDetails.name })
						this.$fxAppTabs.setTabPathQuery({ openType: 'edit', id: res })
						this.organDetails.id = res
						this.fxDataVerification.resetData(this.organDetails)
						this.disabled = !this.canEdit
						return Promise.resolve()
					})
				} else {
					const logger = this.$fxLogger.createInfo('basic-archives.goods-manage.update', this.createLoggerParams())
					return this.$fxApi(`${apiName}.editGoods`, this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
						this.$fxAppTabs.setTabTitle({ name: this.organDetails.name })
						this.fxDataVerification.resetData(this.organDetails)
						this.disabled = !this.canEdit
						return Promise.resolve()
					})
				}
			})
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			return {
				pre: originData,
				cur: organDetails,
				name: organDetails.name,
				code: organDetails.code
			}
		},
		onSaveAndAddClick () {
			this.onSaveClick().then(() => {
				this.$fxAppTabs.tabsPush({
					path: 'goodsManageDetail',
					query: {
						openType: 'add'
					}
				})
			})
		},
		onValidateFormData () {
			return this.$refs.basicInfo.validate()
				.then(this.$refs.detailsInfo.validate)
				.catch((err) => {
					if (err) {
						this.$fxMessage.warning(err.message)
					} else {
						this.$fxMessage.warning('请填写必填信息')
					}
					return Promise.reject(new Error('请填写必填信息'))
				})
		},
		onCancelClick () {
			this.$fxAppTabs.tabsRemove()
		},
		onDeleteClick () {
			this.$fxConfirm('是否确定删除当前商品？')
				.then(this.onDeleteHandler)
				.then(this.onCancelClick)
		},
		onDeleteHandler () {
			const logger = this.$fxLogger.createInfo('basic-archives.goods-manage.delete', { names: [this.organDetails.name] })
			return this.$fxApi(`${apiName}.delete`, this.organDetails.id)({ logger }).then(res => {
				this.billDeleteFlag = true
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		onPushClick () {
			const logger = this.$fxLogger.createInfo('basic-archives.goods-manage.push', { names: [this.organDetails.name] })
			return this.$fxApi(`${apiName}.push`, this.organDetails.id)({ logger }).then(res => {
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		onUnbindClick () {
			const logger = this.$fxLogger.createInfo('basic-archives.goods-manage.unbind', { names: [this.organDetails.name] })
			return this.$fxApi(`${apiName}.unbind`, this.organDetails.id)({ logger }).then(res => {
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.organDetails)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-organ {
	flex: 1
	display: flex;
	flex-direction: column;
	overflow: auto;
}
</style>
