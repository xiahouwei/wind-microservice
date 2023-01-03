<template>
	<div class="fx-bill-container" :style="{width: width}">
		<div class="fx-bill-container__header">
			<div class="fx-bill-container__title fx-block-title">
				<slot name="title">
					<div class="fx-bill-container__title-container">
						<div :style="titleStyle" :class="titleClass" class="fx-bill-container__title-label">{{title}}</div>
						<div v-if="$slots.sub" class="fx-bill-container__title-sub">
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
					<div v-show="moreBtnVisible" slot="reference" class="fx-bill-container__title-tools fx-cursor"><w-icon type="header-more"></w-icon><span>更多</span></div>
				</w-popover>
			</div>
		</div>
		<div class="fx-bill-container__body">
			<slot :fullScreen="currentFullScreen"></slot>
		</div>
		<div class="fx-bill-container__footer">
			<div v-if="$slots.footer" class="fx-bill-container__bottom" :class="[`align-${footAlign}`]">
				<slot name="footer"></slot>
			</div>
			<div v-else-if="$slots['footer-left'] || $slots['footer-right']" class="fx-bill-container__bottom is-flex">
				<div class="fx-bill-container__bottom-left">
					<slot name="footer-left"></slot>
				</div>
				<div class="fx-bill-container__bottom-right">
					<slot name="footer-right"></slot>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
/**
 * fx-bill-container by shang 2022/08/10
 * @desc fx-bill-container 单据容器
 * @params title[String] 标题
 * @params titleClass[String, Array, Object] 标题class
 * @params titleStyle[Object] 标题style
 * @params width[String] 宽度
 * @params showMoreBtn[Boolean] 显示更多按钮
 * @params footAlign[String] foot对齐方式
 * @params billChainOption[Object] <业务追溯>按钮配置
 *
 * @slot defalut 内容插槽
 * @slot tools 更多-按钮栏 插槽
 * @slot footer 底部插槽
 */
export default {
	name: 'fx-bill-container',
	props: {
		title: null,
		titleClass: null,
		titleStyle: null,
		width: {
			type: String,
			default: '100%'
		},
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
		billChainOption: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			currentFullScreen: false,
			moreLinkVisible: false,
			subLinkVisible: {}
		}
	},
	computed: {
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
	methods: {
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
.fx-bill-container {
	background: #FFF;
	display: flex;
	flex-direction: column;
	margin-bottom: 0
	&__header {
		padding: 10px;
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
			.fx-bill-container__title-label {
				font-size: 15px;
				font-weight: 700;
			}
			.fx-bill-container__title-sub {
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
	&__body {
		flex: 1
		display: flex;
		flex-direction: column;
		font-size: 12px
		overflow: auto
		box-sizing: border-box;
		padding: 10px 20px;
		color: #606266;
		word-break: break-all;
	}
	&__footer {
		padding: 10px 20px 20px;
		text-align: right;
		box-sizing: border-box;
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
</style>

