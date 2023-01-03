<template>
	<div v-show="visible" class="wind-context-menu" :style="{top:top, left:left}">
		<div
			v-for="(item, index) in menuList"
			:key="index"
			class="wind-context-menu__item"
			@click="onMenuItemClick(item)"
		>{{item.label}}</div>
	</div>
</template>

<script>
export default {
	name: 'wind-context-menu',
	props: {
		visible: Boolean,
		top: String,
		left: String,
		closed: Boolean,
		menuList: {
			type: Array,
			default: () => {
				return []
			}
		},
		contextEvent: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	methods: {
		onMenuItemClick (item) {
			item.click(this.contextEvent)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.wind-context-menu {
	position: fixed;
	border: 1px solid #ccc;
	list-style: none;
	padding: 4px 0;
	border-radius: 4px;
	box-shadow: 0px 2px 6px 2px #ddd;
	z-index: 100;
    background-color: $fxWhite;
	width: 100px
	&.hidden {
		display: none;
	}
	&__item  {
		padding: 8px 12px;
		border-bottom: 1px solid #f0f2f5;
		user-select: none;
		transition: all 0.1s;
		&:last-child {
			border-bottom: none;
		}
		&:hover {
			cursor: pointer;
			background-color: #0170fe;
			color: $fxWhite;
		}
		&:active {
			background-color: #f0f2f7;
		}
	}
}
</style>
