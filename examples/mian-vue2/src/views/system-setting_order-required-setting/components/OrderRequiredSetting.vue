<template>
	<div class="required-setting">
		<div class="required-setting-container">
			<div v-for="item in orderRequiredConfig" :key="item.id" class="required-setting-content">
				<div class="required-setting-content__label">{{item.label}}</div>
				<el-form ref="form" size="mini" label-width="70px" inline label-position="left">
					<el-form-item v-for="requiredItem in Object.values(item.requiredItems)" :key="requiredItem.id" :label="requiredItem.label" class="required-item">
						<div class="required-item-content">
							<w-switch
								ref="required"
								v-model="requiredItem.required"
								active-color="green"
								inactive-color="blue"
								active-text="必填"
								inactive-text="非必填"
								:active-value="true"
								:inactive-value="false"
								:width="80"
								@change="val => onRequiredItemRequiredChange(val,requiredItem)"
							>
							</w-switch>
							<template v-if="requiredItem.relevance">
								<div class="relevance-item">
									<span class="relevance-item__label">{{requiredItem.relevance.label}}：</span>
									<el-checkbox-group
										v-model="requiredItem.relevance.relevanceArr"
										:disabled="!requiredItem.required"
										@change="val => onRelevanceCheckBoxChange(val,requiredItem)"
									>
										<el-checkbox
											v-for="option in requiredItem.relevance.relevanceOptions"
											:label="option.id"
											:key="option.id"
										>
											{{option.label}}
										</el-checkbox>
									</el-checkbox-group>
								</div>
							</template>
						</div>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class="required-setting__bottom">
			<el-button
				v-fx-auth:system-setting_order-required-setting.edit-order-required
				type="primary"
				@click="onSaveClick"
			>保存</el-button>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
	name: 'OrderRequiredSetting',
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
			orderRequiredConfig: []
		}
	},
	computed: {
		...mapGetters(['getOrderRequired'])
	},
	created () {
		this.initOrderRequiredConfig()
	},
	methods: {
		...mapActions(['saveOrderRequiredConfig']),
		initOrderRequiredConfig () {
			this.orderRequiredConfig = this.getOrderRequired(this.options.billType)
		},
		onRequiredItemRequiredChange (val, requiredItem) {
			const relevance = requiredItem.relevance
			if (!relevance) return
			if (val) {
				relevance.relevanceArr = relevance.relevanceOptions.map(item => item.id)
			} else {
				relevance.relevanceArr = []
			}
		},
		onRelevanceCheckBoxChange (val, requiredItem) {
			if (val.length === 0) {
				requiredItem.required = false
			}
		},
		onSaveClick () {
			const params = {
				type: this.options.billType,
				data: this.orderRequiredConfig
			}
			this.saveOrderRequiredConfig({ params }).then(() => {
				this.$fxMessage.success('保存成功')
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.required-setting {
	flex 1
	display flex
	flex-direction column
	padding 0 70px
	&-container {
		flex 1
	}
	&-content {
		margin-top 20px
		&__label {
			margin-bottom 20px
			line-height 30px
			border-bottom 1px solid $fxBorder
		}
		.required-item {
			margin-right 60px
			.required-item-content {
				display flex
			}
			>>>.el-form-item__label{
				color $fxBlack1
				font-size 14px
			}
		}
		.relevance-item {
			display flex
			&__label {
				flex none
				width 80px
				margin-left 20px
			}
		}
	}
	&__bottom {
		height 50px
		line-height 50px
		text-align center
	}
}
</style>
