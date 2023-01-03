
const printHandler = (printData, loadop) => {
	let positionY = 5
	printData.forEach((item) => {
		item.forEach((printItem, printIndex) => {
			if (printItem.id === 'barcode') {
				loadop.ADD_PRINT_BARCODE(55, 10, 200, 40, '128Auto', printItem.value)
				positionY = 105
			} else {
				const positionX = printIndex === 0 ? 0 : 120
				if (printItem.id === 'batchCode') {
					loadop.ADD_PRINT_TEXT(positionY, positionX, 260, 15, printItem.value)
				} else {
					loadop.ADD_PRINT_TEXT(positionY, positionX, 200, 15, printItem.value)
				}
				if (printItem.id === 'name') {
					loadop.SET_PRINT_STYLEA(0, 'FontSize', 11)
				}
				if (printIndex === item.length - 1) {
					positionY += 15
				}
			}
		})
	})
}
export default [{
	size: '6x4',
	handler (printData) {
		const loadop = window.getCLodop()
		loadop.PRINT_INIT('品项条码打印')
		loadop.SET_PRINT_PAGESIZE(1, 600, 400, '')
		printHandler(printData, loadop)
		loadop.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW', true)
		loadop.PREVIEW()
	}
}, {
	size: '8x6',
	handler (printData) {
		const loadop = window.getCLodop()
		loadop.PRINT_INIT('品项条码打印')
		loadop.SET_PRINT_PAGESIZE(1, 800, 400, '')
		printHandler(printData, loadop)
		loadop.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW', true)
		loadop.PREVIEW()
	}
}]
