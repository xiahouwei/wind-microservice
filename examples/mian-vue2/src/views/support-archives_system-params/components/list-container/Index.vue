<template>
	<div class="list-container">
		<div class="list-container__content">
			<div class="content">
				<div v-for="fatherItem in listData" :key="fatherItem.fatherTypeName">
					<div class="list-container__content-title">{{fatherItem.fatherTypeName}}</div>
					<w-collapse v-for="item in fatherItem.value" v-model="item.collapseVisible" :title="item.nickName" :key="item.id">
						<el-form  size="mini" inline>
							<paramCell v-for="listItem in item.mparamConfigs" :key="listItem.id" :paramItem="listItem" @on-mark-click="setMarkInfo"></paramCell>
						</el-form>
					</w-collapse>
				</div>
			</div>
			<div class="footer">
				<fx-button v-fx-auth:system-setting_system-params.edit-params type="save" @click="onSaveClick">保存</fx-button>
			</div>
		</div>
		<div class="list-container__memo">
			<div class="title">系统参数解释说明：</div>
			<br/>
			系统参数：【{{title}}】
			<br/>
			<br/>
			<p>{{content}}</p>
		</div>
	</div>
</template>
<script>
import { apiName } from '../../Index.vue'
import { mapActions } from 'vuex'
import paramCell from './ParamCell.vue'
export default {
	name: 'listContainer',
	components: {
		paramCell
	},
	props: {
		listData: {
			type: Array,
			default: () => {
				return []
			}
		},
		fxDataVerification: null,
		nodeName: String
	},
	data () {
		return {
			title: '',
			content: ''
		}
	},
	methods: {
		...mapActions([
			'systemGetParamsConfig'
		]),
		onSaveClick () {
			this.saveHandler()
		},
		saveHandler () {
			const params = this.$fxUtils.arrFlatten(this.listData, item => item.value).reduce((pre, cur) => {
				if (cur.mparamConfigs) {
					pre.push(...cur.mparamConfigs)
				}
				return pre
			}, [])
			const originalListData = this.$fxUtils.arrFlatten(this.fxDataVerification.getOriginData(), item => item.value).reduce((pre, cur) => {
				if (cur.mparamConfigs) {
					pre.push(...cur.mparamConfigs)
				}
				return pre
			}, [])
			const logger = this.$fxLogger.createInfo('system-setting.system-params.update', { pre: originalListData, cur: params, name: this.nodeName })
			return this.$fxApi(`${apiName}.saveParams`)({ data: params, logger }).then(res => {
				this.fxDataVerification.resetData(this.listData)
				return this.systemGetParamsConfig()
			})
		},
		setMarkInfo ({ nickName, contant }) {
			this.title = nickName
			this.content = contant
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.list-container {
	flex: 1;
	display:flex
	overflow: auto
	&__content {
		display:flex
		flex-direction: column
		width: 500px
		.content {
			flex: 1
			display:flex
			flex-direction: column
		}
		.footer {
			text-align :right
			height: 50px
			line-height: 50px
		}
		&-title {
			height: 40px
			line-height: 40px
			text-indent: 18px
			font-weight: 900
			font-size: 14px
		}
	}
	&__memo {
		flex: 1;
		max-width: 400px
		font-size: 12px
		margin-left 30px
		.title {
			font-size: 14px
			font-weight: 900
		}
		p {
			white-space pre-wrap
			line-height 25px
		}
	}
}
</style>
