function Bonus() {
  this.width = 32
  this.height = 32;

  var canvas = document.getElementById('bonus');
  var gameZone = document.getElementById('jeux');
  this.canvasWidth = gameZone.offsetWidth;
  this.canvasHeight = gameZone.offsetHeight;
  this.ctx = canvas.getContext('2d');

  this.x = 0;
  this.y = 0;

  /**
   * Fonction qui positionne le bonus aléatoirement et le redessine.
   */
  this.positionBonus = function() {
    this.x = Math.floor(Math.random() * (this.canvasWidth - this.width))
    this.y = Math.floor(Math.random() * (this.canvasHeight - this.height));
    this.draw();
  }

  /**
   * Dessine le cookie aux coordonnées x,y de l'objet Bonus
   */
  this.draw = function() {
    var image = new Image()
    image.src = './image_jeux/coockie.png'
    var self = this;
    image.onload = function() {
      self.ctx.drawImage(image, self.x, self.y, self.width, self.height)
    }
  }

  /**
   * Fonction qui nettoie le canvas aux coordonnées x,y de l'objet Bonus
   * pour signaler que le bonus est ramassé, puis le repositionne à des nouvelles coordonnées
   */
  this.destroy = function() {
    this.ctx.clearRect(this.x, this.y, this.width, this.height);
    this.positionBonus();
  }
}
