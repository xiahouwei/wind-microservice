<template>
	<fx-bill-container
		:title="actionText"
	>
		<div class="create-container">
			<tree-container ref="treeRef" @on-tree-item-click="onTreeItemClick"></tree-container>
			<div class="create-container__content">
				<w-scroll-bar>
					<item-info
						ref="itemInfo"
						:isAdd="isAdd"
						:disabled="computedDisabled"
						:organDetails="organDetails"
						:itemList="itemList"
						:unitList.sync="unitList"
						:billClass="billClass"
						@on-item-chang="onItemChange"
					></item-info>
					<setting-info
						v-if="billClass"
						ref="settingInfo"
						:disabled="computedDisabled"
						:organDetails="organDetails"
						:unitList="unitList"
						:billClass="billClass"
						@on-setting-click="onSettingClick"
					></setting-info>
				</w-scroll-bar>
			</div>
		</div>
		<template slot="footer">
			<el-button
				ref="cancelBtn"
				@click="onCancelClick"
			>取消</el-button>
			<el-button
				ref="saveBtn"
				type="primary"
				v-fx-auth:basic-archives_unit-setting.edit-unit
				@click="onSaveClick"
			>保存</el-button>
		</template>
		<custom-setting
			ref="customSetting"
			:unitList="unitList"
			:billClass="billClass"
			:itemName="itemName"
		></custom-setting>
		<custom-setting-check-bill
			ref="customSettingCheckBill"
			v-if="billClass === 'CheckBill'"
			:unitList="unitList"
			:billClass="billClass"
			:itemName="itemName"
		></custom-setting-check-bill>
	</fx-bill-container>
</template>
<script>
import { mapGetters } from 'vuex'
import itemInfo from './ItemInfo.vue'
import settingInfo from './SettingInfo.vue'
import customSetting from './CustomSetting.vue'
import customSettingCheckBill from './CustomSettingCheckBill.vue'
import treeContainer from '@/components/tree-container/tree-unit-setting/Index.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'createContainer',
	components: {
		itemInfo,
		treeContainer,
		settingInfo,
		customSetting,
		customSettingCheckBill
	},
	data () {
		return {
			organDetails: {},
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			billClassList: this.$fxTypeMiddleware.getCommonTypeList('unitSettingBillClassList'),
			unitList: [],
			billClass: '',
			itemList: [],
			isAdd: false
		}
	},
	computed: {
		...mapGetters(['getSysParams', 'detailsAuthGetter']),
		actionText () {
			return this.isAdd ? '新建' : '编辑'
		},
		itemName () {
			return (this.itemList.find(item => {
				return item.id === this.organDetails.itemId
			}) || {}).name || ''
		},
		computedDisabled () {
			return !this.detailsAuthGetter('basic-archives_unit-setting.edit-unit')
		}
	},
	created () {
		this.initBill()
		this.bindTabBeforeDeactivated()
	},
	methods: {
		async initBill () {
			const { openType } = this.$route.query
			if (openType === 'add') {
				this.add()
			} else if (openType === 'edit') {
				this.edit(this.$route.query)
			}
		},
		bindTabBeforeDeactivated () {
			this.$fxAppTabs.onTabBeforeDeactivated(() => {
				return this.verificationDetails()
			}, this)
		},
		async add () {
			this.billClass = ''
			this.organDetails = {}
			this.isAdd = true
			await this.getItemList()
			this.setOrganDetails('InStore')
		},
		async edit (organDetails) {
			this.billClass = ''
			this.organDetails = {}
			this.isAdd = false
			await this.getItemList(organDetails.itemId)
			await this.getDetails(organDetails.billClass, organDetails.itemId)
			this.$fxAppTabs.setTabTitle({ name: this.itemName })
			this.$refs.treeRef.setCurrentKey(organDetails.billClass)
		},
		getItemList (itemId = '') {
			return this.$fxApi(`${apiName}.getItemList`, itemId).then(res => {
				this.itemList = res
				this.unitList = (this.itemList.find(item => {
					return item.id === itemId
				}) || {}).itemUnitList || []
				return Promise.resolve()
			})
		},
		setOrganDetails (billClass, itemId = this.organDetails.itemId || '') {
			const params = {}
			this.billClassList.find(item => item.id === billClass).billtype.forEach(item => {
				params[item.id] = [{
					billType: item.id,
					customFlag: true,
					organType: 1,
					setType: 2,
					unitId: '',
					unitIdBig: '',
					unitIdSmall: ''
				}, {
					billType: item.id,
					customFlag: true,
					organType: 2,
					setType: 2,
					unitId: '',
					unitIdBig: '',
					unitIdSmall: ''
				}]
			})
			this.organDetails = {
				itemId,
				billClass,
				params,
				isAdd: true
			}
			this.$nextTick(() => {
				this.billClass = billClass
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		onTreeItemClick (data, node) {
			this.billClass = ''
			if (this.isAdd) {
				this.setOrganDetails(data.id)
			} else {
				this.getDetails(data.id, this.organDetails.itemId)
			}
		},
		getDetails (billClass, itemId) {
			return this.$fxApi(`${apiName}.getDetails`, itemId, billClass).then(res => {
				if (Object.values(res).length) {
					const params = this.setParams(res, billClass)
					this.organDetails = {
						billClass,
						itemId,
						params,
						isAdd: false
					}
					this.$nextTick(() => {
						this.billClass = billClass
						this.fxDataVerification.resetData(this.organDetails)
						return Promise.resolve()
					})
				} else {
					return this.setOrganDetails(billClass, itemId)
				}
			})
		},
		setParams (res, billClass) {
			if (billClass !== 'CheckBill') {
				return { ...res }
			}
			const params = {
				4001: [{
					billType: 4001,
					customFlag: true,
					organType: 1,
					setType: 2,
					unitId: '',
					unitIdBig: '',
					unitIdSmall: ''
				}, {
					billType: 4001,
					customFlag: true,
					organType: 2,
					setType: 2,
					unitId: '',
					unitIdBig: '',
					unitIdSmall: ''
				}]
			}
			res[4001].forEach(item => {
				const curParams = params[4001][item.organType - 1]
				curParams.billType = item.billType
				curParams.customFlag = item.customFlag
				curParams.organType = item.organType
				curParams.setType = item.setType
				curParams.unitIdBig = curParams.unitIdBig || ''
				curParams.unitIdSmall = ''
				if (!item.customFlag) {
					curParams.id = item.id
				} else if (item.customFlag && item.itemType === 1) {
					curParams.unitIdBigRowId = item.id
					curParams.unitIdBig = item.unitId
				} else if (item.customFlag && item.itemType === 2) {
					curParams.unitIdSmallRowId = item.id
					curParams.unitIdSmall = item.unitId
				}
			})
			return params
		},
		onSaveClick (showMessage) {
			return this.onValidateFormData().then(() => {
				return this.onSaveHandler(showMessage)
			})
		},
		onSaveHandler (showMessage = true) {
			const data = this.getSaveData()
			if (this.organDetails.isAdd) {
				const logger = this.$fxLogger.createInfo('basic-archives.unit-setting.setting', { itemName: this.itemName, data: this.organDetails, unitList: this.unitList })
				return this.$fxApi(`${apiName}.add`)({ data, logger }).then(res => {
					this.$fxAppTabs.setTabTitle({ name: this.itemName })
					this.$fxAppTabs.setTabPathQuery({ openType: 'edit', id: this.organDetails.itemId, itemId: this.organDetails.itemId, billClass: this.billClass })
					this.isAdd = false
					this.organDetails.isAdd = false
					this.organDetails.params = this.setParams(res, this.billClass)
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve(res)
				})
			} else {
				const isChanged = !this.fxDataVerification.checkData(this.organDetails)
				if (isChanged) {
					const logger = this.$fxLogger.createInfo('basic-archives.unit-setting.setting', { itemName: this.itemName, data: this.organDetails, unitList: this.unitList })
					return this.$fxApi(`${apiName}.saveDetails`)({ data, logger }).then(res => {
						this.$fxAppTabs.setTabPathQuery({ openType: 'edit', id: this.organDetails.itemId, itemId: this.organDetails.itemId, billClass: this.billClass })
						this.organDetails.params = this.setParams(res, this.billClass)
						this.fxDataVerification.resetData(this.organDetails)
						return Promise.resolve(res)
					})
				} else {
					showMessage && this.$fxMessage.success('保存成功！')
					return Promise.resolve(this.organDetails.params)
				}
			}
		},
		getSaveData () {
			let params = []
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			const paramsArr = Object.values(organDetails.params).reduce((pre, cur) => {
				return pre.concat(cur)
			}, [])
			const paramsArrOrigin = Object.values(this.fxDataVerification.getOriginData().params).reduce((pre, cur) => {
				return pre.concat(cur)
			}, [])
			if (this.billClass !== 'CheckBill') {
				params = paramsArr.map((item, index) => {
					delete item.unitIdBig
					delete item.unitIdSmall
					if (paramsArr[index].customFlag !== paramsArrOrigin[index].customFlag && paramsArr[index].customFlag) {
						item.isDeleteRel = 1
					} else {
						item.isDeleteRel = 0
					}
					return item
				})
			} else {
				paramsArr.forEach((item, index) => {
					if (!item.customFlag) {
						const isDeleteRel = paramsArr[index].setType === paramsArrOrigin[index].setType ? 0 : 1
						params.push({
							id: item.id,
							billType: item.billType,
							customFlag: item.customFlag,
							organType: item.organType,
							setType: item.setType,
							unitId: '',
							isDeleteRel
						})
					} else {
						params.push({
							id: item.unitIdBigRowId,
							billType: item.billType,
							customFlag: item.customFlag,
							organType: item.organType,
							unitId: item.unitIdBig,
							setType: item.setType,
							itemType: 1,
							isDeleteRel: 0
						})
						if (item.setType === 2) {
							params.push({
								id: item.unitIdSmallRowId,
								billType: item.billType,
								customFlag: item.customFlag,
								organType: item.organType,
								unitId: item.unitIdSmall,
								setType: item.setType,
								itemType: 2,
								isDeleteRel: 0
							})
						}
					}
				})
			}
			return {
				billClass: this.billClass,
				itemId: this.organDetails.itemId,
				params
			}
		},
		onValidateFormData () {
			return this.$refs.itemInfo.validate().then(this.$refs.settingInfo.validate)
		},
		onCancelClick () {
			this.$fxAppTabs.tabsRemove()
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.organDetails)
		},
		onItemChange () {
			this.setOrganDetails(this.billClass)
		},
		onSettingClick (billType, organType, setType) {
			this.onSaveClick(false).then(res => {
				const id = res[billType].filter(item => item.organType === organType)[0].id
				if (this.billClass === 'CheckBill') {
					this.$refs.customSettingCheckBill.open(id, organType, billType, setType)
				} else {
					this.$refs.customSetting.open(id, organType, billType)
				}
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-container {
	flex: 1
	display: flex
	overflow auto
	&__content {
		flex 1
	}
}
</style>
