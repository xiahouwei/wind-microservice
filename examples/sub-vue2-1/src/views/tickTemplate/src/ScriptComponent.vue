<template>
    <div>{{tagText}}{{item.fatherName}}.{{item.name}}></div>
</template>
<script>
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
	data () {
		return {
			tagText: '<'
		}
	}
}
</script>
