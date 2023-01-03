<template>
	<w-dialog v-model="dialogVisible" title="供货商送货评价" positionCenter width="520px" @close="onClose">
		<div class="rate-tip">请对本次供货商送货进行评价！</div>
		<el-form ref="rateForm" :model="formData" label-width="70px" size="mini">
			<el-form-item prop="name" label="送货速度">
				<el-rate
					v-model="formData.speed"
					class="form-item-rate"
				></el-rate>
			</el-form-item>
			<el-form-item prop="name" label="货物质量">
				<el-rate
					v-model="formData.quality"
					class="form-item-rate"
				></el-rate>
			</el-form-item>
			<el-form-item prop="name" label="司机服务">
				<el-rate
					v-model="formData.driverService"
					class="form-item-rate"
				></el-rate>
			</el-form-item>
			<el-form-item prop="memo" label="备注">
				<w-input
					ref="memo"
					type="textarea"
					v-model="formData.memo"
					:rows="5"
					:maxlength="300"
					placeholder="请输入其他备注信息"
					class="form-item-input"
				></w-input>
			</el-form-item>
		</el-form>
		<template slot="footer">
			<el-button ref="cancelBtn" @click="onCancelClick">取消</el-button>
			<el-button ref="saveBtn" type="primary" @click="onSubmitClick">提交</el-button>
		</template>
	</w-dialog>
</template>
<script>
export default {
	name: 'supplierRateDialog',
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			dialogVisible: false,
			formData: {
				speed: 5,
				quality: 5,
				driverService: 5,
				memo: ''
			}
		}
	},
	methods: {
		open () {
			this.dialogVisible = true
		},
		onSubmitClick () {
			this.onSubmitHandler()
			this.dialogVisible = false
		},
		onSubmitHandler () {
			const data = {
				billId: this.organDetails.id,
				organId: this.organDetails.otherOrgan.id,
				speed: this.formData.speed,
				quality: this.formData.quality,
				driverService: this.formData.driverService,
				memo: this.formData.memo
			}
			const logger = this.$fxLogger.createInfo('store-manage.in-store-order.supplierRate', { orderData: this.organDetails, rateInfo: this.formData })
			return this.$fxApi('inStore.supplierRate', this.organDetails.id)({ data, logger }).then(res => {
				this.dialogVisible = false
				return Promise.resolve()
			})
		},
		onClose () {
			this.clear()
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		clear () {
			this.formData.speed = 5
			this.formData.quality = 5
			this.formData.driverService = 5
			this.formData.memo = ''
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.rate-tip{
	margin: 0 0 10px 10px
}
.form-item-rate {
	height: 28px
	display: flex
	align-items: center
}
</style>
