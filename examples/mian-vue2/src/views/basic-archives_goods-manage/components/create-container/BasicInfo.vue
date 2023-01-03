<template>
	<w-collapse ref="collapse" v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="100px" inline>
			<fx-details-form-row>
				<template slot="left">
					<div class="form-item-vertical">
						<el-form-item prop="name" label="商品名称：">
							<w-input
								ref='name'
								v-model="organDetails.name"
								:disabled="disabled"
								:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
								placeholder="请输入商品名称"
								:regType="$fxCommon.getFxInputReg('commonName')"
								class="form-item-input"
							></w-input>
						</el-form-item>
						<el-form-item prop="secondary_name" label="副名称：" class="form-item-unrequire">
							<w-input
								ref='secondary_name'
								v-model="organDetails.secondary_name"
								:disabled="disabled"
								:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
								placeholder="请输入副名称"
								:regType="$fxCommon.getFxInputReg('commonName')"
								class="form-item-input"
							/>
						</el-form-item>
						<el-form-item prop="code" label="商品编码：" class="form-item-spec">
							<w-input
								ref="code"
								v-model="organDetails.code"
								:maxlength="50"
								:disabled="!isAdd"
								placeholder="请输入商品编码"
								class="form-item-input"
							/>
						</el-form-item>
					</div>
				</template>
				<el-form-item slot="right" label="商品主图：">
					<fx-upload
						:fileList="organDetails.pic"
						:limit="3"
						type="image"
						:disabled="disabled"
						api='goods.upload'
						class="upload-content"
						@on-change="onFileChange"
					></fx-upload>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item prop="enable_flag" label="启停状态：" class="form-item-unrequire">
					<w-switch
						ref="enable_flag"
						v-model="organDetails.enable_flag"
						:active-value="true"
						:inactive-value="false"
						:disabled="enableFlagDisabled"
						active-text='启用'
						inactive-text='禁用'
						:inclusion="false"
						:width="40"
					></w-switch>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item prop="video" label="商品视频：" class="form-item-unrequire">
					<fx-upload
						:fileList="organDetails.video"
						type='video'
						:fileSize='20'
						:limit='1'
					></fx-upload>
				</el-form-item>
			</fx-details-form-row>
		</el-form>
	</w-collapse>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name: 'basicInfo',
	components: {
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
		return {
			collapseVisible: true,
			fileList: [],
			rules: {
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				code: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			}
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		isAdd () {
			return !this.organDetails.id
		},
		enableFlagDisabled () {
			return !this.detailsAuthGetter('basic-archives_goods-manage.edit-goods')
		}
	},
	methods: {
		validate () {
			return this.$refs.form.validate()
		},
		onFileChange (list) {
			this.organDetails.appendixList = list.map(item => {
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
	width: 275px
	box-sizing: border-box
}
.form-item-input-buyer {
	width: 200px
}
.form-item-vertical {
	display flex
	flex-direction column
}
.form-item-unrequire {
	>>>.el-form-item__label {
		padding-left:10px
	}
}
.switch-container {
	width 275px
}
</style>
