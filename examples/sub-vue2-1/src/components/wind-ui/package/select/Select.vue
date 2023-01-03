<template>
	<div ref="select" class="wind-select" v-fxClickOutSide="onClickOutSideHander" @click.stop="toggleMenu">
		<el-popover
			ref="popper"
			v-model="popperVisible"
			placement="bottom-start"
			trigger="manual"
			:popper-class="popperClasses"
			:disabled="disabled"
			@show="onPoperShow"
		>
			<w-scroll-bar ref="scroll-bar" class="wind-select__scroll-bar" wrapClass="wind-select__dropdown-wrap">
				<div v-show="currentOptionList.length>0&&!loading" ref='phantom' :style="{height: `${this.phantomHeight}px`}" class="wind-select__dropdown-list">
					<ul
						:style="{
							transform: `translate3d(0px, ${this.viewListTranslateY}px, 0px)`
						}"
						class="wind-select__dropdown-content"
					>
						<li
							v-for="(item, index) in visibleOptionList"
							:key="item.id"
							ref="option-item"
							:class="['wind-select__dropdown-item', 'wind-select__has-title', `wind-select__dropdown-item-${item.id}`, selectItemClasses(item)]"
							@click="onSelectItemClick(item)"
							@mouseover="onSelectItemMouseover(item)"
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
				<div v-show="currentOptionList.length===0||loading" class='wind-select__dropdown-empty'>{{emptyText}}</div>
			</w-scroll-bar>
			<el-input
				ref="selectInput"
				v-model="selectedLabel"
				slot="reference"
				:placeholder="placeholderComputed"
				:disabled="disabled"
				readonly
				:size="size"
				class="select-input"
				:class="{'is-disabled':disabled}"
				@keydown.down.native.prevent="navigateOptions('next')"
				@keydown.up.native.prevent="navigateOptions('pre')"
				@keyup.enter.native.prevent="onSelectEnter"
				@focus="onInputFocus"
				@blur="onInputBlur"
			>
				<template slot="suffix">
					<i v-if="showClear" class="el-icon-circle-close select-input__clear-btn" @click="onClearClick"></i>
					<Icon class="title-arrow__icon" :class="{
						'is-expanded': popperVisible
					}" type="arrow-down"></Icon>
				</template>
			</el-input>
		</el-popover>
	</div>
</template>
<script>
/**
 * select by shang 2020/12/4
 * @desc select 选择框
 * @param {any}  value - 输入框值
 * @param {Boolean}  disabled - 是否禁用
 * @param {Boolean}  filterable - 开启筛选 默认开启
 * @param {Boolean}  clearable - 清除功能
 * @param {Stringe}  size - 尺寸
 * @param {String}  placeholder - 默认提示
 * @param {Array}  filterKeys - 筛选keys
 * @param {Array}  optionlist - 选项集合
 * @param {Object}  optionProp - 选项字段
 * @param {String}  optionProp.name - 选项name 默认name
 * @param {Boolean}  optionProp.disabled - 是否禁用 默认disabled
 * @param {Boolean}  optionProp.visibleFlag - 是否显示 默认visibleFlag, 如果选项没有这个字段则默认显示
 * @param {Boolean}  optionRender - 选项渲染函数
 * @param {Function}  fpBeforeSelect - 选择选项之后回调
 * @param {Boolean}  scrollClose - 滚动自动关闭
 * @param {String}  defaultText - 没有匹配选项时输入框显示的文本
 *
 * @event {change} 选项发生变化触发
 * @event {blur} 输入框失焦时触发
 * @event {focus} 输入框聚焦时触发
 */
import fxClickOutSide from '../../js/utils/clickoutside.js'
import scrollHide from '../../js/utils/scroll-hide.js'
import Icon from '../icon'
import throttle from '../../js/utils/throttle.js'
import debounce from '../../js/utils/debounce.js'
import { initEventUtils, getTextWidth } from '../../js/utils/event.js'
import { addResizeListener, removeResizeListener } from '../../js/utils/resize-event.js'
const SEARCH_PROPS = ['name', 'code', 'pinYin', 'pinYinList', 'label']
const OPTIONS_ITEM_HEIGHT = 34
const VISIVLE_COUNT = 20
const BUFFER_COUNT = 50
let beforeScrollTop = 0
export default {
	name: 'w-select',
	fxComponentName: 'w-select',
	components: {
		Icon
	},
	directives: {
		fxClickOutSide
	},
	props: {
		value: null,
		disabled: Boolean,
		filterable: {
			type: Boolean,
			default: true
		},
		clearable: Boolean,
		size: {
			type: String,
			default: 'mini'
		},
		placeholder: {
			type: String,
			default: '请选择'
		},
		filterKeys: {
			type: Array,
			default: () => {
				return SEARCH_PROPS
			}
		},
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
		fpBeforeSelect: {
			type: Function,
			default: () => {
				return Promise.resolve({})
			}
		},
		fpSelectShow: Function,
		virtual: {
			type: Boolean,
			default: true
		},
		poperClass: {
			type: String,
			default: ''
		},
		loading: {
			type: Boolean
		},
		dropdownWidth: String,
		dropdownMaxWidth: {
			type: String,
			default: '280px'
		},
		scrollClose: {
			type: Boolean,
			default: true
		},
		loadingText: {
			type: String,
			default: '加载中'
		},
		noDataText: {
			type: String,
			default: '无数据'
		},
		defaultText: String
	},
	data () {
		return {
			popperVisible: false,
			popperElm: null,
			searchKey: '',
			currentHoverItem: {},
			searchDebounce: debounce(),
			start: 0,
			end: 0,
			viewListTranslateY: 0,
			scrollThrottle: throttle(),
			scrollDebounce: debounce(),
			scrolling: false,
			allVisibleOptionList: [],
			currentOptionList: [],
			titleDebounce: debounce(),
			enterDebounce: debounce(),
			menuVisibleOnFocus: false,
			optionItemHeight: OPTIONS_ITEM_HEIGHT,
			visibleCount: VISIVLE_COUNT,
			bufferRow: BUFFER_COUNT,
			eventUtils: initEventUtils()
		}
	},
	computed: {
		selectedLabel: {
			get () {
				return this.popperVisible ? this.searchKey : this.currentSelect[this.optionProp.name]
			},
			set (val) {
				this.searchKey = val
			}
		},
		selectItemClasses () {
			return (listItem) => {
				return {
					selected: this.value === listItem.id,
					hover: listItem.id === this.currentHoverItem.id,
					'is-disabled': !!listItem.disabled
				}
			}
		},
		showClear () {
			return this.clearable && !this.disabled && !!this.value
		},
		currentSelect () {
			let select = {}
			if (this.$fxUtils.isDef(this.value)) {
				const _select = this.optionlist.find(item => item.id === this.value)
				if (_select) {
					select = _select
				} else if (this.value !== '') {
					console.warn(`fxWarn:w-select${this.$parent.label ? `-${this.$parent.label}-` : ''}无法匹配选项值`
					)
				}
				if (this.$fxUtils.isEmptyObj(select)) {
					select = {
						id: this.value,
						name: this.defaultText || this.value
					}
				}
			}
			return select
		},
		visibleOptionList () {
			return this.virtual ? this.currentOptionList.slice(this.start, this.end) : this.currentOptionList
		},
		phantomHeight () {
			return this.currentOptionList.length * this.optionItemHeight
		},
		popperClasses () {
			return `wind-select__dropdown ${this.poperClass || ''}`
		},
		readonly () {
			return !this.popperVisible
		},
		placeholderComputed () {
			return this.popperVisible ? this.currentSelect[this.optionProp.name] || this.placeholder : this.placeholder
		},
		emptyText () {
			return this.loading ? this.loadingText : this.noDataText
		}
	},
	watch: {
		optionlist: {
			immediate: true,
			handler (value, oldValue) {
				this.allVisibleOptionList = value.filter(item => item.visibleFlag !== false)
				this.getCurrentOptionList(this.allVisibleOptionList)
				this.updateVisibleData(0)
			}
		},
		popperVisible (val) {
			if (val) {
				if (this.scrollClose) {
					scrollHide.add(this)
				}
			} else {
				this.$refs.popper.destroyPopper()
				this.searchKey = ''
				this.menuVisibleOnFocus = false
				if (this.scrollClose) {
					scrollHide.remove(this)
				}
			}
			this.$emit('visible-change', val)
		},
		searchKey (val) {
			this.searchDebounce(200, false).then(() => {
				this.getCurrentOptionList(this.allVisibleOptionList)
				if (this.currentOptionList.length === 1) {
					this.currentHoverItem = this.currentOptionList[0]
				}
				this.updateVisibleData(0).then(() => {
					this.$refs.popper.updatePopper()
				})
			})
		}
	},
	mounted () {
		this.bindEvents()
		this.bindSelectOptionHover()
		this.setSelectDropWidth()
	},
	destroyed () {
		this.unbindEvents()
		this.removeSelectOptionHover()
	},
	methods: {
		onPoperShow () {
			this.popperElm = this.$refs.popper.$refs.popper
			this.searchKey = ''
			if (typeof this.fpSelectShow === 'function') {
				this.fpSelectShow().then(this.setHoverItemAndScroll)
			} else {
				this.setHoverItemAndScroll()
			}
		},
		setHoverItemAndScroll () {
			if (this.currentOptionList.length > 0) {
				let index = this.currentOptionList.findIndex(item => item.id === this.value)
				if (!~index) {
					index = 0
				}
				this.currentHoverItem = this.currentOptionList[index]
				this.$nextTick(() => {
					this.scrollToIndex(index)
				})
			}
		},
		handleClose () {
			this.popperVisible = false
		},
		onClickOutSideHander () {
			if (this.popperVisible) {
				this.popperVisible = false
			}
		},
		onSelectItemClick (item) {
			return new Promise(resolve => {
				if (!item.disabled) {
					this.fpBeforeSelect(item).then(() => {
						if (item.id === this.value) {
							this.popperVisible = false
						} else {
							this.popperVisible = false
							this.$emit('input', item.id)
							this.$emit('change', item.id, item)
							this.$nextTick(() => {
								this.blur()
							})
						}
						if (event.type === 'click') {
							this.$emit('on-select-click', item.id, item, item.id === this.value)
						}
						resolve(item)
					})
				}
			})
		},
		onSelectItemMouseover (item) {
			this.currentHoverItem = item
		},
		navigateOptions (type) {
			if (this.currentOptionList.length === 0 || !this.popperVisible) {
				return false
			}
			const _optionList = this.currentOptionList
			let index = _optionList.findIndex(item => {
				return item === this.currentHoverItem
			})
			if (~index) {
				if (type === 'next') {
					if (index === _optionList.length - 1) {
						index = 0
					} else {
						index = index + 1
					}
				} else {
					if (index === 0) {
						index = _optionList.length - 1
					} else {
						index = index - 1
					}
				}
				this.currentHoverItem = _optionList[index]
			} else {
				this.currentHoverItem = _optionList[0]
			}
			this.$nextTick(() => this.scrollToOption(this.currentHoverItem))
		},
		scrollToOption (optionItem) {
			const wrap = this.$refs['scroll-bar'].$el.querySelector('.wind-select__dropdown-wrap')
			const target = wrap.querySelector(`.wind-select__dropdown-item-${optionItem.id}`)
			if (target) {
				this.scrollIntoView(wrap, target)
			} else {
				const index = this.currentOptionList.findIndex(item => item.id === optionItem.id)
				if (~index) {
					this.scrollToIndex(index).then(() => {
						const target = wrap.querySelector(`.wind-select__dropdown-item-${optionItem.id}`)
						this.scrollIntoView(wrap, target)
					})
				}
			}
		},
		onSelectEnter (event) {
			this.enterDebounce(200).then(() => {
				if (this.loading) return false
				if (!this.popperVisible) {
					this.toggleMenu()
				} else {
					this.onSelectItemClick(this.currentHoverItem).then((item) => {
						if (this.$fxUtils.isEnterCode(event.code)) {
							this.$emit('on-select-enter', event, item)
						}
					})
				}
			})
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
			for (let i = 0; i < this.currentOptionList.length; i++) {
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
				end: end > this.currentOptionList.length ? this.currentOptionList.length : end
			}
		},
		getViewTranslateY (start, end) {
			if (end === this.currentOptionList.length) {
				const diffStart = this.currentOptionList.length - end + start
				return this.getHeightByRowIndex(diffStart - 1)
			}
			return this.getHeightByRowIndex(start - 1)
		},
		getHeightByRowIndex (rowIndex) {
			if (rowIndex < 0) {
				return 0
			}
			let height = 0
			for (let i = 0; i < this.currentOptionList.length; i++) {
				height += this.optionItemHeight
				if (i === rowIndex) {
					return height
				}
			}
		},
		bindEvents () {
			beforeScrollTop = 0
			const wrap = this.$refs['scroll-bar'].$el.querySelector('.wind-select__dropdown-wrap')
			wrap.addEventListener('scroll', this.handleScroll, { passive: true })
			addResizeListener(this.$refs.selectInput.$el, this.resizeListener)
		},
		unbindEvents () {
			if (this.$refs['scroll-bar']) {
				const wrap = this.$refs['scroll-bar'].$el.querySelector('.wind-select__dropdown-wrap')
				wrap.removeEventListener('scroll', this.handleScroll, { passive: true })
			}
			if (this.$refs.selectInput) {
				removeResizeListener(this.$refs.selectInput.$el, this.resizeListener)
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
				const wrap = this.$refs['scroll-bar'].$el.querySelector('.wind-select__dropdown-wrap')
				const maxScrollTop = wrap.scrollHeight - wrap.clientHeight
				const scrollTop = beforeHeight > maxScrollTop ? maxScrollTop : beforeHeight
				wrap.scrollTop = scrollTop
				beforeScrollTop = scrollTop
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
		focus () {
			this.$refs.selectInput.focus()
		},
		blur () {
			this.$refs.selectInput.blur()
		},
		onClearClick () {
			this.$emit('input', '')
			this.$emit('change', '', {})
		},
		onInputFocus (e) {
			setTimeout(() => {
				this.menuVisibleOnFocus = true
				this.popperVisible = true
				this.$emit('focus', e)
			}, 30)
		},
		onInputBlur (e) {
			this.$emit('blur', e)
		},
		getCurrentOptionList (optionlist) {
			this.currentOptionList = !this.searchKey ? optionlist : optionlist.filter(item => {
				return this.$fxUtils.fuzzyQueryObj(item, this.searchKey, this.filterKeys)
			})
		},
		bindSelectOptionHover () {
			if (this.$refs.popper) {
				const popper = this.$refs.popper.$refs.popper
				this.eventUtils.on(popper, 'mouseover', this.optionHoverHandler)
			}
		},
		removeSelectOptionHover () {
			if (this.$refs.popper) {
				const popper = this.$refs.popper.$refs.popper
				this.eventUtils.off(popper, 'mouseover', this.optionHoverHandler)
			}
		},
		optionHoverHandler (event) {
			const target = event.target
			if (!target.classList.contains('wind-select__has-title')) {
				return false
			}
			this.titleDebounce(150, false).then(() => {
				const text = target.innerText
				const offsetWidth = target.offsetWidth - 40
				if (getTextWidth(text) > offsetWidth && !target.title) {
					target.title = text
				}
			})
		},
		setSelectDropWidth () {
			this.setPopperMinwidth()
			if (this.dropdownWidth) {
				this.$refs.popper.$refs.popper.style.width = this.dropdownWidth
			} else {
				this.$refs.popper.$refs.popper.style.maxWidth = this.dropdownMaxWidth
			}
		},
		toggleMenu () {
			if (!this.disabled) {
				if (this.menuVisibleOnFocus) {
					this.menuVisibleOnFocus = false
				} else {
					this.popperVisible = !this.popperVisible
				}
				if (this.popperVisible) {
					this.$refs.selectInput.focus()
				}
			}
		},
		resizeListener () {
			this.setPopperMinwidth()
		},
		setPopperMinwidth () {
			const minWidth = this.$el.offsetWidth
			if (this.$refs.popper) {
				this.$refs.popper.$refs.popper.style.minWidth = `${minWidth}px`
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
.wind-select {
	display: inline-block;
    position: relative;
	.select-input {
		line-height: 28px
		>>>.el-input__inner {
			cursor: pointer
			padding-right: 40px;
		}
		.title-arrow__icon {
			width: 10px
			height:10px
			margin-right: 5px
			transition: transform 0.3s;
			&.is-expanded {
				transform: rotate(-180deg);
			}
		}
		&__clear-btn {
			font-size: 14px
			margin-right: 4px
		}
		&.is-disabled>>>.el-input__inner {
			cursor: not-allowed
		}
	}
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
		padding-right: 0
		padding-bottom: 0
	}
}
</style>
<style lang="stylus">
.wind-select__dropdown {
	padding: 5px 0
	&-wrap {
		max-height: 274px;
		position:relative
		overflow: auto
		overflow-anchor:none
	}
}
</style>
