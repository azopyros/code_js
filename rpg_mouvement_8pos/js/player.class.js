var Player = Class.create({
	init : function(id,posx,posy,color,direction,acceleration){
		this.id = id
		this.posx = posx;
		this.posy = posy;
		this.color = color;
		this.direction = direction;
		this.acceleration = acceleration;
	},
	display : function(){
		var div = _id("game_div");
		if(!_id("player")){
			var me = _cn("div",{id:this.id},{top:this.posy+"px",left:this.posx+"px","background-color":this.color},div);
			me.className = "player";
		}
		else{
			this.refresh();
		}
	},
	refresh : function(){
		var me = _id(this.id);
		if(!me){
			this.display();
		}
		else{
			me.css({top:this.posy+"px",left:this.posx+"px"});
			var dir = JSON.stringify(this.direction);
			var regFalse = /false/g;
			var regTrue = /true/g;
			var regRep = /[a-zA-Z"{}':,]/g;
			dir = dir.replace(regFalse,"0");
			dir = dir.replace(regTrue,"1");
			dir = dir.replace(regRep,"");
			dir = parseInt(dir,2);
			if(dir != 0){
				me.className = "player" + " dir"+dir;
			}
		}
	},
	move : function(){
		if(this.direction.top) this.posy -= this.acceleration;
		if(this.direction.right) this.posx += this.acceleration;
		if(this.direction.bottom) this.posy += this.acceleration;
		if(this.direction.left) this.posx -= this.acceleration;
	}
});