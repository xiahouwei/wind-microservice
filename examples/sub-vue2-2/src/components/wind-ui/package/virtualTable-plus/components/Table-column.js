/**
 * VirtualTableColumn by shang 2019/10/25
 * @desc 虚拟渲染表格列
 * @param {prop}  [String] - 列key
 * @param {label}  [String] - 列名
 * @param {align}  [String] - 对齐方式
 * @param {decimal}  [Number] - 保留小数
 * @param {formatter}  [Function] - 列value自定义
 * @param {visiable}  [Boolean] - 列是否显示
 */
import { cellConfig, cellRender } from '../js/config.js'
let columnIdSeed = 1
export default {
	name: 'windTableColumnPlus',
	props: {
		type: {
			type: String,
			default: 'default'
		},
		index: [Number, Function],
		columnKey: String,
		label: [String, Object],
		prop: String,
		width: {
			type: [Number, String],
			default: 150
		},
		minWidth: {},
		fixed: [Boolean, String],
		renderHeader: Function,
		sortable: {
			type: [Boolean, String],
			default: false
		},
		sortMethod: Function,
		sortBy: [String, Function, Array],
		sortOrders: {
			type: Array,
			default () {
				return ['ascending', 'descending', null]
			},
			validator (val) {
				return val.every(order => ['ascending', 'descending', null].indexOf(order) > -1)
			}
		},
		resizable: {
			type: Boolean,
			default: true
		},
		formatter: Function,
		align: {
			type: String,
			default: 'left'
		},
		headerAlign: {
			type: String,
			default: 'left'
		},
		className: String,
		labelClassName: String,
		selectable: {
			type: Function,
			default: () => {
				return true
			}
		},
		// @TODO
		reserveSelection: Boolean,
		decimal: Number,
		visiable: {
			type: Boolean,
			default: true
		},
		headerClick: Function,
		diagonal: Boolean,
		radio: Boolean
	},
	data () {
		return {
			currentSort: '',
			columnConfig: {},
			isSubColumn: false,
			childColumn: []
		}
	},
	computed: {
		owner () {
			let parent = this.$parent
			while (parent && !parent.tableId) {
				parent = parent.$parent
			}
			return parent
		},
		columnOrTableParent () {
			let parent = this.$parent
			while (parent && !parent.tableId && !parent.columnId) {
				parent = parent.$parent
			}
			return parent
		}
	},
	created () {
		const parent = this.columnOrTableParent
		this.isSubColumn = this.owner !== parent
		this.columnId = (parent.tableId || parent.columnId) + '_column_' + columnIdSeed++
		this.currentSort = ''
		this.property = this.prop
		const defaults = {
			owner: this.owner,
			id: this.columnId,
			type: this.type,
			property: this.prop || this.property,
			align: this.align,
			headerAlign: this.headerAlign,
			sortable: this.sortable,
			resizable: this.resizable,
			isColumnGroup: false,
			index: this.index,
			width: parseInt(this.width),
			realWidth: parseInt(this.width),
			className: this.className,
			labelClassName: this.labelClassName,
			...cellConfig[this.type],
			...cellRender[this.type]
		}
		if (typeof this.renderHeader === 'function') {
			defaults.renderHeader = this.renderHeader
		}
		this.columnConfig = defaults
		this.registerNormalWatchers()
	},
	mounted () {
		const parent = this.columnOrTableParent
		const children = this.isSubColumn ? parent.$el.children : parent.$refs.hiddenColumns.children
		const index = this.getColumnElIndex(children, this.$el)
		this.owner.store.commit('insertColumn', this, index, this.isSubColumn ? parent : null)
	},
	destroyed () {
		if (!this.$parent) return
		const parent = this.$parent
		this.owner.store.commit('removeColumn', this, this.isSubColumn ? parent : null)
	},
	methods: {
		getColumnElIndex (children, child) {
			return [].indexOf.call(children, child)
		},
		setSort (val) {
			this.currentSort = val
		},
		getSort () {
			return this.currentSort
		},
		registerNormalWatchers () {
			const props = ['label', 'width']
			props.forEach(key => {
				this.$watch(key, (newVal) => {
					if (key === 'width') {
						this.columnConfig.realWidth = newVal
					} else {
						this.columnConfig[key] = newVal
					}
				})
			})
		}
	},
	render (h) {
		return h('div', this.$slots.default)
	}
}
