<template>
	<fx-card title="常用单据" class="bill-container">
		<div slot="title-right">
			<w-icon pointer type="auth-setting" @click="onSettingClick"></w-icon>
		</div>
		<div class="bill-content" v-show="billContentShow">
			<div class="bill-item" v-for="(bill,index) in billList" :key="index"  @click="goToBill(bill.billType)">
				<span class="bill-tag__dot"></span>
				<span>{{bill.billName}}</span>
			</div>
		</div>
		<div class="bill-select-content" v-show="billSettingShow">
			<el-checkbox class="checkbox-all" :indeterminate="isIndeterminate" v-model="checkAll">全选</el-checkbox>
			<el-checkbox-group v-model="checkedBills">
				<el-checkbox v-for="item in billSelectList" :label="item.billType" :key="item.billType">{{item.billName}}</el-checkbox>
			</el-checkbox-group>
		</div>
		<div class="bill-select-btn" v-show="billSettingShow">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick">保存</el-button>
		</div>
	</fx-card>
</template>
<script>
import { apiName } from '../Index.vue'
export default {
	name: 'bill',
	data () {
		return {
			billContentShow: true,
			billSettingShow: false,
			billList: [],
			billSelectList: [],
			checkedBills: [],
			fxDataVerification: this.$fxUtils.fxDataVerification()
		}
	},
	mounted () {
		this.getMyBill()
	},
	watch: {
		billSelectList (val) {
			this.checkedBills = val.filter(item => {
				return item.selected === 1
			}).map(item => item.billType)
			this.fxDataVerification.resetData(this.checkedBills)
		}
	},
	computed: {
		checkAll: {
			get () {
				return this.checkedBills.length === this.billSelectList.length
			},
			set (val) {
				this.checkedBills = val ? this.billSelectList.map(item => item.billType) : []
			}
		},
		isIndeterminate () {
			return this.checkedBills.length > 0 && this.checkedBills.length < this.billSelectList.length
		}
	},
	methods: {
		getMyBill () {
			return this.$fxApi(`${apiName}.getMyBill`).then(res => {
				this.billList = res
			})
		},
		goToBill (type) {
			this.$fxGoToBillBlank(type)
		},
		onSettingClick () {
			if (!this.billSettingShow) {
				this.getMyBillSelect().then(() => {
					this.billContentShow = false
					this.billSettingShow = true
				})
			}
		},
		getMyBillSelect () {
			return this.$fxApi(`${apiName}.getMyBillSelect`).then(res => {
				this.billSelectList = res
			})
		},
		onCancelClick () {
			return this.verificationDills().then(() => {
				this.billContentShow = true
				this.billSettingShow = false
			})
		},
		onSaveClick () {
			if (this.fxDataVerification.checkData(this.checkedBills)) {
				this.$fxMessage.success('设置常用单据成功')
				this.onCancelClick()
			} else {
				const params = this.checkedBills.map(item => {
					return { billType: item }
				})
				this.setMyBill(params).then(this.onCancelClick).then(this.getMyBill)
			}
		},
		setMyBill (params) {
			const logger = this.$fxLogger.createInfo('home.favourite-bill.set', { pre: this.billList, cur: params })
			return this.$fxApi(`${apiName}.setMyBill`)({ data: params, logger }).then(() => {
				this.fxDataVerification.resetData(this.checkedBills)
			}).catch(() => {
				return new Promise()
			})
		},
		verificationDills () {
			return this.fxDataVerification.checkComfirm(this.checkedBills)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.bill-container {
	min-width 275px
	overflow auto
	display flex
	flex 1
	flex-direction column
	margin-left 18px
	.bill-content {
		display flex
		flex-wrap wrap
		margin-top 15px
		margin-left 20px
		font-size 14px
		color $fxBlue6
		.bill-item {
			flex 50%
			display flex
			align-items center
			line-height 40px
			&:hover {
				color $fxBlue
				text-decoration underline
				cursor pointer
			}
			.bill-tag__dot {
				width 8px
				height 8px
				border-radius 50%
				margin-right 10px
				margin-left 5px
				background-color $fxBlue5
			}
		}
	}
	.bill-select-content{
		flex 1
		margin-top 15px
		margin-left 20px
		.checkbox-all {
			line-height 30px
		}
		.el-checkbox-group {
			display flex
			flex-wrap wrap
			.el-checkbox {
				flex 50%
				margin-right 0
				margin-top 15px
				margin-bottom 5px
			}
		}
	}
	.bill-select-btn {
		display flex
		justify-content flex-end
	}
}
</style>

