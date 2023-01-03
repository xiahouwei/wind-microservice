<template>
	<w-collapse v-model="collapseVisible" title="其他信息">
		<div class="other-info">
			<div class="address-setting">
				<div class="other-info__module-title">收货地址管理：</div>
				<addressManageList v-model="contactList" :disabled="disabled"></addressManageList>
			</div>
			<div class="certificateList-setting">
				<div class="other-info__module-title">资质管理：</div>
				<certificateManageList ref="certificateManageList" v-model="resourceList" :disabled="disabled"></certificateManageList>
			</div>
		</div>
	</w-collapse>
</template>
<script>
import addressManageList from '@/components/address-manage/AddressManageList.vue'
import certificateManageList from '@/components/certificate-manage/CertificateManageList.vue'
export default {
	name: 'otherInfo',
	components: {
		addressManageList,
		certificateManageList
	},
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		disabled: Boolean
	},
	data () {
		return {
			collapseVisible: false
		}
	},
	computed: {
		contactList () {
			return this.organDetails.contactList || []
		},
		resourceList () {
			return this.organDetails.resourceList || []
		}
	},
	methods: {
		getResourceTypeList () {
			return this.$refs.certificateManageList.resourceTypeList
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.other-info__module-title {
	height: 32px
	line-height: 32px
}
</style>
