window.addEventListener("load",init);

/* fonction d'initialisation au démarage de la page */
function init(){
	// Création d'un nouveau joueur
	var player1 = new Player("player1",250,250,"#f00",{top:false,right:false,bottom:false,left:false},1);
	player1.display();

	var key_pressed = [];

	var reg_key = {
		top : /38/,
		left : /37/,
		bottom : /40/,
		right : /39/
	}

	//ajout des touches de direction
	document.getElementsByTagName("body")[0].addEventListener("keypress",function(event){
		if(key_pressed.indexOf(event.keyCode) == -1)
			key_pressed.push(event.keyCode);
	});
	document.getElementsByTagName("body")[0].addEventListener("keyup", function(event){
		key_pressed.splice(key_pressed.indexOf(event.keyCode),1);
	});

	//boucle pour les touches directionnelles
	var boucle = setInterval(function(){
		var key_string = key_pressed.toString();
		for(var index in reg_key){
			if(index != "extend"){
				player1.direction[index] = reg_key[index].test(key_string);
			}
		}
		if(key_string != ""){
			player1.move();
		}
		player1.refresh();
	},24);
}
