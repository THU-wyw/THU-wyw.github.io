// JavaScript Document
topBar = $('.top-bar');
topBar.css('height', 'auto');
topBar.addClass('clear');
var container = $('.box-c');
var rightColumn = $(container.children()[0]);
var centerColumn = $(container.children()[1]);
$(window).resize(function() {
	if (document.documentElement.clientWidth < 975) {
		container.prepend(centerColumn);
		centerColumn.css('margin-right', '0px');
		rightColumn.css('float', 'none');
		rightColumn.css('width', 'auto');
	}
	else {
		container.prepend(rightColumn);
		centerColumn.removeAttr('style');
		rightColumn.removeAttr('style');
	}
});