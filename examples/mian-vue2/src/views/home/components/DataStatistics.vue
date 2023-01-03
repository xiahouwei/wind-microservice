<template>
	<fx-card id="dataStatistics" title="数据统计" class="data-statistics-container">
		<div class="filter-container">
			<w-select
				v-model="prop"
				:optionlist="propSelectList"
				class="select-input"
				disabled
				@change="onPropSelectChanged"
			>
			</w-select>
			<div class="date-container">
				<span>日期：</span>
				<el-date-picker
					v-model="dateRang"
					disabled
					type="monthrange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					format="yyyy 年 MM 月"
					value-format="yyyy-MM"
					class="date-input"
				>
				</el-date-picker>
			</div>
		</div>
		<div id="myChart" class="charts-container"></div>
	</fx-card>
</template>

<script>
export default {
	name: 'DataStatistics',
	data () {
		return {
			prop: 1,
			propSelectList: [{
				id: 1,
				name: '动销率（%）'
			}, {
				id: 2,
				name: '动销率（%）123'
			}],
			dateRang: ['2020-06', '2021-03'],
			myChart: null,
			chartOption: {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'line',
						label: {
							backgroundColor: '#6a7985'
						}
					}
				},
				xAxis: {
					type: 'category',
					data: ['2020-06', '2020-07', '2020-08', '2020-09', '2020-10', '2020-11', '2020-12', '2021-01', '2021-02', '2021-03'],
					boundaryGap: false,
					splitLine: {
						show: true
					},
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						margin: 30,
						fontSize: 16,
						fontWeight: 'bold',
						color: '#999'
					}
				},
				yAxis: {
					axisLabel: {
						margin: 25,
						fontSize: 16,
						fontWeight: 'bold',
						color: '#999'
					}
				},
				series: [{
					type: 'line',
					smooth: true,
					data: [1, 1.7, 7.8, 7.5, 10.2, 2.5, 0, 1, 3.5, 1.9],
					areaStyle: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [{
								offset: 0, color: 'rgba(0, 221, 255, 0.5)'
							}, {
								offset: 1, color: 'rgba(77, 119, 255, 0.5)'
							}],
							global: false
						}
					},
					symbol: 'roundRect',
					symbolSize: 14,
					itemStyle: {
						color: '#4197f7',
						borderColor: '#fff',
						borderWidth: 2
					}
				}],
				grid: {
					left: '1%',
					right: '3%',
					bottom: '3%',
					top: '5%',
					containLabel: true
				}
			}
		}
	},
	mounted () {
		this.drawLine()
	},
	destroyed () {
		window.onresize = null
	},
	methods: {
		drawLine () {
			this.myChart = this.$fxEcharts.init(document.getElementById('myChart'))
			this.myChart.setOption(this.chartOption)
			const dataStatistics = document.getElementById('dataStatistics')
			const observer = new ResizeObserver(() => {
				this.$fxUtils.fxDebounce(200, false, true).then(() => {
					this.myChart.resize()
				})
			})
			observer.observe(dataStatistics)
		},
		onPropSelectChanged (val) {
			if (val === 1) {
				this.chartOption.series[0].data = [1, 1.7, 7.8, 7.5, 10.2, 2.5, 0, 1, 3.5, 1.9]
			} else {
				this.chartOption.series[0].data = [1, 6, 9, 7.5, 15, 2, 3, 8, 3.5, 1.9]
			}
			this.myChart.setOption(this.chartOption)
		}
	}
}
</script>

<style lang="stylus" scoped>
.data-statistics-container{
	flex 1
	display flex
	flex-direction column
	margin-top 15px
	margin-bottom 15px
	min-height 450px
	.filter-container {
		display flex
		justify-content space-between
		align-items center
		margin-top 20px
		.select-input {
			margin-left 55px
			width 150px
		}
		.date-container {
			margin-right 3%
			.date-input {
				margin-left 10px
			}
		}
	}
	.charts-container {
		flex 1
	}
}
</style>
