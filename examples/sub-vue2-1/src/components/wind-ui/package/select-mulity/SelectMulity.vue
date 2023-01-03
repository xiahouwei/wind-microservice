<template>
	<div ref="select-mulity" class="wind-select-mulity" v-fxClickOutSide="onClickOutSideHander">
		<el-popover
			ref="popper"
			v-model="popperVisible"
			placement="bottom-start"
			trigger="manual"
			popper-class="wind-select-mulity__dropdown"
			:disabled="disabled"
			@show="onPoperShow"
		>
			<slot name="header"></slot>
			<div class="search-input">
				<el-input
					ref="selectSearchInput"
					v-model="searchKey"
					placeholder="请输入"
					@keydown.down.native.prevent="navigateOptions('next')"
					@keydown.up.native.prevent="navigateOptions('pre')"
					@keyup.enter.native="onSelectEnter"
					@blur="onInputBlur"
				>
					<i slot="prefix" class="el-input__icon el-icon-search"></i>
				</el-input>
			</div>
			<div class="btn-tools">
				<el-button type="primary" size="mini" class="select-btn" @click="onSelectAll">全选</el-button>
				<el-button size="mini" class="select-btn" @click="onUnselectAll">取消全选</el-button>
			</div>
			<w-scroll-bar ref="scroll-bar" class="wind-select-mulity__scroll-bar" wrapClass="wind-select-mulity__dropdown-wrap">
				<div
					v-show="currentOptionList.length>0&&!loading"
					ref='phantom'
					:style="{height: `${this.phantomHeight}px`}"
					class="wind-select-mulity__dropdown-list"
				>
					<ul
						:style="{
							transform: `translate3d(0px, ${this.viewListTranslateY}px, 0px)`
						}"
						class="wind-select-mulity__dropdown-content"
					>
						<li
							v-for="(item, index) in visibleOptionList"
							:key="index"
							ref="option-item"
							:class="['wind-select-mulity__dropdown-item', 'wind-select-mulity__has-title', `wind-select-mulity__dropdown-item-${item.id}`, selectItemClasses(item)]"
							@mousedown.prevent
							@click="onSelectItemClick(item)"
							@mouseover="onSelectItemMouseover(item)"
						>
							<fx-render-dom
								v-if="optionRender&&item.id!==emptyItem.id"
								:render="optionRender"
								:backValue="{item, index}"
							></fx-render-dom>
							<span v-else>{{item[optionProp.name]}}</span>
						</li>
					</ul>
				</div>
				<div v-show="currentOptionList.length===0||loading" class='wind-select-mulity__dropdown-empty'>{{emptyText}}</div>
			</w-scroll-bar>
			<el-input
				ref="selectInput"
				slot="reference"
				readonly
				:placeholder="inputPlaceholder"
				:disabled="disabled"
				:size="size"
				class="select-input"
				@focus="onInputFocus"
			>
				<template slot="suffix">
					<i v-if="showClose" class="el-icon-circle-close select-input__clear-btn" @click="onClearClick"></i>
					<Icon class="title-arrow__icon" :class="{
						'is-expanded': popperVisible
					}" type="arrow-down"></Icon>
				</template>
			</el-input>
			<div v-show="currentTag" class="wind-select-mulity__tags" slot="reference">
				<w-tag
					v-show="currentTag"
					closable
					:disabled="disabled"
					@close="onTagRemoveClick"
					@click="onTagClick"
					:maxWidth="tagCount > 0 ? 35 : 85"
				>{{currentTagLabel}}</w-tag>
				<el-popover
					:content="tagMoreText"
					placement="top-start"
					width="200"
					trigger="hover"
					popper-class="wind-select-mulity__tag-more-popper">
					<el-tag
						slot="reference"
						v-show="tagCount > 0"
						type="info"
						size="mini"
						class="select-tag"
						@click="onTagClick"
					>等{{tagCount}}个</el-tag>
				</el-popover>
			</div>
		</el-popover>
	</div>
</template>
<script>
/**
 * select by shang 2020/12/4
 * @desc select 选择框
 * @param {value}  [any] - 输入框值
 * @param {disabled}  [Boolean] - 是否禁用
 * @param {placeholder}  [String] - 默认提示
 * @param {filterKeys}  [Array] - 筛选keys
 * @param {optionlist}  [Array] - 选项集合
 * @param {fpBeforeSelect}  [Function] - 选择选项之后回调
 * @param {Boolean}  scrollClose - 滚动自动关闭
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
	name: 'w-select-mulity',
	fxComponentName: 'w-select-mulity',
	components: {
		Icon
	},
	directives: {
		fxClickOutSide
	},
	props: {
		value: {
			type: Array,
			default: () => {
				return []
			}
		},
		disabled: Boolean,
		clearable: {
			type: Boolean,
			default: true
		},
		showEmpty: {
			type: Boolean,
			default: true
		},
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
		tipsCount: {
			type: Number,
			default: 10
		},
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
		emptyItem: {
			type: Object,
			default: () => {
				return {
					id: 'empty',
					name: '[空数据]',
					label: '[空数据]'
				}
			}
		}
	},
	data () {
		return {
			popperVisible: false,
			popperElm: null,
			searchKey: '',
			sortOptionList: [],
			allVisibleOptionList: [],
			currentOptionList: [],
			currentHoverItem: {},
			searchDebounce: this.$fxUtils.debounce(),
			start: 0,
			end: 0,
			viewListTranslateY: 0,
			scrollThrottle: throttle(),
			scrollDebounce: debounce(),
			scrolling: false,
			titleDebounce: debounce(),
			optionItemHeight: OPTIONS_ITEM_HEIGHT,
			visibleCount: VISIVLE_COUNT,
			bufferRow: BUFFER_COUNT,
			eventUtils: initEventUtils()
		}
	},
	computed: {
		selectItemClasses () {
			return (listItem) => {
				return {
					selected: this.value.includes(listItem.id),
					hover: listItem.id === this.currentHoverItem.id,
					'is-disabled': !!listItem.disabled
				}
			}
		},
		currentTag () {
			const _optionList = [this.emptyItem, ...this.optionlist]
			return _optionList.find(item => {
				return item.id === this.value[0]
			})
		},
		currentTagLabel () {
			return this.currentTag ? this.currentTag[this.optionProp.name] : ''
		},
		tagCount () {
			return this.value.length - 1
		},
		tagMoreText () {
			if (this.value.length > 1) {
				const moreList = new Set(this.value.slice(1, this.tipsCount + 1))
				const tips = [this.emptyItem, ...this.optionlist].filter(item => {
					return moreList.has(item.id)
				}).map(item => {
					return item[this.optionProp.name]
				}).join('，')
				return this.value.length > this.tipsCount + 1 ? `${tips}...` : tips
			} else {
				return ''
			}
		},
		inputPlaceholder () {
			return this.value.length > 0 ? '' : this.placeholder
		},
		showClose () {
			const hasValue = Array.isArray(this.value) && this.value.length > 0
			return this.clearable && !this.disabled && hasValue
		},
		visibleOptionList () {
			return this.virtual ? this.currentOptionList.slice(this.start, this.end) : this.currentOptionList
		},
		phantomHeight () {
			return this.currentOptionList.length * this.optionItemHeight
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
				this.setSortOptionList()
				this.getCurrentOptionList(this.sortOptionList)
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
				if (this.scrollClose) {
					scrollHide.remove(this)
				}
			}
			this.$emit('visible-change', val)
		},
		searchKey (val) {
			this.searchDebounce(200, false).then(() => {
				this.getCurrentOptionList(this.sortOptionList)
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
			this.setSortOptionList()
			this.getCurrentOptionList(this.sortOptionList)
			if (this.currentOptionList.length > 0) {
				const _value = new Set(this.value)
				let index = this.currentOptionList.findIndex(item => _value.has(item.id))
				if (!~index) {
					index = 0
				}
				this.currentHoverItem = this.currentOptionList[index]
			}
			this.onSearchInputFocus()
			this.$nextTick(() => {
				this.scrollToIndex(0)
			})
		},
		onSearchInputFocus () {
			return new Promise(resolve => {
				if (this.popperVisible === true) {
					setTimeout(() => {
						this.$refs.selectSearchInput.focus()
						resolve()
					}, 100)
				}
			})
		},
		onClickOutSideHander () {
			if (this.popperVisible) {
				this.popperVisible = false
			}
		},
		onSelectItemClick (item) {
			return new Promise(resolve => {
				if (!item[this.optionProp.disabled || 'disabled']) {
					this.fpBeforeSelect(item).then(() => {
						const value = this.doItemSelect(item)
						this.$emit('input', value)
						this.$emit('change', value)
						resolve()
					})
				}
			})
		},
		doItemSelect (item) {
			let [..._value] = this.value
			if (_value.includes(item.id)) {
				_value = _value.filter(currentItem => {
					return currentItem !== item.id
				})
			} else {
				_value.push(item.id)
			}
			return _value
		},
		onSelectItemMouseover (item) {
			this.currentHoverItem = item
		},
		onTagRemoveClick () {
			const [..._value] = this.value
			_value.splice(0, 1)
			this.$emit('input', _value)
			this.$emit('change', _value)
			this.onSearchInputFocus()
		},
		onTagClick () {
			this.onSearchInputFocus()
			this.popperVisible = true
		},
		onSelectAll () {
			const value = this.currentOptionList.map(item => {
				return item.id
			})
			this.$emit('input', value)
			this.$emit('change', value)
		},
		onUnselectAll () {
			const value = []
			this.$emit('input', value)
			this.$emit('change', value)
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
			const wrap = this.$refs['scroll-bar'].$el.querySelector('.wind-select-mulity__dropdown-wrap')
			const target = wrap.querySelector(`.wind-select-mulity__dropdown-item-${optionItem.id}`)
			if (target) {
				this.scrollIntoView(wrap, target)
			} else {
				const index = this.currentOptionList.findIndex(item => item.id === optionItem.id)
				if (~index) {
					this.scrollToIndex(index).then(() => {
						const target = wrap.querySelector(`.wind-select-mulity__dropdown-item-${optionItem.id}`)
						this.scrollIntoView(wrap, target)
					})
				}
			}
		},
		scrollToIndex (index) {
			return new Promise(resolve => {
				const { start, end } = this.getVisibleRange(index)
				const beforeHeight = this.getHeightByRowIndex(index - 1)
				const wrap = this.$refs['scroll-bar'].$el.querySelector('.wind-select-mulity__dropdown-wrap')
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
		onSelectEnter (event) {
			if (!this.popperVisible || this.currentOptionList.length === 0) {
				return false
			}
			this.onSelectItemClick(this.currentHoverItem).then(() => {
				if (event.ctrlKey) {
					this.popperVisible = false
					this.$emit('on-select-enter', event, this.value)
				} else if (event.shiftKey) {
					this.$emit('on-select-enter', event, this.value)
				}
			})
		},
		focus () {
			this.$refs.selectSearchInput.focus()
			this.popperVisible = true
		},
		onClearClick () {
			this.onUnselectAll()
		},
		onInputFocus (e) {
			setTimeout(() => {
				this.popperVisible = !this.popperVisible
				this.$refs.selectSearchInput.focus()
				if (this.ppopperVisible) {
					this.$emit('focus', e)
				}
			}, 30)
		},
		onInputBlur (e) {
			this.$emit('blur', e)
		},
		handleClose () {
			this.popperVisible = false
		},
		bindEvents () {
			beforeScrollTop = 0
			const wrap = this.$refs['scroll-bar'].$el.querySelector('.wind-select-mulity__dropdown-wrap')
			wrap.addEventListener('scroll', this.handleScroll, { passive: true })
			addResizeListener(this.$refs.selectInput.$el, this.resizeListener)
		},
		unbindEvents () {
			if (this.$refs['scroll-bar']) {
				const wrap = this.$refs['scroll-bar'].$el.querySelector('.wind-select-mulity__dropdown-wrap')
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
		getCurrentOptionList (optionlist) {
			this.currentOptionList = !this.searchKey ? optionlist : optionlist.filter(item => {
				return this.$fxUtils.fuzzyQueryObj(item, this.searchKey, this.filterKeys)
			})
		},
		setSortOptionList () {
			let _list = null
			if (this.value.length > 0) {
				const _value = new Set(this.value)
				const selets = []
				const unselects = []
				this.allVisibleOptionList.forEach(item => {
					if (_value.has(item.id)) {
						selets.push(item)
					} else {
						unselects.push(item)
					}
				})
				_list = [...selets, ...unselects]
			} else {
				_list = this.allVisibleOptionList
			}
			this.sortOptionList = this.showEmpty ? [this.emptyItem, ..._list] : _list
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
			if (!target.classList.contains('wind-select-mulity__has-title')) {
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
.wind-select-mulity {
	display: inline-block;
    position: relative;
	.select-input {
		line-height: 28px
		>>>.el-input__inner {
			cursor: pointer
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
	&__tags {
		position: absolute;
		line-height: normal;
		white-space: normal;
		z-index: 1;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		.select-tag {
			box-sizing: border-box;
			border-color: transparent;
			margin: 2px 0 2px 6px;
			background-color: #f0f2f5;
			user-select:none;
			>>>.el-tag__close.el-icon-close {
				background-color: #C0C4CC;
			}
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
				&::after {
					position: absolute;
					right: 0px;
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
		.search-input {
			width: 100%
			padding: 0 5px;
			box-sizing: border-box;
		}
		.btn-tools {
			height: 36px
			line-height: 36px
			padding: 0 5px;
			box-sizing: border-box;
			.select-btn {
				padding: 4px 15px
			}
		}
	}
	&__scroll-bar {
		padding-bottom: 0
	}
}
</style>
<style lang="stylus">
.wind-select-mulity__dropdown {
	padding: 5px 0
	&-wrap {
		max-height: 274px;
		position:relative
		overflow: auto
		overflow-anchor:none
	}
}
.wind-select-mulity__tag-more-popper {
	font-size: 12px
}
</style>
