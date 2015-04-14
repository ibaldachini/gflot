/*
 * Copyright (c) 2015 naBerTech
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * @author Igor Baldachini
 */
(function ($){
	var pluginName = "background", pluginVersion = "1.1";
	var options ={
		grid:{
			background:{
				imageurl: null,
				text: null,
				font: "24px Arial",
				fillstyle: "#303030",
				yoffset: 0,
				alpha: null
			}
		}
	};
	
	var getTextHeight = function(font) {
		var text = $('<span>Hg</span>').css({ fontFamily: font });
		var block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');
		var div = $('<div></div>');
		div.append(text, block);
		var body = $('body');
		body.append(div);
		try {
			var result = {};
			block.css({ verticalAlign: 'baseline' });
			result.ascent = block.offset().top - text.offset().top;
			block.css({ verticalAlign: 'bottom' });
			result.height = block.offset().top - text.offset().top;
			result.descent = result.height - result.ascent;
		} finally {
			div.remove();
		}
		return result;
	};

	function init(plot){
		plot.hooks.draw.push(function (plot, ctx) {
			var offset = plot.getPlotOffset();
			var opt = plot.getOptions();
			var img = new Image();
			ctx.save();
			ctx.translate(offset.left, offset.top);
			img.src = opt.grid.background.imageurl;
			if(typeof img !== "undefined"){
				var alpha = ctx.globalAlpha;
				if (opt.grid.background.alpha)
					ctx.globalAlpha = opt.grid.background.alpha;
				ctx.drawImage(img, 0, 0, plot.width(), plot.height());
				ctx.globalAlpha = alpha;
			}
			if (opt.grid.background.text != null){
				ctx.font = opt.grid.background.font;
				ctx.fillStyle = opt.grid.background.fillstyle;
				var w = ctx.measureText(opt.grid.background.text).width;
				var h = getTextHeight(ctx.font);
				ctx.fillText(opt.grid.background.text, plot.width() - w - 6, h.height + 6 + opt.grid.background.yoffset);
			}
			ctx.restore();
		});
	}
	$.plot.plugins.push({
		init: init,
		options: options,
		name: pluginName,
		version: pluginVersion
	});
})(jQuery); 
