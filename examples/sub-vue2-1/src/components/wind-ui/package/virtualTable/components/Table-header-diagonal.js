import { pythagorasTheorem, cosa } from '../js/utils.js'
export default {
	name: 'table-header-diagonal',
	data () {
		return {
			width: 0,
			deg: 0,
			positionLeft: 0
		}
	},
	mounted () {
		this.setStyle()
	},
	methods: {
		setStyle () {
			const parent = this.$el.parentNode
			if (parent.tagName === 'TH') {
				const _width = parent.offsetWidth
				const _height = parent.offsetHeight
				this.positionLeft = pythagorasTheorem(_width, _height)
				this.width = this.positionLeft * 2
				this.deg = cosa(_height, _width, this.positionLeft)
			}
		}
	},
	render (h) {
		return <div class='table-header-diagonal' style={{
			width: `${this.width}px`,
			transform: `rotate(${this.deg}deg)`,
			left: `-${this.positionLeft}px`
		}}></div>
	}
}
