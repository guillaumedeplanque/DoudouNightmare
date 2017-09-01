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
  this.life = 3;
  this.score = 0;

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
    if (this.x == Math.round((this.canvasWidth - this.width) / 10) * 10 &&
      this.y >= this.canvasHeight / 2 - this.height + 10 &&
      this.y <= this.canvasHeight / 2 - this.height + 30) {
      this.x = 0
    } else {
      this.x = ((this.x + this.speed) + this.width > this.canvasWidth) ? this.x : this.x + this.speed
    }
    this.draw();
    this.updateFrame();
  }

  this.moveLeft = function() {
    this.srcY = this.trackLeft * this.height;
    this.ctx.clearRect(this.x, this.y, this.width, this.height)
    if (this.x == 0 && this.y >= this.canvasHeight / 2 - this.height + 10 &&
      this.y <= this.canvasHeight / 2 - this.height + 30) {
      this.x = Math.round((this.canvasWidth - this.width) / 10) * 10
    } else {
      this.x = (this.x - this.speed < 0) ? this.x : this.x - this.speed
    }
    this.draw();
    this.updateFrame();
  }

  this.moveBottom = function() {
    this.srcY = this.trackBottom * this.height;
    this.ctx.clearRect(this.x, this.y, this.width, this.height);
    if (this.y == Math.round((this.canvasHeight - this.height) / 10) * 10 &&
      this.x >= this.canvasWidth / 2 - 30 &&
      this.x <= this.canvasWidth / 2 - 5) {
      this.y = 0;
    } else {
      this.y = ((this.y + this.speed) + this.height > this.canvasHeight) ? this.y : this.y + this.speed
    }
    this.draw();
    this.updateFrame();
  }

  this.moveUp = function() {
    this.srcY = this.trackUp * this.height;
    this.ctx.clearRect(this.x, this.y, this.width, this.height);
    if (this.y == 0 && this.x >= this.canvasWidth / 2 - 30 && this.x <= this.canvasWidth / 2 - 5) {
      this.y = Math.round((this.canvasHeight - this.height) / 10) * 10
    } else {
      this.y = (this.y - this.speed < 0) ? this.y : this.y - this.speed
    }
    this.draw();
    this.updateFrame();
  }

  this.detectCollisionWithMonster = function(monster) {
    if (this.x + ((this.x * 5) / 100) < monster.x + monster.desiredLength  && this.x + this.width  > monster.x + ((monster.x * 5) / 100) &&
    this.y + ((this.y * 8) / 100) < monster.y + monster.desiredLength && this.y + this.height > monster.y + ((monster.y * 8) / 100)) {
      if (this.life > 0) {
        var life = document.getElementsByClassName('heart')
        var lifeContainer = document.getElementById('life');
        lifeContainer.removeChild(life[life.length - 1]);
        this.life = this.life - 1;
        return true;
      }
    } return false;
  }

  this.detectCollisionWithBonus = function(bonus) {
    if (this.x < bonus.x + bonus.width  && this.x + this.width  > bonus.x &&
    this.y < bonus.y + bonus.height && this.y + this.height > bonus.y) {
      bonus.destroy();
      var score = document.getElementById('score');
      this.score += 10;
      score.innerHTML = parseInt(score.innerHTML) + 10;
    }
  }

  this.reinitialize = function() {
    this.ctx.clearRect(this.x, this.y, this.width, this.height);
    this.x = 0;
    this.y = 0;
    this.draw();
  }
}
