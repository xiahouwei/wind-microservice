<template>
	<fx-card title="我的待办" class="todo-container">
		<div class="unchecked-content">
			<div class="todo-title">
				<w-icon type="home-tag" class="todo-icon"></w-icon>
				<div>待审核</div>
				<div class="todo-title-num">{{todoData.SubmittedCount||0}}</div>
			</div>
			<div class="todo-title-sub">
				<span class="todo-tag__dot"></span>
				<span>库存管理</span>
			</div>
			<div class="todo-content">
				<to-do-item
					v-for="(bill,index) in storeBillList"
					:key="index"
					:organId="organId"
					:todoItem="bill"
					:todoData="todoData"
					goToBillFlag
				></to-do-item>
			</div>
			<div class="todo-title-sub">
				<span class="todo-tag__dot"></span>
				<span>采销管理</span>
			</div>
			<div class="todo-content">
				<to-do-item
					v-for="(bill,index) in stockBillList"
					:key="index"
					:organId="organId"
					:todoItem="bill"
					:todoData="todoData"
					goToBillFlag
				></to-do-item>
			</div>
		</div>
		<div class="unassign-content">
			<div class="todo-title">
				<w-icon type="home-tag" class="todo-icon"></w-icon>
				<div>待分派</div>
				<div class="todo-title-num">{{todoData.NoAssignedCount||0}}</div>
			</div>
			<div class="todo-title-sub">
				<span class="todo-tag__dot"></span>
				<span>分派管理</span>
			</div>
			<div class="todo-content">
				<to-do-item
					v-for="(bill,index) in assignList"
					:key="index"
					:organId="organId"
					:todoItem="bill"
					:todoData="todoData"
					goToAssignFlag
				></to-do-item>
			</div>
		</div>
		<div class="unassign-content">
			<div class="todo-title">
				<w-icon type="home-tag" class="todo-icon"></w-icon>
				<div>基础信息档案</div>
				<div class="todo-title-num">{{todoData.ArchiveCount||0}}</div>
			</div>
			<div class="todo-title-sub">
				<span class="todo-tag__dot"></span>
				<span>营业数据</span>
			</div>
			<div class="todo-content">
				<to-do-item
					v-for="(bill,index) in businessList"
					:key="index"
					:organId="organId"
					:todoItem="bill"
					:todoData="todoData"
					goToBusinessFlag
				></to-do-item>
			</div>
		</div>
	</fx-card>
</template>
<script>
import toDoItem from './ToDoItem.vue'
import { apiName } from '../Index.vue'
export default {
	name: 'toDo',
	components: {
		toDoItem
	},
	data () {
		return {
			todoData: {},
			organId: '',
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
				label: '采购计划单分派',
				style: 'flex: 100%'
			}, {
				type: 'InStoreAssign',
				label: '入库分派'
			}, {
				type: 'OutStoreAssign',
				label: '出库分派'
			}],
			businessList: [{
				type: 'businessDataSearch',
				label: '待同步品项信息',
				path: 'businessDataSearch'
			}]
		}
	},
	mounted () {
		this.getTodo()
	},
	methods: {
		getTodo () {
			return this.$fxApi(`${apiName}.getTodo`).then(res => {
				this.todoData = res
				this.organId = res.OrganId || ''
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.todo-container {
	flex 2
	width 100%
	min-height 610px
	.unchecked-content, .unassign-content {
		margin-top 20px
		margin-left 10px
	}
	.todo-title {
		display flex
		align-items center
		font-size 16px
		line-height 22px
		font-weight bold
		margin-bottom 15px
		.todo-icon {
			width 16px
			height 18px
			margin-right 15px
		}
		&-num {
			height 22px
			min-width 40px
			margin-left 10px
			line-height 22px
			font-size 14px
			border-radius 20px
			text-align center
			color $fxBlue5
			background-color #dfecfd
		}
	}
	.todo-title-sub {
		display flex
		align-items center
		font-size 15px
		font-weight bold
		color $fxBlue6
	}
	.todo-tag__dot {
		width 8px
		height 8px
		border-radius 50%
		margin-right 20px
		margin-left 5px
		background-color $fxBlue5
	}
	.todo-content {
		display flex
		flex-wrap wrap
		margin-top 15px
		margin-left 35px
		height 70px
		font-size 14px
		color $fxBlue6
		.todo-item {
			flex 50%
		}
	}
}
</style>

