import { TABLE_NAME } from '../js/config.js'
export default {
	name: 'windTableSortBtn',
	props: {
		sort: String
	},
	render (h) {
		return <div class={[`${TABLE_NAME}__th-sort`]}>
			<i class={[`${TABLE_NAME}__th-sort-up`, {
				'is-active': this.sort === 'asc'
			}]}></i>
			<i class={[`${TABLE_NAME}__th-sort-down`, {
				'is-active': this.sort === 'desc'
			}]}></i>
		</div>
	}
}
