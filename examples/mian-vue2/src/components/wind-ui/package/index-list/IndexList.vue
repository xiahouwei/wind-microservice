<template>
	<div class="wind-index-list">
		<div v-if="letterListShow" class="wind-index-list__letter-container">
			<ul ref="letterList" class="wind-index-list__letter-list">
				<li
					v-for="item in letters"
					:key="item"
					:class="{
						'is-active': item===acitve,
						'not-exist': !currentAlphaArr.includes(item)
					}"
					class="wind-index-list__letter-list-item"
					@mousemove="onMouseMove"
					@mouseleave="onMouseLeave"
					@click="onLetterClick(item)"
				>
					{{item}}
				</li>
			</ul>
		</div>
		<div v-show="!emptyShow" ref="listContainer" class="wind-index-list__container">
			<div v-for="(item, index) in data" :key="item.id" class="wind-index-list__list-item">
				<p v-if="showAlpha(item)" :class="`wind-index-list__list-alpha-${(item[defaultProps.alphaIndex||'alphaIndex'])==='#'? 'wellNumber' : (item[defaultProps.alphaIndex||'alphaIndex'])}`" class="wind-index-list__list-alpha">{{item[defaultProps.alphaIndex||'alphaIndex']}}</p>
				<div :class="computedLabelClass(item)" @click="onItemClick(item)">{{labelComputed(item, index)}}</div>
			</div>
		</div>
		<div v-show="emptyShow" class="wind-index-list__empty">当前没有数据</div>
	</div>
</template>
<script>
/**
 * indexList by shang 2020/11/5
 * @desc indexList 索引列表
 * @param {listData}  [Array] - 列表数据
 * @param {defaultProps}  [Object] - 列表默认参数
 * @param {letterListShow}  [Boolean] - 是否显示索引
 * @param {formatter}  [Function] - 自定义list label
 * @param {customerLetter}  [Boolean] - 自定义索引, 默认不开启, a-z#
 * @event {on-list-click} list元素点击事件
 * @event {on-letter-click} 字母索引点击事件
 */
let alphaCache = ''
export default {
	name: 'indexList',
	props: {
		listData: {
			type: Array,
			default: () => {
				return []
			}
		},
		defaultProps: {
			type: Object,
			default: () => {
				return {
					name: 'name',
					alphaIndex: 'alphaIndex'
				}
			}
		},
		letterListShow: {
			type: Boolean,
			default: true
		},
		formatter: Function,
		customerLetter: {
			type: Boolean,
			default: false
		},
		activeIds: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			data: [],
			acitve: '',
			alphaArr: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '#'],
			currentAlphaArr: []
		}
	},
	watch: {
		listData: {
			immediate: true,
			handler (val) {
				if (this.customerLetter) {
					this.data = val
				} else {
					let _data = []
					const _currentAlphaArr = []
					if (val && val.length > 0) {
						_data = this.alphaArr.reduce((pre, cur) => {
							const curList = val.filter(item => {
								return item[this.defaultProps.alphaIndex || 'alphaIndex'] === cur
							})
							if (curList.length > 0) {
								pre = pre.concat(curList)
								_currentAlphaArr.push(cur)
							}
							return pre
						}, [])
					}
					this.data = _data
					this.currentAlphaArr = _currentAlphaArr
				}
			}
		}
	},
	computed: {
		emptyShow () {
			return this.listData.length === 0
		},
		letters () {
			if (!this.customerLetter) return this.alphaArr
			return this.$fxUtils.arrDedup(this.listData.map(item => {
				return item[this.defaultProps.alphaIndex || 'alphaIndex']
			}))
		},
		labelComputed () {
			return (item, index) => {
				let name = item[this.defaultProps.name || 'name']
				if (typeof this.formatter === 'function') {
					name = this.formatter(item, index)
				}
				return name
			}
		},
		computedLabelClass () {
			return (item) => {
				return {
					'wind-index-list__list-label': true,
					active_label: this.activeIds.includes(item.itemId || item.collectionData.itemId)
				}
			}
		}
	},
	methods: {
		showAlpha (item) {
			if (!this.letterListShow) {
				return false
			}
			const showAlpha = item[this.defaultProps.alphaIndex || 'alphaIndex'] !== alphaCache
			alphaCache = item[this.defaultProps.alphaIndex || 'alphaIndex']
			return showAlpha
		},
		onMouseMove (e) {
			const item = e.target
			const itemRect = item.getBoundingClientRect()
			const offset = Math.abs(e.clientY - itemRect.top) / itemRect.height
			const prev = item.previousElementSibling || null
			const next = item.nextElementSibling || null
			const scale = 0.5
			this.resetScale()
			if (prev) {
				prev.style.setProperty('--scale', 1 + scale * Math.abs(offset - 1))
			}
			item.style.setProperty('--scale', 1 + scale)
			if (next) {
				next.style.setProperty('--scale', 1 + scale * offset)
			}
		},
		onMouseLeave () {
			this.resetScale()
		},
		resetScale () {
			this.$refs.letterList.querySelectorAll('.wind-index-list__letter-list-item').forEach(li => {
				li.style.setProperty('--scale', 1)
			})
		},
		onLetterClick (item) {
			this.acitve = item
			const classKey = item === '#' ? 'wellNumber' : item
			const target = this.$refs.listContainer.querySelector(`.wind-index-list__list-alpha-${classKey}`)
			if (target) {
				this.$fxUtils.doScrollTop(target, 500)
			}
			this.$emit('on-letter-click', item)
		},
		onItemClick (item) {
			this.$emit('on-list-click', item)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '../../style/varsty.styl'
.wind-index-list {
	overflow: auto
	display: flex
	position: relative
	&__letter-container {
		width: 50px
		font-size: 14px
		overflow: auto
		scrollbar-width: none
		&::-webkit-scrollbar {
			width: 0 !important
		}
	}
	&__letter-list {
		--scale: 1
		&-item {
			height: 30px
			line-height: 30px
			padding-left: 15px
			font-size: calc(1.5rem * var(--scale))
			position: relative
			right: calc((1.5rem * var(--scale) - 1.5rem) / 2 * -1)
			transition: 15ms all ease-out
			cursor: pointer
			&.not-exist {
				color: $wind-index-list-letter-not-exist-color
			}
			&.is-active {
				color: $wind-index-list-letter-active-color
				animation: 1s loading ease-in infinite
			}
		}
	}
	&__container {
		position: relative
		overflow: auto
		flex: 1
	}
	&__list-alpha {
		height: 40px
		line-height: 40px
		padding-left: 5px
		border-bottom: 1px solid #eee
	}
	&__list-label {
		height: 40px
		line-height: 40px
		padding-left: 5px
		cursor: pointer
		overflow: hidden
		text-overflow : ellipsis
		white-space: nowrap
		&:hover {
			background-color: #F5F7FA
		}
	}
	.active_label {
		color: $fxBlue
		font-weight: bold
	}
}

@keyframes loading {
  0%, 100% {
    transform: translateY(0px);
  }
  60% {
    transform: translateY(-5px);
  }
}
</style>
