/*
 * @ 轮询函数 SHW
 * @ wait 延迟毫秒数
 */
const noop = function () {}
class Polling {
	constructor () {
		this.loop = false
		this.interval = null
		this.cb = noop
	}

	start (interval = 5000, cb) {
		this.loop = true
		this.interval = interval
		this.cb = cb
		this.resolveHandler()
	}

	resolveHandler () {
		setTimeout(() => {
			if (this.loop) {
				this.cb(this.resolveHandler.bind(this), this.end.bind(this))
			}
		}, this.interval)
	}

	end () {
		this.loop = false
	}
}

const polling = function () {
	return new Polling()
}

const fxPolling = polling()

export default {
	polling,
	fxPolling
}
