// JavaScript Document
var x = $('.head_c');
var y = x.children();
var z = $('<div/>');
var content = $('.content_c');
content.css('margin', '0 auto');
content.css('max-width', '960px');
z.prepend(y[0]);
z.append(y[1]);
x.prepend(z);
topBar = $('.top-bar');
topBar.css('height', 'auto');
topBar.addClass('clear');
$('#wrap').css('min-width', '540px');

function rearrange() {
	if (document.documentElement.clientWidth < 975) {
		var x = $('.head_c');
		var z = $(x.children()[0]);
		$('#head').css('height', '100px');
		z.css('height', '50px');
		z.addClass("clear");
		nav = $($('.head_c').children()[1]);
		
		//nav.css('margin', '0 auto');
		wid = 0;
		for (i = 0; i < nav.children().length; i++) {
			wid += $(nav.children()[i]).width();
		}
		nav.css('margin-left', (document.documentElement.clientWidth * 0.76 - wid) / 2 + 'px');
		return;
	}
	else {
		var x = $('.head_c');
		var z = $(x.children()[0]);
		$('#head').css('height', '50px');
		z.css('height', '0px');
		z.removeClass("clear");
		$($('.head_c').children()[1]).removeAttr('style');
		return;
	}
};

function changeColumns() {
	var container = $('.box-c');
	var str = $('ul.standord-nav li a.active').text();
	if (str == "课程首页") { 
		var rightColumn = $('.w38p');
		var centerColumn = $('.mr39p');
	} else if (str == "课程文件") {
		rightColumn = $('.w28p');
		centerColumn = $('.mr29p');
	} else if (str == "课程信息") {
		var rightColumn = $('.w32p');
		var centerColumn = $('.mr33p');
	} else {
		return;
	}
		

	if (document.documentElement.clientWidth < 720) {	
		container.prepend(centerColumn);
		centerColumn.css('margin-right', '0px');
		rightColumn.css('float', 'none');
		rightColumn.css('width', 'auto');
		return;
	}
	else {
		container.prepend(rightColumn);
		centerColumn.removeAttr('style');
		rightColumn.removeAttr('style');
		return;
	}
};


rearrange();
changeColumns();
$(window).resize(function () {
	rearrange();
	changeColumns();
});