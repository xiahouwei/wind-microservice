<template>
	<div class="list-state-tag">
		<div :class="iconClasses">{{label}}</div>
	</div>
</template>
<script>
export default {
	name: 'fx-list-state-tag',
	props: {
		icon: String,
		label: String
	},
	computed: {
		iconClasses () {
			return ['list-state-tag__dot', `dot-${this.icon}`]
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.list-state-tag {
	display: flex;
	flex-direction: row;
	align-items: center;
	&__dot {
		min-width: 48px
		padding 0 5px
		height: 25px
		border-radius: 4px
		margin-right: 10px
		text-align center
		line-height 25px
		color #fff
		font-weight: bolder
		&.dot-red {
			background-color: $fxRed2
		}
		&.dot-green {
			background-color: $fxGreen2
		}
		&.dot-blue {
			background-color: $fxBlue5
		}
		&.dot-orange {
			background-color: $fxOrange1
		}
		&.dot-gray {
			background-color: $fxGray8
		}
		&.dot-black {
			background-color: $fxBlack3
		}
		&.dot-deep-green {
			background-color: $fxGreen4
		}
	}
}
</style>

