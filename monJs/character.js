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

	this.canvas = document.getElementById('canvas');
	var gameZone = document.getElementById('jeux');
	this.canvas.width = gameZone.offsetWidth;
	this.canvas.height = gameZone.offsetHeight;
	this.ctx = canvas.getContext('2d');
	this.character = new Image();
	this.character.src = './perso_principal/girl_principal2.png'

	this.updateFrame = function() {
		this.currentFrame = ++this.currentFrame % this.frameCount;
		this.srcX = this.currentFrame * this.width;
	}

	this.draw = function() {
		this.ctx.drawImage(this.character, this.srcX, this.srcY, this.width, this.height, this.x, this.y, this.width, this.height)
	}

	this.moveRight = function() {
		this.srcY = this.trackRight * this.height;
		this.ctx.clearRect(this.x, this.y, this.width, this.height)
		this.x = ((this.x + this.speed) + this.width > this.canvas.width) ? this.x : this.x + this.speed
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
		this.y = ((this.y + this.speed) + this.height > this.canvas.height) ? this.y : this.y + this.speed
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
}

var perso = new Personnage();
perso.draw();
perso.canvas.addEventListener('keydown', function(e) {
  switch(e.keyCode) {
  	case 37:
  	  perso.moveLeft();
  	  break;
  	case 38:
  	  perso.moveUp();
  	  break;
    case 39:
      perso.moveRight();
      break;
    case 40:
      perso.moveBottom();
      break;
  }
})