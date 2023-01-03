<template>
	<el-drawer
		:visible.sync="drawer"
		:direction="direction"
		:before-close="handleClose"
		:show-close="showClose"
		:size="size"
		append-to-body
	>
		<div slot="title" class="fx-block-title">业务追溯</div>
		<w-scroll-bar class="scroll-container">
			<w-tree
				ref="tree"
				v-if="!showEmpty"
				:data="billChainTreeData"
				:props="treeProps"
				showLine
				defaultExpandAll
				emptyText="无上下级单据"
			>
				<div class="bill-container" slot-scope="{ data }" :class="{'current-bill':data.currentBill}" @click.stop>
					<div class="current-bill-header" v-if="data.currentBill">当前</div>
					<div class="bill-content">
						<div class="bill-title fx-ellipsis">
							{{billTypeList[data.billClass].name}}
						</div>
						<div class="bill-info">
							<div class="bill-id">
								单据号：
								<w-link
									stop
									@click="goToBillBlank(data)"
								>{{data.sysBillCode}}</w-link>
							</div>
							<div class="bill-date">
								{{$fxUtils.setDateTime($fxUtils.newDate(data.businessDate), '时分')}}
							</div>
						</div>
						<div class="bill-state">
							<fx-details-state-tag v-if="data.billState!==2" :label="currentState(data).label" :icon="currentState(data).icon"></fx-details-state-tag>
							<fx-details-state-tag :label="assignStatus(data).label" :icon="assignStatus(data).icon"></fx-details-state-tag>
							<fx-details-state-tag :label="inAssignStatus(data).label" :icon="inAssignStatus(data).icon"></fx-details-state-tag>
							<fx-details-state-tag :label="outAssignStatus(data).label" :icon="outAssignStatus(data).icon"></fx-details-state-tag>
							<fx-details-state-tag :label="currentMoveState(data).label" :icon="currentMoveState(data).icon"></fx-details-state-tag>
							<fx-details-state-tag :label="offsetState(data).label" :icon="offsetState(data).icon"></fx-details-state-tag>
							<fx-details-state-tag :label="productionState(data).label" :icon="productionState(data).icon"></fx-details-state-tag>
						</div>
					</div>
				</div>
			</w-tree>
			<div class="empty" v-else>
				<div class="empty-img"></div>
				<div>无上下级单据</div>
			</div>
		</w-scroll-bar>
	</el-drawer>
</template>
<script>
/**
	 * @name fx-bill-chain
	 * @desc 单据业务链组件
	 * @author cai
	 * @date 2021/10/28
	 *
	 * @param {Object} billChainData - 单据业务链数据对象{up:[],down:[]}
	 * @param {String} direction - 控制抽屉组件弹出方向,可选['rtl', 'ltr', 'ttb', 'btt']
	 * @param {Function} handleClose - 关闭前的回调，会暂停 Drawer 的关闭
	 * @param {Boolean} showClose - 是否显示关闭按钮
	 * @param {String} size - Drawer 窗体的大小 请传入 'Xpx' 或者 'X%'
	 */
import BILL_TYPE_LIST from '@/router/billRouterConfig.js'
export default {
	name: 'fx-bill-chain',
	props: {
		billChainData: {
			type: Object,
			default: () => {
				return {}
			}
		},
		direction: {
			type: String,
			default: 'rtl',
			validator: function (value) {
				return ['rtl', 'ltr', 'ttb', 'btt'].indexOf(value) !== -1
			}
		},
		handleClose: Function,
		showClose: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: '480px'
		}
	},
	data () {
		return {
			drawer: false,
			downStyle: {
				height: '120px'
			},
			downLineCoverStyle: {
				top: '61px',
				height: '60px'
			},
			billTypeList: BILL_TYPE_LIST,
			billChainTreeData: [],
			treeProps: {
				children: 'child',
				label: 'label',
				disabled: 'disabled'
			}
		}
	},
	computed: {
		showEmpty () {
			return !(this.billChainData.up && this.billChainData.up.length) && !(this.billChainData.down && this.billChainData.down.length)
		},
		currentState () {
			return (billDetails) => {
				return this.$fxStateMiddleware.getOrderStateById(billDetails.billState, billDetails.recheckState, billDetails.deleteState)
			}
		},
		assignStatus () {
			return (billDetails) => {
				return this.$fxStateMiddleware.getStateObj('assignState')(billDetails.assignStatus)
			}
		},
		inAssignStatus () {
			return (billDetails) => {
				return this.$fxStateMiddleware.getStateObj('inAssignState')(billDetails.inAssignStatus)
			}
		},
		outAssignStatus () {
			return (billDetails) => {
				return this.$fxStateMiddleware.getStateObj('outAssignState')(billDetails.outAssignStatus)
			}
		},
		currentMoveState () {
			return (billDetails) => {
				return this.$fxStateMiddleware.getStateObj('moveState')(billDetails.moveState)
			}
		},
		offsetState () {
			return (billDetails) => {
				return this.$fxStateMiddleware.getStateObj('billOffsetState')(billDetails.offsetState)
			}
		},
		productionState () {
			return (billDetails) => {
				return this.$fxStateMiddleware.getStateObj('productionState')(billDetails.productionState)
			}
		}
	},
	methods: {
		open (billData) {
			this.drawer = true
			this.$nextTick(() => {
				billData.child = this.billChainData.down
				if (this.billChainData.up.length === 0) {
					this.billChainTreeData = [billData]
				} else {
					this.setFatherData(this.billChainData.up[0], billData)
					this.billChainTreeData = this.billChainData.up
				}
			})
		},
		setFatherData (father, son) {
			if (father.child) {
				this.setFatherData(father.child[0], son)
			} else {
				father.child = [son]
			}
		},
		goToBillBlank ({ id, billClass, currentBill }) {
			if (!currentBill) {
				if (billClass === 'ProcedureTask') {
					this.$fxGoToBillBlank(billClass, { id })
				} else {
					this.$fxGoToBillBlank(billClass, { id }, 'detail')
				}
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
>>>.el-drawer__header {
	padding 20px
	margin-bottom 0
	font-size 14px
	color $fxBlack1
	font-weight bold
	letter-spacing 1px
}
>>>.el-drawer__body {
	overflow auto
}
.bill-container {
	position relative
	display flex
	flex 1
	flex-direction column
	border-radius 10px
	padding 0 2px
}
.current-bill {
	background-color $fxGray2
	.bill-title {
		color $fxBlue
	}
}
.current-bill-header {
	position absolute
	right 0
	top 0
	width 40px
	height 20px
	background-color $fxBlue
	border-radius 0 10px 0 10px
	line-height 20px
	text-align center
	color $fxWhite
	font-weight bold
}
.bill-content {
	flex 1
	display flex
	flex-direction column
	justify-content space-between
	margin 0 5px
	padding-bottom 10px
	.bill-title {
		font-weight bold
	}
	.bill-info {
		display flex
		justify-content flex-start
		align-items center
		height 30px
		color $fxBlack2
		.bill-id {
			.wind-link{
				text-decoration underline
			}
		}
		.bill-date {
			margin-left 10px
		}
	}
	.bill-state{
		line-height 22px
		>>>.details-state-tag__label{
			padding 2px 4px
		}
	}
}
.scroll-container {
	padding-left 15px
	padding-bottom 0
}
.empty {
	display flex
	flex-direction column
	justify-content center
	align-items center
	margin-top 30px
	color $fxBlack2
	&-img {
		height 95px
		width 133px
		background url('~images/img/bill-chain-empty.png') no-repeat center
	}
}
>>>.wind-tree-node__title {
	height unset !important
}
</style>

