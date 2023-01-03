<template>
	<w-dialog
		v-model="dialogVisible"
		:title="headerTitle"
		width="900px"
		top="5vh"
		:closeOnPressEscape="false"
		:beforeClose="onBeforeClose"
		@close="onRefresh"
	>
		<div class="carry-forward-container">
			<fx-card :showUnderLine="false" titleSize="small" iconType="waiting" :title="waitingTitle" class="card waiting-container">
				<w-scroll-bar v-if="waitingList.length" class="waiting-content">
					<div v-for="item in waitingList" :key="item.organ.id" class="waiting-item fx-ellipsis">{{item.organ.name}}</div>
				</w-scroll-bar>
				<div v-else class="empty-content">暂无数据</div>
			</fx-card>
			<fx-card :showUnderLine="false" titleSize="small" iconType="carry-forward-store" class="card current-container">
				<div slot="title-left" class="fx-ellipsis current-organ">{{currentOrganText}}{{currentOrganName}}</div>
				<div class="process-container">
					<el-timeline>
						<el-timeline-item
							v-for="(item, index) in computedProcessList"
							:key="index"
							:icon="item.icon"
							:color="item.stepResult ? '#318CF2' : '#595959'"
							hide-timestamp
							:class="{'process-success': item.stepResult}"
						>
							<div class="process-content">
								<div :style="{color: item.stepResult ? '#318CF2' : '#595959'}">{{item.content}}</div>
								<div class="process-tips">{{item.tips}}</div>
								<div class="process-step">{{item.step}}</div>
							</div>
							<w-icon slot="dot" v-if="item.iconType" :type="item.iconType" class="process-dot"></w-icon>
						</el-timeline-item>
					</el-timeline>
				</div>
			</fx-card>
			<div class="result-container">
				<fx-card :showUnderLine="false" titleSize="small" iconType="carry-forward-success" :title="successTitle" class="card success-container">
					<w-scroll-bar v-if="successList.length" class="success-content">
						<div v-for="item in successList" :key="item.id" class="fx-ellipsis">{{item.name}}</div>
					</w-scroll-bar>
					<div v-else class="empty-content">暂无数据</div>
				</fx-card>
				<fx-card :showUnderLine="false" titleSize="small" iconType="carry-forward-fail" :title="failTitle" class="card fail-container">
					<w-scroll-bar v-if="failList.length" class="fail-content">
						<div v-for="item in failList" :key="item.id" class="fail-list-item">
							<div class="fail-item fx-ellipsis">{{item.name}}</div>
							<w-link class="check-link" @click="onCheckClick(item)">查看原因</w-link>
						</div>
					</w-scroll-bar>
					<div v-else class="empty-content">暂无数据</div>
				</fx-card>
			</div>
		</div>
		<check-reason-container ref="checkReason"></check-reason-container>
	</w-dialog>
</template>

<script>
import { apiName } from '../../Index.vue'
import checkReasonContainer from './CheckReason.vue'
const PROCESS_LIST = [{
	content: '正在进行月末结转！',
	tips: '月末结转会造成系统繁忙，请您合理安排时间。',
	iconType: 'carry-forward-process',
	stepResult: true,
	step: ''
}, {
	content: '检测结转会计期的单据审核状态。',
	stepResult: false,
	step: '第 1 步'
}, {
	content: '清理系统垃圾数据。',
	stepResult: false,
	step: '第 2 步'
}, {
	content: '系统数据结转处理。',
	stepResult: false,
	step: '第 3 步'
}, {
	content: '生成下月期初单。',
	stepResult: false,
	step: '第 4 步'
}, {
	content: '将当前会计期设置为下一个月。',
	stepResult: false,
	step: '第 5 步'
}, {
	content: '完成月末结转。',
	icon: 'el-icon-check',
	stepResult: false,
	step: '完成'
}]
const REVERSE_PROCESS_LIST = [{
	content: '正在进行反结转！',
	tips: '反结转会造成系统繁忙，请您合理安排时间。',
	iconType: 'carry-forward-process',
	stepResult: true,
	step: ''
}, {
	content: '检测反结转会计期的单据状态。',
	stepResult: false,
	step: '第 1 步'
}, {
	content: '删除所选会计期的期初入库单。',
	stepResult: false,
	step: '第 2 步'
}, {
	content: '系统进行反结转处理。',
	stepResult: false,
	step: '第 3 步'
}, {
	content: '将当前会计期调整为上个月。',
	stepResult: false,
	step: '第 4 步'
}, {
	content: '完成反结转。',
	icon: 'el-icon-check',
	stepResult: false,
	step: '完成'
}]
export default {
	name: 'carryForward',
	components: {
		checkReasonContainer
	},
	data () {
		return {
			dialogVisible: false,
			waitingList: [],
			successList: [],
			failList: [],
			processList: this.$fxUtils.deepClone(PROCESS_LIST),
			reverseProcessList: this.$fxUtils.deepClone(REVERSE_PROCESS_LIST),
			type: '',
			queuePolling: this.$fxUtils.polling(),
			end: null
		}
	},
	computed: {
		currentOrganText () {
			return this.type === 'carryForward' ? '当前结转机构：' : '当前反结转机构：'
		},
		currentOrganName () {
			return this.waitingList[0] ? this.waitingList[0].organ.name : '无'
		},
		computedProcessList () {
			return this.type === 'carryForward' ? this.processList : this.reverseProcessList
		},
		headerTitle () {
			return this.type === 'carryForward' ? '月末结转' : '月末反结转'
		},
		waitingTitle () {
			return this.type === 'carryForward' ? '等待结转队列' : '等待反结转队列'
		},
		successTitle () {
			return this.type === 'carryForward' ? '结转成功机构' : '反结转成功机构'
		},
		failTitle () {
			return this.type === 'carryForward' ? '结转失败机构' : '反结转失败机构'
		}
	},
	methods: {
		open (type) {
			this.end = null
			this.type = type
			this.getQueue().then(() => {
				this.dialogVisible = true
				this.processChangeHandler()
			})
		},
		processChangeHandler () {
			this.queuePolling.start(1000, (next, end) => {
				this.end = end
				this.getQueue().then(() => {
					next()
				})
			})
		},
		getQueue () {
			return this.$fxApi(`${apiName}.getQueue`, this.type).then(res => {
				this.successList = res.successOrgans || []
				this.failList = res.failedOrgans || []
				if (!res.organ) {
					this.waitingList = []
					this.computedProcessList[0].step = ''
					this.computedProcessList.forEach(item => { item.stepResult = true })
					return this.end && this.end()
				}
				this.waitingList = res.waitOrgans || []
				if (res.organ && res.organ.id) {
					this.computedProcessList[0].step = res.yearMonth || '未启用会计期'
					this.waitingList.unshift({ organ: res.organ })
				}
				res.resultList && res.resultList.forEach((item, index) => {
					this.computedProcessList[index + 1].stepResult = item.stepResult
				})
				return Promise.resolve()
			})
		},
		onCheckClick (item) {
			this.$fxApi(`${apiName}.getReason`, item.id, this.type).then(res => {
				this.$refs.checkReason.open(res, this.type)
			})
		},
		onRefresh () {
			this.end && this.end()
			this.$emit('on-refresh')
		},
		onBeforeClose (close) {
			if (this.waitingList.length) {
				const message = this.type === 'carryForward' ? '当前正在结转，是否关闭窗口？' : '当前正在反结转，是否关闭窗口？'
				this.$fxConfirm(message).then(() => {
					close()
				})
			} else {
				close()
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.carry-forward-container {
	display flex
	height 600px
	.card {
		border-radius 0
		padding-top 0
	}
	.empty-content {
		flex 1
		text-align center
		padding-top 30px
	}
	.waiting-container {
		display flex
		flex-direction column
		padding-bottom 0
		width 200px
		border-right 1px solid $fxBorder
		border-top 1px solid $fxBorder
		.waiting-content {
			flex 1
			padding-left 15px
			padding-bottom 0
			margin-top 10px
			line-height 35px
			color $fxGray6
			.waiting-item {
				padding 0 5px
				&:first-child {
					color $fxBlue5
					background-color $fxBlue10
					font-weight bold
					border-radius 2px
				}
			}
		}
	}
	.current-container {
		flex 1
		border-top 1px solid $fxBorder
		.current-organ {
			width 410px
		}
		.process-container {
			padding-top 35px
			padding-left 120px
			>>>.el-timeline-item__tail {
				border-left: 2px solid $fxBorder
			}
			.process-success>>>.el-timeline-item__tail {
				border-left: 2px solid $fxBlue5
			}
			.process-dot {
				position relative
				left -2px
				top -5px
				width 14px
				height 20px
			}
			.process-content {
				height 50px
				padding-left 10px
				font-size 12px
				font-weight bold
				.process-tips {
					margin-top 10px
					color $fxRed
				}
				.process-step {
					position absolute
					left -100px
					top 0
					width 70px
					text-align right
					font-weight normal
				}
			}
		}
	}
	.result-container {
		display flex
		flex-direction column
		width 220px
		border-left 1px solid $fxBorder
		border-top 1px solid $fxBorder
		.success-container {
			flex 1
			display flex
			flex-direction column
			padding-bottom 0
			padding-right 0
			margin-bottom 10px
			border-bottom 1px solid $fxBorder
			.success-content {
				padding-left 20px
				padding-bottom 0
				margin-top 10px
				line-height 35px
				color $fxGray6
			}
		}
		.fail-container {
			flex 1
			display flex
			flex-direction column
			padding-bottom 0
			padding-right 0
			.fail-content {
				padding-left 20px
				padding-bottom 0
				margin-top 10px
				line-height 35px
				color $fxGray6
				.fail-list-item {
					display flex
					justify-content space-between
					align-items center
					.fail-item {
						flex 1
					}
					.check-link {
						color $fxBlue5
						text-decoration-line underline
					}
				}
			}
		}
	}
}
>>>.el-dialog__body {
	padding 10px
	padding-bottom 30px !important
}
</style>
