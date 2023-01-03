import { file } from '@/js/api/dataSource'
export default {
	editer: {
		preview () {
			return file({
				url: 'bm/customizeprintplan/style',
				responseType: 'blob',
				success: (res) => {
					return window.URL.createObjectURL(res)
				}
			})
		}
	}
}
