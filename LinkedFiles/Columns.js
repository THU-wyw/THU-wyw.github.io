// JavaScript Document
var topBar = $('.top-bar');
topBar.css('height', 'auto');
topBar.addClass('clear');
$(window).resize(function() {
	if (document.documentElement.clientWidth < 975) {
		var container = $('.box-c');
		var rightColumn = $('.w38p');
		var centerColumn = $('.mr39p');
		container.prepend(centerColumn);
		centerColumn.css('margin-right', '0px');
		rightColumn.css('float', 'none');
		rightColumn.css('width', 'auto');
		return;
	}
	else {
		var container = $('.box-c');
		var rightColumn = $('.w38p');
		var centerColumn = $('.mr39p');
		container.prepend(rightColumn);
		centerColumn.removeAttr('style');
		rightColumn.removeAttr('style');
		return;
	}
});