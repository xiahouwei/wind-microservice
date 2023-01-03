<template>
	<fx-list-filter @on-enter="onSearchClick" labelWidth="95px">
		<template slot="row-1">
			<el-form-item prop="organId" label="加工机构名称" >
				<w-select-tab-mulity
					ref='organ'
					v-model="filter.organId"
					:optionlist="organSelectList"
					class="form-input"
					@change="organIdChange"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item prop="defaultHouseType" label="默认仓库类型">
				<w-select-mulity
					ref="defaultHouseType"
					v-model="filter.defaultHouseType"
					:optionlist="defaultHouseTypeList"
					:optionProp="{name:'label'}"
					class="form-input"
					:showEmpty='false'
				>
				</w-select-mulity>
			</el-form-item>
			<el-form-item prop="houseId" label="仓库名称">
				<w-select-tab-mulity
					ref="house"
					v-model="filter.houseId"
					:optionlist="warehouseList"
					class="form-input"
				>
				</w-select-tab-mulity>
			</el-form-item>
			<el-form-item prop="itemId" label="品项名称">
				<w-select-tab-mulity
					ref="item"
					v-model="filter.itemId"
					:optionlist="itemList"
					class="form-input"
					:showEmpty='false'
				>
				</w-select-tab-mulity>
			</el-form-item>
		</template>
		<template slot="tools">
			<el-button class="order-btn" type="primary" @click="onSearchClick">查询</el-button>
			<el-button class="order-btn" plain @click="onResetClick">重置</el-button>
		</template>
	</fx-list-filter>
</template>
<script>
export default {
	name: 'filterBar',
	data () {
		return {
			warehouseList: [],
			organSelectList: [],
			itemList: [],
			defaultHouseTypeList: this.$fxTypeMiddleware.getCommonTypeList('defaultHouseType'),
			filter: {
				organId: [],
				houseId: [],
				itemId: [],
				defaultHouseType: []
			}
		}
	},
	created () {
		this.initFilterList()
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search', this.getFilterParams())
		},
		onResetClick () {
			this.filter = {
				organId: [],
				houseId: [],
				itemId: [],
				defaultHouseType: []
			}
		},
		getFilterParams () {
			return {
				organId: this.filter.organId,
				houseId: this.filter.houseId,
				'detail-itemId': this.filter.itemId,
				defaultHouseType: this.filter.defaultHouseType
			}
		},
		onRoleSelectVisibleChange (flag) {
			if (flag) {
				this.getRoleFilterSelectList()
			}
		},
		getStoreOrganList () {
			this.$fxApi('dosingDefaultHouse.getStoreOrganList')({
				data: {
					productCodeList: ['SCJG_SE', 'SCJG_PRO'],
					typeList: ['Shop', 'Center'],
					needLimitSubProduct: true
				}
			}).then(res => {
				this.organSelectList = res
			})
		},
		initFilterList () {
			this.getStoreOrganList()
			this.getHouseList()
			this.getItemSelectList()
		},
		getItemSelectList () {
			this.itemSelectLoading = true
			return this.$fxApi('dosingDefaultHouse.getItemSelectTab').then(res => {
				this.itemList = res
				this.itemSelectLoading = false
				return Promise.resolve()
			})
		},
		organIdChange () {
			this.filter.inHouse = []
			this.getHouseList()
		},
		getHouseList () {
			const params = {
				organIdList: this.filter.organId
			}
			const typeList = [2, 1]
			this.$fxApi('dosingDefaultHouse.getHouseSelectTab', typeList)({ data: params, loading: false }).then(res => {
				this.warehouseList = res
			})
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
