import { getKeysMap, isPlainObject } from '../js/utils.js'
export default {
	data () {
		return {
			states: {
				defaultExpandAll: false,
				expandRows: [],
				expandMap: {},
				expandedIds: [],
				expandRowConfig: [],
				expandRowHeight: 0,
				expandHover: null,
				subSelect: []
			}
		}
	},

	methods: {
		updateExpandRows () {
			// const { data = [], rowKey, defaultExpandAll, expandRows } = this.states;
			// if (defaultExpandAll) {
			//   this.states.expandRows = data.slice();
			// } else if (rowKey) {
			//   // TODO：这里的代码可以优化
			//   const expandRowsMap = getKeysMap(expandRows, rowKey);
			//   this.states.expandRows = data.reduce((prev, row) => {
			//     const rowId = getRowIdentity(row, rowKey);
			//     const rowInfo = expandRowsMap[rowId];
			//     if (rowInfo) {
			//       prev.push(row);
			//     }
			//     return prev;
			//   }, []);
			// } else {
			//   this.states.expandRows = [];
			// }
		},

		toggleRowExpansion (row) {
			const expand = !this.states.expandMap[row.id]
			this.states.expandMap = Object.assign({}, this.states.expandMap, {
				[row.id]: expand
			})
			// 获取展开子表的id数组
			const expandArr = []
			for (const expandKey in this.states.expandMap) {
				if (this.states.expandMap[expandKey]) {
					expandArr.push(expandKey)
				}
			}
			this.states.expandedIds = expandArr
			this.table.$emit('rowExpanded', this.states.expandedIds)
		},

		setExpandRowKeys (rowKeys) {
			this.assertRowKey()
			const { data, rowKey } = this.states
			const keysMap = getKeysMap(data, rowKey)
			this.states.expandRows = rowKeys.reduce((prev, cur) => {
				const info = keysMap[cur]
				if (info) {
					prev.push(info.row)
				}
				return prev
			}, [])
		},
		isRowExpanded (row) {
			let id = ''
			if (typeof row === 'string') {
				id = row
			} else if (isPlainObject(row)) {
				id = row.id
			}
			return this.states.expandMap[id]
		},
		clearExpanded () {
			this.state.expandRows = []
		},
		setRowExpanded (expands) {
			this.states.expandMap = Object.fromEntries(expands.map(item => {
				return [item, true]
			}))
		},
		isRowExpandHover (row) {
			return row.$fxIndex === this.states.expandHover
		},
		setRowExpandHover (index) {
			this.states.expandHover = index
		}
	}
}
