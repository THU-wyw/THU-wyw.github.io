// JavaScript Document
var titles= $('h3');
for (var i = 0; i < titles.length; i++) {
	var icon = $(titles[i]).next().attr('id') == 'aqApplyForm' ?  '↓' : '↑';
	$(titles[i]).append($('<span style = "float:right; margin-right:15px"/>').text(icon));
}

$('h3').click(function(){
	this.lastChild.innerHTML = this.lastChild.innerHTML == '↓' ? '↑' : '↓';
	$(this).nextAll().slideToggle("slow");
});
