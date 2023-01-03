<template>
	<el-dialog
		:width="width"
		:visible.sync="dialogVisible"
		:title="title"
		:fullscreen="currentFullScreen"
		:top="dailogTop"
		:custom-class="classes"
		:append-to-body="appendToBody"
		:modal-append-to-body="modalAppendToBody"
		:close-on-click-modal="closeOnClickModal"
		:before-close="onBeforeClose"
		:show-close="showClose"
		:close-on-press-escape="closeOnPressEscape"
		class="wind-dialog"
		@close="onClose"
		@closed="onClosed">
		<div slot="title" class="wind-dialog__title fx-block-title">
			<slot name="title">
				<div class="wind-dialog__title-container">
					<div :style="titleStyle" :class="titleClass" class="wind-dialog__title-label">{{title}}</div>
					<div v-if="$slots.sub" class="wind-dialog__title-sub">
						<slot name="sub"></slot>
					</div>
				</div>
			</slot>
			<div v-if="$slots.parentBill" class='parent-bill__container'>
				<slot name="parentBill"></slot>
			</div>
			<w-link
				v-if="billChainOption.show"
				icon="bill-chain"
				type="default"
				:disabled="billChainOption.disabled"
				:class="[{'is-disabled': billChainOption.disabled},'bill-chain__container']"
				@click="onBillChainClick(billChainOption.click)"
			>业务追溯</w-link>
			<w-popover
				v-model="moreLinkVisible"
				popper-class="dialog-tools-popover"
				placement="bottom"
				trigger="click">
				<div class="dialog-tools-popover__container">
					<slot v-if="moreBtnOption.length===0" name="tools"></slot>
					<template v-else>
						<div
							v-for="(link, index) in moreBtnOption"
							v-show="link.show||!$fxUtils.isDef(link.show)"
							:key="index"
						>
							<w-popover
								v-model="subLinkVisible[link.label]"
								:disabled="!(link.children && link.children.length > 0) || link.disabled"
								popper-class="dialog-tools-popover"
								placement="left-start"
								trigger="hover">
								<div class="dialog-tools-popover__container">
									<w-link
										v-for="(subLink, subIndex) in link.children"
										:key="subIndex"
										v-show="subLink.show||!$fxUtils.isDef(subLink.show)"
										:icon="subLink.icon"
										:class="[{'is-disabled': subLink.disabled}]"
										:disabled="subLink.disabled"
										type="default"
										@click="onMoreSubLinkClick(subLink, link)"
									>{{subLink.label}}</w-link>
								</div>
								<w-link
									slot="reference"
									:icon="link.icon"
									:disabled="link.disabled"
									:class="[{'is-disabled': link.disabled}]"
									type="default"
									@click="onMoreLinkClick(link.click)"
								>{{link.label}}</w-link>
							</w-popover>
						</div>
					</template>
				</div>
				<div v-show="moreBtnVisible" slot="reference" class="wind-dialog__title-tools fx-cursor"><w-icon type="header-more"></w-icon><span>更多</span></div>
			</w-popover>
		</div>
		<div v-if="$slots.footer" slot="footer" class="wind-dialog__bottom" :class="[`align-${footAlign}`]">
			<slot name="footer"></slot>
		</div>
		<div v-else-if="$slots['footer-left'] || $slots['footer-right']" slot="footer" class="wind-dialog__bottom is-flex">
			<div class="wind-dialog__bottom-left">
				<slot name="footer-left"></slot>
			</div>
			<div class="wind-dialog__bottom-right">
				<slot name="footer-right"></slot>
			</div>
		</div>
		<slot :fullScreen="currentFullScreen"></slot>
		<div v-show="!value" class="dialog-mask"></div>
	</el-dialog>
</template>
<script>
/**
 * Dialog by shang 2020/2/25
 * @desc Dialog 模态窗
 * @params value[Boolean] 窗口开启/关闭
 * @params title[String] 标题
 * @params titleClass[String, Array, Object] 标题class
 * @params titleStyle[Object] 标题style
 * @params width[String] 宽度
 * @params fullscreen[Boolean] 全屏
 * @params heightFullscreen[Boolean] 高度填充整个屏幕
 * @params positionCenter[Boolean] 定位居中
 * @params top[String] 距离顶部高度
 * @params closeOnClickModal[Boolean] 点击遮罩关闭
 * @params showMoreBtn[Boolean] 显示更多按钮
 * @params footAlign[String] foot对齐方式
 * @params beforeClose[Function] 点击X按钮关闭前回调
 * @params showClose[Boolean] 是否显示关闭按钮
 * @params closeOnPressEscape[Boolean] 是否可以通过按下 ESC 关闭 Dialog
 * @params billChainOption[Object] <业务追溯>按钮配置
 *
 * @slot defalut 内容插槽
 * @slot tools 更多-按钮栏 插槽
 * @slot footer 底部插槽
 */
const DEFAULT_DIALOG_CLASS = 'wind-custom-dialog'
const HEIGHT_FULL_SCREEN_CLASS = 'wind-dialog-is-heightFullscreen'
const DIALOG_POSITION_CENTER_CLASS = 'wind-dialog-is-position-center'
export default {
	name: 'wind-dialog',
	props: {
		value: null,
		title: null,
		titleClass: null,
		titleStyle: null,
		width: {
			type: String,
			default: '50%'
		},
		fullscreen: Boolean,
		heightFullscreen: Boolean,
		positionCenter: Boolean,
		top: {
			type: String,
			default: '15vh'
		},
		closeOnClickModal: Boolean,
		showMoreBtn: Boolean,
		moreBtnOption: {
			type: Array,
			default: () => {
				return []
			}
		},
		footAlign: {
			type: String,
			default: 'right'
		},
		beforeClose: Function,
		showClose: {
			type: Boolean,
			default: true
		},
		closeOnPressEscape: {
			type: Boolean,
			default: true
		},
		billChainOption: {
			type: Object,
			default: () => {
				return {}
			}
		},
		appendToBody: {
			type: Boolean,
			default: true
		},
		modalAppendToBody: {
			type: Boolean,
			default: true
		}
	},
	data () {
		return {
			dialogVisible: false,
			currentFullScreen: false,
			moreLinkVisible: false,
			subLinkVisible: {}
		}
	},
	computed: {
		dailogTop () {
			return this.heightFullscreen ? '0' : this.top
		},
		classes () {
			const dialogClass = [DEFAULT_DIALOG_CLASS]
			if (this.heightFullscreen) {
				dialogClass.push(HEIGHT_FULL_SCREEN_CLASS)
			}
			if (this.positionCenter) {
				dialogClass.push(DIALOG_POSITION_CENTER_CLASS)
			}
			return dialogClass.join(' ')
		},
		moreBtnVisible () {
			if (this.moreBtnOption.length === 0) {
				return this.showMoreBtn
			} else {
				return this.moreBtnOption.find(item => {
					return !this.$fxUtils.isDef(item.show) || !!item.show
				})
			}
		}
	},
	watch: {
		value: {
			immediate: true,
			handler (val) {
				if (val) {
					this.currentFullScreen = this.fullscreen
				}
				this.dialogVisible = val
			}
		},
		dialogVisible (val) {
			if (!val) {
				this.$fxEventBus.$emit('on-dialog-close', this.title)
				this.$emit('input', false)
			} else {
				this.$fxEventBus.$emit('on-dialog-open', this.title)
			}
		},
		fullscreen: {
			immediate: true,
			handler (val) {
				this.currentFullScreen = val
			}
		}
	},
	methods: {
		onClose () {
			this.$emit('close')
		},
		onClosed () {
			this.$emit('closed')
		},
		onBeforeClose (close) {
			if (typeof this.beforeClose === 'function') {
				this.beforeClose(close)
			} else {
				close()
			}
		},
		onFullScreen () {
			this.currentFullScreen = true
		},
		offFullScreen () {
			this.currentFullScreen = false
		},
		isFullScreen () {
			return this.currentFullScreen
		},
		onMoreLinkClick (fn) {
			if (typeof fn === 'function') {
				this.moreLinkVisible = false
				fn()
			}
		},
		onMoreSubLinkClick (sublink, link) {
			if (typeof sublink.click === 'function') {
				this.moreLinkVisible = false
				this.subLinkVisible[link.label] = false
				sublink.click()
			}
		},
		onBillChainClick (fn) {
			if (typeof fn === 'function') {
				fn()
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
.wind-dialog {
	>>>.el-dialog__headerbtn {
		top: 27px
	}
	&__title {
		display: flex;
		flex-direction: row;
		height: 30px;
		line-height: 30px;
		align-items: center;
		position:relative
		padding-left: 5px
		padding-right: 30px
		&-container {
			flex: 1
			height: 30px;
			line-height: 30px;
			display:flex
			.wind-dialog__title-label {
				font-size: 15px;
				font-weight: 700;
			}
			.wind-dialog__title-sub {
				position: relative
				flex: 1
				margin-left: 20px
				font-size: 12px
			}
		}
		&-tools {
			width: 50px
			display: flex;
			flex-direction: row;
			align-items: center;
		}
	}
	>>>.wind-custom-dialog {
		display: flex;
		flex-direction: column;
		margin-bottom: 0
		&.wind-dialog-is-heightFullscreen {
			height: 100%
		}
		.el-dialog__title {
			font-size: 14px
		}
		.el-dialog__body {
			flex: 1
			display: flex;
			flex-direction: column;
			font-size: 12px
			overflow: auto
			padding-top: 10px
			padding-bottom:10px
			box-sizing: border-box;
		}
	}
	>>>.wind-dialog-is-position-center {
		top:50%;
		left:50%;
		transform:translate(-50%,-50%);
		margin: 0px !important
	}
	&__bottom {
		text-align: right;
		height: 40px;
		line-height: 40px
		padding-right: 15px
		&.align-right {
			text-align: right;
			margin-right: 10px
		}
		&.align-left {
			text-align: left;
		}
		&.align-center {
			text-align: center;
		}
		&.is-flex {
			display: flex
		}
		&-left {
			flex: 1
			text-align: left;
		}
		&-right {
			flex: 1
			text-align: right;
		}
	}
}
.dialog-tools-popover__container {
	display: flex
	flex-direction: column
}
.parent-bill__container {
	margin-right: 20px
}
.bill-chain__container {
	margin-right 15px
	height 30px
}
.is-disabled {
	color #c0c4cc
	&:hover {
		color #c0c4cc !important
	}
}
.dialog-mask {
	position:absolute
	top:0
	bottom:0
	left:0
	right:0
}
</style>

