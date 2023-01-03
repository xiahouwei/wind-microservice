/**
 * @模块说明 前台营业主界面 - toast
 * @版权所有 
 * 		天津市神州商龙科技股份有限公司
 * @修改历史
 * 		2014-08-13	刘庆魁	对toast修改
 *		2015-03-24	金   星	修改显示位置 判断文字对齐 
 */
//对修改

(function($){
	var th = null, cf = null, toast = function(m,o){
		// fix option type
		o = $.extend({ duration: 1600, sticky: false, 'type': 'success'}, o);//默认修改,如下
		typeof o.duration === 'number' || (o.duration = 1600);//默认5000-1600
		typeof o.sticky === 'boolean' || (o.sticky = false);
		typeof o.type === 'string' || (o.type = 'success');//默认类型 success
		// create host on first call
		if(!th){ 
			// get/fix config
			cf = toast.config;
			th = $('<ul></ul>').addClass('toast').appendTo(document.body).hide();
			typeof cf.height === 'number' || (cf.height = 60); //配置高度
			typeof cf.width === 'number' || (cf.width = 350);
			typeof cf.align === 'string' || (cf.align = 'center');
			typeof cf.closeForStickyOnly === 'boolean' || (cf.closeForStickyOnly = false);
			th.width(cf.width);
			(cf.align === 'left' || cf.align === 'right') && th.css('margin','5px').css(cf.align, '0') || th.css({left: '50%', margin: '200px 0 0 -' + (cf.width / 2) + 'px'});
		}
		//判断长度 区分是居中显示 还是左对齐
		if(m && m.length > 20){
			$(".toast").css({textAlign:'left'});
		}else{
			$(".toast").css({textAlign:'center'});
		}
		// create toast
		var ti = $('<li></li>').hide().html(m).appendTo(th), cb = $('<button>&times;</button>').addClass('close').prependTo(ti), to = null;
		// setup close button
		cb.click(function(e){
			clearTimeout(to);
			ti.animate({ height: 0, opacity: 0}, 'fast', function(){
				ti.remove();
				th.children().length || th.removeClass('active').hide();
			});
			e.stopPropagation(); //不再派发事件 toast 消失时不带走其他模块一并消失
		});
		cf.closeForStickyOnly && !o.sticky && cb.hide();
		// add type class
		o.type !== '' && ti.addClass(o.type);
		// show host if necessary
		!th.hasClass('active') && th.addClass('active').show();
		// setup timeout unless sticky
		!o.sticky && o.duration > 0 && (to = setTimeout(function(){ cb.click(); }, o.duration));
		// show toast
		ti.fadeIn('normal');
	};
	toast.config = {align: 'center', closeForStickyOnly: true };//默认500 - 200宽度
	$.extend({ toast: toast });
})(jQuery);
