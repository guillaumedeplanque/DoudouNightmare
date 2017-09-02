function Monster(gamePosition) {
  this.spriteWidth = 132;
  this.spriteHeight = 176;
  this.spriteRows = 4;
  this.spriteCols = 3;

  this.trackRight = 1;
  this.trackLeft = 3;
  this.trackBottom = 0;
  this.trackUp = 2;

  this.width = this.spriteWidth / this.spriteCols;
  this.height = this.spriteHeight / this.spriteRows;

  this.desiredLength = 64;

  this.currentFrame = 0;
  this.frameCount = 3;

  this.srcX = 0;
  this.srcY = 0;

  this.speed = 15;

  var canvas = document.getElementById('monster');
  var gameZone = document.getElementById('jeux');
  this.canvasWidth = gameZone.offsetWidth;
  this.canvasHeight = gameZone.offsetHeight;
  this.ctx = canvas.getContext('2d');


  this.x = (gamePosition === 'left') ? 0 : this.canvasWidth / 2;
  this.y = 0;
  this.minX = (gamePosition === 'left') ? 0 : this.canvasWidth / 2;
  this.maxX = (gamePosition === 'left') ? this.canvasWidth / 2 : this.canvasWidth;

  /**
   * Fonction qui update la position de la frame suivante selon le déplacement du personnage.
   */
  this.updateFrame = function() {
    this.currentFrame = ++this.currentFrame % this.frameCount;
    this.srcX = this.currentFrame * this.width;
  }

  /**
   * Initialise les coordonnées x,y d'un monstre à des valeurs aléatoires.
   */
  this.drawAtRandomPosition = function() {
    this.x = Math.floor(Math.random() * (this.canvasWidth / 2 - this.desiredLength)) + this.minX;
    this.y = Math.floor(Math.random() * (this.canvasHeight - this.desiredLength));
    this.draw();
  }

  /**
   * Dessine la frame courante du personnage aux coordonnées x,y données.
   */
  this.draw = function() {
    var image = new Image()
    image.src = './monstre_jeux/grosZombie.png'
    var self = this;
    image.onload = function() {
      self.ctx.drawImage(image, self.srcX, self.srcY, self.width, self.height, self.x, self.y, self.desiredLength, self.desiredLength)
    }
  }

  /**
   * Déplacement à droite du personnage : nettoyage du canvas aux anciennes coordonnées,
   * vérification si le personnage a atteint le bord droit de la zone de jeu pour l'empêcher de sortir,
   * puis mise à jour de la frame et dessin sur le canvas.
   */
  this.moveRight = function() {
    this.srcY = this.trackRight * this.height;
    this.ctx.clearRect(this.x, this.y, this.desiredLength, this.desiredLength)
    this.x = ((this.x + this.speed) + this.desiredLength > this.maxX) ? this.maxX : this.x + this.speed
    this.draw();
    this.updateFrame();
  }

  /**
   * Déplacement à gauche du personnage : nettoyage du canvas aux anciennes coordonnées,
   * vérification si le personnage a atteint le bord gauche de la zone de jeu pour l'empêcher de sortir,
   * puis mise à jour de la frame et dessin sur le canvas.
   */
  this.moveLeft = function() {
    this.srcY = this.trackLeft * this.height;
    this.ctx.clearRect(this.x, this.y, this.desiredLength, this.desiredLength)
    this.x = (this.x - this.speed < this.minX) ? this.minX : this.x - this.speed
    this.draw();
    this.updateFrame();
  }

  /**
   * Déplacement en bas du personnage : nettoyage du canvas aux anciennes coordonnées,
   * vérification si le personnage a atteint le bord bas de la zone de jeu pour l'empêcher de sortir,
   * puis mise à jour de la frame et dessin sur le canvas.
   */
  this.moveBottom = function() {
    this.srcY = this.trackBottom * this.height;
    this.ctx.clearRect(this.x, this.y, this.desiredLength, this.desiredLength);
    this.y = ((this.y + this.speed) + this.desiredLength > this.canvasHeight) ? this.y : this.y + this.speed
    this.draw();
    this.updateFrame();
  }

  /**
   * Déplacement en haut du personnage : nettoyage du canvas aux anciennes coordonnées,
   * vérification si le personnage a atteint le bord haut de la zone de jeu pour l'empêcher de sortir,
   * puis mise à jour de la frame et dessin sur le canvas.
   */
  this.moveUp = function() {
    this.srcY = this.trackUp * this.height;
    this.ctx.clearRect(this.x, this.y, this.desiredLength, this.desiredLength);
    this.y = (this.y - this.speed < 0) ? this.y : this.y - this.speed
    this.draw();
    this.updateFrame();
  }

  /**
   * Déplacement aléatoire d'un monstre. Un monstre initialisé en "left" ne pourra se déplacer que dans la partie
   * gauche de la zone de jeu, et un monstre initialisé en "right" ne pourra se déplacer que dans la partie droite
   * de la zone de jeu.
   * A chaque intervalle, on tire un nombre aléatoire pour déterminer la direction, puis un autre nombre
   * aléatoire pour déterminer le nombre de pas.
   * Lors de la collision avec un mur, la fonction se ré-appelle pour changer de direction.
   */
  this.move = function() {
    var self = this
    var directions = ['up', 'down', 'left', 'right']
    var random = Math.floor(Math.random() * 4)
    var cpt = 0;
    var numberOfMovement = Math.floor(Math.random() * 15);
    var interval = setInterval(function() {
      if (cpt++ < numberOfMovement) {
        switch(directions[random]) {
          case 'up' :
            if (self.y - self.speed < 0) {
              clearInterval(interval);
              self.move()
            } else {
              self.moveUp();
            }
            break;
          case 'down' :
            if ((self.y + self.speed) + self.desiredLength > self.canvasHeight) {
              clearInterval(interval);
              self.move()
            } else {
              self.moveBottom();
            }
            break;
          case 'left' :
            if (self.x  - self.speed < self.minX) {
              clearInterval(interval);
              self.move();
            } else {
              self.moveLeft();
            }
            break;
          case 'right' :
            if ((self.x + self.speed) + self.desiredLength > self.maxX) {
              clearInterval(interval);
              self.move();
            } else {
              self.moveRight();
            }
            break;
          default :
            break;
        }
      } else {
        clearInterval(interval)
        self.move();
      }
    }, 250)
  }

  /**
   * Fonction de remise à zéro des coordonnées du monstre.
   */
  this.reset = function() {
    this.ctx.clearRect(this.x, this.y, this.desiredLength, this.desiredLength);
  }
}
