<template>
	<div class="filter-setting__order-manage">
		<div
			v-for="item in Object.values(filterSettingConfig)"
			:key="item.id"
			class="filter-setting__module-container"
		>
			<div class="filter-setting__module-title">{{item.label}}</div>
			<div class="filter-setting__module-item-container">
				<div
					v-for="moduleItem in Object.values(item.children)"
					:key="moduleItem.id"
					class="filter-setting__module-item fx-cursor"
					@click="onModuleItemClick(moduleItem)"
				>
					<w-icon :type="moduleItem.icon" class="filter-setting__module-item-icon"></w-icon>
					<span class="filter-setting__module-item-label">{{moduleItem.label}}</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'orderManage',
	data () {
		return {
		}
	},
	computed: {
		...mapState({
			filterSettingConfig: state => state.filterItem.filterSettingConfig
		})
	},
	methods: {
		onModuleItemClick (item) {
			this.$emit('on-click', item)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.filter-setting__order-manage {
	height: 100%
	flex: 1
	.filter-setting__module-container {
		padding: 20px
		.filter-setting__module-title {
			height: 60px
			line-height: 60px
			font-size: 14px
			font-weight: bolder
			padding-left: 10px
		}
		.filter-setting__module-item-container {
			margin-bottom: 40px
			display: flex
			.filter-setting__module-item {
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

