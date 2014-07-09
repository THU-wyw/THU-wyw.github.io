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
		autoChange();
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
/*
loaded = new Array();
imageList = [{
"imageUrl": "album/1.jpg",
"title": "图片1"
}, {
"imageUrl": "album/2.jpg",
"title": "图片2"
}, {
"imageUrl": "album/3.jpg",
"title": "图片3"
}, {
"imageUrl": "album/4.jpg",
"title": "图片4"
}, {
"imageUrl": "album/5.jpg",
"title": "图片5"
}, {
"imageUrl": "album/6.jpg",
"title": "图片6"
}, {
"imageUrl": "album/7.jpg",
"title": "图片7"
}, {
"imageUrl": "album/8.jpg",
"title": "图片8"
}];
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
images[0].src = imageList[0].imageUrl;*/
	
	
function setCurrentPhoto(value) {
	$($('#image-list').children()[current]).removeAttr('style');
	current = value;
	$($('#image-list').children()[current]).css('display', 'block');
}
	
function autoChange() {
	if (loaded[(current + 1) % loaded.length]) {
		setCurrentPhoto((current + 1) % loaded.length);
	} 
	setTimeout("autoChange()", 1000);
}

	