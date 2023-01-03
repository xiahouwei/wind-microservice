<template>
	<w-collapse v-model="collapseVisible" disabled :showArrow="false" title="规格信息">
		<div class="spec-container">
			<el-form ref="form" :model="specInfoForm" size="mini" label-width="100px" inline>
				<div class="spec-row" v-for="(item, index) in specInfoForm.specInfo" :key='index'>
					<div class="info">
						<el-form-item :prop="`specInfo.${index}.name`" :label="`规格${index+1}名称：`" :rules="rules.name">
							<w-input
								ref='name'
								v-model="item.name"
								:disabled='disabled'
							></w-input>
						</el-form-item>
						<span class="value-text">{{`规格${index+1}-值：`}}</span>
						<div class="spec-item" v-for="(specItem, specIndex) in item.spec_value" :key='specIndex'>
							<el-form-item :prop="`specInfo.${index}.spec_value.${specIndex}.name`" label="" :rules="rules.info">
								<w-input
									:ref="`spec${index}-${specIndex}`"
									:disabled='disabled'
									v-model="specItem.name"
									class="spec-item-input"
									@change='changeSpecItem(index, specIndex)'
								></w-input>
							</el-form-item>
							<w-link
								v-if='showDelSpecItemIcon(index, specIndex)'
								icon="spec-del"
								@click='onDelSpecItem(index, specIndex)'
								class="del-spec-item-icon"
							></w-link>
						</div>
						<div class="spec-item" v-show='showAddSpecItemIcon(index)'>
							<w-link icon="spec-add" @click='onAddSpecItem(index)'></w-link>
						</div>
					</div>
					<div class="row-del" v-show='showDelSpecRowIcon(index)'>
						<w-link icon="spec-del" @click='onDelSpecRow(index)'></w-link>
					</div>
				</div>
				<el-button
					class="add-spec-row-btn"
					@click="onAddSpecRow"
					v-show='showAddSpecRowBtn'
					:disabled='!canAddSpecRow'
				>+ 添加规格</el-button>
			</el-form>
		</div>
		<el-form ref="detailsTableForm" :model="detailsTableForm" size="mini" label-width="100px" inline class='details-form'>
			<fx-details-table
				ref="detailsTable"
				:tableColumn="tableColumn"
				:disabled='disabled'
				:tableData="detailsTableForm.tableData"
				:canAdd="false"
				:selectable="false"
				:showTools="false"
				:showIndex='false'
				:stripe="false"
				:trHeight='102'
				minHeight='600px'
				:highlightCurrentRow="false"
				:rowStyle='rowStyle'
				border
			>
			</fx-details-table>
		</el-form>
		<itemArchive ref='itemArchive'></itemArchive>
	</w-collapse>
</template>
<script>
import { apiName } from '../../Index.vue'
import itemArchive from './ItemArchive.vue'
export default {
	name: 'detailsInfo',
	components: {
		itemArchive
	},
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		disabled: Boolean
	},
	data () {
		const checkSpecValue = (rule, value, callback) => {
			if (!value) {
				callback(new Error('不能为空'))
			} else {
				const keys = rule.field.split('.')
				const names = this.specInfoForm.specInfo[keys[1]].spec_value.filter(item => {
					return item.name === value
				})
				if (names.length > 1) {
					callback(new Error('规格值重复'))
				} else {
					callback()
				}
			}
		}
		return {
			collapseVisible: true,
			specInfoForm: {
				specInfo: [
					{
						name: '',
						level: 1,
						id: this.$fxUtils.createUUID(),
						spec_value: []
					}
				]
			},
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			basicInfo: {
				price: 0,
				sku_id: '',
				relateSpecName: '',
				itemArchive: {},
				itemUnit: {},
				itemUnitList: [],
				sale_flag: true,
				filelist: [],
				exchange: '',
				sku_weight: 0
			},
			basicColumn: [
				{ prop: 'price', label: '建议售价(￥)', width: '100px', fxRender: this.priceRender },
				{ prop: 'relateSpec', label: '品项档案', width: '220px', fxRender: this.relateSpecRender },
				{ prop: 'unit', label: '单位', fxRender: this.unitRender },
				{ prop: 'exchange', label: '单位换算' },
				{ prop: 'sku_weight', label: '标准重量' },
				{ prop: 'sku_cost_price', label: '成本价' },
				{ prop: 'img', label: '规格主图', fxRender: this.imageRender },
				{ prop: 'sale_flag', label: '是否售卖', fxRender: this.saleRender }
			],
			detailsTableForm: {
				tableData: []
			},
			rules: {
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				info: [{ required: true, validator: checkSpecValue, trigger: 'no' }],
				relate: [{ required: true, message: '请关联品项档案', trigger: 'no' }]
			},
			index2Eng: ['one', 'two', 'three'],
			unitSelectLoading: false
		}
	},
	computed: {
		canAddSpecRow () {
			return !!this.specInfoForm.specInfo[0].spec_value.length
		},
		tableColumn () {
			const res = []
			for (const i in this.specInfoForm.specInfo) {
				res.push({
					prop: `spec_value_name_${this.index2Eng[i]}`,
					label: this.specInfoForm.specInfo[i].name,
					width: '150px',
					rowMerge: `rowspan${i * 1 + 1}`
				})
			}
			const column = this.basicColumn
			return res.concat(column)
		},
		showAddSpecItemIcon () {
			return (idx) => {
				return this.specInfoForm.specInfo[idx].spec_value.length < 10 && !this.disabled
			}
		},
		showDelSpecItemIcon () {
			return (idx) => {
				return this.specInfoForm.specInfo[idx].spec_value.length !== 1 && !this.disabled
			}
		},
		showAddSpecRowBtn () {
			return this.specInfoForm.specInfo.length < 3 && !this.disabled
		},
		showDelSpecRowIcon () {
			return (idx) => {
				return idx > 0 && !this.disabled
			}
		}
	},
	methods: {
		init () {
			this.specInfoForm = {
				specInfo: [
					{
						name: '',
						level: 1,
						id: this.$fxUtils.createUUID(),
						spec_value: []
					}
				]
			}
			this.detailsTableForm = {
				tableData: []
			}
		},
		onEdit () {
			this.specInfoForm.specInfo = this.organDetails.spec
			this.detailsTableForm.tableData = this.organDetails.spu_sku
			this.detailsTableForm.tableData.forEach(item => {
				item.filelist = item.pic ? [item.pic] : []
				item.itemUnitList = [{
					id: item.sku_unit_id,
					name: item.sku_unit
				}]
				item.exchange = `1 ${item.sku_unit} = ${item.sku_unit_ratio} ${item.sku_main_unit_name}`
			})
			this.upDateRowSpan()
			return Promise.resolve()
		},
		onAddSpecRow () {
			this.specInfoForm.specInfo.push({
				name: '',
				level: this.specInfoForm.specInfo.length + 1,
				id: this.$fxUtils.createUUID(),
				spec_value: [{
					name: '',
					id: this.$fxUtils.createUUID()
				}]
			})
			this.flatData()
		},
		onAddSpecItem (idx) {
			const copy = this.$fxUtils.deepClone(this.detailsTableForm.tableData)
			const originData = {}
			for (const item of copy) {
				originData[item.spec_value_id_one + (item.spec_value_id_two || '0') + (item.spec_value_id_three || '0')] = item
			}
			this.specInfoForm.specInfo[idx].spec_value.push({
				name: '',
				id: this.$fxUtils.createUUID()
			})
			this.$nextTick(() => {
				this.$refs[`spec${idx}-${(this.specInfoForm.specInfo[idx].spec_value.length - 1)}`][0].focus()
			})
			this.flatData(true, originData)
		},
		rewriteData (originData) {
			this.detailsTableForm.tableData.forEach(item => {
				const id = item.spec_value_id_one + (item.spec_value_id_two || '0') + (item.spec_value_id_three || '0')
				if (originData[id]) {
					for (const key in originData[id]) {
						if (key !== 'rowspan1' && key !== 'rowspan2' && key !== 'rowspan3') { item[key] = originData[id][key] }
					}
				}
			})
		},
		flatData (rewrite = false, originData = []) {
			const data = []
			const basicInfo = this.basicInfo
			const spec1 = this.specInfoForm.specInfo[0].spec_value
			if (spec1.length) {
				for (const i1 in spec1) {
					if (this.specInfoForm.specInfo[1] && this.specInfoForm.specInfo[1].spec_value.length) {
						const spec2 = this.specInfoForm.specInfo[1].spec_value
						for (const i2 in spec2) {
							if (this.specInfoForm.specInfo[2] && this.specInfoForm.specInfo[2].spec_value.length) {
								const spec3 = this.specInfoForm.specInfo[2].spec_value
								for (const i3 in spec3) {
									data.push({
										spec_value_name_one: spec1[i1].name,
										spec_value_id_one: spec1[i1].id,
										spec_value_name_two: spec2[i2].name,
										spec_value_id_two: spec2[i2].id,
										spec_value_name_three: spec3[i3].name,
										spec_value_id_three: spec3[i3].id,
										rowspan1: (i2 === '0' && i3 === '0') ? spec2.length * spec3.length : 0,
										rowspan2: i3 === '0' ? spec3.length : 0,
										rowspan3: 1,
										...this.$fxUtils.deepClone(basicInfo)
									})
								}
							} else {
								data.push({
									spec_value_name_one: spec1[i1].name,
									spec_value_id_one: spec1[i1].id,
									spec_value_name_two: spec2[i2].name,
									spec_value_id_two: spec2[i2].id,
									rowspan1: i2 === '0' ? spec2.length : 0,
									rowspan2: 1,
									...this.$fxUtils.deepClone(basicInfo)
								})
							}
						}
					} else {
						data.push({
							spec_value_name_one: spec1[i1].name,
							spec_value_id_one: spec1[i1].id,
							rowspan1: 1,
							...this.$fxUtils.deepClone(basicInfo)
						})
					}
				}
			}
			this.detailsTableForm.tableData = data
			this.$nextTick(() => {
				if (rewrite) {
					this.rewriteData(originData)
				}
			})
		},
		onDelSpecItem (index, specIndex) {
			const id = this.specInfoForm.specInfo[index].spec_value[specIndex].id
			this.specInfoForm.specInfo[index].spec_value.splice(specIndex, 1)
			this.detailsTableForm.tableData = this.detailsTableForm.tableData.filter(item => {
				return item[`spec_value_id_${this.index2Eng[index]}`] !== id
			})
			if (this.specInfoForm.specInfo[index].spec_value.length === 0) {
				this.flatData()
			} else {
				this.$nextTick(() => {
					this.upDateRowSpan()
				})
			}
		},
		changeSpecItem (index, specIndex) {
			const id = this.specInfoForm.specInfo[index].spec_value[specIndex].id
			for (const i of this.detailsTableForm.tableData) {
				if (i[`spec_value_id_${this.index2Eng[index]}`] === id) {
					i[`spec_value_name_${this.index2Eng[index]}`] = this.specInfoForm.specInfo[index].spec_value[specIndex].name
				}
			}
		},
		upDateRowSpan () {
			const spec2Length = this.specInfoForm.specInfo[1] ? this.specInfoForm.specInfo[1].spec_value.length : 0
			const spec3Length = this.specInfoForm.specInfo[2] ? this.specInfoForm.specInfo[2].spec_value.length : 0
			for (const i in this.detailsTableForm.tableData) {
				const ele = this.detailsTableForm.tableData[i]
				if (spec3Length > 0) {
					ele.rowspan3 = 1
					ele.rowspan2 = i % spec3Length === 0 ? spec3Length : 0
					ele.rowspan1 = i % (spec2Length * spec3Length) === 0 ? (spec2Length * spec3Length) : 0
				} else if (spec2Length > 0) {
					ele.rowspan3 = 1
					ele.rowspan2 = 1
					ele.rowspan1 = i % spec2Length === 0 ? spec2Length : 0
				} else {
					ele.rowspan3 = 1
					ele.rowspan2 = 1
					ele.rowspan1 = 1
				}
			}
		},
		onDelSpecRow (idx) {
			this.$fxConfirm('确认删除吗？删除该等级规格，规格组合重新生成，所有规格组合需重新关联规格').then(() => {
				this.specInfoForm.specInfo.splice(2, 1)
				if (idx === 1) {
					this.specInfoForm.specInfo.splice(1, 1)
				}
				this.$nextTick(() => {
					this.flatData()
				})
			})
		},
		validate () {
			if (this.specInfoForm.specInfo[0].spec_value.length) {
				return Promise.all([
					this.$refs.form.validate(),
					this.$refs.detailsTableForm.validate()
				])
			} else {
				return Promise.reject(new Error('规格1的规格值未添加'))
			}
		},
		priceRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`price-${$index}`}
				isEdit={true}
				vModel={row.price}
				disabled={this.disabled}
				row={row}
				rowIndex={$index}
				columnProp='price'
			>
			</fx-list-cell-input-number>
		},
		relateSpecRender (h, { row, $index }) {
			h = this.$createElement
			if (row.sku_id) {
				return <div class='sku_name_container'>
					<span class='sku_name_text'>
						{`${row.sku_name} ${row.sku_code}`}
					</span>
					<fx-list-cell-button
						ref={`relateSpec-${$index}`}
						isEdit={true}
						row={row}
						rowIndex={$index}
						vShow={!this.disabled}
						columnProp='relateSpec'
						on-on-click={this.relateArchive}
						buttonText='切换'
						className='relateBtn'
					></fx-list-cell-button>
				</div>
			} else {
				return <el-form-item prop={`tableData.${$index}.sku_id`} label="" rules={this.rules.relate}>
					<fx-list-cell-button
						ref={`relateSpec-${$index}`}
						isEdit={true}
						row={row}
						rowIndex={$index}
						vShow={!this.disabled}
						on-on-click={this.relateArchive}
						buttonText='关联品项档案'
					></fx-list-cell-button>
				</el-form-item>
			}
		},
		unitRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`unit-${$index}`}
				vModel={row.sku_unit_id}
				isEdit={true}
				disabled={!row.sku_id || this.disabled}
				row={row}
				rowIndex={$index}
				columnProp='unit'
				selectOptionList={row.itemUnitList}
				fpSelectShow={this.onUnitSelectShow(row)}
				loading={this.unitSelectLoading}
				on-on-change={this.onUnitSelectChange}
			></fx-list-cell-select>
		},
		onUnitSelectChange (item, row) {
			row.sku_unit = item.name
			row.sku_cost_price = item.cost_price
			row.price = item.sale_price
			this.$fxMessage.success('价格已切换')
		},
		onUnitSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.unitSelectLoading = true
					this.getSkuUnitlist(row.sku_id).then(res => {
						this.unitSelectLoading = false
						row.itemUnitList = res
						resolve()
					})
				})
			}
		},
		getSkuUnitlist (id) {
			return this.$fxApi(`${apiName}.getSkuUnitlist`, id)({ loading: false })
		},
		saleRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-switch
				ref={`sale_flag-${$index}`}
				vModel={row.sale_flag}
				disabled={this.disabled}
				activeText='是'
				inactiveText='否'
				isEdit={true}
				row={row}
				rowIndex={$index}
				columnProp='sale_flag'
				width={56}
				activeValue={true}
				inactiveValue={false}
			></fx-list-cell-switch>
		},
		imageRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-upload
				ref={`image-${$index}`}
				vModel={row.filelist}
				disabled={this.disabled}
				isEdit={true}
				row={row}
				rowIndex={$index}
				columnProp='image'
				on-change={this.changePic}
			></fx-list-cell-upload>
		},
		changePic (item, row) {
			row.pic = item[0]
		},
		relateArchive (item, row) {
			this.$refs.itemArchive.open(row)
		},
		rowStyle (item, index) {
			return {
				position: 'relative',
				zIndex: this.detailsTableForm.tableData.length - index
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.spec-row {
	display: flex
	margin-bottom: 14px
	.info {
		flex: 1
		margin-top: 14px
		display: flex
		align-items: center
		.value-text {
			margin-left: 14px
		}
	}
	.row-del {
		width: 26px
	}
	>>>.el-form-item {
		margin: 0
	}
}
.spec-item {
	display: inline-block
	position: relative
	width: 80px
	margin-right: 10px
	>>>.spec-item-input {
		border-radius: 4px;
		input {
			background: #eee;
			text-align: center;
			border: none;
		}
	}
	.del-spec-item-icon {
		position: absolute
		top: -15px
		right: -18px
	}
	>>>.wind-link {
		line-height: 26px
	}
}
.add-spec-row-btn {
	width: 100%
	margin-bottom: 16px
}
.relateBtn {
	display: inline-block
}
.details-form {
	>>>.el-form-item__error{
		transform: translate(120px,-20px)
	}
	>>>.el-form-item {
		margin-bottom: 0
		display: flex
		align-items: center
	}
	>>>.wind-virtual-table__tr {
		line-height: 102px!important
	}
	>>>.wind-upload__item {
		margin-top: 10px
	}
}
>>>thead {
	tr {
		height: 45px!important
		line-height: 45px!important
	}
}
.sku_name_container {
	display: flex
}
.sku_name_text {
	flex: 1
	display: inline-block
	overflow: hidden
	text-overflow: ellipsis
	white-space: nowrap
}
</style>
