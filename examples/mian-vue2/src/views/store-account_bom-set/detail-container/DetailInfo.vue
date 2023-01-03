<template>
	<w-app-container>
		<fx-page-header title="BOM详情"></fx-page-header>
		<div class="detailsContainer">
			<fx-details-table
				ref="detailsTable"
				:tableSearchInput='false'
				:disabled='detailDisabled || !computedAuth.editDetailsAuth'
				:tableColumn="computedColumn"
				:tableValiDate="[...commonValidate, ...tableValiDate]"
				:tableData="tableData"
				:tableEditColumnProp="tableEditColumnProp"
				:mainId="bomDetail.id"
				:fpSaveMain="fSaveMain"
				:fpBeforeRowEdit="beforeRowEdit"
				:fpInitAddDetailsData="fpInitAddDetailsData"
				:fpSaveDetails="fpSaveDetails"
				:fpDeleteDetails="fpDeleteDetails"
				:selectedRows="selectedRows"
				:fullScreenBtn='false'
				:rowClassName="rowClassName"
				:canAdd="computedAuth.addDetailsAuth"
				:showSummary="!isType('split_bom')"
				:showMulitySettingBtn="computedAuth.editDetailsAuth"
				:showDeleteBtn="computedAuth.delDetailsAuth"
				@on-details-refresh="onDetailsRefresh"
				@on-add-mulity="onAddMulity"
			>
				<template slot="btn-tools-left">
					<w-link
						v-show="showCopyConnect"
						v-fx-auth="computedAuth.editDetailsAuth"
						:disabled="detailDisabled"
						icon="copy-mulity"
						@click="copyConnect"
					>复制到其他BOM</w-link>
					<w-link
						v-show="showCopyWithBom"
						v-fx-auth="computedAuth.editDetailsAuth"
						:disabled="detailDisabled"
						icon="copy-single"
						@click="copyWithBom"
					>与其他BOM一致</w-link>
					<w-link :disabled="detailDisabled" v-fx-auth="computedAuth.lowerItemsAuth" icon="lower-items" @click="showLowerItems">查看下级配料</w-link>
					<w-link v-fx-auth="computedAuth.importAuth" icon="icon-import" @click="onImportClick">导入</w-link>
					<w-link v-fx-auth="computedAuth.exportAuth"  icon="export-data-blue" @click="onExportClick">导出明细数据</w-link>
					<w-link :disabled="detailDisabled" icon="get-price" @click="getConsultCost">获取参考成本</w-link>
					<w-link v-if="isType('food_bom') && realtimeStock && false" icon="push-middle-ground" @click="pushMiddleGround">推送中台</w-link>
					<w-link v-fx-auth="computedAuth.replaceMulity" icon="replace" @click="replaceMulity">批量替换配料</w-link>
				</template>
				<settingMulity
					:slot="settingMulitySlot"
					slot-scope="{ visible }"
					:visible="visible"
					:bomDetail="bomDetail"
					:type='type'
					@on-cancel-click="onSettingMulityClose"
					@set-mulity='setMulity'
				></settingMulity>
			</fx-details-table>
		</div>
		<addMulity
			ref="addMulity"
			:bomDetail="bomDetail"
			:type='type'
			@on-details-refresh="onDetailsRefresh"
		></addMulity>
		<consultCost ref="consultCost" :type='type' :bomDetail='bomDetail' @tableDataConsultCost="tableDataConsultCost"></consultCost>
		<lowerItems ref='lowerItems' @addInCard='addInCard' :type='type' :bomDetail='bomDetail' @refresh='onDetailsRefresh'></lowerItems>
		<connectSetting ref='connectSetting' :type='type' :bomDetail='bomDetail' @refresh='onDetailsRefresh'></connectSetting>
		<copyConnect ref='copyConnect' :type='type' :bomDetail='bomDetail'></copyConnect>
		<copyWithBom ref='copyWithBom' :type='type' :bomDetail='bomDetail' @refresh='onDetailsRefresh'></copyWithBom>
		<replaceMulity ref='replaceMulity' :type='type' :bomDetail='bomDetail' @refresh='onDetailsRefresh'></replaceMulity>
	</w-app-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import lowerItems from './LowerItems.vue'
import settingMulity from './SettingMulity.vue'
import consultCost from './ConsultCost.vue'
import addMulity from './add-mulity-details/AddMulity.vue'
import connectSetting from '../basic-container/connect-organ.vue'
import copyConnect from './connect/copy-connect.vue'
import copyWithBom from './connect/copy-with-bom.vue'
import replaceMulity from './replace-mulity/Index.vue'
export default {
	name: 'bomDetail',
	components: {
		lowerItems,
		settingMulity,
		consultCost,
		addMulity,
		connectSetting,
		copyConnect,
		copyWithBom,
		replaceMulity
	},
	props: {
		type: String,
		bomDetail: {
			type: Object,
			default: () => {
				return {
					default: 1
				}
			}
		},
		fSaveMain: Function,
		selectedRows: {
			type: Array,
			default: () => {
				return []
			}
		},
		detailDisabled: Boolean
	},
	data () {
		return {
			itemList: [],
			basic_column: [
				{
					prop: 'code',
					label: '一级配料编号',
					width: '150px',
					required: true,
					editColumn: true,
					fxRender: this.codeRender,
					click: this.onCellClick('code')
				},
				{ prop: 'item.name', label: '一级配料名称', required: true }
			],
			unit_column: [{
				prop: 'unit',
				label: '一级配料单位',
				width: '120px',
				required: true,
				editColumn: true,
				fxRender: this.unitRender,
				click: this.onCellClick('unit')
			}],
			spec_column: [{ prop: 'item.spec', label: '规格', width: '100px' }],
			child_bom_column: [
				{
					prop: 'childBom',
					label: '下级BOM',
					width: '140px',
					required: true,
					editColumn: true,
					fxRender: this.childBomListRender,
					click: this.onCellClick('childBom')
				}
			],
			ratio_column: [
				{
					prop: 'outputYield',
					label: '标准产出率',
					width: '120px',
					required: true,
					editColumn: true,
					fxRender: this.outputYieldRender,
					click: this.onCellClick('outputYield')
				}
			],
			count_column: [
				{
					prop: 'materialDosage',
					label: '净料用量',
					width: '120px',
					required: true,
					editColumn: true,
					fxRender: this.materialDosageRender,
					click: this.onCellClick('materialDosage')
				},
				{
					prop: 'materialRate',
					label: '净料率',
					width: '120px',
					required: true,
					editColumn: true,
					fxRender: this.materialRateRender,
					click: this.onCellClick('materialRate')
				},
				{
					prop: 'rawMaterialDosage',
					label: '毛料用量',
					width: '120px',
					required: true,
					editColumn: true,
					fxRender: this.rawMaterialDosageRender,
					click: this.onCellClick('rawMaterialDosage')
				}
			],
			offset_column: [
				{
					prop: 'offsetType',
					label: '冲减方式',
					width: '120px',
					required: true,
					editColumn: true,
					fxRender: this.offsetTypeRender,
					click: this.onCellClick('allOrgan'),
					renderHeader: this.offsetTypeRenderHeader
				}
			],
			organ_column: [
				{
					prop: 'allOrgan',
					label: '适用机构',
					width: '180px',
					required: true,
					editColumn: true,
					fxRender: this.organRender,
					click: this.onCellClick('allOrgan')
				}
			],
			type_column: [
				{
					prop: 'ingredientsType',
					label: '配料类型',
					width: '180px',
					required: true,
					editColumn: true,
					fxRender: this.ingredientsTypeRender,
					click: this.onCellClick('ingredientsType')
				}
			],
			date_column: [
				{
					prop: 'beginDate',
					label: '生效日期',
					width: '200px',
					required: true,
					editColumn: true,
					fxRender: this.beginDateRender,
					click: this.onCellClick('beginDate')
				},
				{
					prop: 'endDate',
					label: '失效日期',
					width: '200px',
					required: true,
					editColumn: true,
					fxRender: this.endDateRender,
					click: this.onCellClick('endDate')
				},
				{
					prop: 'price',
					label: '参考成本价',
					formatter: (row) => {
						if (row.price !== '') {
							return this.$fxCommon.toFixedAutoZeroFill(row.price, this.sysPricePointSize)
						}
					},
					renderHeader: this.renderPriceHeader
				},
				{
					prop: 'money',
					label: '参考成本金额',
					summary: true,
					formatter: (row) => {
						if (row.money !== '') {
							return this.$fxCommon.toFixedAutoZeroFill(row.money, this.sysMoneyPointSize)
						}
					},
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{ prop: 'organName', label: '取价机构' },
				{ prop: 'businessDate', label: '取价时间', width: '150px' },
				{
					prop: 'memo',
					label: '备注',
					editColumn: true,
					fxRender: this.memoRender,
					click: this.onCellClick('memo')
				},
				{
					prop: 'modifyDate',
					label: '最新修改日期',
					width: '140px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.modifyDate)
					}
				},
				{ prop: 'modifyMan.name', label: '修改人' }
			],
			selectOptionProp: {
				name: 'code',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			filterKeys: ['name', 'code', 'pinYin', 'spec', 'itemUnitList.barcode'],
			ingredientsTypeList: this.$fxTypeMiddleware.getCommonTypeList('ingredientsType'),
			childBomList: [],
			fxCalculation: this.$fxCalculation('bomSet')
		}
	},
	computed: {
		...mapState({
			sysPointSize: state => state.system.sysPointSize,
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize
		}),
		...mapGetters(['detailsAuthGetter', 'moduleAuthGetter', 'getSysParams']),
		tableData () {
			return this.bomDetail.details
		},
		computedAuth () {
			const authObj = {
				food_bom: {
					addDetailsAuth: this.detailsAuthGetter('basic-archives_bom-set_food-bom.add-food-bom-details'),
					editDetailsAuth: this.detailsAuthGetter('basic-archives_bom-set_food-bom.edit-food-bom-details'),
					delDetailsAuth: this.detailsAuthGetter('basic-archives_bom-set_food-bom.delete-food-bom-details'),
					lowerItemsAuth: this.moduleAuthGetter('basic-archives_bom-set_food-bom'),
					importAuth: this.detailsAuthGetter('basic-archives_bom-set_food-bom.import-food-bom-details'),
					exportAuth: this.detailsAuthGetter('basic-archives_bom-set_food-bom.export-food-bom-details'),
					replaceMulity: this.detailsAuthGetter('basic-archives_bom-set_food-bom.replace-mulity-food-bom')
				},
				compose_bom: {
					addDetailsAuth: this.detailsAuthGetter('basic-archives_bom-set_compose-bom.add-compose-bom-details'),
					editDetailsAuth: this.detailsAuthGetter('basic-archives_bom-set_compose-bom.edit-compose-bom-details'),
					delDetailsAuth: this.detailsAuthGetter('basic-archives_bom-set_compose-bom.delete-compose-bom-details'),
					lowerItemsAuth: this.moduleAuthGetter('basic-archives_bom-set_compose-bom'),
					importAuth: this.detailsAuthGetter('basic-archives_bom-set_compose-bom.import-compose-bom-details'),
					exportAuth: this.detailsAuthGetter('basic-archives_bom-set_compose-bom.export-compose-bom-details'),
					replaceMulity: this.detailsAuthGetter('basic-archives_bom-set_compose-bom.replace-mulity-compose-bom')
				},
				split_bom: {
					addDetailsAuth: this.detailsAuthGetter('basic-archives_bom-set_split-bom.add-split-bom-details'),
					editDetailsAuth: this.detailsAuthGetter('basic-archives_bom-set_split-bom.edit-split-bom-details'),
					delDetailsAuth: this.detailsAuthGetter('basic-archives_bom-set_split-bom.delete-split-bom-details'),
					lowerItemsAuth: this.moduleAuthGetter('basic-archives_bom-set_split-bom'),
					importAuth: this.detailsAuthGetter('basic-archives_bom-set_split-bom.import-split-bom-details'),
					exportAuth: this.detailsAuthGetter('basic-archives_bom-set_split-bom.export-split-bom-details'),
					replaceMulity: this.detailsAuthGetter('basic-archives_bom-set_split-bom.replace-mulity-split-bom')
				}
			}
			return authObj[this.type] || {}
		},
		computedColumn () {
			const dateColumn = this.date_column.filter(item => {
				return item.prop !== 'money'
			})
			switch (this.type) {
			case 'food_bom':
				if (this.bomDetail.productionMethod) {
					return [...this.basic_column, ...this.unit_column, ...this.spec_column, ...this.child_bom_column, ...this.count_column, ...this.offset_column, ...this.organ_column, ...this.date_column]
				} else {
					return [...this.basic_column, ...this.unit_column, ...this.spec_column, ...this.child_bom_column, ...this.count_column, ...this.organ_column, ...this.type_column, ...this.date_column]
				}
			case 'compose_bom':
				return [...this.basic_column, ...this.unit_column, ...this.spec_column, ...this.child_bom_column, ...this.count_column, ...this.date_column]
			default:
				return [...this.basic_column, ...this.spec_column, ...this.child_bom_column, ...this.ratio_column, ...dateColumn]
			}
		},
		tableEditColumnProp () {
			switch (this.type) {
			case 'food_bom':
				return ['code', 'unit', 'childBom', 'materialDosage', 'materialRate', 'rawMaterialDosage', 'ingredientsType']
			case 'compose_bom':
				return ['code', 'unit', 'childBom', 'materialDosage', 'materialRate', 'rawMaterialDosage']
			default:
				return ['code', 'childBom', 'outputYield']
			}
		},
		settingMulitySlot () {
			if (this.isAssign) {
				return ''
			} else {
				return 'setting-mulity'
			}
		},
		tableValiDate () {
			switch (this.type) {
			case 'food_bom':
				return [{
					columnProp: 'materialDosage',
					rule (row, success, error) {
						if (row.materialDosage <= 0) {
							error('净料用量必须大于0')
						} else {
							success()
						}
					}
				}, {
					columnProp: 'materialRate',
					rule (row, success, error) {
						if (row.materialRateZoom <= 0) {
							error('净料率必须大于0%')
						} else if (row.materialRateZoom > 1000) {
							error('净料率不能大于1000%')
						} else {
							success()
						}
					}
				}, {
					columnProp: 'rawMaterialDosage',
					rule (row, success, error) {
						if (row.rawMaterialDosage <= 0) {
							error('毛料用量必须大于0')
						} else {
							success()
						}
					}
				}]
			case 'compose_bom':
				return [{
					columnProp: 'materialDosage',
					rule (row, success, error) {
						if (row.materialDosage <= 0) {
							error('净料用量必须大于0')
						} else {
							success()
						}
					}
				}, {
					columnProp: 'materialRate',
					rule (row, success, error) {
						if (row.materialRateZoom <= 0) {
							error('净料率必须大于0%')
						} else if (row.materialRateZoom > 1000) {
							error('净料率不能大于1000%')
						} else {
							success()
						}
					}
				}, {
					columnProp: 'rawMaterialDosage',
					rule (row, success, error) {
						if (row.rawMaterialDosage <= 0) {
							error('毛料用量必须大于0')
						} else {
							success()
						}
					}
				}]
			default:
				return [{
					columnProp: 'outputYield',
					rule (row, success, error) {
						if (!row.outputYield) {
							error('标准产出率不能为空')
						} else {
							success()
						}
					}
				}]
			}
		},
		commonValidate () {
			return [{
				columnProp: 'code',
				rule (row, success, error) {
					if (!row.item.id) {
						error('品项编号不能为空')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'endDate',
				rule (row, success, error) {
					if (new Date(row.endDate).valueOf() < new Date(row.beginDate).valueOf()) {
						error('生效日期不能大于失效日期')
					} else {
						success()
					}
				}
			}]
		},
		showCopyConnect () {
			return !this.bomDetail.productionMethod
		},
		showCopyWithBom () {
			return !this.bomDetail.productionMethod
		},
		isType () {
			return (type) => {
				return this.type === type
			}
		},
		realtimeStock () {
			return this.getSysParams('XTGF_ITEM_STOCK', 'value')
		}
	},
	methods: {
		showLowerItems () {
			this.$refs.lowerItems.open(this.type, this.bomDetail.id)
		},
		beforeRowEdit (row) {
			return new Promise(resolve => {
				this.getItemList(this.bomDetail.id).then(() => {
					this.getChildBomList(this.bomDetail.id, row.item.id, row.childBom.id).then((res) => {
						this.childBomList = res
						if (this.type !== 'split_bom') {
							this.getUnitList(row.item.id).then((res) => {
								row.itemUnitList = res
								resolve()
							})
						} else {
							row.itemUnitList = [row.unit]
							resolve()
						}
					})
				})
			})
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		onSettingMulityClose () {
			this.$refs.detailsTable.closeMulitySettingPopver()
		},
		async fpInitAddDetailsData () {
			await this.getItemList(this.bomDetail.id)
			return new Promise(resolve => {
				const data = {
					item: {},
					unit: {},
					materialDosage: 1,
					materialRate: 1,
					materialRateZoom: 100,
					rawMaterialDosage: 1,
					outputYieldZoom: 100,
					offsetType: 1,
					outputYield: 1,
					beginDate: `${(new Date()).getFullYear()}-${(new Date()).getMonth() + 1}-${(new Date()).getDate()} 00:00:00`,
					endDate: `${(new Date()).getFullYear() + 99}-${(new Date()).getMonth() + 1}-${(new Date()).getDate()} 00:00:00`,
					allOrgan: true,
					childBom: {},
					modifyDate: '',
					ingredientsType: 0,
					businessDate: '',
					organName: '',
					price: '',
					money: ''
				}
				resolve(data)
			})
		},
		getItemList (id) {
			return this.$fxApi('bom.getItemListTab', this.type, id).then(res => {
				this.itemList = res
				return Promise.resolve()
			})
		},
		fpSaveDetails (detail, origin) {
			return this.onSaveDetailsHandler(detail, origin)
		},
		onSaveDetailsHandler (params, origin) {
			if (params.id) {
				const logger = this.$fxLogger.createInfo('basic-archives.bom.updateDetails', this.createLoggerParams(params, origin))
				return this.$fxApi('bom.editDetail', this.type, this.bomDetail.id)({ data: params, logger }).then(res => {
					this.$set(params, 'modifyDate', res.modifyDate)
					this.$set(params, 'modifyMan', res.modifyMan)
					return Promise.resolve(res)
				})
			} else {
				const addItemInfo = this.getAddItemInfo(params)
				const logger = this.$fxLogger.createInfo('basic-archives.bom.addDetail', { code: this.bomDetail.code, name: this.bomDetail.name, addItemInfo })
				return this.$fxApi('bom.addDetail', this.type, this.bomDetail.id)({ data: params, logger }).then(res => {
					params.beginDate = res.beginDate
					params.endDate = res.endDate
					this.$set(params, 'bomId', res.bomId)
					this.$set(params, 'modifyDate', res.modifyDate)
					this.$set(params, 'modifyMan', res.modifyMan)
					return Promise.resolve(res)
				})
			}
		},
		createLoggerParams (params, origin) {
			const originData = this.$fxUtils.deepClone(origin)
			const organDetails = this.$fxUtils.deepClone(params)
			return {
				pre: originData,
				cur: organDetails,
				code: this.bomDetail.code,
				name: this.bomDetail.name
			}
		},
		getAddItemInfo (params) {
			const name = params.item.name
			const unit = params.unit.name
			return `一级配料名称:${name},一级配料单位:${unit}`
		},
		fpDeleteDetails (ids) {
			const deleteItemInfo = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('basic-archives.bom.deleteDetails', { code: this.bomDetail.code, name: this.bomDetail.name, deleteItemInfo })
			return this.$fxApi('bom.delDetail', this.type, this.bomDetail.id)({ data: ids, logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		clearSelected () {
			this.$refs.detailsTable.clearSelected()
		},
		doScrollLeft () {
			this.$refs.detailsTable.doScrollLeft()
		},
		getDeleteItemInfo (ids) {
			return this.bomDetail.details.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				const name = item.item.name
				const itemUnit = item.unit.name
				return `一级配料名称:${name},单位:${itemUnit}`
			}).join(';')
		},
		onDetailsRefresh (data = this.bomDetail, refreshBomCard = false) {
			if (refreshBomCard) {
				this.$refs.lowerItems.getBomCard(this.type, this.bomDetail.id)
			}
			this.$emit('refreshBomDetail', data.id)
		},
		onAddMulity () {
			this.$refs.addMulity.open()
		},
		onSettingMulitySave (setting) {
			this.$refs.detailsTable.getSelectRows().then(res => {
			})
		},
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		copyConnect () {
			this.$refs.copyConnect.open()
		},
		copyWithBom () {
			this.$refs.copyWithBom.open()
		},
		addInCard (data) {
			this.$refs.addMulity.open(data)
		},
		//
		// RENDER 部分
		//
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
		},
		codeRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select-tab
				ref={`code-${$index}`}
				vModel={row.item.id}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='code'
				dropdownWidth='300px'
				optionRender={this.optionRender}
				selectOptionProp={this.selectOptionProp}
				filterKeys={this.filterKeys}
				cellText={row.item.code}
				selectOptionList={this.itemList}
				asyncChange={this.onCodeSelectChange}
			></fx-list-cell-select-tab>
		},
		async onCodeSelectChange (item, row) {
			row.item = item
			const unitList = await this.getUnitList(item.id)
			row.itemUnitList = unitList
			row.unit = unitList[0] || {}
			row.childBom = {}
			this.childBomList = await this.getChildBomList(this.bomDetail.id, item.id)
		},
		getUnitList (itemId) {
			return this.$fxApi('bom.getUnitList', this.type, itemId).then(res => {
				return Promise.resolve(res)
			})
		},
		getChildBomList (bomId, itemId, childBomId) {
			return this.$fxApi('bom.getChildBomList', this.type, bomId, itemId, childBomId).then(res => {
				return Promise.resolve(res)
			})
		},
		unitRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`unit-${$index}`}
				value={row.unit.id}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='unit'
				cellText={row.unit.name}
				selectOptionList={row.itemUnitList}
				on-on-change={this.onUnitSelectChange}
			></fx-list-cell-select>
		},
		onUnitSelectChange (item, row) {
			row.unit = item
		},
		materialDosageRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`materialDosage-${$index}`}
				vModel={row.materialDosage}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.materialDosage, this.sysPointSize)}
				columnProp='materialDosage'
				pointSize={this.sysPointSize}
				on-on-change={this.onMaterialDosageChange}
			>
			</fx-list-cell-input-number>
		},
		onMaterialDosageChange (item, row) {
			this.fxCalculation.changeMaterialDosage(row)
		},
		materialRateRender (h, { row, $index }) {
			h = this.$createElement
			return <section class='flex'>
				<fx-list-cell-input-number
					ref={`materialRate-${$index}`}
					vModel={row.materialRateZoom}
					isEdit={row.isEdit}
					row={row}
					rowIndex={$index}
					columnProp='materialRate'
					on-on-change={this.onMaterialRateChange}
					class='materialRate'
					cellText={row.materialRateZoom + '%'}
				>
				</fx-list-cell-input-number>
				<span vShow={row.isEdit}>%</span>
			</section>
		},
		onMaterialRateChange (val, row) {
			this.fxCalculation.changeMaterialRate(val, row)
		},
		rawMaterialDosageRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`rawMaterialDosage-${$index}`}
				vModel={row.rawMaterialDosage}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.rawMaterialDosage, this.sysPointSize)}
				columnProp='rawMaterialDosage'
				pointSize={this.sysPointSize}
				on-on-change={this.onRawMaterialDosageChange}
			>
			</fx-list-cell-input-number>
		},
		onRawMaterialDosageChange (item, row) {
			this.fxCalculation.changeRawMaterialDosage(row)
			this.fxCalculation.countMoney(row)
		},
		beginDateRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-date
				ref={`beginDate-${$index}`}
				vModel={row.beginDate}
				isEdit={row.isEdit}
				row={row}
				valueFormat='yyyy-MM-dd HH:mm:SS'
				columnProp='beginDate'
				rowIndex={$index}
				cellText={this.$fxUtils.formatterDateTime(row.beginDate)}
			>
			</fx-list-cell-date>
		},
		endDateRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-date
				ref={`endDate-${$index}`}
				vModel={row.endDate}
				isEdit={row.isEdit}
				row={row}
				valueFormat='yyyy-MM-dd HH:mm:SS'
				columnProp='endDate'
				rowIndex={$index}
				cellText={this.$fxUtils.formatterDateTime(row.endDate)}
			>
			</fx-list-cell-date>
		},
		offsetTypeRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-switch
				ref={`offsetType-${$index}`}
				vModel={row.offsetType}
				activeText='正向冲减'
				inactiveText='反向冲减'
				width={80}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='offsetType'
			></fx-list-cell-switch>
		},
		offsetTypeRenderHeader (h, column, index) {
			h = this.$createElement
			return <div>
				{ column.label }
				<el-tooltip placement="top" effect="dark" content="品项在当前做法所属单位的BOM中必须存在，才可进行反向冲减设置">
					<w-icon type="question-active" class="unit-mark-icon"></w-icon>
				</el-tooltip>
			</div>
		},
		organRender (h, { row, $index }) {
			h = this.$createElement
			const text = row.allOrgan ? '全部' : `自定义(${row.organCount || 0}个机构)`
			return <section class='flex-cell'>
				<fx-list-cell-switch
					ref={`allOrgan-${$index}`}
					vModel={row.allOrgan}
					isEdit={row.isEdit}
					activeValue={true}
					inactiveValue={false}
					activeText='全部'
					inactiveText='自定义'
					row={row}
					rowIndex={$index}
					cellText={text}
				></fx-list-cell-switch>
				<fx-list-cell-button
					ref={`allOrganBtn-${$index}`}
					isEdit={row.isEdit}
					row={row}
					rowIndex={$index}
					vShow={!row.allOrgan}
					on-on-click={this.allOrganBtnClick}
				></fx-list-cell-button>
			</section>
		},
		allOrganBtnClick (item, row) {
			this.checkDetailsUnSaving().then(() => {
				this.$refs.connectSetting.open(row, row.id || 0)
			})
		},
		ingredientsTypeRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`ingredientsType-${$index}`}
				vModel={row.ingredientsType}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='ingredientsType'
				selectOptionList={this.ingredientsTypeList}
			></fx-list-cell-select>
		},
		childBomListRender (h, { row, $index }) {
			const disabledChildBom = this.bomDetail.itemId === row.item.id && this.type === 'food_bom'
			h = this.$createElement
			return <fx-list-cell-select
				ref={`childBom-${$index}`}
				value={row.childBom.id}
				isEdit={row.isEdit}
				disabled={disabledChildBom}
				clearable={true}
				row={row}
				rowIndex={$index}
				columnProp='childBom'
				cellText={row.childBom.name}
				selectOptionList={this.childBomList}
				on-on-change={this.onChildBomChange}
			></fx-list-cell-select>
		},
		onChildBomChange (item, row) {
			row.childBom = item
		},
		outputYieldRender (h, { row, $index }) {
			h = this.$createElement
			return <section class='flex'>
				<fx-list-cell-input-number
					ref={`outputYield-${$index}`}
					vModel={row.outputYieldZoom}
					isEdit={row.isEdit}
					row={row}
					rowIndex={$index}
					columnProp='outputYield'
					pointSize='2'
					cellText={row.outputYieldZoom + '%'}
					on-on-change={this.onOutputYieldChange}
				>
				</fx-list-cell-input-number>
				<span vShow={row.isEdit}>%</span>
			</section>
		},
		onOutputYieldChange (item, row) {
			row.outputYield = item / 100
		},
		setMulity (params) {
			this.$refs.detailsTable.getSelectRows().then(ids => {
				params.detailIds = ids.map(i => i.id)
				this.$fxApi('bom.setMulity', this.type, this.bomDetail.id)({ data: params }).then(res => {
					this.onDetailsRefresh()
				})
			})
		},
		rowClassName (row) {
			return (this.$fxUtils.compareDateBetween(this.$fxUtils.setDateTime(), row.beginDate, row.endDate)) ? '' : 'failure-time'
		},
		onImportClick () {
			this.$emit('on-multiple-import-click', this.type)
		},
		transferBomType (type) {
			switch (type) {
			case 'food_bom':
				return '菜品'
			case 'compose_bom':
				return '组合'
			case 'split_bom':
				return '拆分'
			default:
				return ''
			}
		},
		onExportClick () {
			const type = this.transferBomType(this.type)
			const bomType = this.type.split('_')[0]
			const logger = this.$fxLogger.createInfo('basic-archives.bom.exportDetail', { type })
			return this.$fxApi('bom.exportDetail', bomType)({ logger }).then(res => {
				this.$fxUtils.downloadFile(res)
			})
		},
		renderPriceHeader (h, column, index) {
			const content = {
				food_bom: '1.参考成本价，取该配料的最近一次入库价 2.若配料为纯菜品、纯商品，则无法获取',
				compose_bom: '1.参考成本价，取该配料的最近一次入库价 2.若配料为纯菜品，则无法获取',
				split_bom: '1.参考成本价，取该配料的最近一次入库价 2.若配料为纯菜品，则无法获取'
			}
			h = this.$createElement
			return <div>参考成本价
				<el-popover
					placement="top-start"
					trigger="hover"
					content={content[this.type]}>
					<w-icon slot="reference" type="question-active" class="mark-icon"></w-icon>
				</el-popover>
			</div>
		},
		memoRender  (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input
				ref={`memo-${$index}`}
				vModel={row.memo}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='memo'
				class='list-cell-input'
				maxlength={this.$fxCommon.getFxInputMaxLength('memo')}
				regType={this.$fxCommon.getFxInputReg('memo')}
			></fx-list-cell-input>
		},
		getConsultCost () {
			this.$refs.consultCost.open()
		},
		tableDataConsultCost (data) {
			this.bomDetail.details.forEach(item => {
				item.businessDate = ''
				item.organName = ''
				item.price = ''
				item.money = ''
				if (data[item.id]) {
					item.businessDate = data[item.id].businessDate
					item.organName = data[item.id].organName
					item.price = data[item.id].price
					this.fxCalculation.countMoney(item)
				}
			})
		},
		pushMiddleGround () {
			const logger = this.$fxLogger.createInfo('basic-archives.bom.pushMiddleGround', { code: this.bomDetail.code, name: this.bomDetail.name })
			return this.$fxApi('bom.pushMiddleGround')({ logger })
		},
		replaceMulity () {
			this.$refs.replaceMulity.open()
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.connect-container {
	margin-left 14px
}
.button-container {
	width 100px
}
.copyBtn {
	margin-left 10px
}
.detailsContainer {
	padding 10px 20px
	flex 1
}
.flex-cell{
	display: flex
	>>>.el-button--small, .el-button--small.is-round{
		margin-left 8px
		padding 6px 9px
	}
}
.materialRate {
	width 80%
}
.flex {
	display flex
}
.unit-mark-icon {
	transform translateY(3px)
  margin-left: 5px
	width 14px
	height 14px
}
>>>.failure-time {
	color $fxRed
}
.mark-icon {
	width:16px
	height: 16px
	position: relative
	top: 4px
	left: 5px
}
.wind-link {
	display: inline-block
}
</style>

