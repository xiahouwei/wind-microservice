<template>
	<div ref="select-tab" class="wind-select-tab-mulity" v-fxClickOutSide="onClickOutSideHander">
		<el-popover
			ref="popper"
			v-model="popperVisible"
			placement="bottom-start"
			trigger="manual"
			:popper-class="popperClasses"
			:disabled="disabled"
			@show="onPoperShow"
		>
			<div class="search-input">
				<el-input
					ref="selectSearchInput"
					v-model="searchKey"
					v-fx-keyboard-enter="onSelectEnter"
					placeholder="请输入"
					@keyup.left.native.prevent="tabSwitch('left')"
					@keyup.right.native.prevent="tabSwitch('right')"
					@keydown.down.native.prevent="navigateOptions('next')"
					@keydown.up.native.prevent="navigateOptions('pre')"
					@blur="onInputBlur"
				>
					<i slot="prefix" class="el-input__icon el-icon-search"></i>
				</el-input>
			</div>
			<div class="btn-tools">
				<el-button type="primary" size="mini" class="select-btn" @click="onSelectAll">全选</el-button>
				<el-button v-if="showUnselectAllBtn" size="mini" class="select-btn" @click="onUnselectAll">取消全选</el-button>
			</div>
			<el-tabs v-show="currentOptionList.length>0&&!loading" ref="el-tab" v-model="activeTag">
				<template v-for="(item, index) in currentOptionList">
					<el-tab-pane :name="item.id" :key="item.id">
						<div slot="label">
							<fx-render-dom
								v-if="paneRender"
								:render="paneRender"
								:backValue="{item, index}"
							></fx-render-dom>
							<span v-else>{{item[optionProp.tabName || 'name']}}</span>
						</div>
						<dropdown-wrap
							:ref="`dropdown-wrap-${item.id}`"
							:selectValue="value"
							:optionlist="item.listData"
							:typeOptionlist="item.typeListDate"
							:currentHoverItem.sync="currentHoverItem"
							:optionProp="optionProp"
							:optionRender="optionRender"
							:typeOptionProp="typeOptionProp"
							:typeOptionRender="typeOptionRender"
							:virtual="virtual"
							:loading="loading"
							:loadingText="loadingText"
							:noDataText="noDataText"
							:typeFilter="typeFilter"
							:showAllTypeOption="showAllTypeOption"
							@on-scroll="onScroll"
							@on-select-item-click="onSelectItemClick"
						></dropdown-wrap>
					</el-tab-pane>
				</template>
			</el-tabs>
			<div v-show="currentOptionList.length===0||loading" class='wind-select-tab-mulity__dropdown-empty'>{{emptyText}}</div>
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
			<div v-show="firstTag" class="wind-select-tab-mulity__tags" slot="reference">
				<w-tag
					v-show="firstTag"
					:closable="canCloseTag"
					:disabled="disabled"
					:maxWidth="tagCount > 0 ? 35 : 85"
					@click="onTagClick"
					@close="onTagRemoveClick"
				>{{firstTagLabel}}</w-tag>
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
 * select-tab-mulity by shang 2021/8/5
 * @desc select-tab-mulity 分页多选选择框
 * @param {Array}  value - 输入框值
 * @param {Boolean}  disabled - 是否禁用
 * @param {String}  placeholder - 默认提示
 * @param {Array}  filterKeys - 筛选keys
 * @param {Boolean}  clearable - 清除功能,默认开启
 * @param {Stringe}  size - 输入框尺寸
 * @param {Array}  optionlist - 选项集合
 * @param {Object}  optionProp - 选项字段
 * @param {String}  optionProp.tabName - 分页name 默认name
 * @param {String}  optionProp.name - 选项name 默认name
 * @param {Boolean}  optionProp.disabled - 是否禁用 默认disabled
 * @param {Boolean}  optionProp.visibleFlag - 是否显示 默认visibleFlag, 如果选项没有这个字段则默认显示
 * @param {Boolean}  optionRender - 选项渲染函数
 * @param {Object}  typeOptionProp - 选项字段
 * @param {String}  typeOptionProp.name - 左侧类别选项name 默认name
 * @param {Boolean}  typeOptionProp.disabled - 是否禁用 默认disabled
 * @param {Boolean}  typeOptionProp.visibleFlag - 是否显示 默认visibleFlag, 如果选项没有这个字段则默认显示
 * @param {Boolean}  typeOptionRender - 左侧类别选项渲染函数
 * @param {Boolean}  paneRender - 分页标签渲染函数
 * @param {Function}  fpBeforeSelect - 选择选项之后回调
 * @param {Boolean}  scrollClose - 滚动自动关闭
 * @param {Function}  typeFilter - 点击左侧类别数据后，对于右侧数据筛选的回调函数 传参(selectedTypeData, item)
 * @param {Boolean}  showAllTypeOption - 左侧类别数据，是否显示 “全部” 选项
 * @param {Boolean}  canCloseTag - 是否显示tag标签关闭按钮，默认显示
 * @param {Boolean}  showUnselectAllBtn - 是否显示'取消全选'按钮，默认显示
 *
 * @event change 选项发生变化触发
 * @event blur 输入框失焦时触发
 * @event focus 输入框聚焦时触发
 */
import fxClickOutSide from '../../js/utils/clickoutside.js'
import { KeyboardEnter } from '../../js/directives'
import scrollHide from '../../js/utils/scroll-hide.js'
import Icon from '../icon'
import debounce from '../../js/utils/debounce.js'
import { addResizeListener, removeResizeListener } from '../../js/utils/resize-event.js'
import { prevent, initEventUtils } from '../../js/utils/event.js'
import DropdownWrap from './DropdownWrap.vue'
const SEARCH_PROPS = ['name', 'code', 'pinYin', 'pinYinList']
export default {
	name: 'w-select-tab-mulity',
	fxComponentName: 'w-select-tab',
	components: {
		Icon,
		DropdownWrap
	},
	directives: {
		fxClickOutSide,
		'fx-keyboard-enter': KeyboardEnter
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
					tabName: 'name',
					name: 'name',
					disabled: 'disabled',
					visibleFlag: 'visibleFlag'
				}
			}
		},
		optionRender: Function,
		typeOptionProp: {
			type: Object,
			default: () => {
				return {
					name: 'name',
					disabled: 'disabled',
					visibleFlag: 'visibleFlag'
				}
			}
		},
		typeOptionRender: Function,
		paneRender: Function,
		scrollClose: {
			type: Boolean,
			default: true
		},
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
		dropdownWidth: {
			type: String,
			default: '380px'
		},
		loadingText: {
			type: String,
			default: '加载中'
		},
		noDataText: {
			type: String,
			default: '无数据'
		},
		loading: {
			type: Boolean
		},
		typeFilter: Function,
		showAllTypeOption: {
			type: Boolean,
			default: true
		},
		canCloseTag: {
			type: Boolean,
			default: true
		},
		showUnselectAllBtn: {
			type: Boolean,
			default: true
		},
		fpSelectShow: Function
	},
	data () {
		return {
			popperVisible: false,
			popperElm: null,
			activeTag: '',
			searchKey: '',
			currentHoverItem: {},
			searchDebounce: debounce(),
			eventUtils: initEventUtils()
		}
	},
	computed: {
		currentOptionList () {
			return this.optionlist.map(item => {
				const listData = item.listData.filter(_item => {
					return this.$fxUtils.fuzzyQueryObj(_item, this.searchKey, this.filterKeys)
				})
				return {
					...item,
					listData
				}
			})
		},
		currentTag () {
			return this.currentOptionList.find(item => {
				return item.id === this.activeTag
			})
		},
		firstTag () {
			const _value = this.value[0]
			if (_value) {
				for (let i = 0; i < this.optionlist.length; i++) {
					const option = this.optionlist[i].listData.find(item => item.id === _value)
					if (option) {
						return option
					}
				}
			}
			return null
		},
		firstTagLabel () {
			return this.firstTag ? this.firstTag[this.optionProp.name] : ''
		},
		tagCount () {
			return this.value.length - 1
		},
		tagMoreText () {
			if (this.value.length > 1) {
				const moreList = new Set(this.value.slice(1, this.tipsCount + 1))
				const tips = this.$fxUtils.arrDedup(this.optionlist.reduce((pre, cur) => {
					pre.push(...cur.listData)
					return pre
				}, []).filter(item => {
					return moreList.has(item.id)
				}).map(item => {
					return item[this.optionProp.name]
				})).join('，')
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
		popperClasses () {
			return `wind-select-tab-mulity__dropdown ${this.poperClass || ''}`
		},
		readonly () {
			return !this.popperVisible
		},
		emptyText () {
			return this.loading ? this.loadingText : this.noDataText
		}
	},
	watch: {
		popperVisible (val) {
			if (val) {
				if (this.scrollClose) {
					scrollHide.add(this)
				}
			} else {
				this.activeTag = ''
				this.$refs.popper.destroyPopper()
				this.searchKey = ''
				if (this.scrollClose) {
					scrollHide.remove(this)
				}
				this.$nextTick(() => {
					this.optionlist.forEach(item => {
						this.$refs[`dropdown-wrap-${item.id}`][0].resetScroll()
					})
				})
			}
			this.$emit('visible-change', val)
		},
		searchKey (val) {
			if (val) {
				this.searchDebounce(200, false).then(() => {
					if (this.currentTag.listData.length) {
						this.currentHoverItem = this.currentTag.listData[0]
					} else if (!this.currentTag.listData.length) {
						this.setTabActive()
					}
					this.$nextTick(() => {
						this.$refs.popper.updatePopper()
					})
				})
			}
		},
		activeTag (val) {
			this.$nextTick(() => {
				this.$refs[`dropdown-wrap-${val}`] && this.$refs[`dropdown-wrap-${val}`][0].recalculateScrollBar()
			})
		}
	},
	mounted () {
		this.bindEvents()
		this.setSelectDropWidth()
	},
	destroyed () {
		this.unbindEvents()
	},
	methods: {
		onPoperShow () {
			this.popperElm = this.$refs.popper.$refs.popper
			this.eventUtils.delegate({
				target: this.popperElm.querySelector('.el-tabs__nav-scroll'),
				child: 'el-tabs__item',
				event: 'mousedown',
				namespace: 'prevent',
				handler: prevent
			})
			this.searchKey = ''
			this.currentHoverItem = {}
			if (typeof this.fpSelectShow === 'function') {
				this.fpSelectShow().then(this.setHoverItemAndScroll)
			} else {
				this.setHoverItemAndScroll()
			}
		},
		setHoverItemAndScroll () {
			let index = 0
			const _value = this.value[0]
			if (_value) {
				const tab = this.currentOptionList.find((item, i) => {
					index = item.listData.findIndex(listItem => {
						return listItem.id === _value
					})
					if (~index) {
						this.currentHoverItem = item.listData[index]
					}
					return ~index
				}) || {}
				this.activeTag = tab.id || this.currentOptionList[0].id
			} else {
				this.activeTag = this.currentOptionList[0] && this.currentOptionList[0].id
			}
			if (typeof this.fpSelectShow === 'function') {
				this.$refs.popper.updatePopper()
			}
			this.$nextTick(() => {
				this.onSearchInputFocus()
				this.scrollToIndex(index)
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
				if (!item.id) { return resolve() }
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
			let _value = this.value
			if (_value.includes(item.id)) {
				_value = _value.filter(currentItem => {
					return currentItem !== item.id
				})
			} else {
				_value.push(item.id)
			}
			return _value
		},
		tabSwitch (type) {
			if (this.optionlist.length === 0) {
				return false
			}
			let index = this.optionlist.findIndex(item => {
				return item.id === this.activeTag
			})
			if (type === 'left') {
				if (index === 0) {
					index = this.optionlist.length - 1
				} else {
					index = index - 1
				}
			} else {
				if (index === this.optionlist.length - 1) {
					index = 0
				} else {
					index = index + 1
				}
			}
			this.activeTag = this.optionlist[index].id
		},
		setTabActive () {
			let currentHoverItem = null
			const activeTag = this.optionlist.find(tab => {
				const listData = tab.listData.filter(item => {
					return this.$fxUtils.fuzzyQueryObj(item, this.searchKey, this.filterKeys)
				})
				if (listData.length) {
					currentHoverItem = listData[0]
				}
				return !!listData.length
			})
			if (activeTag) {
				this.activeTag = activeTag.id
			}
			if (currentHoverItem) {
				this.currentHoverItem = currentHoverItem
			}
		},
		navigateOptions (type) {
			if (!this.currentTag || this.currentTag.listData.length === 0 || !this.popperVisible) {
				return false
			}
			let index = this.currentTag.listData.findIndex(item => {
				return item === this.currentHoverItem
			})
			if (~index) {
				if (type === 'next') {
					if (index === this.currentTag.listData.length - 1) {
						index = 0
					} else {
						index = index + 1
					}
				} else {
					if (index === 0) {
						index = this.currentTag.listData.length - 1
					} else {
						index = index - 1
					}
				}
				this.currentHoverItem = this.currentTag.listData[index]
			} else {
				this.currentHoverItem = this.currentTag.listData[0]
			}
			this.$nextTick(() => this.scrollToOption(this.currentHoverItem))
		},
		onSelectEnter (event) {
			if (!this.popperVisible || this.currentOptionList.length === 0) {
				return false
			}
			if (this.$fxUtils.isEnterCode(event.code)) {
				this.onSelectItemClick(this.currentHoverItem).then(() => {
					if (event.ctrlKey) {
						this.popperVisible = false
						this.$emit('on-select-enter', event, this.value)
					} else if (event.shiftKey) {
						this.$emit('on-select-enter', event, this.value)
					}
				})
			}
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
		focus () {
			this.$refs.selectSearchInput.focus()
			this.popperVisible = true
		},
		blur () {
			this.$refs.selectSearchInput.blur()
			this.popperVisible = false
		},
		onClearClick () {
			const value = []
			this.$emit('input', value)
			this.$emit('change', value)
		},
		handleClose () {
			this.popperVisible = false
		},
		setSelectDropWidth () {
			this.setPopperMinwidth()
			if (this.$refs.popper) {
				this.$refs.popper.$refs.popper.style.width = this.dropdownWidth
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
		},
		onScroll (e) {
			this.$emit('on-scroll', e)
		},
		bindEvents () {
			addResizeListener(this.$refs.selectSearchInput.$el, this.resizeListener)
		},
		unbindEvents () {
			if (this.$refs.selectSearchInput) {
				removeResizeListener(this.$refs.selectSearchInput.$el, this.resizeListener)
			}
		},
		scrollToOption (optionItem) {
			this.$refs[`dropdown-wrap-${this.activeTag}`][0].scrollToOption(optionItem)
		},
		scrollToIndex (scrollTop = 0) {
			return this.$refs[`dropdown-wrap-${this.activeTag}`] && this.$refs[`dropdown-wrap-${this.activeTag}`][0].scrollToIndex(scrollTop)
		},
		onSelectAll () {
			const currentTagIds = this.$refs[`dropdown-wrap-${this.activeTag}`][0].getCurrentOptionList()
				.filter(
					item => !item[this.optionProp.disabled || 'disabled']
				)
				.map(item => item.id)
			const value = this.value.concat(currentTagIds)
			this.$emit('input', this.$fxUtils.arrDedup(value))
			this.$emit('change', this.$fxUtils.arrDedup(value))
		},
		onUnselectAll () {
			const currentTagIds = this.$refs[`dropdown-wrap-${this.activeTag}`][0].getCurrentOptionList()
				.filter(
					item => !item[this.optionProp.disabled || 'disabled']
				)
				.map(item => item.id)
			const currentTagIdsMap = this.$fxUtils.compareArrayUtils(currentTagIds)
			const value = this.value.filter(item => {
				return !currentTagIdsMap.has(item)
			})
			this.$emit('input', value)
			this.$emit('change', value)
		},
		onTagRemoveClick () {
			const _value = this.value
			_value.splice(0, 1)
			this.$emit('input', _value)
			this.$emit('change', _value)
			this.onSearchInputFocus()
		},
		onTagClick () {
			this.onSearchInputFocus()
			this.popperVisible = true
		},
		onInputClick () {
			this.onSearchInputFocus()
		}
	}
}
</script>
<style lang="stylus" scoped>
.wind-select-tab-mulity {
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
	&__dropdown-empty {
		height: 34px;
		line-height: 34px;
		box-sizing: border-box;
		padding: 0 20px
		text-align: center;
		color: #999;
		font-size: 14px;
	}
}
</style>
<style lang="stylus">
.wind-select-tab-mulity__dropdown {
	&-wrap {
		height: 274px;
		position: relative
		overflow: auto
		overflow-anchor:none
	}
	.el-tabs__item {
		font-size:12px
	}
}
</style>
