<template>
	<div class="details-form-row" :class="classes">
		<slot></slot>
		<div v-show="$slots.left" class="details-form-row__left">
			<slot name="left"></slot>
		</div>
		<div v-show="$slots.right" class="details-form-row__right">
			<slot name="right"></slot>
		</div>
	</div>
</template>
<script>
export default {
	name: 'fx-details-form-row',
	props: {
		textAlign: {
			type: String,
			default: 'left'
		}
	},
	computed: {
		classes () {
			return [`is-align-${this.textAlign}`]
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.details-form-row {
	display: flex;
	flex-direction: row;
	&__left, &__right {
		flex: 1
	}
	&__left {
		margin-right: 30px
	}
	&.is-align-left {
		>>>.el-form-item__label {
			text-align: left
		}
	}
	&.is-align-right {
		>>>.el-form-item__label {
			text-align: right
		}
	}
}
</style>

