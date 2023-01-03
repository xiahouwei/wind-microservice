<template>
	<div v-if="visible" class="list-state-tag">
		<div :class="iconClasses">{{label}}</div>
	</div>
</template>
<script>
export default {
	name: 'fx-details-state-tag',
	props: {
		label: String,
		icon: String
	},
	computed: {
		iconClasses () {
			return ['list-state-tag__dot', `dot-${this.icon}`]
		},
		visible () {
			return !!this.label
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.list-state-tag {
	display: inline-block;
	flex-direction: row;
	align-items: center;
	&__dot {
		min-width: 30px
		height: 25px
		padding 0 5px
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

