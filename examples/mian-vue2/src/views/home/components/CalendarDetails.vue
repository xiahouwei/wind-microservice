<template>
	<div class="calendar-details-container">
		<div class="details-header">
			<w-icon pointer type="arrow-left" class="arrow-icon" @click="onBackClick"></w-icon>
			<div class="details-title">
				<w-icon type="home-remind" class="remind-icon"></w-icon>
				<span>今日提醒事项</span>
			</div>
			<div class="header-date">{{$fxUtils.setDate(new Date(date), '年月日')}}</div>
		</div>
		<el-tabs v-model="activeName" class="remind-tabs">
			<el-tab-pane label="我的待办" name="todo">
				<w-scroll-bar>
					<div class="todo-container">
						<div class="unchecked-tag"></div>
						<div class="todo-content">
							<div class="todo-title">
								<w-icon type="home-tag" class="todo-icon"></w-icon>
								<div>待审核</div>
								<div class="todo-title-num">{{calenderDetails.SubmittedCount||0}}</div>
								<i class="el-icon-arrow-up arrow-up" @click="uncheckedExpanded = !uncheckedExpanded" :class="{ 'is-expanded': !uncheckedExpanded }"></i>
							</div>
							<div class="todo-item-group" v-show="uncheckedExpanded">
								<span class="todo-tag__dot"></span>
								<span class="todo-title-sub">库存管理</span>
								<to-do-item
									v-for="(bill,index) in storeBillList"
									:key="index"
									:organId="organId"
									:todoItem="bill"
									:todoData="calenderDetails"
									:date="date"
									goToBillFlag
									showBracket
								></to-do-item>
							</div>
							<div class="todo-item-group" v-show="uncheckedExpanded">
								<span class="todo-tag__dot"></span>
								<span class="todo-title-sub">采销管理</span>
								<to-do-item
									v-for="(bill,index) in stockBillList"
									:key="index"
									:organId="organId"
									:todoItem="bill"
									:todoData="calenderDetails"
									:date="date"
									goToBillFlag
									showBracket
								></to-do-item>
							</div>
						</div>
					</div>
					<div class="todo-container">
						<div class="unassign-tag"></div>
						<div class="todo-content">
							<div class="todo-title">
								<w-icon type="home-tag" class="todo-icon"></w-icon>
								<div>待分派</div>
								<div class="todo-title-num">{{calenderDetails.NoAssignedCount||0}}</div>
								<i class="el-icon-arrow-up arrow-up" @click="unassignExpanded = !unassignExpanded" :class="{ 'is-expanded': !unassignExpanded }"></i>
							</div>
							<div class="todo-item-group" v-show="unassignExpanded">
								<span class="todo-tag__dot"></span>
								<span class="todo-title-sub">分派管理</span>
								<to-do-item
									v-for="(bill,index) in assignList"
									:key="index"
									:organId="organId"
									:todoItem="bill"
									:todoData="calenderDetails"
									:date="date"
									goToAssignFlag
									showBracket
								></to-do-item>
							</div>
						</div>
					</div>
				</w-scroll-bar>
			</el-tab-pane>
			<el-tab-pane label="可盘仓库" name="store" v-if="calenderDetails.isTodoCheck">
				<div v-if="!showStoreItem" class="no-store-item">
					<span>当前可管理全部机构，因此请前往<span class="click-text" @click="goCheckProgress">【盘点进度】</span>进行未盘仓库查看</span>
				</div>
				<div v-else class="store-list-container">
					<div class="select-container">
						<w-select-tab
							v-model="organ"
							:optionlist="organSelectList"
							defaultText="请选择机构"
							class="form-item-input"
						></w-select-tab>
						<el-button type="primary" class="sreach-btn" @click="onSearchClick">查询</el-button>
					</div>
					<w-scroll-bar v-show="storeList.length">
					<div class="store-item" v-for="(store,index) in storeList" :key="index">
						<span class="store-tag__dot"></span>
						<span :class="['store-info', {'store-info-disabled': !canAddTakeStockOrder}]" @click="goAndAddTakeStockOrder(store)">{{store.name}}</span>
					</div>
					</w-scroll-bar>
					<div class="store-empty" v-show="!storeList.length">无可盘仓库</div>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import toDoItem from './ToDoItem.vue'
export default {
	name: 'calendarDetails',
	components: {
		toDoItem
	},
	props: {
		date: Date,
		calenderDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		storeList: {
			type: Array,
			default: () => {
				return []
			}
		},
		organId: String,
		manageAllOrgan: Number,
		organSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		selectedOrganId: String
	},
	data () {
		return {
			activeName: 'todo',
			uncheckedExpanded: true,
			unassignExpanded: true,
			storeBillList: [{
				type: 'InStore',
				label: '入库单'
			}, {
				type: 'OutStore',
				label: '出库单'
			}, {
				type: 'MoveApply',
				label: '调拨单'
			}, {
				type: 'CheckBill',
				label: '盘点单'
			}],
			stockBillList: [{
				type: 'StockPlan',
				label: '采购计划单'
			}, {
				type: 'StockOrder',
				label: '采购订单'
			}, {
				type: 'SalesOrder',
				label: '销售订单'
			}],
			assignList: [{
				type: 'StockPlanAssign',
				label: '采购计划单分派'
			}, {
				type: 'InStoreAssign',
				label: '入库分派'
			}, {
				type: 'OutStoreAssign',
				label: '出库分派'
			}],
			organ: ''
		}
	},
	watch: {
		calenderDetails: {
			handler (val) {
				this.uncheckedExpanded = true
				this.unassignExpanded = true
				setTimeout(() => {
					if (!val.SubmittedCount && !val.NoAssignedCount && this.storeList.length) {
						this.activeName = 'store'
					} else {
						this.activeName = 'todo'
					}
				}, 100)
			}
		},
		selectedOrganId (val) {
			this.organ = val
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		canAddTakeStockOrder () {
			return this.detailsAuthGetter('store-manage_take-stock-order.add-order')
		},
		showStoreItem () {
			return this.manageAllOrgan !== 1
		}
	},
	methods: {
		goAndAddTakeStockOrder ({ checkClassId, organId, houseId }) {
			if (!this.canAddTakeStockOrder) {
				return false
			}
			const params = {
				checkClassId,
				organId,
				houseId,
				openType: 'add'
			}
			this.$fxGoToBillBlank('CheckBill', params, 'detail')
		},
		onBackClick () {
			this.$emit('on-back')
		},
		goCheckProgress () {
			this.$fxGoToBillBlank('CheckBill', { checkProgress: true })
		},
		onSearchClick () {
			this.$emit('on-search', this.organ)
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.calendar-details-container {
	display flex
	flex-direction column
	overflow hidden
	margin-top 10px
	.details-header {
		flex none
		display flex
		justify-content space-between
		align-items center
		height 35px
		.arrow-icon{
			margin-right 88px
		}
		.details-title {
			display flex
			align-items center
			font-size 16px
			font-weight bold
			color $fxBlue6
			.remind-icon {
				margin-right 10px
			}
		}
		.header-date{
			font-size 14px
			color $fxBlue6
		}
	}
	.remind-tabs {
		flex 1
		display flex
		flex-direction column
		overflow hidden
	}
}
>>>.el-tabs__header {
	margin-left 30px
	.el-tabs__nav-wrap {
		&::after {
			height 0
		}
		.el-tabs__item {
			color $fxBlack2
		}
		.is-active {
			color $fxBlack1
			font-weight bold
		}
		.el-tabs__active-bar {
			height 3px
			width 40px !important
			left 8px
			border-radius 3px
		}
	}
}
>>>.el-tabs__content {
	.el-tab-pane {
		height 100%
	}
	.wind-scroll-bar {
		padding-bottom 0
	}
}
.todo-container {
	display flex
	border-radius 10px
	box-shadow 0px 2px 8px 1px rgba(157, 182, 255, 0.23)
	overflow hidden
	&:not(:last-child) {
		margin-bottom 10px
	}
	.unchecked-tag {
		width 8px
		background-color #9b7eff
	}
	.unassign-tag {
		width 8px
		background-color #ffc600
	}
	.todo-content {
		padding 15px
		padding-left 20px
		.todo-title {
			display flex
			align-items center
			line-height 22px
			font-size 14px
			font-weight bold
			.todo-icon {
				margin-right 13px
				width 15px
				height 18px
			}
			.arrow-up {
				margin-left 20px
				font-weight bold
				cursor pointer
				transition transform 0.3s;
				&.is-expanded {
					transform rotate(180deg);
				}
			}
			&-num {
				height 22px
				min-width 40px
				margin-left 5px
				line-height 22px
				font-size 14px
				border-radius 20px
				text-align center
				color $fxBlue5
				background-color #dfecfd
			}
		}
		.todo-item-group {
			display flex
			align-items center
			margin-top 12px
			.todo-tag__dot {
				width 8px
				height 8px
				border-radius 50%
				margin-right 15px
				margin-left 5px
				background-color $fxBlue5
			}
			.todo-title-sub {
				font-weight bold
				color $fxBlue6
				font-size 14px
			}
			.todo-item {
				margin-left 40px
				font-size 14px
				color $fxBlue6
				&:hover {
					color $fxBlue
					text-decoration underline
					cursor pointer
					span {
						color $fxBlue
					}
				}
				span {
					color $fxBlue4
					font-weight bold
				}
				&-disabled {
				color #c0c4cc
				span {
					color #c0c4cc
				}
				&:hover {
					cursor not-allowed
					color #c0c4cc
					text-decoration none
					span {
						color #c0c4cc
					}
				}
			}
			}
		}
	}
}
.store-item {
	display flex
	align-items center
	line-height 30px
	.store-tag__dot {
		width 8px
		height 8px
		border-radius 50%
		margin-right 10px
		margin-left 15px
		background-color $fxBlue5
	}
	.store-info {
		&:hover {
			color $fxBlue
			text-decoration underline
			cursor pointer
		}
		&-disabled {
			&:hover {
				cursor not-allowed
				color #c0c4cc
				text-decoration none
			}
		}
	}
}
.no-store-item {
	margin-left 30px
	.click-text {
		color $fxBlue
		cursor pointer
	}
}
.store-list-container {
	height 100%
	.select-container {
		display flex
		align-items center
		justify-content flex-start
		margin-bottom 5px
		padding-left 30px
		.form-item-input {
			width 175px
		}
		.sreach-btn {
			margin-left 10px
		}
	}
}
.store-empty {
	line-height 200px
	text-align center
}
>>>.el-scrollbar__view {
	padding 6px
	padding-left 0
}
#pane-store {
	>>>.el-scrollbar__view {
		padding-top 0
	}
}
</style>
