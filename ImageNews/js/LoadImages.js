// JavaScript Document
var Images;

function LoadImages() {
	$.getJSON("album/PhotoList.txt", function(ImageList) {
		for (var i = 0; i < ImageList.length; i++) {
			var newPhoto = $('<li class="image-display"/>');
			if (i == 0) {
				newPhoto.css('display', 'block');
			}
			var img = new Image();
			img.src = 'images/loading.png';
			newPhoto.append(img);
			newPhoto.append($('<span/>').text(ImageList[i].title));
			$('#image-list').append(newPhoto);
		}
		Images = new Array();
		for (var i = 0; i < ImageList.length; i++) {
			Images[i] = new Image();
			Images[i].onload = (function(i, ImageList) {
				if (i == ImageList.length - 1) {
					return function () {
						$($($("#image-list").children()[i]).children()[0]).remove();
						$($("#image-list").children()[i]).prepend(Images[i]);
						return;
					}
				}
				else {
					return function () {
						$($($("#image-list").children()[i]).children()[0]).remove();
						$($("#image-list").children()[i]).prepend(Images[i]);
						Images[i + 1].src = ImageList[i + 1].imageUrl;
					}
				}
			})(i, ImageList);
		}
		Images[0].src = ImageList[0].imageUrl;
	});
}

LoadImages();