<template>
  <div class="card" :class='(childIndex<level1Length-1&&level>0)?"normalChild":"lastChild"'>
	<div class="firstChildHover" v-if='childIndex===0'></div>
	<div class='inner-card' :class="level===0?'item-content':'bom-content'">
		<div v-if="level===0" :class="level===0?'item-content':'bom-content'">
			<w-link icon="bom-add" class="bom-add-icon" v-fx-auth="computedAuth.addDetailsAuth" @click='onAdd'></w-link>
			<div class="name flex">
				<el-tooltip
					placement="top-start"
					class="subName"
					:content='cardData.item.name'
				>
					<span>
						{{cardData.item.name}}
					</span>
				</el-tooltip>
				<el-tooltip
					placement="top-start"
					class="subName right"
					v-if='cardData.childBomId'
					:content='cardData.childBomName'
					>
					<div class='flex'>
						<div class="subName right">【{{cardData.childBomName}}</div>
						】
					</div>
				</el-tooltip>
			</div>
			<div class="data-line">
				<span class="label">编号：</span>
				<span class="value">{{cardData.item.code}}</span>
			</div>
			<div class="doubleColumn">
				<div class="column1" v-if='this.type!=="split_bom"'>
					<span class="label">单位：</span>
					<span class="value">{{cardData.unit.name}}</span>
				</div>
				<div class="column2">
					<span class="label">规格：</span>
					<span class="value">{{cardData.item.spec}}</span>
				</div>
			</div>
		</div>
		<div v-else :class="level===0?'item-content':'bom-content'">
			<div class="name flex" v-if='level===1'>
				<el-tooltip
					placement="top-start"
					class="subName"
					:content='cardData.item.name'
				>
					<span>
						{{cardData.item.name}}
					</span>
				</el-tooltip>
				<el-tooltip
					placement="top-end"
					class="subName right"
					v-if='cardData.childBomId'
					:content='cardData.childBomName'
					>
					<div class='flex'>
						<div class="subName right">【{{cardData.childBomName}}</div>
						】
					</div>
				</el-tooltip>
			</div>
			<div class="name" v-else>{{cardData.item.name}}</div>
			<div class="data-line">
				<span class="label">编号：</span>
				<span class="value">{{cardData.item.code}}</span>
			</div>
			<div class="doubleColumn">
				<div class="column1" v-if='this.type!=="split_bom"'>
					<span class="label">单位：</span>
					<span class="value">{{cardData.unit.name}}</span>
				</div>
				<div class="column2">
					<span class="label">规格：</span>
					<span class="value">{{cardData.item.spec}}</span>
				</div>
			</div>
			<template v-if='cardData.bomType!==2'>
				<div class="data-line">
					<span class="label">净料用量：</span>
					<div class="mao-met" v-if='isEdit'>
						<w-input-number v-model="cardData.materialDosage" @change='materialDosageChange' :pointSize='sysPointSize'></w-input-number>
					</div>
					<span v-else>{{cardData.materialDosage | filterAutoZeroFill({ len: sysPointSize })}}</span>
				</div>
				<div class="data-line">
					<span class="label pure-ratio-label">净料率：</span>
					<div class="pure-ratio" v-if='isEdit'>
						<w-input-number v-model="materialRateZoom" :max='1000' @change='materialRateZoomChange'></w-input-number>
					</div>
					<span v-else>{{this.$fxUtils.toFixed(cardData.materialRate * 100, 4, false)}}</span>
					<span class="value">%</span>
				</div>
				<div class="data-line">
					<span class="label">毛料用量：</span>
					<div class="mao-met" v-if='isEdit'>
						<w-input-number v-model="cardData.rawMaterialDosage" @change='rawMaterialDosageChange' :pointSize='sysPointSize'></w-input-number>
					</div>
					<span v-else>{{cardData.rawMaterialDosage | filterAutoZeroFill({ len: sysPointSize })}}</span>
				</div>
			</template>
			<div class="data-line">
				<span class="label">生效日期：</span>
				<div class="date-picker" v-if='isEdit'>
					<el-date-picker
						v-model="cardData.beginDate"
						type="datetime"
						align="right"
						value-format="yyyy-MM-dd HH:mm:SS"
						format="yyyy-MM-dd HH:mm"
						placeholder="选择日期"
					></el-date-picker>
				</div>
				<span v-else>{{cardData.beginDate}}</span>
			</div>
			<div class="data-line">
				<span class="label">失效日期：</span>
				<div class="date-picker" v-if='isEdit'>
					<el-date-picker
						v-model="cardData.endDate"
						type="datetime"
						align="right"
						value-format="yyyy-MM-dd HH:mm:SS"
						format="yyyy-MM-dd HH:mm"
						placeholder="选择日期"
					></el-date-picker>
				</div>
				<span v-else>{{cardData.endDate}}</span>
			</div>
			<div class="data-line">
				<span class="label memo-label">备注：</span>
				<div class="memo" v-if="isEdit">
					<w-input
						v-model="cardData.memo"
						:maxlength="$fxCommon.getFxInputMaxLength('memo')"
						:regType="$fxCommon.getFxInputReg('memo')"
					></w-input>
				</div>
				<span v-else>{{cardData.memo}}</span>
			</div>
			<div class="data-line">
				<span class="label">最新修改日期：</span>
				<span class="value">{{cardData.modifyDate}}</span>
			</div>
			<div class="data-line">
				<span class="label">最新修改人：</span>
				<span class="value">{{cardData.modifyMan.name}}</span>
			</div>
			<div class="data-line" v-if='type==="food_bom"'>
				<span class="label">参与冲减：</span>
				<w-switch
					class="offset-switch"
					v-model="cardData.offsetFlag"
					active-text="是"
					inactive-text="否"
					:width="40"
					:disabled="!computedAuth.editDetailsAuth"
					@change="onOffsetSwitchChange"
				>
				</w-switch>
			</div>
		</div>
		<div class="arrow" v-if='level>0'>
			<div class="line"></div>
			<div class="to_right"></div>
		</div>
		<div class="afterLine" v-if='cardData.child && cardData.child.length>0'></div>
		<w-link
			icon="bom-edit"
			class="bom-edit-icon"
			v-if='level===1 && !isEdit'
			v-fx-auth="computedAuth.editDetailsAuth"
			@click="onEdit"
		></w-link>
		<w-link icon="bom-save" class="bom-edit-icon" v-if='level===1 && isEdit' @click="onSave" title='保存'></w-link>
		<w-link icon="bom-del" class="bom-del-icon" v-if='level===1' v-fx-auth="computedAuth.delDetailsAuth" @click='onDelete'></w-link>
		<el-tooltip effect="dark" content="更换下级BOM" placement="top">
			<w-link icon="bom-change" class="bom-change-icon" v-if='level===1' @click='onChange'></w-link>
		</el-tooltip>

	</div>
	<div class="lastChildHover" v-if='childIndex===(level1Length-1) && childIndex > 0'></div>
	<div class="child-card"  v-if='cardData.child && cardData.child.length'>
		<cardList
			ref='cardList'
			v-for='(item,index) in cardData.child'
			:key='index'
			:bomDetail='bomDetail'
			:type='type'
			:cardData='item'
			:level='level+1'
			:childIndex='index'
			:level1Length='cardData.child.length'
			@refresh='refresh'
			@resetCheckdata='resetCheckdata'
			@closeOffset='closeOffset'
		></cardList>
	</div>
	<changeBom :type='type' :bomDetail='bomDetail' :cardData='cardData' ref='changeBom' @refresh='refresh'></changeBom>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import changeBom from './ChangeBom.vue'
export default {
	name: 'cardList',
	components: {
		changeBom
	},
	props: {
		type: String,
		bomDetail: Object,
		cardData: {
			type: Object
		},
		level: Number,
		childIndex: Number,
		level1Length: Number
	},
	data () {
		return {
			isEdit: false,
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			materialRateZoom: 0,
			fxCalculation: this.$fxCalculation('bomSet')
		}
	},
	computed: {
		...mapState({
			sysPointSize: state => state.system.sysPointSize
		}),
		...mapGetters(['detailsAuthGetter', 'moduleAuthGetter']),
		computedAuth () {
			const authObj = {
				food_bom: {
					addDetailsAuth: this.detailsAuthGetter('basic-archives_bom-set_food-bom.add-food-bom-details'),
					editDetailsAuth: this.detailsAuthGetter('basic-archives_bom-set_food-bom.edit-food-bom-details'),
					delDetailsAuth: this.detailsAuthGetter('basic-archives_bom-set_food-bom.delete-food-bom-details')
				},
				compose_bom: {
					addDetailsAuth: this.detailsAuthGetter('basic-archives_bom-set_compose-bom.add-compose-bom-details'),
					editDetailsAuth: this.detailsAuthGetter('basic-archives_bom-set_compose-bom.edit-compose-bom-details'),
					delDetailsAuth: this.detailsAuthGetter('basic-archives_bom-set_compose-bom.delete-compose-bom-details')
				},
				split_bom: {
					addDetailsAuth: this.detailsAuthGetter('basic-archives_bom-set_split-bom.add-split-bom-details'),
					editDetailsAuth: this.detailsAuthGetter('basic-archives_bom-set_split-bom.edit-split-bom-details'),
					delDetailsAuth: this.detailsAuthGetter('basic-archives_bom-set_split-bom.delete-split-bom-details')
				}
			}
			return authObj[this.type] || {}
		}
	},
	methods: {
		onEdit () {
			this.isEdit = true
			this.materialRateZoom = this.$fxUtils.toFixed(this.cardData.materialRate * 100, 4, false)
			this.fxDataVerification.resetData(this.cardData)
		},
		onSave () {
			const foodOrCompose = this.type === 'food_bom' || this.type === 'compose_bom'
			if (foodOrCompose && this.cardData.materialDosage <= 0) {
				this.$fxMessage.error('净料用量必须大于0')
				return
			}
			if (foodOrCompose && (this.materialRateZoom <= 0 || this.materialRateZoom > 1000)) {
				this.$fxMessage.error('净料率必须大于0%小于等于1000%')
				return
			}
			if (foodOrCompose && this.cardData.rawMaterialDosage <= 0) {
				this.$fxMessage.error('毛料用量必须大于0')
				return
			}
			const logger = this.$fxLogger.createInfo('basic-archives.bom.updateDetails', this.createLoggerParams())
			return this.$fxApi('bom.editDetail', this.type, this.bomDetail.id, true)({ data: this.cardData, logger }).then(res => {
				this.$set(this.cardData, 'modifyDate', res.modifyDate)
				this.$set(this.cardData, 'modifyMan', res.modifyMan)
				this.isEdit = false
				this.$emit('resetCheckdata')
			})
		},
		resetCheckdata () {
			this.$emit('resetCheckdata')
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			const cardData = this.$fxUtils.deepClone(this.cardData)
			return {
				pre: originData,
				cur: cardData,
				code: this.bomDetail.code,
				name: this.bomDetail.name
			}
		},
		refresh () {
			this.$emit('refresh')
		},
		onDelete () {
			this.$fxConfirm('是否确认删除该一级配料').then(() => {
				this.$fxApi('bom.delDetail', this.type, this.bomDetail.id)({ data: [this.cardData.id] }).then(res => {
					this.$emit('refresh')
				})
			})
		},
		onAdd () {
			this.$emit('addInCard')
		},
		onChange () {
			this.$fxApi('bom.getChildBomList', this.type, this.bomDetail.id, this.cardData.item.id, this.cardData.childBom && this.cardData.childBom.id).then(res => {
				if (res.length) {
					this.$refs.changeBom.open(res, this.cardData.childBomId)
				} else {
					this.$fxMessage.warning('无可替换的下级BOM')
				}
			})
		},
		materialDosageChange () {
			this.fxCalculation.changeMaterialDosage(this.cardData)
			this.materialRateZoom = this.cardData.materialRateZoom
		},
		materialRateZoomChange (val) {
			this.fxCalculation.changeMaterialRate(val, this.cardData)
		},
		rawMaterialDosageChange () {
			this.fxCalculation.changeRawMaterialDosage(this.cardData)
			this.materialRateZoom = this.cardData.materialRateZoom
		},
		onOffsetSwitchChange (val) {
			if (val) {
				this.$emit('closeOffset')
				this.closeChildOffset(this.cardData)
			}
		},
		closeOffset () {
			this.cardData.offsetFlag = 0
			this.$emit('closeOffset')
		},
		closeChildOffset (data) {
			if (data.child) {
				for (const i of data.child) {
					i.offsetFlag = 0
					this.closeChildOffset(i)
				}
			} else {
				return false
			}
		}
	}
}
</script>
<style lang='stylus' scoped>
@import '~$assets/stylus/varsty.styl'
root-height=110px
.card {
	display flex
	position relative
	align-items: flex-start
}
.inner-card {
	position relative
	border 1px solid #3f96fb
	background-color #f4f9ff
	margin 10px 25px
	border-radius 6px
	box-sizing border-box
	padding 10px
}
.item-content {
	width 250px
	// height root-height
}
.bom-content {
	width 270px
	padding-bottom: 10px
}
.child-card {
	display flex
	flex-direction column
}
.arrow {
	position absolute
	top (root-height/2)
	left -26px
	width 20px
}
.line {
	width 14px
	border-top 1px solid #3f96fb
	float: left
    margin-top: 3.5px
}
.to_right {
	width: 0;
	height: 0;
	float right
	border-left: 6px solid #3f96fb;
	border-top: 4px solid transparent;
	border-bottom: 4px solid transparent;
}
.normalChild {
	border-left 1px solid #3f96fb
}
.firstChildHover {
	position absolute
	width 2px
	height (root-height/2+15px)
	background #fff
	left -2px
	top -0.5px
}
.lastChildHover {
	position absolute
	border-left 1px solid #3f96fb
	width 2px
	height (root-height/2+15px)
	left 0px
	top 0
}
.afterLine {
	position absolute
	width 20px
	height 2px
	border-top 1px solid #3f96fb
	top (root-height/2+3.5px)
	right -28px
}
.name {
	width 230px
	font-size 13px
	font-weight 800
	margin-bottom 8px
	.subName {
		flex 1
		overflow hidden
		text-overflow ellipsis
		white-space nowrap
	}
}
.doubleColumn {
	margin-bottom 10px
	width 220px
	.column1 {
		display inline-block
		width 115px
	}
	.column2 {
		display inline-block
	}
}
.label {
	display inline-block
	color #a1a2a4
}
>>>.wind-link{
	padding 0
}
.bom-add-icon {
	position absolute
	right -13px
	top -15px
	>>>.wind-link-icon{
		width 16px!important
	}
}
.bom-del-icon {
	position absolute
	left -8px
	top -16px
	>>>.wind-link-icon{
		width 16px!important
	}
}
.bom-edit-icon {
	position absolute
	right 5px
	bottom 5px
	>>>.wind-link-icon{
		width 14px!important
	}
}
.bom-change-icon {
	position absolute
	right 5px
	top 3px
	>>>.wind-link-icon{
		width 14px!important
	}
}
.data-line{
	margin-bottom 10px
	width 235px
}
.pure-met{
	display inline-block
	width 50px
}
.pure-ratio {
	display inline-block
	width 90px
}
.pure-ratio-label {
	margin-right 12px
}
.mao-met{
	display inline-block
	width 90px
}
.memo-label {
	margin-right 24px
}
.memo{
	display inline-block
	width 175px
}
.date-picker {
	display inline-block
	>>>.el-date-editor.el-input, .el-date-editor.el-input__inner{
		width 175px
	}
}
.flex {
	display flex
	.right {
		text-align right
	}
}
.offset-switch {
	display inline-block
}
</style>
