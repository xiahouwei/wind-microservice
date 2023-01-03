import { TABLE_NAME } from '../js/config.js'
import { scrollbarWidth } from '../js/utils.js'
export default {
	name: 'windTableBottom',
	props: {
		columnArr: {
			type: Array,
			default: () => {
				return []
			}
		},
		sumData: {
			type: Object,
			default: () => {
				return {}
			}
		},
		width: [String, Number],
		height: String,
		isScrollY: Boolean
	},
	data () {
		return {
			gutterWidth: scrollbarWidth()
		}
	},
	computed: {
		table () {
			return this.$parent
		},
		sumColumnStyle (colItem, colIndex) {
			return (colItem, colIndex) => {
				const colStyle = {}
				colStyle['text-align'] = colIndex === 0 ? 'left' : colItem.align || 'center'
				return colStyle
			}
		},
		computedGutterWidth () {
			return (this.isScrollY && this.gutterWidth) ? this.gutterWidth : 0
		}
	},
	render (h) {
		return <div class={[`${TABLE_NAME}__bottom`]}>
			<table
				class={[`${TABLE_NAME}__bottom-table`]}
				style={{ width: `${this.width + this.computedGutterWidth}px` }}
				cellspacing='0'
				cellpadding='0'
				border='0'
			>
				<colgroup>
					{
						this.columnArr.map((item, index) => {
							const cellWidth = item.columnConfig.realWidth
							const cellClassKey = item.prop || item.type
							return <col name={ `${TABLE_NAME}-column-${cellClassKey}` } width = { cellWidth } key={item.prop}/>
						})
					}
					{
						this.computedGutterWidth ? <col name={ `${TABLE_NAME}__th-gutter` } width = '17' key='gutter'/> : ''
					}
				</colgroup>
				<tbody class={[`${TABLE_NAME}__bottom-tbody`]}>
					<tr
						class={[`${TABLE_NAME}__bottom-tr`]}
						style={{
							height: this.height,
							'line-height': this.height
						}}
					>
						{
							this.columnArr.map((item, index) => {
								const sumText = this.$parent.sumText || '合计'
								const value = index === 0 ? sumText : this.sumData[item.prop]
								const cellClassKey = item.prop || item.type
								return <td
									class={[`${TABLE_NAME}-column-${cellClassKey}`, `${TABLE_NAME}__td`, { 'is-border': this.table.isBorder }]}
								>
									<div class={[`${TABLE_NAME}__cell`, {
										'has-padding': item.columnConfig.cellPadding
									}]} style={{ 'text-align': item.columnConfig.headerAlign || 'left' }}>
										<span class={[`${TABLE_NAME}__bottom-label`]}>{ value }</span>
									</div>
								</td>
							})
						}
						{
							this.computedGutterWidth ? <td class={[`${TABLE_NAME}__th-gutter`]} style={{ width: `${this.gutterWidth}px` }}></td> : ''
						}
					</tr>
				</tbody>
			</table>
		</div>
	}
}
