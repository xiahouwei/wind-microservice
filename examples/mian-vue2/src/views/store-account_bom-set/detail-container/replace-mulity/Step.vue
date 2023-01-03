<template>
	<el-steps :active="step" class="container" :class="{'line' : step === 0}" process-status="finish" finish-status="success" align-center>
		<el-step title="设置替换配料明细" ></el-step>
		<el-step title="替换完成"></el-step>
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
	margin	0px 0 25px -50px
  width 100%
  >>>.el-step__title {
    font-size 14px
  }
  >>>.el-step__head.is-success {
    color #409EFF
    border-color #409EFF
    .el-step__line {
      background-color #409EFF
    }
  }
  >>>.el-step__title.is-success{
    color #333
  }
  >>>.is-finish {
    color #333
    font-weight 700
    .el-step__icon.is-text {
      color #fff
      background-color #409EFF
    }
  }
  >>>.el-step__main {
    position: absolute;
    top: -7px;
    left: 55%;
  }
  >>>.el-step__line {
    width 70%
    left 76%
    height 1px
    .el-step__line-inner {
      border-width 0 !important
    }
  }
}
.line{
  >>>.el-step__line {
    width 40%
    left 102%
    height 1px
    .el-step__line-inner {
      border-width 0 !important
    }
  }
}
</style>
