var playerCanvas = document.getElementById('character');
var monsterCanvas = document.getElementById('monster');
var bonusCanvas = document.getElementById('bonus');
var gameZone = document.getElementById('jeux');
var startLevel1Button = document.getElementById('start1');
var startLevel2Button = document.getElementById('start2');
var startLevel3Button = document.getElementById('start3');
var endButton = document.getElementById('end');
playerCanvas.width = monsterCanvas.width = bonusCanvas.width = gameZone.clientWidth;
playerCanvas.height = monsterCanvas.height = bonusCanvas.height = gameZone.clientHeight;

function Game(playerCanvas) {
  this.levelTimer = 60000
  this.level = 1;
  this.player = null
  this.monsters = [];
  this.bonus = null;
  this.bindCharacterMovement = function(playerCanvas) {
    playerCanvas.focus();
    var self = this;
    playerCanvas.addEventListener('keydown', function(e) {
      e.preventDefault();
      switch(e.keyCode) {
        case 37:
          self.player.moveLeft();
          break;
        case 38:
          self.player.moveUp();
          break;
        case 39:
          self.player.moveRight();
          break;
        case 40:
          self.player.moveBottom();
          break;
      }
    });
  }
  this.createPlayer = function() {
    this.player = new Personnage()
    this.bindCharacterMovement(playerCanvas);
    this.player.draw();
  }
  this.createMonsters = function() {
    this.monsters.push(new Monster('left'))
    this.monsters.push(new Monster('right'))
    for (var i = 0; i < this.monsters.length; i++) {
      this.monsters[i].drawAtRandomPosition();
      this.monsters[i].move();
    }
  }
  this.createBonus = function() {
    this.bonus = new Bonus();
    this.bonus.positionBonus();
  }
  this.detectGameCollision = function() {
    var self = this;
    var detectionInterval = setInterval(function() {
      for (var i = 0; i < self.monsters.length; i++) {
        self.player.detectCollisionWithMonster(self.monsters[i]);
      }
      self.player.detectCollisionWithBonus(self.bonus)
      if (self.player.life === 0) {
        self.finishGame();
        clearInterval(detectionInterval)
      }
    }, 1000)
  }
  this.initGame = function() {
    var background = document.getElementById('background')
    var fond = document.getElementById('jeux')
    background.style.backgroundImage = "url('./image_jeux/the_cellar_bord.png')"
    fond.style.backgroundImage = "url('./image_jeux/the_cellar_fond.png')"
    this.createPlayer();
    this.createMonsters();
    this.createBonus();
    this.detectGameCollision();
  }
  this.startGame = function() {
    var self = this;
    var timer = document.getElementById('timer');
    var timerInterval = setInterval(function() {
      var minutes = Math.floor(self.levelTimer / 60000);
      var seconds = ((self.levelTimer % 60000) / 1000).toFixed(0);
      timer.innerHTML = seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds
      if (self.levelTimer - 1000 < 0 && self.player.life > 0) {
        clearInterval(timerInterval)
        self.level++;
        if (self.level == 2) {
          var background = document.getElementById('background')
          var fond = document.getElementById('jeux')
          background.style.backgroundImage = "url('./image_jeux/the_depths_bord.png')"
          fond.style.backgroundImage = "url('./image_jeux/the_depths_fond.png')"
          for (var i = 0; i < self.monsters.length; i++) {
            self.monsters[i].speed = 20
          }
          self.hideCanvas();
          startLevel2Button.style.display = 'block';
          startLevel2Button.addEventListener('click', function() {
            self.restartGame();
            playerCanvas.focus();
          })
        } else if (self.level == 3) {
          var background = document.getElementById('background')
          var fond = document.getElementById('jeux')
          background.style.backgroundImage = "url('./image_jeux/the_cathedral_bord.png')"
          fond.style.backgroundImage = "url('./image_jeux/the_cathedral_fond.png')"
          for (var i = 0; i < self.monsters.length; i++) {
            self.monsters[i].speed = 25
          }
          self.hideCanvas();
          startLevel3Button.style.display = 'block';
          startLevel3Button.addEventListener('click', function() {
            self.restartGame();
            playerCanvas.focus();
          })
        } else {
          self.finishGame();
        }
      } else if (self.levelTimer == 0 && self.player.life == 0) {
        clearInterval(timerInterval)
      } else {
        self.levelTimer -= 1000
      }
    }, 1000)
  }
  this.restartGame = function() {
    this.hideButtons();
    this.showCanvas();
    this.player.reinitialize();
    for (var i = 0; i < this.monsters.length; i++) {
      this.monsters[i].reset();
      this.monsters[i].drawAtRandomPosition();
    }
    this.bonus.destroy();
    this.levelTimer = 60000;
    this.startGame();
  }
  this.finishGame = function() {
    this.hideCanvas();
    this.levelTimer = 0;
    endButton.style.display = 'block'
  }
  this.hideCanvas = function() {
    playerCanvas.style.display = 'none'
    monsterCanvas.style.display = 'none'
    bonusCanvas.style.display = 'none'
  }
  this.showCanvas = function() {
    playerCanvas.style.display = 'block'
    monsterCanvas.style.display = 'block'
    bonusCanvas.style.display = 'block'
  }
  this.hideButtons = function() {
    startLevel1Button.style.display = 'none'
    startLevel2Button.style.display = 'none'
    startLevel3Button.style.display = 'none'
  }
}

var game = new Game(playerCanvas);
startLevel1Button.addEventListener('click', function() {
  startLevel1Button.style.display = 'none'
  game.initGame();
  game.startGame();
})


