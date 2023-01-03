<template>
	<div class="setting-mulity">
		<el-form size="mini" label-width="80px" class="setting-mulity_form">
			<el-form-item label="将字段：" class="form-item">
				<w-select
					v-model="settingKey"
					class="form-input"
					:optionlist="computedColumnSelectList"
					:optionProp="{name:'label'}"
				>
				</w-select>
			</el-form-item>
			<div class="form-edit-text">修改为</div>
			<div class="form-content">
				<div v-show="settingKey===0">
					<w-select-tab
						ref='otherOrgan'
						:value="otherOrgan.id"
						:optionlist="otherOrganList"
						class="form-input-otherOrgan"
						@change="otherOrganChange"
					></w-select-tab>
				</div>
			</div>
			<div class="form-footer">
				<el-button type="danger" plain @click="onCancelClick">取消</el-button>
				<el-button type="primary" plain @click="onSaveClick">保存</el-button>
			</div>
		</el-form>
	</div>
</template>
<script>
import { apiName } from '../../Index.vue'
export default {
	name: 'settingMulity',
	props: {
		visible: Boolean
	},
	data () {
		return {
			columnSelectList: [{
				id: 0,
				label: '卖方机构'
			}],
			settingKey: 0,
			otherOrgan: {},
			stockWay: 1,
			otherOrganList: [],
			tabStoreFilterKeys: ['name', 'code', 'pinYin', 'organName']
		}
	},
	computed: {
		computedColumnSelectList () {
			return this.columnSelectList
		}
	},
	watch: {
		visible (val) {
			if (val) {
				this.open()
			}
		}
	},
	methods: {
		open () {
			this.refreshFormData()
			this.getOtherOrganSelect()
		},
		onSaveClick () {
			this.$emit('on-save-click', this.otherOrgan)
		},
		onCancelClick () {
			this.$emit('on-cancel-click')
		},
		refreshFormData () {
			this.settingKey = 0
			this.otherOrgan = {}
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.name}>{ item.name }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.organName}>{ item.organName }</span>
			</div>
		},
		getOtherOrganSelect () {
			const typeList = ['5']
			return this.$fxApi(`${apiName}.getEnableOrganSelectTab`, typeList).then(res => {
				this.otherOrganList = res
			})
		},
		otherOrganChange (id, item) {
			this.otherOrgan = item
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.setting-mulity {
	display: flex
	flex-direction: column
	height: 300px
	font-size: 12px
	.setting-mulity_form {
		display: flex
		flex-direction: column
		flex: 1
		.form-input {
			width: 150px
		}
		.form-item {
			margin-bottom: 10px
		}
		.form-item-input {
			width: 175px
		}
		.form-input-otherOrgan {
			margin-top: 20px
			margin-left: 40px
			width: 200px
		}
		.form-edit-text {
			height: 26px
			line-height:26px
			padding-left: 20px
		}
		.form-content {
			flex: 1
			border: 1px solid #eee
		}
		.form-footer {
			text-align: right
			margin-top: 10px
			margin-bottom: 5px
		}
	}
}
</style>
