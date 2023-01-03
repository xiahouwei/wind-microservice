<template>
	<div class="mistake-check-setting">
		<div class="mistake-check-setting-container">
			<el-checkbox-group
				v-model="orderMistakeCheckConfig.selectedList"
			>
				<el-checkbox
					v-for="option in orderMistakeCheckConfig.mistakeCheckList"
					:key="option.id"
					:label="option.id"
					:disabled="option.mistakeType === 'error'"
					border
				>
					{{option.title}}
				</el-checkbox>
			</el-checkbox-group>
		</div>
		<div class="mistake-check-setting__bottom">
			<el-button
				v-fx-auth:system-setting_order-mistake-check-setting.edit-order-mistake-check
				type="primary"
				@click="onSaveClick"
			>保存</el-button>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
	name: 'OrderMistakeCheckSetting',
	props: {
		options: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			orderMistakeCheckConfig: {}
		}
	},
	computed: {
		...mapGetters(['getOrderMistakeCheck'])
	},
	created () {
		this.initOrderMistakeCheckConfig()
	},
	methods: {
		...mapActions(['saveOrderMistakeCheckConfig']),
		initOrderMistakeCheckConfig () {
			this.orderMistakeCheckConfig = this.getOrderMistakeCheck(this.options.billType)
		},
		onSaveClick () {
			const params = {
				type: this.options.billType,
				data: this.orderMistakeCheckConfig.selectedList
			}
			this.saveOrderMistakeCheckConfig({ params }).then(() => {
				this.$fxMessage.success('保存成功')
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
>>> .el-checkbox {
	margin-bottom 10px
}
>>> .el-checkbox.is-bordered+.el-checkbox.is-bordered {
	margin-left 0px!important
}
.mistake-check-setting {
	flex 1
	display flex
	flex-direction column
	padding 0 70px
	&-container {
		flex 1
		margin-top 20px
	}
	&__bottom {
		height 50px
		line-height 50px
		text-align center
	}
}
</style>
