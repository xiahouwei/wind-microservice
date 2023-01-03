<template>
    <div>{{tagText}}{{item.fatherName}}.{{item.name}}></div>
</template>
<script>
export default {
	name: 'print-props-editer-group',
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
