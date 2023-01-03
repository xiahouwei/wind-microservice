<template>
	<el-steps :active="step" class="container" finish-status="success">
		<el-step title="步骤一" description="选择分派的采购计划单"></el-step>
		<el-step title="步骤二" description="选择要订货的品项明细"></el-step>
		<el-step title="步骤三" description="生成下级单据"></el-step>
	</el-steps>
</template>
<script>
export default ({
	name: 'step',
	props: {
		step: {
			type: Number,
			default: 0
		}
	}
})
</script>

<style lang="stylus" scoped>
.container {
	padding	0 90px 10px 60px
}
>>>.el-step__head.is-success,>>>.el-step__title.is-success,>>>.el-step__description.is-success {
	color: black
	border-color: black
	.el-step__line {
    background-color #409EFF
  }
	.el-step__icon.is-text {
		color #409EFF
    border-color #409EFF
  }
}
>>>.el-step__head.is-process,>>>.el-step__title.is-process,>>>.el-step__description.is-process {
	color: #409EFF
	border-color: #409EFF
}
>>>.el-step__line {
  height 1px
  .el-step__line-inner {
    border-width 0 !important
  }
}
</style>
