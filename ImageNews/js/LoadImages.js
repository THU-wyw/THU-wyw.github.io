// JavaScript Document
var images;
var loaded;
var current;
function LoadImages() {
	$.getJSON("album/PhotoList.txt", function(imageList) {
		loaded = new Array();
		for (var i = 0; i < imageList.length; i++) {
			var newPhoto = $('<li class="image-display"/>');
			loaded[i] = false;
			if (i == 0) {
				newPhoto.css('display', 'block');
			}
			var img = new Image();
			img.src = 'images/loading.png';
			newPhoto.append(img);
			newPhoto.append($('<span/>').text(imageList[i].title));
			$('#image-list').append(newPhoto);
		}
		current = 0;
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
		images[0].src = imageList[0].imageUrl;
	});
}

LoadImages();

function setCurrentPhoto(value) {
	$($('#image-list').children()[current]).removeAttr('style');
	current = value;
	$($('#image-list').children()[current]).css('display', 'block');
}
	
function autoChange() {
	if (loaded[(current + 1) % images.length]) {
		setCurrentPhoto((current + 1) % images.length);
	} 
	setTimeout("autoChange()", 1000);
}

$('body').unload(autoChange);
	