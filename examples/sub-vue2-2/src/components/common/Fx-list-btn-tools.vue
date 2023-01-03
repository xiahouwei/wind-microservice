<template>
	<div class="list-btn-tools">
		<div v-show="!recycleVisible && !historyVisible" class="list-btn-tools__normal">
			<slot></slot>
			<el-button v-if="recycle" class="order-btn" type="primary" plain @click="onRecycleClick">回收站</el-button>
			<el-button v-if="history" class="order-btn" type="primary" plain @click="onHistoryClick">历史</el-button>
			<slot name="btn-right"></slot>
		</div>
		<div v-show="recycleVisible && !historyVisible" class="list-btn-tools__recycle">
			<el-button class="order-btn" type="primary" plain @click="onReturnClick">返回列表</el-button>
			<slot name="recycle"></slot>
		</div>
		<div v-show="historyVisible && !recycleVisible" class="list-btn-tools__recycle">
			<el-button class="order-btn" type="primary" plain @click="onAllClick">全部</el-button>
			<slot name="history"></slot>
		</div>
	</div>
</template>
<script>
export default {
	name: 'filterBar',
	props: {
		value: null,
		recycle: {
			type: Boolean,
			default: true
		},
		history: {
			type: Boolean,
			default: false
		},
		historyVisible: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			recycleVisible: false
		}
	},
	watch: {
		value: {
			immediate: true,
			handler (val) {
				this.recycleVisible = val
			}
		}
	},
	methods: {
		onRecycleClick () {
			this.recycleVisible = true
			this.$emit('input', true)
			this.$emit('on-recycle-change', this.recycleVisible)
		},
		onReturnClick () {
			this.recycleVisible = false
			this.$emit('input', false)
			this.$emit('on-recycle-change', this.recycleVisible)
		},
		onHistoryClick () {
			this.$emit('update:historyVisible', true)
			this.$emit('on-history-change')
		},
		onAllClick () {
			this.$emit('update:historyVisible', false)
			this.$emit('on-history-change')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.list-btn-tools {
	display:flex
	flex-direction: row
	>>>.el-button {
		margin: 5px 10px 5px 0
	}
}
</style>
