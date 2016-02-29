var Case = Class.create({
	init : function(id, seq, bordures){
		this.id = id;
		this.seq = seq;
		this.bordures = bordures;
	},
	hasBordure : function(dir){
		var reg = new RegExp(dir);
		return reg.test(this.bordures);
	},
	removeBordure : function(dir){
		this.bordures = this.bordures.replace(dir,"");
	},
	getRandomBordure : function(){
		// renvoie un mur random, ou "" si pas de mur disponible.

		//si on a pas de bordure
		if(this.bordures == ""){
			return this.bordures;
		}
		var borduresPossible = this.bordures.split("");
		var mur = borduresPossible[_rand(0,borduresPossible.length-1)];
		return mur;
	},
	affiche: function(top, left, taillePixel, ctx){
		ctx.beginPath();      // Début du chemin
		if(this.hasBordure("t")){
			ctx.moveTo(left,top);
			ctx.lineTo(left+taillePixel,top);	
		}
		if(this.hasBordure("r")){
			ctx.moveTo(left+taillePixel,top);
			ctx.lineTo(left+taillePixel,top+taillePixel);	
		}
		if(this.hasBordure("b")){
			ctx.moveTo(left,top+taillePixel);
			ctx.lineTo(left+taillePixel,top+taillePixel);	
		}
		if(this.hasBordure("l")){
			ctx.moveTo(left,top);
			ctx.lineTo(left,top+taillePixel);	
		}
		ctx.stroke();
	}
});