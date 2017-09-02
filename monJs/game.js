var playerCanvas = document.getElementById('character');
var monsterCanvas = document.getElementById('monster');
var bonusCanvas = document.getElementById('bonus');
var gameZone = document.getElementById('jeux');
var startLevel1Screen = document.getElementById('start1');
var startLevel2Screen = document.getElementById('start2');
var startLevel3Screen = document.getElementById('start3');
var endScreen = document.getElementById('end');
playerCanvas.width = monsterCanvas.width = bonusCanvas.width = gameZone.clientWidth;
playerCanvas.height = monsterCanvas.height = bonusCanvas.height = gameZone.clientHeight;

function Game(playerCanvas) {
  this.levelTimer = 60000
  this.level = 1;
  this.player = null
  this.monsters = [];
  this.bonus = null;

  /**
   * Fonction qui assigne l'événement de déplacement au clavier pour le personnage.
   */
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

  /**
   * Création du personnage.
   */
  this.createPlayer = function() {
    this.player = new Personnage()
    this.bindCharacterMovement(playerCanvas);
    this.player.draw();
  }

  /**
   * Création des monstres.
   */
  this.createMonsters = function() {
    this.monsters.push(new Monster('left'))
    this.monsters.push(new Monster('right'))
    for (var i = 0; i < this.monsters.length; i++) {
      this.monsters[i].drawAtRandomPosition();
      this.monsters[i].move();
    }
  }

  /**
   * Création du bonus.
   */
  this.createBonus = function() {
    this.bonus = new Bonus();
    this.bonus.positionBonus();
  }

  /**
   * Initialisation des détections entre le personnage et les monstres, et entre le personnage et le bonus
   */
  this.detectGameCollision = function() {
    var self = this;
    var detectionMonsterInterval = setInterval(function() {
      for (var i = 0; i < self.monsters.length; i++) {
        self.player.detectCollisionWithMonster(self.monsters[i]);
      }
      if (self.player.life === 0) {
        self.finishGame();
        clearInterval(detectionMonsterInterval)
      }
    }, 1000)
    var detectionBonusInterval = setInterval(function() {
      self.player.detectCollisionWithBonus(self.bonus)
      if (self.player.life === 0) {
        self.finishGame();
        clearInterval(detectionBonusInterval)
      }
    }, 500)
  }

  /**
   * Création du premier niveau, du personnage, des monstres, du bonus et initialisation des collisions.
   */
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

  /**
   * Fonction gérant le timer du jeu. A la fin de celui-ci, si le joueur a encore une ou plusieurs vies,
   * le jeu change de niveau. Si celui-ci n'a plus de vie ou si il a atteint la fin du 3e niveau, chargement de l'écran de fin.
   */
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
          startLevel2Screen.style.display = 'block';
          startLevel2Screen.addEventListener('click', function() {
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
          startLevel3Screen.style.display = 'block';
          startLevel3Screen.addEventListener('click', function() {
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

  /**
   * Replacement du personnage aux coordonnées de départ, placement aléatoire des monstres et
   * du bonus. Remise à 1:00 du compteur.
   */
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

  /**
   * Appel de l'écran de fin du jeu.
   */
  this.finishGame = function() {
    this.hideCanvas();
    this.levelTimer = 0;
    endScreen.style.display = 'block';
    var finalScore = document.getElementById('final-score');
    finalScore.innerHTML = 'Score: ' + this.player.score;
  }

  /**
   * Helper permettant de cacher les canvas de jeu.
   */
  this.hideCanvas = function() {
    playerCanvas.style.display = 'none'
    monsterCanvas.style.display = 'none'
    bonusCanvas.style.display = 'none'
  }

  /**
   * Helper permettant d'afficher les canvas de jeu.
   */
  this.showCanvas = function() {
    playerCanvas.style.display = 'block'
    monsterCanvas.style.display = 'block'
    bonusCanvas.style.display = 'block'
  }

  /**
   * Helper permettant de cacher les interstitiels.
   */
  this.hideButtons = function() {
    startLevel1Screen.style.display = 'none'
    startLevel2Screen.style.display = 'none'
    startLevel3Screen.style.display = 'none'
  }
}

var cookies = document.getElementsByClassName('cookie');
for (var i = 0; i < cookies.length; i++) {
  cookies[i].addEventListener('mouseover', function() {
    this.src = "./image_jeux/coockie_mange.png"
  });
  cookies[i].addEventListener('mouseout', function() {
    this.src = "./image_jeux/coockie.png"
  })
}

var game = new Game(playerCanvas);
startLevel1Screen.addEventListener('click', function() {
  startLevel1Screen.style.display = 'none'
  game.initGame();
  game.startGame();
})


