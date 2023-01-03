<template>
	<fx-card title="预警提醒" class="warn-container">
		<div class="warn-content">
			<div class="warn-item" v-for="(warn,index) in warntList" :key="index" @click="openWarnDialog(warn)">
				<w-icon :type="warn.type" class="warn-icon"></w-icon>
				<span>{{warn.label}}</span>
			</div>
		</div>
		<shelf-life-warn ref="shelfLifeWarn"></shelf-life-warn>
		<store-warn ref="storeWarn"></store-warn>
	</fx-card>
</template>
<script>
import shelfLifeWarn from './shelf-life-warn/Index.vue'
import storeWarn from './store-warn/Index.vue'
export default {
	name: 'warnRemind',
	components: {
		shelfLifeWarn,
		storeWarn
	},
	data () {
		return {
			warntList: [{
				id: 1,
				label: '保质期预警',
				type: 'home-shelf-life',
				refsName: 'shelfLifeWarn'
			}, {
				id: 2,
				label: '库存预警',
				type: 'home-store',
				refsName: 'storeWarn'
			}]
		}
	},
	methods: {
		openWarnDialog (item) {
			this.$refs[item.refsName].open(item)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.warn-container {
	overflow auto
	flex 1
	margin-left 18px
	.warn-content {
		display flex
		flex-direction row
		justify-content flex-start
		margin-top 15px
		padding 0 25px
		font-size 14px
		color $fxBlue6
		.warn-item {
			display flex
			flex-direction column
			align-items center
			&:nth-child(n+2) {
				margin-left: 25px
			}
			&:hover {
				color $fxBlue
				text-decoration underline
				cursor pointer
			}
			.warn-tag__dot {
				width 8px
				height 8px
				border-radius 50%
				margin-right 10px
				margin-left 5px
				background-color $fxBlue5
			}
			.warn-icon {
				width 40px
				height 40px
				margin-bottom 10px
			}
		}
	}
}
</style>

