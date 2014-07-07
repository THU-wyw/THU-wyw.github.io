// JavaScript Document
$(window).resize(function() {
	if (document.documentElement.clientWidth < 780) {
		x = $('.head_c');
		y = x.children();
		z = $('<div class="clear"/>')
		z.prepend(y[0]);
		z.append(y[1]);
		x.prepend(z);
		$('#head').css('height', '100px');
		z.css('height', '50px');
	}
	alert(2);
});