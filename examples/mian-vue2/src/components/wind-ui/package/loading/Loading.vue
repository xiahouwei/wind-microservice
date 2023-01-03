<template>
	<div
		v-show="visible"
		:style="{ backgroundColor: background || '' }"
		:class="['wind-loading', customClass, { 'is-fullscreen': fullscreen }]">
		<div class="wind-loading__contaienr" v-if="!loadingType">
			<img
				src="~images/icon/wind-ui/icon-loading-running-man.gif"
				alt=""
				class="loading-img"
				:class="[sizeClass]"
			>
			<div class="loading-text">{{text}}</div>
		</div>
		<div class="wind-loading__contaienr" v-if="loadingType === 'circle'">
			<svg viewBox="25 25 50 50" class="circular">
				<circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
			</svg>
		</div>
	</div>
</template>
<script>
/**
 * loading by shang 2022/6/14
 * @desc loading
 */
export default {
	name: 'wind-loading',
	data () {
		return {
			visible: false,
			text: '小龙人奋力奔跑中~',
			fullscreen: true,
			customClass: '',
			background: null,
			size: '',
			loadingType: ''
		}
	},
	computed: {
		sizeClass () {
			return this.size ? `is-${this.size}` : ''
		}
	},
	methods: {
		close () {
			this.visible = false
		},
		setText (text) {
			this.text = text
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '../../style/varsty.styl'
.wind-loading {
	position:absolute
	z-index: 9999;
	margin: 0;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	transition: opacity .3s;
	&.is-fullscreen {
		position: fixed
	}
	&__contaienr {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: transparent
		text-align: center
		.loading-img {
			width: 70px
			display: inline-block;
			&.is-small {
				width: 30px
			}
		}
		.loading-text {
			text-align: center
			color: $wind-loading-text-color
		}
		.circular {
			height: 42px;
			width: 42px;
			animation: loading-rotate 2s linear infinite;
		}
		@keyframes loading-rotate {
			transform: rotate(1turn);
		}
		.path {
			animation: loading-dash 1.5s ease-in-out infinite;
			stroke-dasharray: 90,150;
			stroke-dashoffset: 0;
			stroke-width: 2;
			stroke: #409eff;
			stroke-linecap: round;
		}
		@keyframes loading-dash {
			0% {
				stroke-dasharray: 1,200;
				stroke-dashoffset: 0;
			}
			50% {
				stroke-dasharray: 90,150;
				stroke-dashoffset: -40px;
			}
			100% {
				stroke-dasharray: 90,150;
				stroke-dashoffset: -120px;
			}
		}
	}
}
</style>
<style lang="stylus">
.wind-loading-parent--relative {
	position:relative!important
}
.wind-loading-parent--hidden {
	overflow:hidden!important
}
</style>
