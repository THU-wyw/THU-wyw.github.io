// JavaScript Document
var commentsPerPage = 5;
var commentsList;
var commentsArray = [];
var currentPage;
if (localStorage.currentPage == undefined) {
	currentPage = 0;
} else {
	currentPage = localStorage.currentPage;
}

function initComments(s) {
	$.getJSON(s, function(data) {commentsList = data;loadComments(currentPage);});
	
}

function loadComments(page) {
	if (page < 0 || page >= commentsList.commentsUrl.length) {
		return;
	}
	if (commentsArray[page] == undefined) {
		$.getJSON(commentsList.commentsUrl[page], function(data) {
			commentsArray[page] = data;
			showComments(page);
			return;
		});
	}
	else {
		showComments(page);
	}
}

function showComments(page) {
	localStorage.currentPage = page;
	currentPage = page;
	$('#page-number').text('第' + (page * commentsPerPage + 1) + '-' + (page * commentsPerPage + commentsArray[page].length) + '条 / 共' + commentsList.number + '条');
	$(".comments-list").empty();
	for (var i = 0; i < commentsArray[page].length; i++) {
		var portrait = $('<img>').addClass("portrait").attr('src', commentsArray[page][i].portraitUrl);
		var userName = $('<p/>').addClass('user-name').text(commentsArray[page][i].userName);
		var commentText = $('<div class="comment-text"/>');
		for (var j = 0; j < commentsArray[page][i].commentText.length; j++) {
			commentText.append($('<p/>').text(commentsArray[page][i].commentText[j]));
		}
		commentText.append($('<h4/>').text(commentsArray[page][i].year + '年' + commentsArray[page][i].month + '月' + commentsArray[page][i].date + '日'));
		$(".comments-list").append($('<li/>').addClass('comment').append(($('<div class="user-info"/>').append(portrait).append(userName))).append(commentText));
	}
}
	

initComments("comments/CommentsList.txt");