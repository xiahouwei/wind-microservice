<template>
	<fx-bill-container
		:title="actionText"
		:moreBtnOption="moreBtnOption"
	>
		<div class="create-organ">
			<w-scroll-bar>
				<div class="create-organ__content">
					<basicInfo
						ref="basicInfo"
						:organDetails="organDetails"
						:disabled="billDisabled"
						:organCascaderData="organCascaderData"
						:financialClassList="financialClassList"
						@itemCategoryListSelectChange="itemCategoryListSelectChange"
						@on-custom-setting-click="onCustomSettingClick"
						@on-refresh-financial-list="getFinancialList"
					></basicInfo>
					<methodInfo
						ref='methodInfo'
						v-if='showMethod'
						v-model="organDetails.foodsProductionMethodList"
						:organDetails="organDetails"
						:disabled="billDisabled"
					></methodInfo>
					<connectSetting
						ref="connectSetting"
						:organDetails="organDetails"
						:disabled="billDisabled"
					></connectSetting>
					<otherInfo
						ref="otherInfo"
						:organDetails="organDetails"
						:mainFlag="mainFlag"
						:disabled="billDisabled"
					></otherInfo>
					<appendInfo ref="appendInfo" :organDetails="organDetails" :disabled="billDisabled"></appendInfo>
					<sourceInfo :organDetails="organDetails" :disabled="billDisabled"></sourceInfo>
				</div>
			</w-scroll-bar>
			<printBarcode ref="printBarcode"></printBarcode>
			<itemSettingGuide ref="itemSettingGuide"></itemSettingGuide>
		</div>
		<template slot="footer">
			<el-button v-if="showItemSettingGuide" class="order-btn" type="danger" plain @click="onItemSettingClick">品项设置向导</el-button>
			<el-button class="order-btn" type="danger" plain @click="onBarcodePrintClick">条码打印</el-button>
			<el-button
				ref="cancelBtn"
				v-fx-tab:loop.basic-archives_item-manage_details.cancelBtn
				@click="onCancelClick"
			>取消</el-button>
			<el-button
				ref="saveBtn"
				type="primary"
				v-fx-auth:basic-archives_item-manage.edit-item="!isDel"
				v-fx-tab:loop.basic-archives_item-manage_details.saveBtn
				@click="onSaveClick"
			>保存</el-button>
			<el-button
				ref="saveAndAddBtn"
				type="primary"
				v-fx-auth:basic-archives_item-manage.add-item="!isDel"
				v-fx-tab:loop.basic-archives_item-manage_details.saveAndAddBtn
				@click="onSaveAndAddClick"
			>保存并新建</el-button>
		</template>
	</fx-bill-container>
</template>
<script>
import { mapGetters } from 'vuex'
import basicInfo from './BasicInfo.vue'
import connectSetting from './ConnectSetting.vue'
import otherInfo from './OtherInfo.vue'
import appendInfo from './AppendInfo.vue'
import sourceInfo from './SourceInfo.vue'
import methodInfo from './MethodInfo.vue'
import printBarcode from '../print-barcode/Index.vue'
import itemSettingGuide from '../item-setting-guide/Index.vue'
export default {
	name: 'createContainer',
	components: {
		basicInfo,
		connectSetting,
		otherInfo,
		appendInfo,
		sourceInfo,
		methodInfo,
		printBarcode,
		itemSettingGuide
	},
	data () {
		return {
			organDetails: {
				itemCategoryListSelect: [],
				itemCategoryList: []
			},
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			itemTypeList: [],
			organCascaderData: [],
			financialClassList: [],
			showMethod: false
		}
	},
	computed: {
		...mapGetters(['getSysParams', 'detailsAuthGetter']),
		isAdd () {
			return !this.organDetails.id
		},
		actionText () {
			return this.isAdd ? '新建' : '编辑'
		},
		mainFlag () {
			const mainUnit = (this.organDetails.itemUnitList && this.organDetails.itemUnitList.find(item => {
				return item.mainFlag
			})) || {}
			return mainUnit.name || '最小单位'
		},
		isDel () {
			return !!this.organDetails.delFlag
		},
		billDisabled () {
			return !this.detailsAuthGetter('basic-archives_item-manage.edit-item')
		},
		moreBtnOption () {
			return [{
				show: !this.isAdd && this.detailsAuthGetter('basic-archives_item-manage.delete-item'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}, {
				show: !this.isAdd && this.isDel && this.detailsAuthGetter('basic-archives_item-manage.recover-organ'),
				label: '恢复',
				icon: 'refresh-grey',
				click: this.onRecoverClick
			}]
		},
		isOnlyFromMiddleground () {
			return !this.isAdd && this.organDetails.sourceList.length === 1 && this.organDetails.sourceType === 1
		},
		showItemSettingGuide () {
			return !(JSON.stringify(this.organDetails.itemCategoryListSelect) === JSON.stringify([1]))
		}
	},
	created () {
		this.$fxTabkey.init('basic-archives_item-manage_details', this)
		this.initBill()
		this.bindTabBeforeDeactivated()
	},
	methods: {
		async initBill () {
			const { openType, addFlag } = this.$route.query
			if (openType === 'add') {
				if (addFlag === 'again') {
					const { itemType } = this.$route.query
					this.add(itemType)
				} else {
					const { itemType } = await this.initDefaultOrganData()
					this.add(itemType)
				}
			} else if (openType === 'edit') {
				const { id, isRecycle } = this.$route.query
				this.onEditHandler({ id, isRecycle }).then(this.edit)
			}
		},
		bindTabBeforeDeactivated () {
			this.$fxAppTabs.onTabBeforeDeactivated(() => {
				return this.verificationDetails()
			}, this)
		},
		async add (itemType) {
			await this.getSelectList()
			const itemTypeAll = itemType ? await this.getItemTypeIds(itemType) : []
			const code = await this.getItemCode(itemType)
			const itemCategoryListSelect = [0]
			const itemCategoryList = itemCategoryListSelect.map(item => {
				return {
					category: item
				}
			})
			this.organDetails = {
				itemTypeAll,
				itemType,
				code,
				pinYin: '',
				consumptionMethod: '',
				offsetMethod: '1',
				enableFlag: 1,
				spec: '',
				imageUrl: '',
				itemAppendixList: [],
				itemUnitList: [],
				foodsProductionMethodList: [],
				itemCategoryListSelect,
				itemCategoryList,
				shelfLifeFlag: 0,
				shelfLife: '',
				minCostMargin: 0,
				maxCostMargin: 100,
				minFoodMargin: 0,
				maxFoodMargin: 100,
				kgToMainUnit: 1,
				canWeigh: 0,
				roundFlag: 0,
				indexNum: 0,
				relAllFinances: true
			}
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				this.$refs.basicInfo.defaultFocus('code')
			})
		},
		async initDefaultOrganData () {
			const { treeNodeId } = this.$route.query
			const itemTypeAll = treeNodeId !== '1' ? await this.getItemTypeIds(treeNodeId) : []
			const itemType = itemTypeAll[itemTypeAll.length - 1] || ''
			return { itemType }
		},
		getItemTypeIds (id) {
			if (!id) {
				return Promise.resolve([])
			}
			return this.$fxApi('itemType.getFullPathId', id)
		},
		getItemCode (itemType) {
			if (!itemType) {
				return Promise.resolve('')
			}
			return this.$fxApi('item.getItemCode')({ data: { itemType } })
		},
		getitemTypeList () {
			return this.$fxApi('itemType.getFatherList').then(res => {
				this.itemTypeList = res
				return Promise.resolve(res)
			})
		},
		getItemTypeCascader () {
			return this.$fxApi('itemType.getItemType').then(res => {
				this.organCascaderData = res
				return Promise.resolve()
			})
		},
		getFinancialList (organDetails = this.organDetails) {
			const data = organDetails.financeSortId ? [organDetails.financeSortId] : []
			return this.$fxApi('finance.getFinancialList')({ data }).then(res => {
				this.financialClassList = res
				return Promise.resolve(res)
			})
		},
		getSelectList (organDetails) {
			return Promise.all([
				this.getitemTypeList(),
				this.getItemTypeCascader(),
				this.getFinancialList(organDetails)
			])
		},
		async edit (organDetails) {
			this.$fxAppTabs.setTabTitle({ name: organDetails.name })
			await this.getSelectList(organDetails)
			organDetails.consumptionMethod = organDetails.consumptionMethod || ''
			organDetails.indexNum = organDetails.indexNum || 0
			if (organDetails.foodsProductionMethodList) {
				for (const i of organDetails.foodsProductionMethodList) {
					i.isEdit = false
					i.grossProfit = this.$fxUtils.toFixed((i.sellingPrice - i.costPrice) / i.sellingPrice * 100, 2, false)
				}
			} else {
				organDetails.foodsProductionMethodList = []
			}
			const itemCategoryList = organDetails.itemCategoryList.map(item => {
				return {
					category: item.category
				}
			})
			const itemCategoryListSelect = organDetails.itemCategoryList.map(item => {
				return item.category
			})
			this.organDetails = {
				...organDetails,
				itemChangeFlag: 1,
				itemUnitChangeFlag: 1,
				itemAppendixChangeFlag: 1,
				foodsProductionMethodChangeFlag: 1,
				itemCategoryList,
				itemCategoryListSelect
			}
			if (itemCategoryListSelect.indexOf(1) > -1) {
				this.showMethod = true
			}
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				if (this.billDisabled) {
					this.$fxUtils.vDoRefFocus(this, 'cancelBtn')
				} else if (this.isOnlyFromMiddleground) {
					this.$refs.basicInfo.defaultFocus('spec')
				} else {
					this.$refs.basicInfo.defaultFocus('name')
				}
			})
		},
		onSaveClick () {
			if (this.fxDataVerification.checkData(this.organDetails) && !this.isAdd) {
				this.$fxMessage.success('保存成功')
				return Promise.resolve()
			} else {
				return this.onValidateFormData().then(this.onSaveItemHandler)
			}
		},
		onSaveAndAddClick () {
			this.onValidateFormData()
				.then(this.onSaveItemHandler)
				.then(this.addItemAgain)
		},
		onValidateFormData () {
			return this.$refs.basicInfo.validate().then(this.$refs.otherInfo.validate).then(() => {
				if (!this.showMethod) {
					return Promise.resolve()
				} else {
					return this.$refs.methodInfo.saveTable()
				}
			})
		},
		onSaveItemHandler () {
			this.organDetails.financeSortId = this.organDetails.financeSortId || null
			if (!this.organDetails.id) {
				const logger = this.$fxLogger.createInfo('basic-archives.item-manage.add', { item: this.organDetails.name, code: this.organDetails.code })
				return this.$fxApi('item.add')({ data: this.organDetails, logger }).then(this.getSource).then(res => {
					this.$fxAppTabs.setTabTitle({ name: res.name })
					this.$fxAppTabs.setTabPathQuery({ openType: 'edit', id: res.id })
					this.$set(this.organDetails, 'id', res.id)
					this.$set(this.organDetails, 'sourceList', res.sourceList)
					this.$set(this.organDetails, 'itemUnitList', res.itemUnitList)
					this.$set(this.organDetails, 'foodsProductionMethodList', res.foodsProductionMethodList)
					this.$set(this.organDetails, 'createMan', res.createMan)
					this.organDetails = {
						...this.organDetails,
						itemChangeFlag: 1,
						itemUnitChangeFlag: 1,
						itemAppendixChangeFlag: 1,
						foodsProductionMethodChangeFlag: 1
					}
					const itemCategoryListSelect = res.itemCategoryList.map(item => {
						return item.category
					})
					this.organDetails.itemCategoryListSelect = itemCategoryListSelect
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve()
				})
			} else {
				return this.settingUnitCheck().then(this.saveDetailsHandler)
			}
		},
		settingUnitCheck () {
			const data = this.getChangedUnitList()
			if (!data) return Promise.resolve()
			return new Promise(resolve => {
				return this.$fxApi('item.settingUnitCheck', this.organDetails.id)({ data }).then(resolve).catch(err => {
					if (err.code === 1) {
						this.$set(this.organDetails, 'itemUnitList', err.data)
						this.$fxMessage.error('辅助单位切换失败，请在<品项单位>右侧“?”处查看原因')
					} else if (err.code === 2) {
						this.$fxConfirm(err.message).then(() => {
							resolve()
						}).catch(() => {
							this.$set(this.organDetails, 'itemUnitList', err.data)
						})
					} else {
						this.$fxMessage.error(err.message || '保存失败，请稍后再试')
					}
				})
			})
		},
		getChangedUnitList () {
			const { itemUnitList: originItemUnitList } = this.fxDataVerification.getOriginData()
			const { itemUnitList } = this.$fxUtils.deepClone(this.organDetails)
			const originRatioMap = {}
			originItemUnitList.forEach(item => {
				originRatioMap[item.id || ''] = item.ratio
			})
			const originAssistUnit = originItemUnitList.find(item => !!item.assistFlag) || {}
			const currentAssistUnit = itemUnitList.find(item => !!item.assistFlag) || {}
			let changedUnitListType1 = []
			if ((originAssistUnit.id || currentAssistUnit.id) && originAssistUnit.id !== currentAssistUnit.id) {
				changedUnitListType1 = [originAssistUnit.id ? originAssistUnit : null, currentAssistUnit.id ? currentAssistUnit : null]
			}
			const changedUnitListType2 = []
			itemUnitList.forEach(item => {
				if (item.id && originRatioMap[item.id] !== item.ratio) {
					changedUnitListType2.push(item)
				}
			})
			const changedUnitList = [{
				type: 1,
				units: changedUnitListType1
			},
			{
				type: 2,
				units: changedUnitListType2
			}]
			if (changedUnitListType1.length || changedUnitListType2.length) {
				return changedUnitList
			} else {
				return null
			}
		},
		saveDetailsHandler () {
			if (this.fxDataVerification.checkData(this.organDetails)) {
				this.$fxMessage.success('保存成功')
				return Promise.resolve(this.organDetails)
			} else {
				const logger = this.$fxLogger.createInfo('basic-archives.item-manage.update', this.createLoggerParams())
				return this.$fxApi('item.saveDetails', this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
					this.$fxAppTabs.setTabTitle({ name: res.name })
					const itemCategoryListSelect = res.itemCategoryList.map(item => {
						return item.category
					})
					this.organDetails.itemCategoryListSelect = itemCategoryListSelect
					this.$set(this.organDetails, 'itemUnitList', res.itemUnitList)
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve()
				})
			}
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			originData.itemTypeAllName = this.getItemTypeAllName(originData.itemTypeAll)
			originData.financeSortName = this.getFinanceSortName(originData.financeSortId)
			originData.itemUnitList.forEach(item => {
				delete item.isEdit
			})
			if (originData.foodsProductionMethodList) {
				originData.foodsProductionMethodList.forEach(item => {
					delete item.isEdit
				})
			}
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			organDetails.itemTypeAllName = this.getItemTypeAllName(organDetails.itemTypeAll)
			organDetails.financeSortName = this.getFinanceSortName(organDetails.financeSortId)
			organDetails.itemUnitList.forEach(item => {
				delete item.isEdit
			})
			if (organDetails.foodsProductionMethodList) {
				organDetails.foodsProductionMethodList.forEach(item => {
					delete item.isEdit
				})
			}
			return {
				pre: originData,
				cur: organDetails,
				name: organDetails.name,
				code: organDetails.code
			}
		},
		getItemTypeAllName (type) {
			if (type.length === 0) {
				return ''
			}
			const itemTypeAllNameList = type.map(item => {
				return this.itemTypeList.find(_item => _item.id === item).name
			})
			return itemTypeAllNameList.join('/')
		},
		getFinanceSortName (id) {
			if (!id) {
				return ''
			}
			return (this.financialClassList.find(item => {
				return item.id === id
			}) || {}).name
		},
		getSource (organDetails) {
			return this.$fxApi('source.getItemList', organDetails.id).then(sourceList => {
				return Promise.resolve({
					...organDetails,
					sourceList
				})
			})
		},
		onCancelClick () {
			this.$fxAppTabs.tabsRemove()
		},
		addItemAgain () {
			const { itemType } = this.organDetails
			this.$fxAppTabs.tabsPush({
				path: 'itemManageDetail',
				query: {
					openType: 'add',
					addFlag: 'again',
					itemType
				}
			})
		},
		onDeleteClick () {
			this.$fxConfirm('是否确定删除当前品项？')
				.then(this.onDeleteHandler)
				.then(this.onCancelClick)
		},
		onDeleteHandler () {
			const api = !this.isDel ? 'delete' : 'recyclingDelete'
			const del = !this.isDel ? 'delete' : 'recyclingDelete'
			const logger = this.$fxLogger.createInfo(`basic-archives.item-manage.${del}`, { item: this.organDetails.name })
			return this.$fxApi(`item.${api}`, this.organDetails.id)({ logger }).then(res => {
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		onRecoverClick () {
			this.$fxConfirm('是否确定恢复当前品项？')
				.then(this.onRecoverHandler)
				.then(this.onCancelClick)
		},
		onRecoverHandler () {
			const logger = this.$fxLogger.createInfo('basic-archives.item-manage.recover', { item: this.organDetails.name })
			return this.$fxApi('item.recover', this.organDetails.id)({ logger }).then(res => {
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		verificationDetails () {
			return this.isDel ? Promise.resolve() : this.fxDataVerification.checkComfirm(this.organDetails)
		},
		itemCategoryListSelectChange (val) {
			this.showMethod = val
		},
		onBarcodePrintClick () {
			const unitList = this.getPrintCodeUnitList()
			if (unitList.length === 0) {
				this.$fxMessage.warning('当前无可打印条码')
				return false
			}
			const { name, spec, code } = this.organDetails
			const itemList = [{
				name,
				spec,
				code,
				unitList
			}]
			this.$refs.printBarcode.open(itemList)
		},
		getPrintCodeUnitList () {
			return this.organDetails.itemUnitList.filter(item => !!item.barcode)
		},
		onCustomSettingClick (next) {
			this.onSaveClick().then(next)
		},
		onItemSettingClick () {
			this.onSaveClick().then(() => {
				this.$refs.itemSettingGuide.open(this.organDetails)
			})
		},
		onEditHandler ({ id, isRecycle }) {
			return Promise.all([
				this.getDetails(id, isRecycle),
				this.getSourceHandler(id)])
				.then(([details, sourceList]) => {
					return Promise.resolve({
						...details,
						sourceList
					})
				})
		},
		getDetails (id, isRecycle) {
			const api = isRecycle ? 'item.getDetailsRecycling' : 'item.getDetails'
			return this.$fxApi(api, id).then(res => {
				return Promise.resolve(res)
			})
		},
		getSourceHandler (id) {
			return this.$fxApi('source.getItemList', id).then(res => {
				return Promise.resolve(res)
			})
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
	&__type {
		height: 30px
		line-height: 30px
		padding-left: 20px
		&-label {
			color: $fxDefaultColor
		}
	}
	&__content {
		flex: 1
		overflow:auto
		padding-right: 10px
	}
}
</style>
