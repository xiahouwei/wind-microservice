<template>
	<div class="filter-bar" @keyup.enter="onEnterClick">
		<div class="filter-bar__row">
			<el-form size="mini" inline :label-width="labelWidth">
				<slot name="row-1"></slot>
				<template v-if="filterExtend" >
					<slot name="row-2"></slot>
				</template>
			</el-form>
		</div>
		<div class="btn-tools">
			<div v-show="$slots['row-2']" class="form-item filter-btn-tools">
				<!-- <w-icon
					v-show="$slots['row-2']"
					:type="filterExtend?'filter-unextend':'filter-extend'"
					class="filter-btn-tools__extend fx-cursor"
					@click="onFilterExtendClick"
				></w-icon> -->
				<w-link v-show="$slots['row-2']" class="filter-btn-tools__extend fx-cursor" @click="onFilterExtendClick">{{moreLabel}}</w-link>
			</div>
			<slot name="tools"></slot>
		</div>
	</div>
</template>
<script>
export default {
	name: 'filterBar',
	props: {
		labelWidth: {
			type: String,
			default: '70px'
		}
	},
	data () {
		return {
			filterExtend: false
		}
	},
	computed: {
		moreLabel () {
			return this.filterExtend ? '隐藏' : '更多'
		}
	},
	methods: {
		onFilterExtendClick () {
			this.filterExtend = !this.filterExtend
		},
		onEnterClick (e) {
			if (e.target.tagName === 'INPUT') {
				this.$emit('on-enter')
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.filter-bar {
	display:flex
	flex-direction: row
	padding-left: 11px
	&__row {
		flex: 1
		display:flex
		align-items: center
		>>>.el-form-item {
			.el-form-item__label {
				// text-align: left;
			}
		}
	}
	.btn-tools {
		height: 32px
		display: flex;
		margin-right: 16px
	}
	.filter-btn-tools {
		display: flex;
		align-items: center;
		&__extend {
			// width: 14px
			// height: 14px
			margin-right: 10px
			margin-left:10px
		}
	}
}
</style>
