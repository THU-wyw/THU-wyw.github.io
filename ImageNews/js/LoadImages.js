
var images;
var imageList;
var loaded;
var current;
var t;
var s;


function LoadImages() {
	$.getJSON("album/PhotoList.txt", function(data) {
		imageList = data;
		getDefaultImages();
		loadImageList();
		$(images).mouseover(function() {
			$(this).next().css('display', 'block');
			$(this).next().width('70%');
			clearTimeout(t);
			clearTimeout(s);
		});
	
		$(images).mouseout(function() {
			$(this).next().css('width', '0');
			s = setTimeout('$(images[current]).next().removeAttr("style")', 2000);
			t = setTimeout("autoChange()", 5000);
		});
	});
}

LoadImages();

function getDefaultImages() {
	loaded = [];
	for (var i = 0; i < imageList.length; i++) {
		var newPhoto = $('<li class="image-display"/>');
		loaded[i] = false;
		if (i == 0) {
			newPhoto.css('display', 'block');
		}
		var img = new Image();
		img.src = 'images/loading.png';
		newPhoto.append(img);
		newPhoto.append($('<div class="description">').append($('<p/>').text(imageList[i].title).width($('#image-list').width() * 0.7)));
		$('#image-list').append(newPhoto);
		$('#image-button-list').append($('<span class="image-button"/>'));
	}
	current = 0;
	$($('#image-button-list').children()[current]).addClass('selected');
	for (var i = 0; i < imageList.length; i++) {
		$($('#image-button-list').children()[i]).click((function(i) {
			return function () {
				setCurrentPhoto(i);
			}
			})(i));
	}
	autoChange();
}
function loadImageList() {
	images = new Array();

	for (var i = 0; i < imageList.length; i++) {
		images[i] = new Image();
		images[i].onload = (function(i, imageList) {
			if (i == imageList.length - 1) {
				return function () {
					$($($("#image-list").children()[i]).children()[0]).remove();
					$($("#image-list").children()[i]).prepend(images[i]);
					loaded[i] = true;  
					return;
				}
			}
			else {
				return function () {
					$($($("#image-list").children()[i]).children()[0]).remove();
					$($("#image-list").children()[i]).prepend(images[i]);
					loaded[i] = true;
					images[i + 1].src = imageList[i + 1].imageUrl;
				}
			}
		})(i, imageList);
	}
	images[0].src = imageList[0].imageUrl;// JavaScript Document
}

function setCurrentPhoto(value) {
	if (current == value) return;
	clearTimeout(t);
	$('#left-button').removeAttr('onclick');
	$('#right-button').removeAttr('onclick');
	$($('#image-button-list').children()[current]).removeClass('selected');
	$($('#image-button-list').children()[value]).addClass('selected');
	$('#left-button').removeAttr('onclick');
	$('#right-button').removeAttr('onclick');
	$($('#image-list').children()[current]).fadeOut(function (){
		$($('.image-display')[current]).children().last().removeAttr('style');
		current = value;
		$($('#image-list').children()[current]).fadeIn(function() {
			$('#left-button').attr('onClick', "setCurrentPhoto((current + imageList.length - 1) % imageList.length);");
			$('#right-button').attr('onClick', "setCurrentPhoto((current + 1) % imageList.length)");
			t = setTimeout("autoChange()", 5000);
			});
	});
}
	
function autoChange() {
	if (loaded[(current + 1) % loaded.length]) {
		setCurrentPhoto((current + 1) % loaded.length);
	} 
}

$(window).resize(function() {
    $('.description').children().width($('#image-list').width() * 0.7);
});