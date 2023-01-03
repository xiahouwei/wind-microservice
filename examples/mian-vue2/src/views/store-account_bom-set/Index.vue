<template>
	<w-app-container>
		<fx-page-header title="BOM设置"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<sideContainer
				:bomDetail='bomDetail'
				@onTypeChange='onTypeChange'
				@refreshBomDetail='refreshBomDetail'
				@getRefresh='getRefresh'
				@initBomDetail='initBomDetail'
			></sideContainer>
			<div class="info">
				<basicContainer
					ref='basicInfo'
					:type='type'
					class='basicContainer'
					@refreshBomDetail='getRefresh'
					:bomDetail='bomDetail'
					:unitList='unitList'
					:detailDisabled='detailDisabled'
				></basicContainer>
				<detailContainer
					ref='detailsInfo'
					:type='type'
					:bomDetail='bomDetail'
					:itemList='itemList'
					:detailDisabled='detailDisabled'
					@refreshBomDetail='getRefresh'
					@on-multiple-import-click="onMultipleImportClick"
				></detailContainer>
				<multipleImport ref="multipleImport" :importId="importId" :type="type" @on-refresh="getRefresh"></multipleImport>
				<div class="footer-btn">
					<fx-button type="save" @click="onSaveClick" v-if='!detailDisabled'>保存</fx-button>
				</div>
			</div>
		</w-app-container>
	</w-app-container>
</template>
<script>
import sideContainer from './side-container/Index.vue'
import basicContainer from './basic-container/BasicInfo.vue'
import detailContainer from './detail-container/DetailInfo.vue'
import multipleImport from './multiple-import/MultipleImport.vue'

export default {
	name: 'bomSet',
	components: {
		sideContainer,
		basicContainer,
		detailContainer,
		multipleImport
	},
	data () {
		return {
			type: 'food_bom',
			bomDetail: {
				unit: {},
				item: {},
				isDefault: false
			},
			itemList: [],
			unitList: [],
			detailDisabled: true,
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			importId: ''
		}
	},
	computed: {
		checkData () {
			const data = this.$fxUtils.deepClone(this.bomDetail)
			delete data.details
			return data
		}
	},
	mounted () {
		this.fxDataVerification.resetData(this.bomDetail)
	},
	methods: {
		onTypeChange (e) {
			this.type = e
			this.detailDisabled = true
			this.initBomDetail()
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.checkData)
		},
		initBomDetail () {
			const data = {
				unit: {},
				item: {},
				isDefault: 0
			}
			this.bomDetail = data
			this.fxDataVerification.resetData(data)
			this.$refs.detailsInfo.clearSelected()
			this.$refs.basicInfo.clearValidate()
		},
		getRefresh (id) {
			const bomid = id || this.bomDetail.id
			this.$fxApi('bom.getBomDetail', this.type, bomid).then(res => {
				this.refreshBomDetail(res)
			})
		},
		async refreshBomDetail (data) {
			this.importId = data.id
			this.$refs.basicInfo.clearValidate()
			this.$refs.detailsInfo.clearSelected()
			this.$refs.detailsInfo.doScrollLeft()
			if (this.type === 'food_bom') {
				await this.getUnitList(data.item.id)
				for (const i of data.details) {
					if (!i.childBom) {
						i.childBom = {}
					}
					i.materialRateZoom = this.$fxUtils.toFixed(i.materialRate * 100, 2, false)
				}
			}
			if (this.type === 'compose_bom') {
				await this.getUnitList(data.item.id)
				if (!data.unit) {
					data.unit = {}
				}
				for (const i of data.details) {
					if (!i.childBom) {
						i.childBom = {}
					}
					i.materialRateZoom = this.$fxUtils.toFixed(i.materialRate * 100, 2, false)
				}
			}
			if (this.type === 'split_bom') {
				if (data.outIntoYield) {
					data.outIntoYieldZoom = this.$fxUtils.toFixed(data.outIntoYield * 100, 2, false)
				}
				for (const i of data.details) {
					if (!i.childBom) {
						i.childBom = {}
					}
					if (i.outputYield) {
						i.outputYieldZoom = this.$fxUtils.toFixed(i.outputYield * 100, 2, false)
					}
				}
			}
			if (!data.unit) {
				data.unit = {}
			}
			this.bomDetail = data
			this.$nextTick(() => {
				this.fxDataVerification.resetData(this.checkData)
			})
			this.detailDisabled = false
		},
		getItemList (id) {
			this.$fxApi('bom.getItemList', this.type, id).then(res => {
				this.itemList = res
			})
		},
		getUnitList (id) {
			return this.$fxApi('bom.getUnitList', this.type, id).then(res => {
				this.unitList = res
				return Promise.resolve()
			})
		},
		onSaveClick () {
			return this.$refs.detailsInfo.checkDetailsUnSaving().then(() => {
				if (this.fxDataVerification.checkData(this.checkData)) {
					this.onValidateFormData().then(() => {
						this.$fxMessage.success('保存成功')
					})
				} else {
					return this.onSaveClickHandler()
				}
			})
		},
		onSaveClickHandler () {
			return this.onValidateFormData().then(this.onSaveOrganHandler)
		},
		onSaveOrganHandler () {
			if (this.fxDataVerification.checkData(this.checkData)) {
				return Promise.resolve(this.bomDetail)
			} else {
				if (this.type === 'split_bom') {
					if (this.bomDetail.outIntoYieldZoom) {
						this.bomDetail.outIntoYield = this.bomDetail.outIntoYieldZoom / 100
					}
				}
				const logger = this.$fxLogger.createInfo('basic-archives.bom.update', this.createLoggerParams())
				return this.$fxApi('bom.editBom', this.type)({ data: this.bomDetail, logger }).then(res => {
					this.fxDataVerification.resetData(this.checkData)
					this.$fxMessage.success('保存成功')
					return Promise.resolve(res)
				})
			}
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			const bomDetail = this.$fxUtils.deepClone(this.bomDetail)
			if (originData.unit) {
				originData.unitName = originData.unit.name
				bomDetail.unitName = bomDetail.unit.name
			}
			return {
				pre: originData,
				cur: bomDetail,
				name: bomDetail.name
			}
		},
		onValidateFormData () {
			return new Promise(resolve => {
				this.$refs.basicInfo.validate().then(() => {
					resolve()
				}).catch(() => {
					this.$fxMessage.warning('请填写必填信息')
				})
			})
		},
		onMultipleImportClick (val) {
			this.type = val
			this.$refs.multipleImport.open()
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.info {
	display: flex
  flex-direction: column
	flex 1
}
.basicContainer {
	flex 0
}
.footer-btn {
	display flex
	justify-content: flex-end
	padding-right 20px
	padding-bottom 10px
}
</style>
