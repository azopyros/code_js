var Draggable = Class.create({
	init : function(id, coords, color, sizes){
		this.id = id;
		this.coords = coords;
		this.color = color;
		this.sizes = sizes;
		this.taken = false;
		this.moving = false;
		this.coordsMouseOnIt = {x:0,y:0};
		if(!_id(id)){
			this.element = _cn("div",{id:this.id},{'position':"relative",'backgroundColor':this.color,'zIndex':1,'opacity':0.8},_id('container'));
			_id(this.id).style.top = this.coords.y+"px";
			_id(this.id).style.left =this.coords.x+"px";
			_id(this.id).style.height = this.sizes.y+"px";
			_id(this.id).style.width =this.sizes.x+"px";
		}
		else{
			this.element = _id(this.id);
		}
		//this.parent = _id("container");

		var that = this;
		this.element.addEventListener("mousedown",function(event){
			that.taken = true;
			that.element.style.opacity = 0.4;
			that.element.style.zIndex = 20;
			that.coordsMouseOnIt.x = event.clientX - parseInt(this.style.left);
			that.coordsMouseOnIt.y = event.clientY - parseInt(this.style.top);
		});
		window.addEventListener("mouseup",function(event){
			that.taken = false;
			that.element.style.opacity = 0.8;
			that.element.style.zIndex = 1;
		});
		window.addEventListener("mousemove",function(event){
			if(that.taken){
				//if()
				that.coords.x = event.clientX-that.coordsMouseOnIt.x;
				that.coords.y = event.clientY-that.coordsMouseOnIt.y;
				that.visualUpdate();
			}
		});
	},
	visualUpdate : function(){
		this.element.style.top = this.coords.y+"px";
		this.element.style.left =this.coords.x+"px";
	}
});

var start = function(){
	var drag1 = new Draggable("drag1",{x:50,y:20},"#00FF00",{x:20,y:50});
	var drag2 = new Draggable("drag2",{x:10,y:100},"#FFFF00",{x:70,y:10});
	var drag3 = new Draggable("drag4",{x:150,y:20},"#00FFFF",{x:40,y:60});
	var drag4 = new Draggable("drag5",{x:50,y:120},"#FF00FF",{x:5,y:130});
}