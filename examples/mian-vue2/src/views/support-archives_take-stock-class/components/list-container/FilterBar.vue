<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="分类名称">
				<w-input v-model="classKey" placeholder="请输入" class="form-input"/>
			</el-form-item>
			<el-form-item label="适用机构">
				<w-select-tab-mulity
					v-model="organ"
					:optionlist="organList"
					class="form-input"
					@change="organChange"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="适用仓库">
				<w-select-tab-mulity
					v-model="house"
					:optionlist="houseList"
					class="form-input"
					:emptyItem="emptyItem"
					:filterKeys="tabStoreFilterKeys"
					:optionRender="optionRender"
				>
				</w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="启停状态">
				<w-select
					v-model="enableFlag"
					:optionlist="enableStateSelectList"
					:optionProp="{key: 'id', name: 'label', value: 'id', disabled: 'disabled'}"
					class="form-input"
				></w-select>
			</el-form-item>
			<!-- <el-form-item label="标签">
				<w-input v-model="tagKey" placeholder="请输入" class="form-input"/>
			</el-form-item> -->
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
			classKey: '',
			organ: [],
			house: [],
			enableFlag: 1,
			tagKey: '',
			houseList: [],
			organList: [],
			enableStateList: this.$fxStateMiddleware.getStateConfig('enableState'),
			emptyItem: {
				id: 'empty',
				name: '[空数据]'
			},
			tabStoreFilterKeys: ['name', 'code', 'pinYin', 'organName']
		}
	},
	computed: {
		enableStateSelectList () {
			return [{
				id: '',
				label: '全部'
			}, ...this.enableStateList]
		}
	},
	mounted () {
		this.initSelect()
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search', this.getFilterParams())
		},
		onResetClick () {
			this.classKey = ''
			this.organ = []
			this.house = []
			this.enableFlag = 1
			this.tagKey = ''
		},
		getFilterParams () {
			return {
				classKey: this.classKey,
				organ: this.organ,
				house: this.house,
				enableFlag: this.enableFlag,
				tagKey: this.tagKey
			}
		},
		initSelect () {
			this.getFilterOrganList()
			this.getFilterStoreList()
		},
		getFilterOrganList () {
			const typeList = ['2', '1']
			return this.$fxApi(`${apiName}.getFilterOrganList`, typeList).then(res => {
				this.organList = res
				return Promise.resolve(res)
			})
		},
		getFilterStoreList () {
			const params = {
				organIdList: this.organ
			}
			const typeList = ['2', '1']
			return this.$fxApi(`${apiName}.getFilterStoreList`, typeList)({ data: params, loading: false }).then(res => {
				this.houseList = res
				return Promise.resolve(res)
			})
		},
		organChange () {
			this.houseList = []
			this.getFilterStoreList()
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.name}>{ item.name }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.organName}>{ item.organName }</span>
			</div>
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-input {
	width: $fx-filterBar-formInputWidth
}
</style>
