<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="货位编码">
				<w-select-mulity
					v-model="storageSpaceKey"
					:optionlist="storageSpaceList"
					:showEmpty="false"
					:filterKeys="tabCodeStoreFilterKeys"
					:loading="storageSpaceSelectLoading"
					:optionRender="codeOptionRender"
					:optionProp="codeOptionProp"
					dropdownWidth="280px"
					class="form-input"
					@visible-change="onStorageSpaceSelectVisibleChange"
				>
				</w-select-mulity>
			</el-form-item>
			<el-form-item label="货架编码">
				<w-select-mulity
					v-model="storageRackKey"
					:optionlist="storageRackList"
					:showEmpty="false"
					:filterKeys="tabCodeStoreFilterKeys"
					:loading="storageRackSelectLoading"
					:optionRender="codeOptionRender"
					:optionProp="codeOptionProp"
					dropdownWidth="280px"
					class="form-input"
					@visible-change="onStorageRackSelectVisibleChange"
				>
				</w-select-mulity>
			</el-form-item>
			<el-form-item label="货位类型">
				<w-select
					v-model="storageSpaceType"
					:optionlist="storageSpaceTypeSelectList"
					:optionProp="optionProp"
					class="form-input"
				/>
			</el-form-item>
			<el-form-item label="货位状态">
				<w-select
					v-model="enableFlag"
					:optionlist="enableStateSelectList"
					:optionProp="optionProp"
					class="form-input"
				/>
			</el-form-item>
			<el-form-item label="机构">
				<w-select-tab-mulity
					v-model="organKey"
					:optionlist="organList"
					class="form-input"
					@change="onOrganKeyChange"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="仓库">
				<w-select-tab-mulity
					v-model="storeKey"
					:optionlist="storeList"
					:filterKeys="tabStoreFilterKeys"
					:optionRender="optionRender"
					class="form-input"
				></w-select-tab-mulity>
			</el-form-item>
		</template>
		<template slot="tools">
			<el-button class="order-btn" type="primary" @click="onSearchClick">查询</el-button>
			<el-button class="order-btn" plain @click="onResetClick">重置</el-button>
		</template>
	</fx-list-filter>
</template>
<script>
import { apiName } from '../../Index.vue'
export default {
	name: 'filterBar',
	data () {
		return {
			storageSpaceKey: [],
			storageRackKey: [],
			storageSpaceType: '',
			enableFlag: 1,
			organKey: [],
			storeKey: [],
			enableStateList: this.$fxStateMiddleware.getStateConfig('enableState'),
			storageSpaceTypeList: this.$fxTypeMiddleware.getCommonTypeList('storageSpaceTypeList'),
			optionProp: {
				name: 'label'
			},
			codeOptionProp: {
				name: 'code'
			},
			storageSpaceList: [],
			storageSpaceSelectLoading: false,
			storageRackList: [],
			storageRackSelectLoading: false,
			organList: [],
			storeList: [],
			tabStoreFilterKeys: ['name', 'code', 'pinYin', 'organName'],
			tabCodeStoreFilterKeys: ['code', 'house.name']
		}
	},
	computed: {
		enableStateSelectList () {
			return [{
				id: '',
				label: '全部'
			}, ...this.enableStateList]
		},
		storageSpaceTypeSelectList () {
			return [{
				id: '',
				label: '全部'
			}, ...this.storageSpaceTypeList]
		}
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search')
		},
		initFilter () {
			this.storageSpaceKey = []
			this.storageRackKey = []
			this.enableFlag = 1
			this.storageSpaceType = ''
			this.organKey = []
			this.storeKey = []
		},
		onResetClick () {
			this.initFilter()
			this.getFilterStoreSelectList()
		},
		getFilterParams () {
			return {
				'hil.id': this.storageSpaceKey,
				'hil.shelfId': this.storageRackKey,
				'hil.enableFlag': this.enableFlag,
				'hil.locationCategory': this.storageSpaceType,
				'hil.organId': this.organKey,
				'hil.houseId': this.storeKey
			}
		},
		initSelect () {
			this.getFilterOrganSelectList()
			this.getFilterStoreSelectList()
		},
		getFilterOrganSelectList () {
			return this.$fxApi(`${apiName}.getFilterOrganSelectList`).then(res => {
				this.organList = res
			})
		},
		onOrganKeyChange () {
			this.storeKey = []
			this.getFilterStoreSelectList()
		},
		getFilterStoreSelectList () {
			const params = {
				organIdList: this.organKey
			}
			return this.$fxApi(`${apiName}.getFilterStoreSelectList`)({ data: params, loading: false }).then(res => {
				this.storeList = res
			})
		},
		getStorageSpaceSelectList () {
			this.storageSpaceSelectLoading = true
			return this.$fxApi(`${apiName}.getFilterSpaceList`)({ loading: false }).then(res => {
				this.storageSpaceList = res
				this.storageSpaceSelectLoading = false
			})
		},
		onStorageSpaceSelectVisibleChange (flag) {
			if (flag) {
				this.getStorageSpaceSelectList()
			}
		},
		getStorageRackSelectList () {
			this.storageRackSelectLoading = true
			return this.$fxApi(`${apiName}.getFilterRackList`)({ loading: false }).then(res => {
				this.storageRackList = res
				this.storageRackSelectLoading = false
			})
		},
		onStorageRackSelectVisibleChange (flag) {
			if (flag) {
				this.getStorageRackSelectList()
			}
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.name}>{ item.name }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.organName}>{ item.organName }</span>
			</div>
		},
		codeOptionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.house.name}>{ item.house.name }</span>
			</div>
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
