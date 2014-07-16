var canvas = document.getElementById('gameCanvas').getContext('2d');
canvas.translate(360, 360);
var startMusic = $('<embed hidden = "true" src = "mp3/startMusic.mp3" autostart = true></embed>');

if (!localStorage.bestScore === undefined) {
	localStorage.bestScore = -1;
}

var sound = 0;
var startNumber = 0;

var map = {
	orbits: [],
	firstRadius: 5,
	distance: 30,	
	orbitsNumber: 10,
	levels: [{
		upgradeScore: 100,
		speed: 1.2,
		items: [{possibility: 0.3, create: Shield, maxNumber: 1}, {possibility: 0.3, create: Aerolite, maxNumber: 2}],
	}, {
		upgradeScore: 200,
		speed: 1.8,
		items: [{possibility: 0.2, create: Shield, maxNumber: 1}, {possibility: 0.3, create: Aerolite, maxNumber: 3}]
	}, {
		upgradeScore: 400,
		speed: 2.0,
		items: [{possibility: 0.2, create: Shield, maxNumber: 1}, {possibility: 0.5, create: Aerolite, maxNumber: 3}, {possibility: 0.3, create: ArcWeapon, maxNumber: 2}]
	}, {
		upgradeScore: 800,
		speed: 2.2,
		items: [{possibility: 0.1, create: Shield, maxNumber: 1}, {possibility: 0.4, create: Aerolite, maxNumber: 4}, {possibility: 0.3, create: ArcWeapon, maxNumber: 3}]
	}, {
		upgradeScore: 888888,
		speed: 3.0,
		items: [{possibility: 0.05, create: Shield, maxNumber: 1}, {possibility: 0.3, create: Aerolite, maxNumber: 4}, {possibility: 0.4, create: ArcWeapon, maxNumber: 4}]
	}, {
		upgradeScore:888988,
		speed:3.3,
		items: [{possibility: 0.05, create: Shield, maxNumber: 1}, {possibility: 0.3, create: Aerolite, maxNumber: 4}, {possibility: 0.4, create: ArcWeapon, maxNumber: 5}]
	}]
};

function initial(){
	if (localStorage.bestScore === undefined) {
		localStorage.bestScore = -1;
	}
	map.orbits = [];
	map.score = 0;
	map.currentLevel = 0;
	map.isPlaying = false;
	for (var i = 0; i < map.orbitsNumber; i++) {
		map.orbits[i] = new Orbit(map.firstRadius + i * map.distance);
	}
	if (!map.player) {
		$(document).keydown(function(event) {
			if (map.isPlaying) {
				switch (event.which) {
					case 38:
						if (map.player.orbit > 0) {
							map.player.orbit--;
						}
						break;
					case 40:
						map.player.orbit++;
						break;
					case 37:
						map.player.acceleration = 2 * Math.PI;
						break;
					case 39:
						map.player.acceleration = - 2 * Math.PI;
						break;
					default:
						break;
				}
			}
			event.stopPropagation();
			(event || window.event).preventDefault();
		});
		$(document).keyup(function(event) {
			map.player.acceleration = 0;
			event.stopPropagation();
			(event || window.event).preventDefault();
		});	
	}
	map.player = new Player();
};

//create Orbit
function Orbit(radius) {
	this.radius = radius;
	this.items = [];
	var sum = 0;
	for (var i = 0; i < map.levels[map.currentLevel].items.length; i++) {
		var p = Math.random();
		if (p < map.levels[map.currentLevel].items[i].possibility) {
			this.items.push(new map.levels[map.currentLevel].items[i].create(map.levels[map.currentLevel].items[i].maxNumber));
		}
	}
}

Orbit.prototype = {
	constructor: Orbit,
	draw: function () {
		canvas.lineWidth = 1;
		canvas.strokeStyle = "rgb(80,96,166)";
		canvas.beginPath();
		canvas.arc(0, 0, this.radius, 0, 2 * Math.PI);
		canvas.closePath();
		canvas.stroke();
		for (var i = 0; i < this.items.length; i++) {
			this.items[i].draw(this.radius);
		}
	}, 
	update: function() {
		this.radius += map.levels[map.currentLevel].speed * map.distance / FPS;
		for (var i = 0; i < this.items.length; i++) {
			this.items[i].update();
		}
	},
	collision: function() {
		for (var i = 0; i < this.items.length; i++) {
			switch (this.items[i].collision()) {
				case true:
					this.items.splice(i, 1);
					i--;
					break;
				case false: 
					if (map.player.invincible == 0) {
						return;
					}
					break;
				default:
					break;
			}
		}
	}
}
//create Player
function Player() {
	this.orbit = 5;
	this.invincible = 0;
	this.current_speed = 0;
	this.angular = Math.PI / 2;
	this.acceleration = 0;
}

Player.prototype = {
	constructor: Player,
	max_velocity: Math.PI / 3,
	//update Player
	update: function() {
		if (this.current_speed * this.acceleration > 0) {
			this.current_speed += this.acceleration / (2 * FPS);
		}
		else {
			this.current_speed += this.acceleration / FPS;
		}
		if (this.current_speed > this.max_velocity) {
			this.current_speed = this.max_velocity;
		}
		if (this.current_speed < - this.max_velocity) {
			this.current_speed = - this.max_velocity;
		}
		this.angular += this.current_speed / FPS;
		if (this.invincible) {
			this.invincible -= 1;
		}
	},
	//draw player
	draw: function() {
		if (this.orbit == map.orbitsNumber) return;
			var x0 = map.orbits[this.orbit].radius * Math.cos(this.angular); 
			var y0 = map.orbits[this.orbit].radius * Math.sin(this.angular);
			
			var grd = canvas.createRadialGradient(x0, y0, 0, x0, y0, 5);
			grd.addColorStop(0, 'rgb(255, 555, 170)');
			grd.addColorStop(1, 'rgb(255, 0, 0)');
			canvas.fillStyle = grd;
			canvas.beginPath();
			canvas.arc(x0, y0, 5, 0, 2 * Math.PI);
			canvas.closePath();
			canvas.fill();
		if (this.invincible) {
			$('#timingbar').width(100 * this.invincible / (5 * FPS) +'%');
			canvas.strokeStyle ="rgba(255, 0, 0, 0.5)";
			canvas.lineWidth = 2;
			canvas.beginPath();	
			canvas.arc(map.orbits[this.orbit].radius * Math.cos(this.angular), map.orbits[this.orbit].radius * Math.sin(this.angular), 8, 0, 2 * Math.PI);
			canvas.closePath();
			canvas.stroke();
		} else {
			$('#timing').hide();
		}
	}
}
	
//create Aerolite
function Aerolite(maxNumber) {
	this.number = (Math.floor(Math.random() * maxNumber) + 1);
	this.angularSpeed = Math.random() * 2 * Math.PI / 3 - Math.PI / 3;
	this.angular = Math.random() * 2 * Math.PI;
}

Aerolite.prototype = {
	constructor: Aerolite,
	draw: function(radius) {
		for(var j = 0; j < this.number; j++){
			var x0 = radius * Math.cos(j * (2 * Math.PI) / this.number + this.angular); 
			var y0 = radius * Math.sin(j * (2 * Math.PI) / this.number + this.angular);
			
			var grd = canvas.createRadialGradient(x0, y0, 0, x0, y0, 5);
			grd.addColorStop(0, 'rgb(0, 168, 170)');
			grd.addColorStop(1, 'rgb(37, 0, 199)');
			canvas.fillStyle = grd;
			canvas.beginPath();
			canvas.arc(x0, y0, 5, 0, 2 * Math.PI);
			canvas.closePath();
			canvas.fill();
		}
	}, 
	update: function() {
        this.angular += this.angularSpeed / FPS;
	},
	collision: function() {
		for (var i = 0; i < this.number; i++) {
			var distanceAngular = this.angular + i * 2 * Math.PI / this.number - map.player.angular;
			distanceAngular -= Math.floor(distanceAngular / (2 * Math.PI)) * 2 * Math.PI;
			if (distanceAngular > Math.PI) {
				distanceAngular -= Math.PI * 2;
			}	
			if (Math.abs(distanceAngular) <= Math.asin(10 / map.orbits[map.player.orbit].radius) && (map.player.invincible == 0)){
				gameOver();
				return false;
			}
		}
	}
}

//create Shield 
function Shield(maxNumber) {
	this.angularSpeed = (Math.random() - 1) * Math.PI / 3;
	this.angular = Math.random() * 2 * Math.PI;
	this.rotationSpeed = Math.PI / 4;
	this.rotationAngular = Math.random() * 2 * Math.PI;
}
Shield.prototype = {
	constructor: Shield,
	update: function() {
		this.angular += this.angularSpeed / FPS;
		this.rotationAngular += this.rotationSpeed / FPS;
	}, 
	draw: function(radius) {
		var x = 5 * 1.414213562373095048801688724 * Math.cos(this.rotationAngular);
		var y = 5 * 1.414213562373095048801688724 * Math.sin(this.rotationAngular);
		var x0 = radius * Math.cos(this.angular);
		var y0 = radius * Math.sin(this.angular);
		canvas.fillStyle = 'rgb(255, 255, 0)';
		canvas.beginPath();
		canvas.moveTo(x0 + x, y0 + y);
		canvas.lineTo(x0 - y, y0 + x);
		canvas.lineTo(x0 - x, y0 - y);
		canvas.lineTo(x0 + y, y0 - x);
		canvas.closePath();
		canvas.fill();
	}, 
	collision: function() {
			var distanceAngular = this.angular - map.player.angular;
			distanceAngular -= Math.floor(distanceAngular / (2 * Math.PI)) * 2 * Math.PI;
			if (distanceAngular > Math.PI) {
				distanceAngular -= Math.PI * 2;
			}	
			if (Math.abs(distanceAngular) <= Math.asin(10 / map.orbits[map.player.orbit].radius)){
				map.player.invincible = 5 * FPS;
				$('#timing').show();
				return true;
			}
	}
}

//create ArcWeapon
function ArcWeapon(maxNumber) {
	this.number = (Math.floor(Math.random() * maxNumber) + 1);
	this.angularSpeed = (Math.random() - 1) * Math.PI / 3;
	this.angular = Math.random() * 2 * Math.PI;
	this.length = Math.PI / 7;
}

ArcWeapon.prototype = {
	constructor: ArcWeapon,
	update: function() {
		this.angular += this.angularSpeed / FPS;
	},
	draw: function(radius) {
		for(var j = 0; j < this.number; j++){
			canvas.beginPath();
			canvas.arc(0, 0, radius,
				this.angular + j * 2 * Math.PI / this.number,
				this.angular + j * 2 * Math.PI / this.number + this.length);
			canvas.lineCap = "round";
			canvas.lineWidth = 10;
			canvas.strokeStyle = "rgba(214, 184, 255, 0.3)";
			canvas.stroke();
			canvas.lineWidth = 5;
			canvas.beginPath();
			canvas.arc(0, 0, radius,
				this.angular + j * 2 * Math.PI / this.number,
				this.angular + j * 2 * Math.PI / this.number + this.length);
			canvas.strokeStyle = "rgba(139, 54, 255, 0.5)";
			canvas.stroke();
		}
	}, 
	collision: function() {
		for (var i = 0; i < this.number; i++) {
			var angular = map.player.angular;
			var angular1 = this.angular + i * 2 * Math.PI / this.number;
			var angular2 = this.angular + i * 2 * Math.PI / this.number + this.length;
			angular -= Math.floor((angular - angular1) / (2 * Math.PI)) * 2 * Math.PI; 
			if (angular < angular2 && (map.player.invincible == 0)) {
				gameOver();
				return false;
			}
		}
	}	
}
		
function update(){
	map.player.update();
	for (var i = 0; i < map.orbitsNumber; i++) {
		map.orbits[i].update();
	}
	if (map.orbits[map.orbitsNumber - 1].radius > map.orbitsNumber * map.distance) {
		map.orbits.pop();
		map.orbits.unshift(new Object());
		map.player.orbit++;
		map.orbits[0] = new Orbit(map.orbits[1].radius - map.distance);
		map.score++;
		if (map.score == map.levels[map.currentLevel].upgradeScore) {
			map.currentLevel++;
		}
	}
}

function draw() {
	canvas.clearRect(-360, -360, 720, 720);
	canvas.lineWidth = 1;
	canvas.strokeStyle = "rgb(80,96,166)";
	//draw orbits and items
	for (var i = 0; i < map.orbits.length; i++) {
		map.orbits[i].draw();
	}
	
	map.player.draw();

	var grd = canvas.createRadialGradient(0, 0, 0, 0, 0, 100);
	grd.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
	grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
	canvas.fillStyle = grd;
	canvas.beginPath();
	canvas.arc(0, 0, 100, 0, 2 * Math.PI);
	canvas.closePath();
	canvas.fill();
	
	canvas.strokeStyle = "rgba(255, 255, 255, 0.5)";
	canvas.lineWidth = 2;
	canvas.beginPath();
	canvas.arc(0, 0, map.orbitsNumber * map.distance, 0, 2 * Math.PI);
	canvas.closePath();
	canvas.stroke();
	
	$('#level').text('Level: ' + (map.currentLevel + 1));
	$('#score').text('Score: ' + map.score);
}

var FPS = 60; 
var game;

function start() {
	$('.gamePrompt').remove();
	$('#pause').hide();
	$('#startMenu').css('display', 'none');
	$('#header').css('display', 'block');
	initial();
	$('#resume').show();
	map.player.invincible = 5 * FPS;
	$('#timing').show();
	$('#soundOn').hide();
	$('#soundOff').hide();
	if(sound == 0){
	  $('#soundOn').show();
	}
	else{
		$('#soundOff').show();
	}
	draw();
	countDown(function() {
		map.isPlaying = true;
		game = setInterval(function(){
				update();
				collision();
				draw(); 
			}, 1000 / FPS);
		$('#pause').show();
		$('#resume').hide();
	});
	if(startNumber == 0){
	   var backgroundMusic = $('<audio loop="loop" src = "mp3/backgroundMusic.mp3" id ="bg"/>');
	   $('#header').prepend(backgroundMusic);
	   backgroundMusic[0].play();
	}
}

function countDown(callback) {

	var t = $('<div id="count-down"/>').text('Three');
	$('.items:first').prepend(startMusic);
	$('.items:first').append(t);
	t.fadeOut(1010, function() {
		t.text('Two');
		t.removeAttr('style');
		t.fadeOut(1010, function() {
			t.text('One');
			t.removeAttr('style');
			t.fadeOut(1010, function() {
				t.text('Go!');
				t.removeAttr('style');
				t.fadeOut(1010, function() {
					t.remove();
					callback();
				});
			});
		});
	});
}

function soundOff(){
	$('#bg').remove();
	$('#soundOn').hide();
	$('#soundOff').show();
	sound = 1;
	startNumber = 1;
}

function soundOn(){
	var backgroundMusic = $('<audio loop="loop" src = "mp3/backgroundMusic.mp3" id ="bg"/>');
	$('#header').prepend(backgroundMusic);
	backgroundMusic[0].play();
	$('#soundOff').hide();
	$('#soundOn').show();
	sound = 0;
}


function pause() {
	$('#pause').hide();
	$('#resume').show();
//	$('.cover').css('display', 'block');
	map.isPlaying = false;
	var divS = $('<div class="gamePrompt"/>');
	var playerScore = $('<h1/>').text('Paused');
	var buttonResume = $('<h2/>').append($('<a href="#"/>').text('Resume').one('click', resume));
	var buttonBackToStart = $('<h2/>').append($('<a href="#"/>').text('Main Menu').one('click', toMainMenu));
	divS.append(playerScore);
	divS.append(buttonResume);
	divS.append(buttonBackToStart);
	$('#prompt').append(divS).fadeIn();
	$('.cover').fadeIn();
	/*if (map.score < 100){
		document.getElementById("sentence").innerHTML = "你弱得让我无法直视！";
	} else{
		document.getElementById("sentence").innerHTML = "五体投地拜大神，撒花o（≧▽≦）o";
	}*/
	clearInterval(game);
	$('#bg').remove();
}	

function collision(){
	if (map.player.orbit >= map.orbitsNumber) {
		gameOver();
		return;
	}
	map.orbits[map.player.orbit].collision();
}

function resume() {
	clearInterval(game);
	$('.cover').fadeOut();
	$('#prompt').fadeOut(function() {
	$('.gamePrompt').remove();
	countDown(function() {
		map.isPlaying = true;
		$('#resume').removeAttr('style');
		$('#pause').css('display', 'block');
		game = setInterval(function(){
			update(); 
			draw(); 
			collision();
			}, 1000 / FPS); 
		});
	});
	var backgroundMusic = $('<audio loop="loop" src = "mp3/backgroundMusic.mp3" id ="bg"/>');
	$('#header').prepend(backgroundMusic);
	backgroundMusic[0].play();
}

function toMainMenu() {
	canvas.clearRect(-360, -360, 720, 720);
	$('#resume').removeAttr('style');
	$('#header').removeAttr('style');
	$('.cover').fadeOut();
	$('#prompt').hide();
	$('#startMenu').removeAttr('style');
	$('.gamePrompt').remove();
}

function restart() {
	$('.cover').fadeOut();
	$('#prompt').fadeOut(start);
}

function gameOver(){
	map.isPlaying = false;
	console.log(gameOver.caller);
	clearInterval(game);
	var divS = $('<div class="gamePrompt"/>');
	var playerScore = $('<h1/>').text(map.score + "分");
	var buttonReplay = $('<h2/>').append($('<a href="#"/>').text('Restart').one('click', restart));
	var buttonBackToStart = $('<h2/>').append($('<a href="#"/>').text('Main Menu').one('click', toMainMenu));
	var boomSound = $('<embed hidden = true autostart = true src = "mp3/collision.mp3"></embed>');
	playerScore.prepend(boomSound);
	divS.append(playerScore);
	divS.append(buttonReplay);
	divS.append(buttonBackToStart);
	if (map.score > localStorage.bestScore) {
		divS.append($('<div id="bestScore"/>').text('Best Score'));
		localStorage.bestScore = map.score;
	}
	$('#prompt').append(divS).fadeIn();
	$('.cover').fadeIn();
	$('#bg').remove();
};
