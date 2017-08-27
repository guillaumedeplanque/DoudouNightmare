var playerCanvas = document.getElementById('character');
var monsterCanvas = document.getElementById('monster');
var bonusCanvas = document.getElementById('bonus');
var gameZone = document.getElementById('jeux');
playerCanvas.width = monsterCanvas.width = bonusCanvas.width = gameZone.clientWidth;
playerCanvas.height = monsterCanvas.height = bonusCanvas.height = gameZone.clientHeight;


var perso = new Personnage();
perso.draw();
var monsters = [];
monsters[0] = new Monster('left');
monsters[0].drawAtRandomPosition();
monsters[0].move();
monsters[1] = new Monster('right');
monsters[1].drawAtRandomPosition();
monsters[1].move();
var bonus = new Bonus();
bonus.positionBonus();
setInterval(function() {
  perso.detectCollisionWithMonster(monsters[0]);
  perso.detectCollisionWithMonster(monsters[1]);
  perso.detectCollisionWithBonus(bonus);
}, 500)
playerCanvas.addEventListener('keydown', function(e) {
  e.preventDefault();
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
});