<template>
	<w-app-container class="app-container" direction="row">
		<div class="left-container">
			<div class="left-top-container">
				<calendar></calendar>
				<bill></bill>
				<warnRemind></warnRemind>
			</div>
			<data-statistics></data-statistics>
		</div>
		<div class="right-container">
			<to-do></to-do>
			<notice-board></notice-board>
		</div>
	</w-app-container>
</template>
<script>
import toDo from './components/ToDo.vue'
import noticeBoard from './components/NoticeBoard.vue'
import calendar from './components/Calendar.vue'
import bill from './components/Bill.vue'
import dataStatistics from './components/DataStatistics.vue'
import warnRemind from './components/WarnRemind.vue'
export const apiName = 'home'
export default {
	name: 'home',
	components: {
		toDo,
		noticeBoard,
		calendar,
		bill,
		dataStatistics,
		warnRemind
	},
	data () {
		return {
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.app-container {
	overflow auto
	background-color $fxGray2
	.left-container {
		display flex
		flex-direction column
		flex 1
		min-width 1200px
		padding 15px
		padding-bottom 0
		.left-top-container {
			display flex
			flex none
			height 420px
			box-sizing border-box
			.left-top-middle-container {
				display flex
				flex 1
				flex-direction column
			}
		}
	}
	.right-container {
		display flex
		flex-direction column
		flex none
		width 330px
		padding 15px 10px 0 0
	}
}
</style>

