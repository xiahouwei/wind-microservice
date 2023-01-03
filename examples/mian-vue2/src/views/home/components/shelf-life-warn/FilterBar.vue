<template>
	<fx-list-filter labelWidth="80px" @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item required label="机构">
				<w-select-tab-mulity
					v-model="filter.organIds"
					:optionlist="organList"
					class="form-input"
					@change="organIdChange"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="仓库">
				<w-select-tab-mulity
					v-model="filter.houseIds"
					:optionlist="houseList"
					:optionRender="optionRender"
					class="form-input"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="所属类别">
				<w-cascader
					ref="cascader"
					v-model="filter.itemTypes"
					collapseTags
					:options="itemCascaderData"
					:optionProps="itemTypeProps"
					:showAllLevels="false"
					:filterable="false"
					class="form-item-input"
				>
			</w-cascader>
			</el-form-item>
			<el-form-item label="品项名称">
				<w-select-tab-mulity
					v-model="filter.itemIds"
					:optionlist="itemList"
					class="form-input"
					:showEmpty='false'
				>
				</w-select-tab-mulity>
			</el-form-item>
			<el-form-item required label="预警天数">
				<el-tooltip
					placement="bottom-start"
					effect="light"
				>
					<div slot="content" class="label-tip">
						1.支持对所有该机构下所有设置保质期的品项预警天数按“天”进行设置,设置后,根据计算公式:【保质期-(当前时间-生产日期)】进行查询
						<br/>1)正常:保质期-(当前时间-生产日期)>预警天数,则显示正常,列表中不显示数据;
						<br/>2)预警:0&lt;保质期-(当前时间-生产日期)&lt;=预警天数,则显示预警,列表显示预警状态显示预警;
						<br/>3)超期:保质期-(当前时间-生产日期)&lt;0,则为已超期,列表显示预警状态显示超期;
					</div>
					<w-icon type="question-active" class="mark-icon"></w-icon>
				</el-tooltip>
				<w-input-number v-model="filter.wornDays" integer placeholder="请输入" class="form-number-input"/>
			</el-form-item>
		</template>
		<template slot="tools">
			<el-button class="order-btn" type="primary" @click="onSearchClick">查询</el-button>
			<el-button class="order-btn" plain @click="onResetClick">重置</el-button>
			<el-button class="order-btn" plain @click="onExportClick">导出</el-button>
		</template>
	</fx-list-filter>
</template>
<script>
import { apiName } from './Index.vue'
export default {
	name: 'filterBar',
	props: {
		tableData: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			organList: [],
			houseList: [],
			itemTypeList: [],
			itemList: [],
			itemCascaderData: [],
			itemTypeProps: {
				value: 'id',
				label: 'name',
				children: 'children',
				checkStrictly: true,
				multiple: true,
				emitPath: false
			},
			filter: {
				organIds: [],
				houseIds: [],
				itemTypes: [],
				itemIds: [],
				wornDays: 20
			},
			currentOrgan: {}
		}
	},
	computed: {
		exportDisabled () {
			return !this.tableData.length
		}
	},
	watch: {
		'filter.itemTypes' (newValue, oldValue) {
			this.checkAllChildNode(newValue, oldValue)
		}
	},
	methods: {
		onSearchClick () {
			if (this.filter.organIds.length && this.filter.wornDays !== '') {
				this.$emit('on-search', this.filter)
			} else if (!this.filter.organIds.length) {
				this.$fxMessage.warning('请填写机构')
			} else if (this.filter.organIds.wornDays === '') {
				this.$fxMessage.warning('请填写预警天数')
			}
		},
		async initFilter () {
			await this.initSelectData()
			await this.getCurrentUser()
			this.resetFilterData()
			if (this.filter.organIds.length) {
				this.getHouseList()
			}
			return Promise.resolve()
		},
		getCurrentUser () {
			return this.$fxApi('common.getCurrentUser').then(({ currentOrgan }) => {
				this.currentOrgan = currentOrgan
				return Promise.resolve()
			})
		},
		resetFilterData () {
			const organIds = this.hasCurrentOrgan() ? [this.currentOrgan.id] : []
			this.filter = {
				organIds,
				houseIds: [],
				itemTypes: [],
				itemIds: [],
				wornDays: 20
			}
		},
		hasCurrentOrgan () {
			return !!this.$fxUtils.getSelectTagById(this.currentOrgan.id, this.organList).id
		},
		async onResetClick () {
			this.resetFilterData()
			this.getHouseList()
			this.getItemSelect()
		},
		getFilterParams () {
			return this.filter
		},
		initSelectData () {
			return Promise.all([
				this.getOrganList(),
				this.getHouseList(),
				this.getItemSelect(),
				this.getItemTypeCascader()
			])
		},
		getOrganList () {
			const typeList = ['2', '1']
			return this.$fxApi(`${apiName}.getOrganSelectTab`, typeList)({ loading: false }).then(res => {
				this.organList = res || []
				return Promise.resolve()
			})
		},
		getHouseList () {
			const params = {
				organIdList: this.filter.organIds
			}
			const typeList = [2, 1]
			return this.$fxApi(`${apiName}.getInhouseSelect`, typeList)({ data: params, loading: false }).then(res => {
				this.houseList = res
				return Promise.resolve()
			})
		},
		getItemSelect () {
			return this.$fxApi(`${apiName}.getItemSelect`, this.filter.itemTypes)({ loading: false }).then(res => {
				this.itemList = res
				return Promise.resolve()
			})
		},
		organIdChange () {
			this.filter.houseIds = []
			this.getHouseList()
		},
		getItemTypeCascader () {
			return this.$fxApi('assignSummary.getItemTypeCascader')({ loading: false }).then(res => {
				this.itemCascaderData = res
				return Promise.resolve()
			})
		},
		getAllChildIds (addCheckNode, arr = []) {
			return addCheckNode.children.reduce((pre, cur) => {
				pre.push(cur.value)
				if (cur.children) {
					this.getAllChildIds(cur, pre)
				}
				return pre
			}, arr)
		},
		checkAllChildNode (newValue, oldValue) {
			const itemTypeDiff = this.$fxUtils.compareDiff(oldValue, newValue, {})
			this.$nextTick(() => {
				if (itemTypeDiff.add && itemTypeDiff.add.length === 1) {
					const checkedNodes = this.$refs.cascader.getCheckedNodes()
					const addCheckNode = checkedNodes.find(_item => _item.value === itemTypeDiff.add[0])
					const childrenIds = this.getAllChildIds(addCheckNode)
					this.filter.itemTypes = this.$fxUtils.arrDedup(this.filter.itemTypes.concat(childrenIds))
				}
				this.filter.itemIds = []
				this.getItemSelect()
			})
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.name}>{ item.name }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.organName}>{ item.organName }</span>
			</div>
		},
		onExportClick () {
			if (this.exportDisabled) {
				this.$fxMessage.warning('当前无明细，不允许导出！')
				return false
			}
			return this.$fxApi(`${apiName}.exportShelfLifeExcel`)({ data: this.filter }).then(res => {
				this.$fxUtils.downloadFile(res)
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width: 180px
}
.form-input {
	width: 180px
}
.form-number-input {
	width: 150px
	margin-left: 10px
}
.label-tip {
	color #606266 !important
}
</style>
