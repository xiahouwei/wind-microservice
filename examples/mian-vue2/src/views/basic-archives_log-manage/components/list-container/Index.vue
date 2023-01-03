<template>
	<div class="log-manage-container">
		<filterBar
			ref="filterBar"
			:loggerConfigMap="loggerConfigMap"
			:loggerConfig="loggerConfig"
			@on-search="refresh"
		></filterBar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="tableColumn"
			:listData="tableData"
			:selectable="false"
			:selectAndIndexFixed="false"
			:expandRows="expandRows"
			showIndex
			indexContinuous
			@on-page-change="onPageChange"
			@on-sort-change="onSortChange"
		>
		</fx-list-virtual-table>
	</div>
</template>
<script>
import filterBar from './FilterBar.vue'
import loggerConfig from '@/config/logger_config/index.js'
const DEFAULT_DOMAIN = ['192.168.13.206:99', '221.239.30.130:1311']
const TEST_DOMAIN = ['order.fxscm.net']
const RELEASE_DOMAIN = ['mobile.engine.fxscm.net', '101.200.149.61']
const DEV_SEARCH_INDEX = 'scm8-dev-frontend-*'
const RELEASE_SEARCH_INDEX = 'scm8-production-frontend-*'
const getMoblieDomain = function (name) {
	return `${name}:8859`
}
export default {
	name: 'listContainer',
	components: {
		filterBar
	},
	data () {
		return {
			tableColumn: [
				{
					prop: 'timestamp',
					label: '操作日期',
					width: '100px',
					required: true,
					sortable: true,
					formatter: (row) => {
						return this.$fxUtils.setDate(new Date(row['@timestamp']))
					}
				},
				{ prop: 'logTime', label: '操作时间', width: '100px', required: true },
				{ prop: 'userEmployeeName', label: '操作员工', width: '100px' },
				{ prop: 'uid', label: '操作账号', width: '100px' },
				{
					prop: 'message',
					label: '操作详细',
					width: '840px',
					required: true,
					fxRender: this.messageRender
				},
				{
					prop: 'resulteType',
					label: '操作结果',
					width: '100px',
					fxRender: this.resulteTypeRender
				},
				{
					prop: 'used',
					label: '操作耗时（秒）',
					width: '120px',
					formatter: (row) => {
						return row.used / 1000
					}
				}
			],
			tableData: [],
			loggerConfigMap: {},
			loggerConfig,
			total: 0,
			domain: window.location.host,
			domainName: window.location.hostname,
			expandRows: [
				{ prop: 'expandRow', label: '详情', render: this.renderExpand, visible: true }
			],
			billType: {
				CheckBill: 'takeStockOrder.get',
				InStore: 'inStore.getBill',
				OutStore: 'outStore.getBill',
				MoveApply: 'moveOrder.get',
				StockPlan: 'stockPlanOrder.get',
				StockOffer: 'stockOfferOrder.get',
				StockOrder: 'stockOrder.get',
				SalesOrder: 'saleOrder.get',
				Inquiry: 'stockInquiryOrder.get',
				TheoryExpend: 'theoryCostOrder.getBill',
				ProductionPlan: 'productionPlan.getDetails',
				Pick: 'pickingList.getDetails',
				MachineCompose: 'machiningOrder.getDetails',
				PayableBill: 'payableOrder.getBill',
				CWInStoreBill: 'financialInStore.getBill',
				CWOutStoreBill: 'financialOutStore.getBill',
				CWPaymentBill: 'paymentOrder.getBill',
				AdvanceBill: 'advancedOrder.getBill',
				PayWriteOff: 'verificationOrder.getBill',
				ReceivableBill: 'receivableOrder.getBill'
			}
		}
	},
	computed: {
		resulteType () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('logState')(val)[key]
			}
		},
		mainMenutext () {
			return (row) => {
				return this.loggerConfigMap[row.mainMenu].label
			}
		},
		subMenutext () {
			return (row) => {
				const subMenuText = this.loggerConfigMap[row.mainMenu][row.subMenu].label
				const thirdMenuText = row.thirdMenu ? ' - ' + this.loggerConfigMap[row.mainMenu][row.subMenu][row.thirdMenu].label : ''
				return subMenuText + thirdMenuText
			}
		},
		actionTypetext () {
			return (row) => {
				const actionTypetext = row.thirdMenu ? this.loggerConfigMap[row.mainMenu][row.subMenu][row.thirdMenu][row.actionType].label : this.loggerConfigMap[row.mainMenu][row.subMenu][row.actionType].label
				return actionTypetext
			}
		}
	},
	mounted () {
		this.bindCodeSpanEvent()
	},
	beforeDestroy () {
		this.unbindCodeSpanEvent()
	},
	methods: {
		refresh () {
			this.$refs.listTable.setPaginationCurrent(1)
			this.$refs.listTable.clearSelected()
			return this.getListData()
		},
		onPageChange () {
			return this.getListData()
		},
		onSortChange () {
			return this.getListData()
		},
		getSearchParams () {
			const sortParams = this.$refs.listTable.getSortKey()
			const pageParams = this.$refs.listTable.getPaginationParams()
			const filterParams = this.$refs.filterBar.getFilterParams()
			let orderBy = [{
				column_name: '@timestamp',
				asc: false
			}]
			const condition = [{
				column_name: 'category',
				value: 'action',
				eq: true
			}, {
				column_name: 'resulteType',
				value: '0,1,2',
				in: true
			}]
			this.setConditionSearchKey(condition)
			if (this.$fxUtils.isDef(sortParams)) {
				orderBy = Object.keys(sortParams).map(key => {
					return {
						column_name: key === 'timestamp' ? '@' + key : key,
						asc: sortParams[key] === 'asc'
					}
				})
			}
			Object.keys(filterParams).forEach(key => {
				if (this.$fxUtils.toRawType(filterParams[key]) === 'Array') {
					condition.push({
						column_name: key,
						value: filterParams[key][0],
						ge: true
					})
					condition.push({
						column_name: key,
						value: filterParams[key][1],
						le: true
					})
				} else if (filterParams[key] || filterParams[key] === 0) {
					if (key === 'used') {
						condition.push({
							column_name: key,
							value: filterParams[key],
							le: true
						})
					} else if (key === 'isMobile') {
						filterParams[key] && condition.push({
							column_name: key,
							value: !!filterParams[key],
							eq: true
						})
					} else if (key === 'message') {
						condition.push({
							column_name: key,
							value: filterParams[key],
							eq: true,
							like: true
						})
					} else {
						condition.push({
							column_name: key,
							value: filterParams[key],
							eq: true
						})
					}
				}
			})
			return {
				index: this.getSearchIndex(),
				page: pageParams.page + 1,
				pageSize: pageParams.rows,
				column: ['@timestamp', 'logTime', 'uid', 'message', 'resulteType', 'used', 'mainMenu', 'subMenu', 'thirdMenu', 'actionType', 'userEmployeeName', 'userOrganName', 'ip', 'tenantId', 'userLogTime', 'isMobile', 'domain'],
				order_by: orderBy,
				condition
			}
		},
		setConditionSearchKey (condition) {
			if (DEFAULT_DOMAIN.includes(this.domain)) {
				condition.push({
					column_name: 'domain',
					value: `${DEFAULT_DOMAIN.join(',')}`,
					in: true
				})
			} else if (this.$fxEnv.isProducton()) {
				condition.push({
					column_name: 'domain',
					value: `${this.domain},${TEST_DOMAIN.join(',')}`,
					in: true
				})
			} else if (this.$fxEnv.isRelease()) {
				condition.push({
					column_name: 'domain',
					value: `${this.domain},${RELEASE_DOMAIN.join(',')}`,
					in: true
				})
			} else if (this.$fxEnv.isDevelopment()) {
				condition.push({
					column_name: 'domain',
					value: `${this.domain},${getMoblieDomain(this.domainName)}`,
					in: true
				})
			}
		},
		getSearchIndex () {
			return this.$fxEnv.isRelease() ? RELEASE_SEARCH_INDEX : DEV_SEARCH_INDEX
		},
		getListData () {
			this.loggerConfigMap = this.getLoggerConfigMap(loggerConfig)
			this.getListDataHandler().then(res => {
				this.$refs.listTable.setPaginationTotal(res.total)
				this.total = res.total
				this.tableData = res.data
			})
		},
		getListDataHandler () {
			const params = this.getSearchParams()
			return this.$fxApi('log.getPage')({ data: params })
		},
		getLoggerConfigMap (config) {
			const configMap = {}
			config.forEach(mainMenu => {
				if (Array.isArray(mainMenu.child)) {
					mainMenu.child.forEach(subMenu => {
						if (Array.isArray(subMenu.actions)) {
							subMenu.actions.forEach(action => {
								subMenu[action.id] = action
							})
						}
						if (Array.isArray(subMenu.child)) {
							subMenu.child.forEach(thirdMenu => {
								if (Array.isArray(thirdMenu.actions)) {
									thirdMenu.actions.forEach(action => {
										thirdMenu[action.id] = action
									})
								}
								subMenu[thirdMenu.id] = thirdMenu
							})
						}
						mainMenu[subMenu.id] = subMenu
					})
				}
				configMap[mainMenu.id] = mainMenu
			})
			return configMap
		},
		resulteTypeRender (h, { row }) {
			return <fx-list-state-tag
				icon={this.resulteType(row.resulteType, 'icon')}
				label={this.resulteType(row.resulteType, 'label')}
			></fx-list-state-tag>
		},
		messageRender (h, { row }) {
			const mobileTitle = row.isMobile ? '【移动端】' : ''
			this.showExpandArrow(row)
			return <div class={['message-content', `${'message-content_' + row.id}`, `${row.expanded ? 'message-content-expanded' : ''}`, `${row.showExpandArrow ? 'message-content-hasarrow' : ''}`]}>
				<div domPropsInnerHTML={`${mobileTitle}【${this.subMenutext(row)}】【${this.actionTypetext(row)}】【${row.message}】`}></div>
				{
					row.showExpandArrow ? <w-icon
						type="arrow-down"
						class={['arrow-icon', `${row.expanded ? 'icon-expanded' : ''}`]}
						pointer
						on-click={this.onExpandArrowClick(row)}
					></w-icon> : ''
				}
			</div>
		},
		onExpandArrowClick (row) {
			return () => {
				row.expanded = !row.expanded
			}
		},
		showExpandArrow (row) {
			this.$nextTick(() => {
				if (row.expanded) return
				const content = this.$el.querySelector(`${'.message-content_' + row.id}`)
				row.showExpandArrow = content.clientHeight < content.scrollHeight
			})
		},
		renderExpand (h, { row, $index }) {
			h = this.$createElement
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="操作位置：" labelWidth='72px' width = { 120 }>{this.mainMenutext(row)}</fx-list-extend-cell>
					<fx-list-extend-cell title="操作功能：" labelWidth='72px' width = { 160 }>{this.subMenutext(row)}</fx-list-extend-cell>
					<fx-list-extend-cell title="操作类型：" labelWidth='72px' width = { 120 }>{this.actionTypetext(row)}</fx-list-extend-cell>
					<fx-list-extend-cell title="所属部门：" labelWidth='72px' width = { 120 }>{row.userOrganName}</fx-list-extend-cell>
					<fx-list-extend-cell title="IP：" labelWidth='32px' width = { 120 }>{row.ip}</fx-list-extend-cell>
					<fx-list-extend-cell title="日志来源：" labelWidth='72px' width = { 60 }>系统日志</fx-list-extend-cell>
				</fx-list-extend-row>
			)
		},
		delegateGoHandler (e) {
			if (e.target.classList.contains('fx-delegate-go')) {
				const { billid, type } = e.target.dataset
				if (this.billType[type]) {
					this.$fxApi(this.billType[type], billid).then(() => {
						this.$fxGoToBillBlank(type, { id: billid }, 'detail')
					})
				} else {
					this.$fxGoToBillBlank(type, { id: billid }, 'detail')
				}
			}
		},
		bindCodeSpanEvent () {
			this.$refs.listTable.$el.addEventListener('click', this.delegateGoHandler)
		},
		unbindCodeSpanEvent () {
			this.$refs.listTable.$el.removeEventListener('click', this.delegateGoHandler)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.log-manage-container {
	flex: 1;
	display:flex
	flex-direction: column
	overflow: 72px
	>>>.count-selected {
		display none
	}
	.row-expand-text {
		width 120px
		font-size 12px
	}
	.demo-table-expand {
		.el-form-item {
			margin-bottom 10px
			margin-top 10px
		}
	}
}
>>>.fx-delegate-go {
	color: $fxDefaultColor
	cursor: pointer
}
>>>.fx-log-code__disable {
	color: $fxRed
	cursor: not-allowed
}
>>>.message-content {
	position relative
	margin 6px 0
	line-height 23px
	white-space normal
  overflow hidden
  display -webkit-box
  -webkit-box-orient vertical
  -webkit-line-clamp: 2
	&-expanded {
		-webkit-line-clamp unset
	}
	&-hasarrow {
		padding-right 25px
	}
}
>>>.arrow-icon {
	position absolute
	right 5px
	top 2px
	width 10px
	transition transform 0.3s
	&.icon-expanded {
		transform rotate(180deg)
	}
}
</style>
