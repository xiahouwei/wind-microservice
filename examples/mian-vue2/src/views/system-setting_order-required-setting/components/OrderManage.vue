<template>
	<div class="required-setting__order-manage">
		<div
			v-for="item in Object.values(orderRequiredModuleConfig)"
			:key="item.id"
			class="required-setting__module-container"
		>
			<div class="required-setting__module-title">{{item.label}}</div>
			<div class="required-setting__module-item-container">
				<div
					v-for="moduleItem in Object.values(item.children)"
					:key="moduleItem.id"
					class="required-setting__module-item fx-cursor"
					@click="onModuleItemClick(moduleItem)"
				>
					<w-icon :type="moduleItem.icon" class="required-setting__module-item-icon"></w-icon>
					<span class="required-setting__module-item-label">{{moduleItem.label}}</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapActions } from 'vuex'
import { ORDER_REQUIRED_MODULE_CONFIG } from '@/config/order_required_config'
export default {
	name: 'orderManage',
	data () {
		return {
			orderRequiredModuleConfig: ORDER_REQUIRED_MODULE_CONFIG
		}
	},
	created () {
		this.getOrderRequiredConfigAll()
	},
	methods: {
		...mapActions(['getOrderRequiredConfigAll']),
		onModuleItemClick (item) {
			this.$emit('on-click', item)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.required-setting__order-manage {
	height: 100%
	flex: 1
	.required-setting__module-container {
		padding: 20px
		.required-setting__module-title {
			height: 60px
			line-height: 60px
			font-size: 14px
			font-weight: bolder
			padding-left: 10px
		}
		.required-setting__module-item-container {
			margin-bottom: 40px
			display: flex
			.required-setting__module-item {
				width: 200px
				height: 60px
				line-height: 60px
				margin-right: 14px
				text-align: center
				background-color: $fxBlue9
				border-radius: 10px
				display: flex
				align-items: center
				border: 1px solid transparent
				&-icon {
					width: 38px
					height: 38px
					margin-left: 20px
				}
				&-label {
					margin-left: 14px
					font-weight: bolder
				}
				&:hover {
					color: $fxDefaultColor
					border: 1px solid $fxDefaultColor
				}
			}
		}
	}
}
</style>

