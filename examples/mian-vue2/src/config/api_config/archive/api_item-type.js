import { get, post, put, del } from '@/js/api/dataSource'
export default {
	// 品项类别接口
	itemType: {
		// 获取品项类别树
		getItemTree () {
			return get({
				url: '/archive/item/type/v1/tree',
				success: (res) => {
					return [{
						name: '全部',
						treeType: 'root',
						fatherId: null,
						children: res,
						id: '1'
					}]
				}
			})
		},
		// 获取品项类别关系表
		getItemType () {
			return get({ url: '/archive/item/type/v1/tree' })
		},
		// 新增品项类别
		add () {
			return post({ url: '/archive/item/type/v1' })
		},
		// 修改品项类别
		save (id) {
			return put({ url: `/archive/item/type/v1/${id}` })
		},
		// 删除品项类别
		delete (id) {
			return del({ url: `/archive/item/type/v1/${id}` })
		},
		// 查询品项类别
		get (id) {
			return get({ url: `/archive/item/type/v1/${id}` })
		},
		// 获取上级可选列表
		getFatherList () {
			return get({ url: '/archive/item/type/v1/father/list' })
		},
		// 获取上级id集合
		getFullPathId (id) {
			return get({ url: `/archive/item/type/v1/${id}/id/path` })
		},
		// 获取品项类别默认编号
		getItemTypeCode () {
			return post({ url: '/archive/item/type/v1/code' })
		}
	}
}
