<template>
    <TextComponent :item="item">{{tagText}}{{item.fatherName}}.{{item.name}}></TextComponent>
</template>
<script>
import TextComponent from './TextComponent.vue'
export default {
	name: 'print-props-editer-data',
	props: {
		item: {
			type: Object,
			default () {
				return {}
			}
		}
	},
	components: {
		TextComponent
	},
	data () {
		return {
			tagText: '<'
		}
	}
}
</script>
