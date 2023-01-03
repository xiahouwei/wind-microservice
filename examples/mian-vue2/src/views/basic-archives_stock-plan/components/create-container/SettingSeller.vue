<template>
	<w-dialog v-model="dialogVisible" width="1200px" :title="title" heightFullscreen @close="onClose" :beforeClose="onBeforeClose">
		<div class="create-organ">
			<treeContainer
				ref="treeContainer"
				:data="tableTreeData"
				showCheckbox
				readonly
				:showTreeWidthExtendBtn="false"
				@check="onTreeCheck"
			></treeContainer>
			<fx-transfer
				ref="transfer"
				v-model="listSelectIds"
				:tableColumn="tableColumn"
				:tableColumnRight="computedTableColumnRight"
				:tableData="computedListData"
				:filter="transferFilter"
				leftTitle="全部机构"
				rightTitle="选定机构"
			></fx-transfer>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import treeContainer from '@/components/tree-container/tree-organ-all/Index.vue'
export default {
	name: 'settingSeller',
	components: {
		treeContainer
	},
	props: {
		listData: {
			type: Array,
			default: () => {
				return []
			}
		},
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	computed: {
		computedTableColumnRight () {
			return this.key === 1 ? this.tableColumnRightKey1 : this.tableColumnRightKey0
		},
		computedListData () {
			return this.key === 1 ? this.crossOrganListData : this.organListData
		},
		crossOrganListData () {
			return this.$fxUtils.deepClone(this.listData).filter(item => {
				return !this.selectedSellerOrgan.includes(item.id)
			})
		},
		organListData () {
			return this.$fxUtils.deepClone(this.listData).filter(item => {
				return !this.selectedCrossOrgan.includes(item.id)
			})
		}
	},
	watch: {
		listSelectIds (val) {
			if (!this.isDefault || !val.includes(this.isDefault)) {
				this.isDefault = val[0]
			}
			if (this.key === 1) {
				this.selectedCrossOrgan = val
			} else {
				this.selectedSellerOrgan = val
			}
		}
	},
	data () {
		return {
			dialogVisible: false,
			tableTreeData: [],
			treeCheckedKeys: [],
			tableColumn: [
				{ prop: 'code', label: '机构编号', required: true },
				{ prop: 'name', label: '机构名称', required: true }
			],
			tableColumnRightKey1: [
				{ prop: 'code', label: '机构编号', width: '100px', required: true },
				{ prop: 'name', label: '机构名称', width: '140px', required: true },
				{
					prop: 'isDefault',
					label: '默认供货机构',
					className: 'table-radio',
					required: true,
					width: '100px',
					fxRender: this.radioRender
				},
				{
					prop: 'crossHouse',
					label: '出库仓库',
					required: true,
					width: '200px',
					fxRender: this.crossHouseRender
				}
			],
			tableColumnRightKey0: [
				{ prop: 'code', label: '机构编号', width: '100px', required: true },
				{ prop: 'name', label: '机构名称', width: '140px', required: true },
				{
					prop: 'sellerHouse',
					label: '出库仓库',
					required: true,
					width: '200px',
					fxRender: this.sellerHouseRender
				}
			],
			tableSearchKey: '',
			listSelectIds: [],
			title: '',
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			titleConfig: ['选择卖方机构', '选择越库实际供货方'],
			isDefault: '',
			key: 0,
			selectedSellerOrgan: [],
			selectedCrossOrgan: []
		}
	},
	methods: {
		open (key, ids, defaultCrossOrgan) {
			this.key = key
			this.title = this.titleConfig[key]
			this.listSelectIds = ids
			this.isDefault = defaultCrossOrgan
			this.initOrganTree().then(() => {
				this.dialogVisible = true
				this.fxDataVerification.resetData(this.listSelectIds)
				this.$nextTick(() => {
					this.$refs.transfer.doTableLayout()
				})
			})
		},
		edit (ids, organs, crossHouseMap, crossHouseNameMap, sellerOrgan) {
			this.key = 1
			this.title = this.titleConfig[1]
			this.listSelectIds = ids
			this.selectedSellerOrgan = [sellerOrgan]
			const defaultOrgan = organs.find(item => item.isDefault)
			this.isDefault = defaultOrgan ? defaultOrgan.crossOrgan : ''
			this.crossOrganListData.forEach(item => {
				this.$set(item, 'crossHouse', crossHouseMap[item.id] || '')
				this.$set(item, 'crossHouseName', crossHouseNameMap[item.id] || '')
			})
			this.initOrganTree().then(() => {
				this.dialogVisible = true
				this.fxDataVerification.resetData(this.listSelectIds)
			})
		},
		onClose () {
			this.$refs.treeContainer.clearSearchInput()
			this.$refs.transfer.refresh()
		},
		onCancelClick () {
			this.verificationDetails().then(() => {
				this.dialogVisible = false
			})
		},
		onSaveClick () {
			if (!this.listSelectIds.length) {
				this.$fxMessage.warning('请' + this.titleConfig[this.key])
				return false
			}
			const selected = this.listSelectIds.map(item => {
				const findObj = this.computedListData.find(obj => {
					return obj.id === item
				})
				return {
					code: findObj.code,
					name: findObj.name,
					id: findObj.id,
					sellerHouse: findObj.sellerHouse,
					sellerHouseName: findObj.sellerHouseName,
					crossHouseName: findObj.crossHouseName,
					crossHouse: findObj.crossHouse
				}
			})
			// key-判断卖方还是越库； listSelectIds-id； selected-table回显所需数据； isDefault-越库默认供货机构
			this.$emit('on-save-click', this.key, this.listSelectIds, selected, this.isDefault)
			this.dialogVisible = false
		},
		initOrganTree () {
			return this.$fxApi('common.getTreeByType')({
				data: [{
					type: 'Organ',
					level: 1
				}, {
					type: 'Supplier',
					level: 1
				}, {
					type: 'Customer',
					level: 1
				}]
			}).then(res => {
				this.treeCheckedKeys = []
				this.tableTreeData = res
				return Promise.resolve()
			})
		},
		onTreeCheck (data, { checkedKeys }) {
			this.treeCheckedKeys = checkedKeys
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.listSelectIds)
		},
		onBeforeClose (close) {
			this.verificationDetails().then(close)
		},
		transferFilter (item) {
			return this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.id)
		},
		radioRender (h, { row, $index }) {
			h = this.$createElement
			return <div on-click={() => { event.stopPropagation() }}>
				<el-radio
					vModel={this.isDefault}
					label={row.id}
				>
				</el-radio>
			</div>
		},
		sellerHouseRender (h, { row, $index }) {
			h = this.$createElement
			return <w-select
				vModel={row.sellerHouse}
				optionlist={row.store || []}
				class="form-item-input"
				dropdownWidth='240px'
				defaultText={row.sellerHouseName}
				optionRender={this.optionRender}
				on-change={(id, store) => this.onSellerHouseChange(row, store)}
			></w-select>
		},
		onSellerHouseChange (row, store) {
			row.sellerHouseName = store.name
		},
		crossHouseRender (h, { row, $index }) {
			h = this.$createElement
			return <w-select
				vModel={row.crossHouse}
				optionlist={row.store || []}
				class="form-item-input"
				dropdownWidth='240px'
				defaultText={row.crossHouseName}
				optionRender={this.optionRender}
				on-change={(id, store) => this.onCrossHouseChange(row, store)}
			></w-select>
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
		},
		onCrossHouseChange (row, store) {
			row.crossHouseName = store.name
		},
		initOutStore () {
			this.crossOrganListData.forEach(item => {
				this.$set(item, 'crossHouse', '')
				this.$set(item, 'crossHouseName', '')
			})
			this.organListData.forEach(item => {
				this.$set(item, 'sellerHouse', '')
				this.$set(item, 'sellerHouseName', '')
			})
		},
		initSelectedOrgans () {
			this.selectedSellerOrgan = []
			this.selectedCrossOrgan = []
		},
		initSelectedCrossOrgans () {
			this.selectedCrossOrgan = []
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-organ {
	flex: 1
	width: 1150px
	height: 700px
	display: flex;
	flex-direction: row;
	overflow: auto;
	.tree-container {
		margin-top:21px
	}
}
</style>
