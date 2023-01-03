<script>
/**
 * Icon by shang 2020/6/30
 * @desc Icon 图标
 * @params [String] type 内置样式
 * {app-logo:项目log}
 */
import ICON_URL from '../../js/config/icon_url'
import ICON_SVG from '../../js/config/icon_svg'
export default {
	name: 'w-icon',
	props: {
		imgUrl: String,
		width: String,
		height: String,
		type: String,
		size: {
			type: String,
			default: 'normal'
		},
		stop: Boolean,
		pointer: Boolean,
		verticalAlign: Boolean,
		svg: Boolean,
		disabled: Boolean
	},
	computed: {
		iconStyle () {
			const imgUrl = this.$fxUtils.isDef(this.type) ? ICON_URL[this.type] : this.imgUrl
			return {
				width: this.width,
				height: this.height,
				backgroundImage: `url(${imgUrl})`
			}
		},
		classes () {
			return [`wind-icon__size-${this.size}`, {
				'is-pointer': this.pointer,
				'is-vertical-align': this.verticalAlign,
				'is-disabled': this.disabled,
				'is-svg': this.svg
			}]
		}
	},
	methods: {
		onIconClick (event) {
			if (this.stop) {
				event.stopPropagation()
			}
			if (this.disabled) {
				return false
			}
			this.$emit('click')
		}
	},
	render (h) {
		if (!this.svg) {
			return <i
				class="wind-icon"
				class={['wind-icon', ...this.classes]}
				style={this.iconStyle}
				on-click={ this.onIconClick }
			></i>
		} else {
			return <i class="wind-icon-svg" on-click={ this.onIconClick }>
				{ ICON_SVG[this.type](h) }
			</i>
		}
	}
}
</script>
<style lang="stylus" scoped>
.wind-icon {
	display:inline-block;
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	width: 20px;
	height: 20px;
	&__size-mini {
		width: 12px;
		height: 12px;
	}
	&.is-pointer {
		cursor: pointer
	}
	&.is-vertical-align {
		vertical-align: middle;
	}
	&.is-disabled {
		filter: grayscale(100%);
		cursor: not-allowed;
	}
}
.wind-icon-svg {
	display: inline-block;
    color: inherit;
    font-style: normal;
    line-height: 0;
    text-align: center;
    text-transform: none;
    vertical-align: -.125em;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
	font-size: 14px
	svg {
		overflow: hidden
		display: inline-block
	}
}
</style>
