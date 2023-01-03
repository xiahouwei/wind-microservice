<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="方案">
				<w-input v-model="planKey" placeholder="请输入" class="form-input"/>
			</el-form-item>
			<el-form-item label="入库机构">
				<w-select-tab-mulity
					v-model="inOrganId"
					:optionlist="organSelectTabList"
					class="form-input"
					@change="inOrganIdChange"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="入库仓库">
				<w-select-tab-mulity
					v-model="inHouseId"
					:optionlist="houseSelectTabList"
					:filterKeys="tabStoreFilterKeys"
					:optionRender="optionRender"
					class="form-input"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="耗用仓库">
				<w-select-tab-mulity
					v-model="outHouseId"
					:optionlist="houseSelectTabList"
					:filterKeys="tabStoreFilterKeys"
					:optionRender="optionRender"
					class="form-input"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="品项">
				<w-select-mulity
					v-model="itemId"
					:optionlist="itemSelectList"
					:showEmpty="false"
					class="form-input"
				>
				</w-select-mulity>
			</el-form-item>
			<el-form-item label="审核状态">
				<w-select
					v-model="billState"
					:optionlist="pricePlanStateSelectList"
					:optionProp="optionProp"
					:disabled="billStateDisabled"
					class="form-input"
				>
				</w-select>
			</el-form-item>
		</template>
		<template slot="row-2">
			<el-form-item label="启停状态">
				<w-select
					v-model="enableFlag"
					:optionlist="enableStateSelectList"
					:optionProp="optionProp"
					class="form-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item label="备注">
				<w-input v-model="memo" placeholder="请输入" class="form-input"/>
			</el-form-item>
			<el-form-item label="明细备注">
				<w-input v-model="pdmemo" placeholder="请输入" class="form-input"/>
			</el-form-item>
		</template>
		<template slot="tools">
			<fx-button class="order-btn" type="primary" @click="onSearchClick">查询</fx-button>
			<fx-button class="order-btn" plain @click="onResetClick">重置</fx-button>
		</template>
	</fx-list-filter>
</template>
<script>
import { apiName } from '../../Index.vue'
export default {
	name: 'filterBar',
	props: {
		billStateDisabled: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			planKey: '',
			inOrganId: [],
			inHouseId: [],
			outHouseId: [],
			itemId: [],
			billState: '',
			enableFlag: 1,
			memo: '',
			pdmemo: '',
			enableStateList: this.$fxStateMiddleware.getStateConfig('enableState'),
			pricePlanStateList: this.$fxStateMiddleware.getStateConfig('planSearchState'),
			optionProp: {
				name: 'label'
			},
			organSelectTabList: [],
			houseSelectTabList: [],
			itemSelectList: [],
			tabStoreFilterKeys: ['name', 'code', 'pinYin', 'organName']
		}
	},
	computed: {
		enableStateSelectList () {
			return [{
				id: '',
				label: '全部'
			}, ...this.enableStateList]
		},
		pricePlanStateSelectList () {
			return [{
				id: '',
				label: '全部'
			}, ...this.pricePlanStateList]
		}
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search')
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.name}>{ item.name }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.organName}>{ item.organName }</span>
			</div>
		},
		getSelectData () {
			this.getOrganSelectTab()
			this.getHouseSelectTab()
			this.getItemSelect()
		},
		getOrganSelectTab () {
			this.$fxApi(`${apiName}.getOrganSelectTab`).then(res => {
				this.organSelectTabList = res
			})
		},
		getHouseSelectTab () {
			const params = {
				organIdList: this.inOrganId
			}
			this.$fxApi(`${apiName}.getHouseSelectTab`)({ data: params, loading: false }).then(res => {
				this.houseSelectTabList = res
			})
		},
		getItemSelect () {
			this.$fxApi(`${apiName}.getItemSelect`).then(res => {
				this.itemSelectList = res
			})
		},
		inOrganIdChange () {
			this.inHouseId = []
			this.outHouseId = []
			this.getHouseSelectTab()
		},
		onResetClick () {
			this.planKey = ''
			this.inOrganId = []
			this.inHouseId = []
			this.outHouseId = []
			this.itemId = []
			this.billState = ''
			this.enableFlag = 1
			this.memo = ''
			this.pdmemo = ''
		},
		getFilterParams () {
			return {
				'pd-inOrganId': this.inOrganId,
				'pd-inHouseId': this.inHouseId,
				'pd-outHouseId': this.outHouseId,
				planKey: this.planKey,
				'pd-itemId': this.itemId,
				billState: this.billState,
				enableFlag: this.enableFlag,
				memo: this.memo,
				'pd-memo': this.pdmemo
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-input {
	width: 150px
}
</style>
