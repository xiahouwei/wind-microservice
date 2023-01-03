/**
 * @模块说明 读取配置
 *
 * @版权所有
 * 		天津市神州商龙科技股份有限公司
 * @修改历史
 * 		2014-10-08	李小龙	创建了该模块
 * 		2015-12-04	鞠辰		调整设备管理器初始化
 *
 * @requires JQuery
 */
var TGloble = new function(){

	var _opts = {
		pos: null, //pos设置
		sys: null,  //系统设置
		site:null  //站点设置
	};

	var _this = this;

	this.init = function(param, callback){
		if(!param.success) {// 为保证程序健壮不抛错，失败情况下不做强制阻拦，因为后面还需要初始化fastreport、客显、钱箱等等
			$.toast(param.msg,{type:"danger"});
		}
		_opts.sys = param.sys;
		_opts.pos = param.pos;
		_opts.site = param.site;
		if(callback) {
			if(callback) callback(_opts);
		}
		_this.isInit = true;
	}

	this.getSetting = function(callback){
		if(!_this.isInit){
			throw new Error("setting没有初始化");
			//this.init(callback);
		}else{
			return _opts;
		}
	}

	this.reload = function(callback) {
		Ajax.submit({
			url:CONTEXTPATH + "/canyin/pos/reception/receptionbusiness/all",
			type:"get",
			success:function(d){
				_opts.sys = d.sys;
				_opts.pos = d.pos;
				_opts.site = d.site;
				_this.isInit = true;
				if(callback) callback(d);
			}
		})
	}
};
