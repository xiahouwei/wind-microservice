<template>
	<div ref="select-tab" class="wind-select-tab" v-fxClickOutSide="onClickOutSideHander" @click.stop="toggleMenu">
		<el-popover
			ref="popper"
			v-model="popperVisible"
			placement="bottom-start"
			trigger="manual"
			:popper-class="popperClasses"
			:disabled="disabled"
			@show="onPoperShow"
		>
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
			<div v-show="currentOptionList.length===0||loading" class='wind-select-tab__dropdown-empty'>{{emptyText}}</div>
			<el-input
				ref="selectSearchInput"
				v-model="selectedLabel"
				v-fx-keyboard-enter="onSelectEnter"
				slot="reference"
				:placeholder="placeholderComputed"
				:disabled="disabled"
				:size="size"
				:readonly="readonly"
				class="select-input"
				@keyup.left.native.prevent="tabSwitch('left')"
				@keyup.right.native.prevent="tabSwitch('right')"
				@keydown.down.native.prevent="navigateOptions('next')"
				@keydown.up.native.prevent="navigateOptions('pre')"
				@focus="onInputFocus"
				@blur="onInputBlur"
			>
				<template slot="suffix">
					<i v-if="showClear" class="el-icon-circle-close select-input__clear-btn" @click.stop="onClearClick"></i>
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
 * select by shang 2020/11/5
 * @desc select-tab 分页选择框
 * @param {any}  value - 输入框值
 * @param {Boolean}  disabled - 是否禁用
 * @param {String}  placeholder - 默认提示
 * @param {Array}  filterKeys - 筛选keys
 * @param {Boolean}  clearable - 清除功能
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
 * @param {String}  activeTagKey - 默认选中的Tag页Id，不传默认为第一页
 * @param {String}  defaultText - 没有匹配选项时输入框显示的文本
 * @param {Function}  typeFilter - 点击左侧类别数据后，对于右侧数据筛选的回调函数 传参(selectedTypeData, item)
 * @param {Boolean}  showAllTypeOption - 左侧类别数据，是否显示 “全部” 选项
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
	name: 'w-select-tab',
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
		value: null,
		disabled: Boolean,
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
		activeTagKey: String,
		defaultText: null,
		typeFilter: Function,
		showAllTypeOption: {
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
			eventUtils: initEventUtils(),
			menuVisibleOnFocus: false
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
		showClear () {
			return this.clearable && !this.disabled && !!this.value
		},
		currentTag () {
			return this.currentOptionList.find(item => {
				return item.id === this.activeTag
			})
		},
		currentSelect () {
			let select = {}
			if (this.value) {
				for (let i = 0; i < this.optionlist.length; i++) {
					const index = this.optionlist[i].listData.findIndex(listItem => {
						return listItem.id === this.value
					})
					if (~index) {
						select = this.optionlist[i].listData[index]
						break
					}
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
		popperClasses () {
			return `wind-select-tab__dropdown ${this.poperClass || ''}`
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
		popperVisible (val) {
			if (val) {
				if (this.scrollClose) {
					scrollHide.add(this)
				}
			} else {
				this.activeTag = ''
				this.$refs.popper.destroyPopper()
				this.menuVisibleOnFocus = false
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
			if (this.value) {
				const tab = this.currentOptionList.find((item, i) => {
					index = item.listData.findIndex(listItem => {
						return listItem.id === this.value
					})
					if (~index) {
						this.currentHoverItem = item.listData[index]
					}
					return ~index
				}) || {}
				this.activeTag = tab.id || this.currentOptionList[0].id
			} else {
				this.activeTag = this.activeTagKey ? (this.currentOptionList.find(item => {
					return item.id === this.activeTagKey
				}) || this.currentOptionList[0]).id : (this.currentOptionList[0] && this.currentOptionList[0].id)
			}
			this.$nextTick(() => {
				this.scrollToIndex(index)
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
						if (item.id === this.value) {
							this.popperVisible = false
						} else {
							this.popperVisible = false
							this.$emit('input', item.id)
							this.$emit('change', item.id, item)
						}
						if (event.type === 'click') {
							this.$emit('on-select-click', item.id, item)
						}
						resolve()
					})
				}
			})
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
			if (this.loading) return false
			if (!this.popperVisible) {
				this.toggleMenu()
			} else if (this.currentTag.listData.length !== 0) {
				if (this.$fxUtils.isEnterCode(event.code)) {
					this.onSelectItemClick(this.currentHoverItem).then(() => {
						this.$refs.selectSearchInput.blur()
						this.$emit('on-select-enter', event, this.value, this.currentHoverItem)
					})
				}
			}
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
		focus () {
			this.$refs.selectSearchInput.focus()
		},
		blur () {
			this.$refs.selectSearchInput.blur()
			this.popperVisible = false
		},
		onClearClick () {
			this.$emit('input', '')
			this.$emit('change', '', {})
		},
		handleClose () {
			this.popperVisible = false
		},
		toggleMenu () {
			if (!this.disabled) {
				if (this.menuVisibleOnFocus) {
					this.menuVisibleOnFocus = false
				} else {
					this.popperVisible = !this.popperVisible
				}
				if (this.popperVisible) {
					this.$refs.selectSearchInput.focus()
				}
			}
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
		}
	}
}
</script>
<style lang="stylus" scoped>
.wind-select-tab {
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
.wind-select-tab__dropdown {
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
