// JavaScript Document
var x = $('.head_c');
var y = x.children();
var z = $('<div/>')
z.prepend(y[0]);
z.append(y[1]);
x.prepend(z);

$(window).resize(function() {
	if (document.documentElement.clientWidth < 780) {
		var x = $('.head_c');
		var z = $(x.children()[1]);
		$('#head').css('height', '100px');
		z.css('height', '50px');
		z.addClass('clear');
	}
	else {
		var x = $('.head_c');
		var z = $(x.children()[1]);
		$('#head').css('height', '50px');
		z.css('height', '50px');
		z.removeClass('clear');
	}
});