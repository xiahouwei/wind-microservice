<template>
	<el-carousel height="165px" class="el-carousel-container">
    <el-carousel-item class="banner-container">
			<div class="img-container">
				<img class="img-1" src="~images/img/home/banner-1/banner-1.png">
				<img class="img-2" src="~images/img/home/banner-1/banner-2.png">
				<img class="img-3" src="~images/img/home/banner-1/banner-3.png">
				<img class="img-4" src="~images/img/home/banner-1/banner-4.png">
			</div>
    </el-carousel-item>
		<el-carousel-item class="banner-container">
			<div class="img-container">
				<img class="img-1" src="~images/img/home/banner-1/banner-1.png">
				<img class="img-2" src="~images/img/home/banner-1/banner-2.png">
				<img class="img-3" src="~images/img/home/banner-1/banner-3.png">
				<img class="img-4" src="~images/img/home/banner-1/banner-4.png">
			</div>
    </el-carousel-item>
		<el-carousel-item class="banner-container">
			<div class="img-container">
				<img class="img-1" src="~images/img/home/banner-1/banner-1.png">
				<img class="img-2" src="~images/img/home/banner-1/banner-2.png">
				<img class="img-3" src="~images/img/home/banner-1/banner-3.png">
				<img class="img-4" src="~images/img/home/banner-1/banner-4.png">
			</div>
    </el-carousel-item>
  </el-carousel>
</template>
<script>
export default {
	name: 'banner',
	data () {
		return {
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.el-carousel-container {
	flex none
	border-radius 10px
	box-shadow 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
	.banner-container{
		height 100%
		border-radius 10px
		background-image linear-gradient(to right, #3ce8e8,  #65affc, #7d5bf8)
		.img-container {
			position relative
			min-width 1200px
			height 100%
			margin 0 auto
			.img-1 {
				position absolute
				top 2px
				right 105px
				width 192px
				height 163px
			}
			.img-2 {
				position absolute
				top 43px
				left 104px
				width 441px
				height 39px
			}
			.img-3 {
				position absolute
				top 95px
				left 102px
				width 128px
				height 35px
			}
			.img-4 {
				position absolute
				bottom 6px
				right 10px
				width 76px
				height 64px
			}
		}
	}
}
</style>

