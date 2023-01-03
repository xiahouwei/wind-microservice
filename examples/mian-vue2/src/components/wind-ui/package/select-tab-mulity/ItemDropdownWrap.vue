<template>
	<w-scroll-bar ref="scroll-bar" class="wind-select-tab__scroll-bar" wrapClass="wind-select-tab__dropdown-wrap">
		<div v-show="optionlist.length>0&&!loading" ref='phantom' :style="{height: `${this.phantomHeight}px`}" class="wind-select-tab__dropdown-list">
			<ul
				:style="{
					transform: `translate3d(0px, ${this.viewListTranslateY}px, 0px)`
				}"
				class="wind-select-tab__dropdown-content"
			>
				<li
					v-for="(item, index) in visibleOptionList"
					:key="item.id"
					ref="option-item"
					:class="['wind-select-tab__dropdown-item', 'wind-select-tab__has-title', `wind-select-tab__dropdown-item-${item.id}`, selectItemClasses(item)]"
					@mousedown.prevent
					@click="onSelectItemClick(item)"
					@mouseover="onSelectItemMouseover($event,item)"
				>
					<fx-render-dom
						v-if="optionRender"
						:render="optionRender"
						:backValue="{item, index}"
					></fx-render-dom>
					<span v-else>{{item[optionProp.name]}}</span>
				</li>
			</ul>
		</div>
		<div v-show="optionlist.length===0||loading" class='wind-select-tab__dropdown-empty'>{{emptyText}}</div>
	</w-scroll-bar>
</template>

<script>
import throttle from '../../js/utils/throttle.js'
import debounce from '../../js/utils/debounce.js'
import { getTextWidth } from '../../js/utils/event.js'
const OPTIONS_ITEM_HEIGHT = 34
const VISIVLE_COUNT = 20
const BUFFER_COUNT = 50
let beforeScrollTop = 0
export default {
	name: 'itemDropdownWrap',
	props: {
		selectValue: null,
		optionlist: {
			type: Array,
			default: () => {
				return []
			}
		},
		optionProp: {
			type: Object,
			default: () => {
				return {
					name: 'name',
					disabled: 'disabled',
					visibleFlag: 'visibleFlag'
				}
			}
		},
		optionRender: Function,
		virtual: {
			type: Boolean,
			default: true
		},
		loading: {
			type: Boolean
		},
		loadingText: {
			type: String,
			default: '加载中'
		},
		noDataText: {
			type: String,
			default: '无数据'
		},
		currentHoverItem: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			start: 0,
			end: 0,
			viewListTranslateY: 0,
			scrollThrottle: throttle(),
			scrollDebounce: debounce(),
			titleDebounce: debounce(),
			scrolling: false,
			optionItemHeight: OPTIONS_ITEM_HEIGHT,
			visibleCount: VISIVLE_COUNT,
			bufferRow: BUFFER_COUNT,
			selectedMap: {}
		}
	},
	computed: {
		selectItemClasses () {
			return (listItem) => {
				return {
					selected: !!this.selectedMap[listItem.id],
					hover: listItem.id === this.currentHoverItem.id,
					'is-disabled': !!listItem[this.optionProp.disabled || 'disabled']
				}
			}
		},
		visibleOptionList () {
			return this.virtual ? this.optionlist.slice(this.start, this.end) : this.optionlist
		},
		phantomHeight () {
			return this.optionlist.length * this.optionItemHeight
		},
		emptyText () {
			return this.loading ? this.loadingText : this.noDataText
		}
	},
	watch: {
		optionlist: {
			immediate: true,
			handler () {
				this.$nextTick(() => {
					this.scrollToIndex(0)
				})
			}
		},
		selectValue: {
			immediate: true,
			handler (val) {
				const selectedMap = {}
				val.forEach(item => {
					selectedMap[item] = true
				})
				this.selectedMap = selectedMap
			}
		}
	},
	mounted () {
		this.bindEvents()
	},
	destroyed () {
		this.unbindEvents()
	},
	methods: {
		onSelectItemClick (item) {
			this.$emit('on-select-item-click', item)
		},
		onSelectItemMouseover (event, item) {
			this.titleDebounce(150, false).then(() => {
				const target = event.target
				const text = target.innerText
				const offsetWidth = target.offsetWidth - 40
				if (getTextWidth(text) > offsetWidth && !target.title) {
					target.title = text
				}
			})
			this.$emit('update:currentHoverItem', item)
		},
		scrollToOption (optionItem) {
			const wrap = this.$refs['scroll-bar'].$el.querySelector('.wind-select-tab__dropdown-wrap')
			const target = wrap.querySelector(`.wind-select-tab__dropdown-item-${optionItem.id}`)
			if (target) {
				this.scrollIntoView(wrap, target)
			} else {
				const index = this.optionlist.findIndex(item => item.id === optionItem.id)
				if (~index) {
					this.scrollToIndex(index).then(() => {
						const target = wrap.querySelector(`.wind-select-tab__dropdown-item-${optionItem.id}`)
						this.scrollIntoView(wrap, target)
					})
				}
			}
		},
		updateVisibleData (scrollTop = 0) {
			return new Promise(resolve => {
				this.scrollDebounce(100, !this.scrolling).then(() => {
					const startIndex = this.getStartIndex(scrollTop)
					const { start, end } = this.getVisibleRange(startIndex)
					this.viewListTranslateY = this.getViewTranslateY(start, end)
					this.start = start
					this.end = end
					this.$nextTick(() => {
						this.scrolling = false
						resolve()
					})
				})
			})
		},
		getStartIndex (scrollTop) {
			let height = 0
			for (let i = 0; i < this.optionlist.length; i++) {
				height += this.optionItemHeight
				if (height > scrollTop) {
					return i
				}
			}
			return 0
		},
		getVisibleRange (startIndex) {
			const start = startIndex - this.bufferRow
			const end = startIndex + this.visibleCount + this.bufferRow
			return {
				start: start >= 0 ? start : 0,
				end: end > this.optionlist.length ? this.optionlist.length : end
			}
		},
		getViewTranslateY (start, end) {
			if (end === this.optionlist.length) {
				const diffStart = this.optionlist.length - end + start
				return this.getHeightByRowIndex(diffStart - 1)
			}
			return this.getHeightByRowIndex(start - 1)
		},
		getHeightByRowIndex (rowIndex) {
			if (rowIndex < 0) {
				return 0
			}
			let height = 0
			for (let i = 0; i < this.optionlist.length; i++) {
				height += this.optionItemHeight
				if (i === rowIndex) {
					return height
				}
			}
		},
		bindEvents () {
			beforeScrollTop = 0
			const wrap = this.$refs['scroll-bar'].$el.querySelector('.wind-select-tab__dropdown-wrap')
			wrap.addEventListener('scroll', this.handleScroll, { passive: true })
		},
		unbindEvents () {
			if (this.$refs['scroll-bar']) {
				const wrap = this.$refs['scroll-bar'].$el.querySelector('.wind-select-tab__dropdown-wrap')
				wrap.removeEventListener('scroll', this.handleScroll, { passive: true })
			}
		},
		handleScroll (e) {
			this.scrolling = true
			this.scrollThrottle(15, true).then(() => {
				this.$emit('on-scroll', e)
				if (this.virtual) {
					const ele = e.srcElement || e.target
					const { scrollTop } = ele
					if (scrollTop !== beforeScrollTop) {
						beforeScrollTop = scrollTop
						this.updateVisibleData(scrollTop)
					}
				}
			})
		},
		scrollToIndex (index) {
			return new Promise(resolve => {
				const { start, end } = this.getVisibleRange(index)
				const beforeHeight = this.getHeightByRowIndex(index - 1)
				const wrap = this.$refs['scroll-bar'].$el.querySelector('.wind-select-tab__dropdown-wrap')
				const maxScrollTop = wrap.scrollHeight - wrap.clientHeight
				const scrollTop = beforeHeight > maxScrollTop ? maxScrollTop : beforeHeight
				wrap.scrollTop = scrollTop
				beforeScrollTop = scrollTop
				!index && this.$refs['scroll-bar'].handleScroll()
				this.viewListTranslateY = this.getViewTranslateY(start, end)
				this.start = start
				this.end = end
				setTimeout(() => {
					resolve()
				}, 100)
			})
		},
		scrollIntoView (container, selected) {
			if (!selected) {
				container.scrollTop = 0
				return
			}
			const top = selected.offsetTop + this.viewListTranslateY
			const bottom = top + selected.offsetHeight
			const viewRectTop = container.scrollTop
			const viewRectBottom = viewRectTop + container.clientHeight
			if (top < viewRectTop) {
				container.scrollTop = top
			} else if (bottom > viewRectBottom) {
				container.scrollTop = bottom - container.clientHeight
			}
		},
		recalculateScrollBar () {
			this.$refs['scroll-bar'].handleScroll()
		}
	}
}
</script>

<style lang="stylus" scoped>
.wind-select-tab {
	&__dropdown {
		&-list {
			list-style: none;
			padding: 6px 0;
			margin: 0;
			box-sizing: border-box;
		}
		&-content {
			position:absolute
			left:0
			top:0
			right:0
		}
		&-item {
			font-size: 12px;
			padding: 0 20px
			position: relative;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			color: #606266;
			height: 34px;
			line-height: 34px;
			box-sizing: border-box;
			cursor: pointer;
			&.hover, &:hover {
				background-color: #F5F7FA;
			}
			&.selected {
				color: #409EFF;
				font-weight: 700;
				&::after {
					position: absolute;
					right: 5px;
					top: 0;
					font-family: element-icons;
					content: "\e6da";
					font-size: 12px;
					font-weight: 700;
					-webkit-font-smoothing: antialiased;
				}
			}
			&.is-disabled {
				opacity: 0.6
				cursor: not-allowed
			}
		}
		&-empty {
			height: 34px;
			line-height: 34px;
			box-sizing: border-box;
			padding: 0 20px
			text-align: center;
			color: #999;
			font-size: 14px;
		}
	}
	&__scroll-bar {
		padding-right: 10px
		padding-bottom: 0
	}
}
</style>
