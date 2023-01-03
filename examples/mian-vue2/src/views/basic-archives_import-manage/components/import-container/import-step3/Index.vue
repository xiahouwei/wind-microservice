<template>
	<div class="step-container">
		<el-progress type="circle" :percentage="percentage"  :status="status"></el-progress>
		<div class="bottom-text">{{text}}</div>
	</div>
</template>

<script>
import { apiName } from '../../../Index.vue'
export default {
	name: 'importStep3',
	data () {
		return {
			percentage: 0,
			status: null
		}
	},
	computed: {
		text () {
			let text = ''
			switch (this.status) {
			case 'success':
				text = '迁移成功！'
				break
			case 'exception':
				text = '迁移失败！'
				break
			default:
				text = '正在迁移，请稍后...'
			}
			return text
		}
	},
	methods: {
		onUpload (fileName) {
			this.status = null
			this.percentage = 0
			const timer = setInterval(() => {
				this.percentage += 5
				if (this.percentage > 94) {
					clearInterval(timer)
				}
			}, 300)
			const logger = this.$fxLogger.createInfo('system-setting.import-manage.transferData', { name: fileName })
			return this.$fxApi(`${apiName}.transferData`)({ logger }).then(res => {
				clearInterval(timer)
				this.percentage = 100
				setTimeout(() => {
					this.status = 'success'
				}, 600)
			}).catch(() => {
				clearInterval(timer)
				setTimeout(() => {
					this.status = 'exception'
				}, 600)
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.step-container {
	width 100%
	height 300px
	display flex
	flex-direction column
	justify-content center
	align-items center
	.bottom-text {
		margin-top 20px
		font-size 14px
		font-weight 700
	}
	>>>.el-icon-check,>>>.el-icon-close {
		font-size 80px
	}
}
</style>
