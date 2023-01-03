<template>
	<w-collapse v-model="collapseVisible" title="其它信息">
		<el-form ref="form" :model="organDetails" size="mini" label-width="100px" inline>
			<fx-details-form-row>
				<el-form-item label="备注：" class="form-label-padding form-item-memo">
					<w-input
						v-model="organDetails.memo"
						:maxlength="400"
						:disabled="disabled"
						class="form-item-input-memo"
						placeholder="请输入备注"
					/>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" label="经办人：" class="form-label-padding">
					<w-select
						v-model="organDetails.operatorMan.id"
						:optionlist="agentSelectList"
						:disabled="disabled"
						class="form-item-input"
					>
				</w-select>
				</el-form-item>
				<el-form-item slot="right" label="生成日期：" class="form-label-padding">
					<div style="fontSize:12px">{{$fxUtils.formatterDateTime(organDetails.generateDate, 'YYYY:MM:DD  HH:MM') }}</div>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item label="附件资料：" class="form-label-padding">
					<fx-upload :fileList="fileList" :disabled="disabled" :limit="9" class="upload-content" @on-change="onFileChange"></fx-upload>
				</el-form-item>
			</fx-details-form-row>
		</el-form>
	</w-collapse>
</template>
<script>
export default {
	name: 'otherInfo',
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		agentSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		disabled: Boolean
	},
	computed: {
		fileList () {
			return (this.organDetails.mappendixList || []).map(item => {
				return item.appendixUrl
			})
		}
	},
	data () {
		return {
			collapseVisible: false
		}
	},
	methods: {
		onFileChange (list) {
			this.organDetails.mappendixList = list.map(item => {
				return {
					appendixUrl: item
				}
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width: 175px
	box-sizing: border-box
}
.form-item-memo {
	width 100%
	>>>.el-form-item__content {
		width calc(100% - 100px)
	}
	.form-item-input-memo {
		width: 100%
		box-sizing: border-box
	}
}
.form-label-padding {
	>>>.el-form-item__label {
		padding-left 10px
	}
}
</style>
