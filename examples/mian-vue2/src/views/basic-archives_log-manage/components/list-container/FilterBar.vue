<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item prop="dateRang" label="操作日期">
				<w-date-picker
					v-model="dateRang"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					format="yyyy 年 MM 月 dd 日"
					value-format="yyyy-MM-dd HH:mm:ss"
					:default-time="['00:00:00', '23:59:59']"
					:picker-options="pickerOptions"
					class="form-date-input"
				></w-date-picker>
			</el-form-item>
			<el-form-item prop="logTime" label="操作时间">
				<el-time-picker
					is-range
					v-model="logTime"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					value-format="HH:mm:ss"
					class="form-time-input"
				></el-time-picker>
			</el-form-item>
			<el-form-item label="操作位置">
				<w-select
					v-model="mainMenu"
					:optionlist="mainMenuList"
					:optionProp="optionProp"
					clearable
					class="form-input-position"
					@change="onMainMenuChange"
				>
				</w-select>
				<w-select
					v-model="subMenu"
					:optionlist="subMenuList"
					:optionProp="optionProp"
					clearable
					class="form-input-position form-input-double"
					@change="onSubMenuChange"
				>
				</w-select>
				<w-select
					v-model="thirdMenu"
					:optionlist="thirdMenuList"
					:optionProp="optionProp"
					clearable
					class="form-input-position form-input-double"
					@change="onThirdMenuChange"
				>
				</w-select>
			</el-form-item>
			<el-form-item label="操作类型">
				<w-select
					v-model="actionType"
					:optionlist="actionTypeList"
					:optionProp="optionProp"
					class="form-input"
					clearable
				>
				</w-select>
			</el-form-item>
		</template>
		<template slot="row-2">
			<el-form-item label="操作员工">
				<w-input v-model="userEmployeeName" placeholder="请输入" class="form-input"/>
			</el-form-item>
			<el-form-item label="所属部门">
				<w-input v-model="userOrganName" placeholder="请输入" class="form-input"/>
			</el-form-item>
			<el-form-item label="操作结果">
				<w-select
					v-model="resulteType"
					:optionlist="resulteTypeSelectList"
					:optionProp="optionProp"
					class="form-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item label="操作耗时">
				<w-input-number ref="used" v-model="used" placeholder="请输入" class="form-input" @blur="onOperatingTimeBlur"/>
			</el-form-item>
			<el-form-item label="模糊搜索">
				<w-input v-model="message" placeholder="请输入操作详细关键字" class="form-input-fuzzy"/>
			</el-form-item>
			<el-form-item label="日志来源">
				<w-select
					v-model="isMobile"
					:optionlist="sourceSelectList"
					class="form-input"
				>
				</w-select>
			</el-form-item>
		</template>
		<template slot="tools">
			<el-button class="order-btn" type="primary" @click="onSearchClick">查询</el-button>
			<el-button class="order-btn" plain @click="onResetClick">重置</el-button>
		</template>
	</fx-list-filter>
</template>
<script>
import loggerConfig from '@/config/logger_config/index.js'
export default {
	name: 'filterBar',
	props: {
		loggerConfigMap: {
			type: Object,
			default () {
				return {}
			}
		},
		loggerConfig: {
			type: Array,
			default () {
				return []
			}
		}
	},
	data () {
		return {
			dateRang: [],
			logTime: ['00:00:00', '23:59:59'],
			mainMenu: '',
			subMenu: '',
			thirdMenu: '',
			actionType: '',
			userEmployeeName: '',
			userOrganName: '',
			resulteType: '',
			used: '',
			message: '',
			isMobile: 0,
			mainMenuList: loggerConfig,
			subMenuList: [],
			thirdMenuList: [],
			actionTypeList: [],
			resulteTypeList: this.$fxStateMiddleware.getStateConfig('logState'),
			optionProp: {
				key: 'id',
				name: 'label',
				value: 'id'
			},
			sourceSelectList: [{
				id: 0,
				name: '全部'
			}, {
				id: 1,
				name: '移动端'
			}],
			pickerOptions: this.$fxGetDatePickerOptionsShortcuts('all')
		}
	},
	computed: {
		resulteTypeSelectList () {
			return [{
				id: '',
				label: '全部'
			}, ...this.resulteTypeList]
		}
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search', this.getFilterParams())
		},
		getAccountingPeriod () {
			return this.$fxApi('inStoreAssign.getAccountingPeriod').then(res => {
				this.dateRang = [res.begin, res.end]
			})
		},
		onResetClick () {
			this.getAccountingPeriod()
			this.logTime = ['00:00:00', '23:59:59']
			this.mainMenu = ''
			this.subMenu = ''
			this.thirdMenu = ''
			this.actionType = ''
			this.subMenuList = []
			this.thirdMenuList = []
			this.actionTypeList = []
			this.userEmployeeName = ''
			this.userOrganName = ''
			this.resulteType = ''
			this.used = ''
			this.message = ''
			this.isMobile = 0
		},
		getFilterParams () {
			const timestamp = this.dateRang && this.dateRang.map(item => {
				return this.$fxUtils.newDate(item).getTime()
			})
			const userLogTime = this.logTime && this.logTime.map(item => {
				return parseInt(item.replace(':', '').replace(':', ''))
			})
			return {
				'@timestamp': timestamp,
				userLogTime,
				mainMenu: this.mainMenu,
				subMenu: this.subMenu,
				thirdMenu: this.thirdMenu,
				actionType: this.actionType,
				userEmployeeName: this.userEmployeeName,
				userOrganName: this.userOrganName,
				resulteType: this.resulteType,
				used: this.used ? this.used * 1000 : '',
				message: this.message,
				isMobile: this.isMobile
			}
		},
		onMainMenuChange (val) {
			if (val) {
				this.subMenuList = this.loggerConfigMap[val].child
			} else {
				this.subMenuList = []
			}
			this.thirdMenuList = []
			this.actionTypeList = []
			this.subMenu = ''
			this.thirdMenu = ''
			this.actionType = ''
		},
		onSubMenuChange (val) {
			this.thirdMenu = ''
			this.actionType = ''
			if (val) {
				this.thirdMenuList = this.loggerConfigMap[this.mainMenu][val].child || []
				this.actionTypeList = this.loggerConfigMap[this.mainMenu][val].actions || []
			} else {
				this.thirdMenuList = []
				this.actionTypeList = []
			}
		},
		onThirdMenuChange (val) {
			this.actionType = ''
			if (val) {
				this.actionTypeList = this.loggerConfigMap[this.mainMenu][this.subMenu][val].actions || []
			} else {
				this.actionTypeList = []
			}
		},
		onOperatingTimeBlur (e) {
			if (!e.target.value || e.target.value === '0') {
				this.used = ''
				this.$refs.used.currentValue = ''
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-date-input {
	width: 360px
}
.form-time-input {
	width: 360px
}
.form-input {
	width: 140px
}
.form-input-position {
	width: 113.3px
}
.form-input-fuzzy {
	width: 360px
}
.form-input-double {
	margin-left 10px
}
</style>
