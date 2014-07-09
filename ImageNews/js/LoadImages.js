// JavaScript Document
function LoadImageList() {
	$.getJSON("album/PhotoList.txt", function(data) {
	alert(data);
});
}
function LoadImage() {
}

LoadImageList();