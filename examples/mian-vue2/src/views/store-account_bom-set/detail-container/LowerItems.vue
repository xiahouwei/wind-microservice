<template>
	<w-dialog
		v-model='dialogVisible'
		width='1000px'
		title='配料表'
		fullscreen
		:beforeClose="onBeforeClose"
	>
		<cardList
			ref='cardList'
			:bomDetail='bomDetail'
			:type='type'
			:cardData='cardData'
			:level='0'
			:childIndex='0'
			:level1Length='cardData.child.length'
			@refresh='refreshBom'
			@addInCard='addInCard'
			@resetCheckdata='resetCheckdata'
		></cardList>
		<el-button type="primary" @click="onSaveOffset" class="offset-save-btn" v-if="type==='food_bom'">保存品项的冲减设置</el-button>
	</w-dialog>
</template>

<script>
import cardList from './CardList.vue'
export default {
	name: 'createStock',
	components: {
		cardList
	},
	props: {
		type: String,
		bomDetail: Object,
		tableQueueUtils: null
	},
	data () {
		return {
			id: '',
			dialogVisible: false,
			cardData: {
				child: [],
				modifyDate: {},
				item: {},
				unit: {}
			},
			fxDataVerification: this.$fxUtils.fxDataVerification()
		}
	},
	computed: {
	},
	mounted () {
	},
	methods: {
		open (type, id) {
			this.id = id
			this.getBomCard(type, id)
			this.dialogVisible = true
			this.fxDataVerification.resetData(this.cardData)
		},
		getBomCard (type, id) {
			this.cardData = {
				child: [],
				modifyDate: {},
				item: {},
				unit: {}
			}
			this.$fxApi('bom.getBomCard', type, id).then(res => {
				this.cardData = this.setOffsetFlag(res)
				this.fxDataVerification.resetData(this.cardData)
			})
		},
		setOffsetFlag (data) {
			if (!data.offsetFlag) {
				data.offsetFlag = 0
			}
			if (data.child && data.child.length) {
				data.child.forEach(item => {
					this.setOffsetFlag(item)
				})
			}
			return data
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		refreshBom () {
			this.getBomCard(this.type, this.id)
		},
		addInCard () {
			this.$emit('addInCard', this.cardData)
		},
		onBeforeClose (close) {
			this.verificationDetails().then(() => {
				this.$emit('refresh', this.bomDetail)
				close()
			})
		},
		resetCheckdata () {
			this.fxDataVerification.resetData(this.cardData)
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.cardData)
		},
		onSaveOffset () {
			const data = this.$fxUtils.arrFlatten(this.cardData.child, item => {
				return item.child
			}).filter(item => {
				return item.offsetFlag === 1
			}).map(item => {
				return {
					offsetItemId: item.item.id,
					detailPath: item.detailPath,
					bomId: this.cardData.id
				}
			})
			const loggerInfo = this.createOffsetLogger()
			if (loggerInfo.cardStr === loggerInfo.orignStr) {
				this.$fxMessage.warning('数据未发生改变')
			} else {
				const logger = this.$fxLogger.createInfo('basic-archives.bom.saveOffset', { name: this.cardData.bomName, loggerInfo })
				this.$fxApi('bom.saveOffset', this.cardData.id)({ data, logger }).then(res => {
					this.resetCheckdata()
				})
			}
		},
		createOffsetLogger () {
			const originData = this.fxDataVerification.getOriginData()
			const cardData = this.$fxUtils.deepClone(this.cardData)
			const orignStr = this.createOffsetDescription(originData.child)
			const cardStr = this.createOffsetDescription(cardData.child)
			return {
				orignStr,
				cardStr
			}
		},
		createOffsetDescription (data) {
			const all = this.$fxUtils.arrFlatten(this.cardData.child, item => {
				return item.child
			})
			const offsetList = []
			const offsetChild = this.$fxUtils.arrFlatten(data, item => {
				return item.child
			}).filter(item => {
				return item.offsetFlag === 1
			})
			for (const i of offsetChild) {
				const str = `（${this.cardData.item.name}）${this.getPath(all, i, '')}`
				offsetList.push(str)
			}
			return offsetList.join(',')
		},
		getPath (all, data, str) {
			if (data && data.fatherBomId) {
				const father = all.find(item => {
					return item.childBomId === data.fatherBomId
				})
				str = this.getPath(all, father, str) + `【${data.bomName}】-（${data.item.name}）`
			} else {
				str = `【${data.bomName}】-（${data.item.name}）`
			}
			return str
		}
	}
}
</script>
.<style lang='stylus' scoped>
@import '~$assets/stylus/varsty.styl'
.create-stock {
	flex: 1
	display: flex;
	flex-direction: column;
	overflow: auto;
}
.offset-save-btn {
	position absolute
	left 20px
	bottom 20px
}
</style>
