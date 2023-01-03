<template>
	<div class="setting-mulity">
		<el-form size="mini" label-width="80px" class="setting-mulity_form">
			<el-form-item label="将字段：" class="form-item">
				<w-select
					v-model="settingKey"
					:optionlist="columnSelectList"
					:optionProp="{name:'label'}"
					class="form-input"
				>
				</w-select>
			</el-form-item>
			<div class="form-edit-text">修改为</div>
			<div class="form-content">
				<div v-show="settingKey===1">
					<w-select
						ref="store"
						v-model="offsetHouseId"
						:optionlist="storeSelectList"
						class="form-select"
						@visible-change="onStoreSelectVisibleChange"
					>
					</w-select>
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
export default {
	name: 'settingMulity',
	props: {
		visible: Boolean,
		storeSelectList: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	inject: ['initPopoverConnectTarget', 'removePopoverConnectTarget'],
	data () {
		return {
			columnSelectList: [{
				id: 1,
				label: '冲减仓库'
			}],
			settingKey: 1,
			offsetHouseId: ''
		}
	},
	watch: {
		visible (val) {
			this.refreshFormData()
			val && this.$emit('on-setting-mulity-show', val)
		}
	},
	methods: {
		onSaveClick () {
			const params = {
				type: this.settingKey,
				offsetHouseId: this.offsetHouseId
			}
			this.$emit('on-save-click', params)
			this.$fxMessage.success('操作成功')
		},
		onCancelClick () {
			this.$emit('on-cancel-click')
		},
		refreshFormData () {
			this.settingKey = 1
			this.offsetHouseId = ''
		},
		onStoreSelectVisibleChange (val) {
			val ? this.initPopoverConnectTarget(this.$refs.store) : this.removePopoverConnectTarget(this.$refs.store)
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
		.form-select {
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
