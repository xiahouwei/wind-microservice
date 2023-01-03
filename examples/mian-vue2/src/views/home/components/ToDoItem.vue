<template>
	<div
		:class="['todo-item', {'todo-item-disabled': billNoAuth}]"
		:style="todoItem.style || ''"
		@click="goToHandler"
	>
		{{todoItem.label}}
		<span v-if="showBracket" :class="{'bill-count-zero': billCount === 0 || billCount === '0'}">（{{billCount}}）</span>
		<span v-else class="no-bracket" :class="{'bill-count-zero': billCount === 0 || billCount === '0'}">{{billCount}}</span>
	</div>
</template>
<script>
export default {
	name: 'toDoItem',
	props: {
		todoData: {
			type: Object,
			default: () => {
				return {}
			}
		},
		organId: String,
		todoItem: {
			type: Object,
			default: () => {
				return {}
			}
		},
		goToBillFlag: Boolean,
		goToAssignFlag: Boolean,
		goToBusinessFlag: Boolean,
		showBracket: Boolean,
		date: Date
	},
	computed: {
		type () {
			return this.todoItem.type
		},
		billCount () {
			return this.todoData[this.type] ? this.todoData[this.type].count : 0
		},
		billNoAuth () {
			return this.todoData[this.type] ? this.todoData[this.type].NoPrivilege : true
		}
	},
	methods: {
		goToHandler () {
			if (this.goToBillFlag) {
				this.goToBill()
			} else if (this.goToAssignFlag) {
				this.goToAssign()
			} else if (this.goToBusinessFlag) {
				this.goToBusiness()
			}
		},
		goToBill () {
			if (this.billNoAuth) {
				return false
			}
			const businessDate = this.date ? this.$fxUtils.setDate(new Date(this.date)) : ''
			const clearDate = this.date ? '' : '1'
			this.$fxGoToBillBlank(this.type, { billState: [0, 1], businessDate, clearDate, organId: this.organId })
		},
		goToAssign () {
			if (this.billNoAuth) {
				return false
			}
			const businessDate = this.date ? this.$fxUtils.setDate(new Date(this.date)) : ''
			const clearDate = this.date ? '' : '1'
			this.$fxGoToBillBlank(this.type, { inAssignStatus: [0, 1], businessDate, clearDate, organId: this.organId })
		},
		goToBusiness () {
			if (this.billNoAuth) {
				return false
			}
			// this.$router.replace({ path: this.todoItem.path, query: { onSyncClick: true } })
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.todo-item {
	display flex
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
	.no-bracket {
		margin-left 5px
	}
	.bill-count-zero {
		color #c0c4cc
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

</style>

