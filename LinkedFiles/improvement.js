// JavaScript Document
$(window).resize(function() {
	if (document.documentElement.clientWidth < 780) {
		var x = $('.head_c');
		var y = x.children();
		if (y.length == 3) {
			var z = $('<div class="clear"/>')
			z.prepend(y[0]);
			z.append(y[1]);
			x.prepend(z);
			$('#head').css('height', '100px');
			z.css('height', '50px');
		}
	}
	else {
		var x = $('.head_c');
		var y = x.children();
		if (y.length == 2) {
			y[0].remove();
			x.prepend($(y[0]).children());	
			$('#head').css('height', '50px');
		}
	}
});