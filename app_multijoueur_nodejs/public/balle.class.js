/* Création de la classe Balle */
var Balle = function(id, color, x, y, parent){
	this.id = id;
	this.color = color;
	this.x = x;
	this.y = y;
	this.parent = parent;

	_log("Création d'une balle :");
	_log(this);
}

Balle.prototype.moveUp = function(){this.y--;};
Balle.prototype.moveDown = function(){this.y++;};
Balle.prototype.moveLeft = function(){this.x--;};
Balle.prototype.moveRight = function(){this.x++};

Balle.prototype.affiche = function(){
	_cn(
		"div",
		{id:"balle"+this.id, 'class':"balle"},
		{top:this.y+'px', left:this.x+'px', backgroundColor:this.color},
		document.getElementById(this.parent)
	);
};

Balle.prototype.update = function(){
	document.getElementById("balle" + this.id).deleteNode();
	this.affiche();
};

Balle.prototype.updateFromBalle = function(data){
	this.id = data.id;
	this.color = data.color;
	this.x = data.x;
	this.y = data.y;
	this.parent = data.parent;
	this.update();
};