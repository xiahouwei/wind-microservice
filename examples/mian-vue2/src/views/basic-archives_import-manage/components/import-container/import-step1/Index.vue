<template>
	<div class="step-container">
		<el-timeline>
			<el-timeline-item color="#409eff">
				<div class="card-container">
					<div class="step-header">第一步</div>
					<div class="card-content">
						下载导入模板，点击<w-link @click="onDownload">此处下载</w-link>
					</div>
				</div>
			</el-timeline-item>
			<el-timeline-item :color="step2Color">
				<div class="card-container">
					<div class="step-header">第二步</div>
					<div class="card-content">
						<div class="card-content-info">设置需要导入的数据
							<el-popover
								placement="top-start"
								trigger="hover"
								content="勾选中的基础档案信息会被导入，未勾选的则视为不导入">
								<w-icon slot="reference" type="question-active" class="mark-icon"></w-icon>
							</el-popover>
						</div>
						<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
						<el-checkbox-group v-model="checkedDatas" @change="handleCheckedDatasChange">
							<el-checkbox v-for="item in dataSelectList" :label="item.id" :key="item.id">{{item.label}}</el-checkbox>
						</el-checkbox-group>
					</div>
				</div>
			</el-timeline-item>
			<el-timeline-item :color="step3Color">
				<div class="card-container">
					<div class="step-header">第三步</div>
					<div class="card-content">
						<div class="btn-content">
							导入数据
							<el-button class="order-btn" type="primary" @click="onUpload">上传附件</el-button>
						</div>
						<el-tag
							v-if="file"
							closable
							size="medium"
							@close="onTagClose"
							class="excel-tag"
						>
							<span class="fx-ellipsis tag-name">{{file.name}}</span>
						</el-tag>
					</div>
				</div>
			</el-timeline-item>
		</el-timeline>
	</div>
</template>

<script>
import { apiName } from '../../../Index.vue'
export default {
	name: 'importStep1',
	props: {
		file: File
	},
	computed: {
		step2Color () {
			return this.checkedDatas.length ? '#409eff' : ''
		},
		step3Color () {
			return this.file ? '#409eff' : ''
		}
	},
	data () {
		return {
			checkAll: true,
			checkedDatas: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
			dataSelectList: this.$fxTypeMiddleware.getCommonTypeList('importDataOptions'),
			isIndeterminate: false
		}
	},
	methods: {
		onDownload () {
			const logger = this.$fxLogger.createInfo('system-setting.import-manage.downloadExcel')
			return this.$fxApi(`${apiName}.downloadExcel`)({ logger }).then(res => {
				this.$fxUtils.downloadFile(res)
			})
		},
		onUpload () {
			this.$fxUpload({ type: 'excel' }).then(this.importExcelHandler)
		},
		importExcelHandler (file) {
			this.$emit('update:file', file)
		},
		onTagClose () {
			this.$emit('update:file', null)
		},
		handleCheckAllChange (val) {
			this.checkedDatas = val ? this.dataSelectList.map(item => item.id) : []
			this.isIndeterminate = false
		},
		handleCheckedDatasChange (value) {
			const checkedCount = value.length
			this.checkAll = checkedCount === this.dataSelectList.length
			this.isIndeterminate = checkedCount > 0 && checkedCount < this.dataSelectList.length
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.step-container {
	width 100%
	height 650px
	display flex
	flex-direction column
	justify-content center
	align-items center
	.card-container {
		position relative
		width 650px
		display flex
		flex 1
		flex-direction column
		margin 0 5px
		border-radius 6px
		box-shadow 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
		.step-header {
			position absolute
			top -8px
			left -8px
			width 65px
			height 28px
			background-image linear-gradient(to bottom right, $fxBlue1, #b3d1ef);
			border-radius 10px 0 10px 0
			line-height 28px
			text-align center
			font-size 14px
			color $fxWhite
			font-weight bold
		}
		.card-content {
			padding 30px 20px 20px 35px
			font-size 14px
			color $fxBlack1
			font-weight bold
			&-info {
				margin-bottom 15px
			}
			.wind-link{
				font-size 14px
				text-decoration underline
			}
			.mark-icon {
				width:16px
				height: 16px
				position: relative
				top: 4px
			}
			.el-checkbox-group {
				display flex
				flex-wrap wrap
				.el-checkbox {
					flex 33.33%
					margin-right 0
					margin-top 20px
				}
			}
		}
	}
	.order-btn {
		margin-left 15px
		width 80px
	}
	.excel-tag {
		display flex
		align-items center
		max-width 560px
		width fit-content
		margin-top 15px
		>>>.el-icon-close {
			top 1px
		}
		.tag-name {
			display block
			width 95%
			font-weight normal
		}
	}
}
</style>
