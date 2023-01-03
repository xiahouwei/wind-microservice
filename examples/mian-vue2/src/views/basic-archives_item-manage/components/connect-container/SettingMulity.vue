<template>
	<div class="setting-mulity">
		<el-form size="mini" label-width="80px" class="setting-mulity_form">
			<el-form-item label="将字段：" class="form-item">
				<w-select
					v-model="settingKey"
					class="form-input"
					:optionlist="columnSelectList"
					:optionProp="{name:'label'}"
				>
				</w-select>
			</el-form-item>
			<div class="form-edit-text">修改为</div>
			<div class="form-content">
				<div v-show="settingKey===0">
					<w-input-number
						v-model="optimalStore"
						:min="0"
						placeholder="请输入内容"
						class="form-input-optimal-store"
					>
					</w-input-number>
				</div>
				<div v-show="settingKey===1" class="flex-store">
					<w-select
						v-model="maxStoreFlag"
						class="form-select-store"
						:optionlist="maxStoreOption"
						@change="onMaxStoreFlagChange"
					>
					</w-select>
					<w-input-number
						v-model="maxStore"
						:disabled="maxStoreFlag === '0'"
						:min="0"
						placeholder="请输入内容"
						class="form-input-store"
					>
					</w-input-number>
				</div>
				<div v-show="settingKey===2" class="flex-store">
					<w-select
						v-model="minStoreFlag"
						class="form-select-store"
						:optionlist="minStoreOption"
						@change="onMinStoreFlagChange"
					>
					</w-select>
					<w-input-number
						v-model="minStore"
						:disabled="minStoreFlag === '0'"
						:min="0"
						placeholder="请输入内容"
						class="form-input-store"
					>
					</w-input-number>
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
		visible: Boolean
	},
	data () {
		return {
			columnSelectList: [{
				id: 0,
				label: '最佳库存'
			}, {
				id: 1,
				label: '库存上限'
			}, {
				id: 2,
				label: '库存下限'
			}],
			maxStoreOption: [{
				id: '0',
				name: '无上限'
			}, {
				id: '1',
				name: '有上限'
			}],
			minStoreOption: [{
				id: '0',
				name: '无下限'
			}, {
				id: '1',
				name: '有下限'
			}],
			settingKey: 0,
			optimalStore: '',
			maxStoreFlag: '0',
			maxStore: 0,
			minStoreFlag: '0',
			minStore: 0
		}
	},
	watch: {
		visible () {
			this.refreshFormData()
		}
	},
	methods: {
		onMaxStoreFlagChange (item) {
			if	(item === '0') {
				this.maxStore = 0
			}
		},
		onMinStoreFlagChange (item) {
			if	(item === '0') {
				this.minStore = 0
			}
		},
		onSaveClick () {
			if (this.settingKey === 1 && this.maxStoreFlag === '1' && this.maxStore === 0) {
				this.$fxMessage.warning('库存上限不能为0')
				return
			} else if (this.settingKey === 2 && this.minStoreFlag === '1' && this.minStore === 0) {
				this.$fxMessage.warning('库存下限不能为0')
				return
			}
			const params = {
				type: this.settingKey,
				optimalStore: this.optimalStore,
				maxStoreFlag: this.maxStoreFlag,
				maxStore: this.maxStore,
				minStoreFlag: this.minStoreFlag,
				minStore: this.minStore
			}
			this.$emit('on-save-click', params)
		},
		onCancelClick () {
			this.$emit('on-cancel-click')
		},
		refreshFormData () {
			this.settingKey = 0
			this.optimalStore = ''
			this.maxStoreFlag = '0'
			this.maxStore = 0
			this.minStoreFlag = '0'
			this.minStore = 0
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
		.form-input-optimal-store {
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
			.flex-store {
				display: flex
				padding: 20px 5px 0px
				.form-select-store {
					width: 100px
				}
				.form-input-store {
					flex: 1
				}
			}
		}
		.form-footer {
			text-align: right
			margin-top: 10px
			margin-bottom: 5px
		}
	}
}
</style>
