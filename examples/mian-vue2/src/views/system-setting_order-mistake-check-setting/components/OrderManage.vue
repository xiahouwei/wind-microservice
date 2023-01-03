<template>
	<div class="mistake-check-setting__order-manage">
		<div
			v-for="item in Object.values(orderMistakeCheckModuleConfig)"
			:key="item.id"
			class="mistake-check-setting__module-container"
		>
			<div class="mistake-check-setting__module-title">{{item.label}}</div>
			<div class="mistake-check-setting__module-item-container">
				<div
					v-for="moduleItem in Object.values(item.children)"
					:key="moduleItem.id"
					class="mistake-check-setting__module-item fx-cursor"
					@click="onModuleItemClick(moduleItem)"
				>
					<w-icon :type="moduleItem.icon" class="mistake-check-setting__module-item-icon"></w-icon>
					<span class="mistake-check-setting__module-item-label">{{moduleItem.label}}</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapActions } from 'vuex'
import { ORDER_MISTAKE_CHECK_MODULE_CONFIG } from '@/config/order_mistake_check_config'
export default {
	name: 'orderManage',
	data () {
		return {
			orderMistakeCheckModuleConfig: ORDER_MISTAKE_CHECK_MODULE_CONFIG
		}
	},
	created () {
		this.getOrderMistakeCheckConfigAll()
	},
	methods: {
		...mapActions(['getOrderMistakeCheckConfigAll']),
		onModuleItemClick (item) {
			this.$emit('on-click', item)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.mistake-check-setting__order-manage {
	height: 100%
	flex: 1
	.mistake-check-setting__module-container {
		padding: 20px
		.mistake-check-setting__module-title {
			height: 60px
			line-height: 60px
			font-size: 14px
			font-weight: bolder
			padding-left: 10px
		}
		.mistake-check-setting__module-item-container {
			margin-bottom: 40px
			display: flex
			.mistake-check-setting__module-item {
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

