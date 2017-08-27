function Personnage() {
	this.spriteWidth = 304;
	this.spriteHeight = 296;
	this.spriteRows = 4;
	this.spriteCols = 8;

	this.trackRight = 0;
	this.trackLeft = 3;
	this.trackBottom = 1;
	this.trackUp = 2;

	this.width = this.spriteWidth / this.spriteCols;
	this.height = this.spriteHeight / this.spriteRows;

	this.currentFrame = 0;
	this.frameCount = 8;

	this.x = 0;
	this.y = 0;

	this.srcX = 0;
	this.srcY = 0;

	this.speed = 10;

	var canvas = document.getElementById('character');
	var gameZone = document.getElementById('jeux');
	this.canvasWidth = gameZone.offsetWidth;
	this.canvasHeight = gameZone.offsetHeight;
	this.ctx = canvas.getContext('2d');

	this.updateFrame = function() {
		this.currentFrame = ++this.currentFrame % this.frameCount;
		this.srcX = this.currentFrame * this.width;
	}

	this.draw = function() {
		var image = new Image()
		image.src = './perso_principal/girl_principal2.png'
		var self = this;
		image.onload = function() {
			self.ctx.drawImage(image, self.srcX, self.srcY, self.width, self.height, self.x, self.y, self.width, self.height)
		}
	}

	this.moveRight = function() {
		this.srcY = this.trackRight * this.height;
		this.ctx.clearRect(this.x, this.y, this.width, this.height)
		this.x = ((this.x + this.speed) + this.width > this.canvasWidth) ? this.x : this.x + this.speed
		this.draw();
		this.updateFrame();
	}

	this.moveLeft = function() {
		this.srcY = this.trackLeft * this.height;
		this.ctx.clearRect(this.x, this.y, this.width, this.height)
		this.x = (this.x - this.speed < 0) ? this.x : this.x - this.speed
		this.draw();
		this.updateFrame();
	}

	this.moveBottom = function() {
		this.srcY = this.trackBottom * this.height;
		this.ctx.clearRect(this.x, this.y, this.width, this.height);
		this.y = ((this.y + this.speed) + this.height > this.canvasHeight) ? this.y : this.y + this.speed
		this.draw();
		this.updateFrame();
	}

	this.moveUp = function() {
		this.srcY = this.trackUp * this.height;
		this.ctx.clearRect(this.x, this.y, this.width, this.height);
		this.y = (this.y - this.speed < 0) ? this.y : this.y - this.speed
		this.draw();
		this.updateFrame();
	}

	this.detectCollisionWithMonster = function(monster) {
		if (this.x < monster.x + monster.desiredLength  && this.x + this.width  > monster.x &&
		this.y < monster.y + monster.desiredLength && this.y + this.height > monster.y) {
			console.log('Monster touched')
		}
	}

	this.detectCollisionWithBonus = function(bonus) {
		if (this.x < bonus.x + bonus.width  && this.x + this.width  > bonus.x &&
		this.y < bonus.y + bonus.height && this.y + this.height > bonus.y) {
			bonus.destroy();
		}
	}
}