<template>
	<w-dialog
		v-model='dialogVisible'
		width='370px'
		top="30vh"
		title='获取参考成本价'
		@close="close"
	>
		<div class="form-area">
			<el-form ref="form" :model="formData" :rules="rules" size="mini" inline label-width="80px">
				<el-form-item prop="priceOrganId" label="取价机构">
					<w-select-tab
						ref='priceOrgan'
						v-model="formData.priceOrganId"
						v-fx-tab:focus.confirmBtn
						:optionlist="organSelectList"
						class="form-item-input"
					></w-select-tab>
				</el-form-item>
			</el-form>
		</div>
		<template slot="footer-right">
			<el-button
				v-fx-tab:focus.priceOrgan
				@click="onCancelClick"
			>取消</el-button>
			<fx-button
				ref="confirmBtn"
				type="save"
				v-fx-tab:focus.cancelBtn
				@click="onConfirmClick"
			>确定</fx-button>
		</template>
	</w-dialog>
</template>

<script>
export default {
	name: 'consultCost',
	components: {
	},
	props: {
		type: String,
		bomDetail: Object
	},
	data () {
		return {
			rules: {
				priceOrganId: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			formData: {
				priceOrganId: ''
			},
			dialogVisible: false,
			organSelectList: []
		}
	},
	computed: {
	},
	mounted () {
	},
	methods: {
		open () {
			this.getOrganSelectTab()
			this.dialogVisible = true
		},
		getOrganSelectTab () {
			return this.$fxApi('bom.getOrganSelectTab').then(res => {
				this.organSelectList = res
				return Promise.resolve(res)
			})
		},
		close () {
			this.formData.priceOrganId = ''
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onValidateFormData () {
			return this.$refs.form.validate()
		},
		onConfirmClick () {
			this.onValidateFormData().then(this.getConsultCost).then((res) => {
				this.$emit('tableDataConsultCost', res)
				this.dialogVisible = false
			})
		},
		getConsultCost () {
			return this.$fxApi('bom.getConsultCost', this.type, this.bomDetail.id, this.formData.priceOrganId).then(res => {
				return Promise.resolve(res)
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-area {
	width: 100%
	height: 80px
	padding-top: 20px
	box-sizing: border-box
	.form-item-input {
		width: 235px
	}
}
</style>
