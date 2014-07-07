// JavaScript Document
var x = $('.head_c');
var y = x.children();
var z = $('<div/>')
z.prepend(y[0]);
z.append(y[1]);
x.prepend(z);
topBar = $('.top-bar');
topBar.css('height', 'auto');
topBar.addClass('clear');
$(window).resize(function() {
	if (document.documentElement.clientWidth < 975) {
		var x = $('.head_c');
		var z = $(x.children()[0]);
		$('#head').css('height', '100px');
		z.css('height', '50px');
		z.addClass("clear");
//		$(x.children()[1]).css('-webkit-padding-start', '0px');
	}
	else {
		var x = $('.head_c');
		var z = $(x.children()[0]);
		$('#head').css('height', '50px');
		z.css('height', '0px');
		z.removeClass("clear");
//		$(x.children()[1]).css('-webkit-padding-start', '40px');
	}
});