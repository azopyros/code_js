var Plateau = Class.create({
	init : function(taille, ctx){
		//vérification des paramètres
		if(!taille || !Reg.number.test(taille) || taille <= 0){
			throw "taile passée en paramètre incorrecte : " + taille;
		}

		//taille du plateau (x ou y)
		this.taille = taille;

		this.ctx = ctx;

		//creation du tableau avec en taille le nombre de cases qu'il y aura dans le tableau
		this.cases = new Array(this.taille * this.taille);

		//création du tableau de séquence
		this.sequence = new Array(this.taille * this.taille);

		//remplissage du tableau avec des cases où toutes les bordures sont bloquées
		// remplissage initiale de la séquence
		for(var index = 0; index<this.cases.length; index ++){
			this.cases[index] = new Case(index, index, "tblr");
			this.sequence[index] = [this.cases[index]];
		}

		//création du joueur
		//premier 0 pour le mode solo.
		this.joueur = new Joueur(0, _rand(0,this.taille*this.taille-1));

		//création du labyrinthe aléatoire
		this.random();

	},
	random : function(){
		/* Creation des variables*/

		// nombre d'itérations maximales
		var compteur = 0;
		// case aléatoire choisie sur le plateau
		var caseSel;
		//mur aléatoire choisi sur la case
		var mur; 
		//case adjacente à la case choisie sur le plateau
		var caseAdj = false; 

		/* boucle de conception */
		while(compteur++ < this.taille * this.taille - 1){
			do{
				do{
					//selection d'une case
					caseSel = this.cases[_rand(0,this.taille*this.taille-1)];

					//selection d'un mur
					mur = caseSel.getRandomBordure(this);
				}
				while(mur == "");

				//selection de la case adjacente
				caseAdj = this.getCaseAdjacente(caseSel,mur);

				/*test*/
				//if(cpt == 20) {throw ""};
			}
			while(!caseAdj || caseAdj.seq == caseSel.seq);
			//ici, les deux cases ne sont pas reliées.
			//on change les numéros de séquence de la deuxième séquence

			var seqCaseAdj = caseAdj.seq;

			this.sequence[seqCaseAdj].forEach(function(elt, index){
				elt.seq = caseSel.seq;
			});
			//on les ajoute au tableau correspondant à la première sequence

			//cause out of memory
			//this.sequence[caseSel.seq].merge(this.sequence[caseAdj.seq]);
			this.sequence[caseSel.seq] = this.sequence[caseSel.seq].concat(this.sequence[seqCaseAdj]);

			// on vide la tableau de la deuxième séquence
			this.sequence[seqCaseAdj] = [];

			//on supprime les barrières
			caseSel.removeBordure(mur);
			caseAdj.removeBordure(this.getDirInverse(mur));		
		}
	},
	getCaseAdjacente : function(caseSel, mur){
		var caseAdj = false;
		if(mur == "t" && caseSel.id >= this.taille){
			caseAdj = this.cases[caseSel.id-this.taille];
		}
		if(mur == "r" && ((caseSel.id+1) % this.taille) != 0){
			caseAdj = this.cases[caseSel.id+1];
		}
		if(mur == "b" && caseSel.id < (this.taille*this.taille-this.taille)){
			caseAdj = this.cases[caseSel.id+this.taille];
		}
		if(mur == "l" && (caseSel.id % this.taille) !=0){
			caseAdj = this.cases[caseSel.id-1];
		}
		
		return caseAdj;
	},
	getDirInverse : function(mur){
		switch(mur){
			case "t": return "b"; break;
			case "r": return "l"; break;
			case "b": return "t"; break;
			case "l": return "r"; break;
		}
	},
	affiche : function(div){
		var taillePixel = 32;
		div.css({width:taillePixel*this.taille + "px", height:taillePixel*this.taille+"px"});
		for(var index =0; index<this.cases.length; index ++){
			var top = Math.floor(index/this.taille) * taillePixel;
			var left = index%this.taille * taillePixel;
			this.cases[index].affiche(top,left,taillePixel,this.ctx);
			/*var divC = _cn("div",{id:"case"+index},{top:top+"px", left:left+"px"},div);
			divC.className = "case case"+this.cases[index].bordures;*/
		}
		var top = Math.floor(this.cases[this.joueur.idCase].id/this.taille)*taillePixel;
		var left = (this.cases[this.joueur.idCase].id%this.taille) * taillePixel;
		divJoueur = _cn("div",{id:"joueur"+this.joueur.id},{top:top+"px", left:left+"px"},div);

	},
	moveJoueur : function(joueur, dir){
		var taillePixel = 32;
		if(dir && !this.cases[joueur.idCase].hasBordure(dir)){
			joueur.idCase = this.getCaseAdjacente(this.cases[joueur.idCase], dir).id;
		}
		var top = Math.floor(this.cases[joueur.idCase].id/this.taille)*taillePixel;
		var left = (this.cases[joueur.idCase].id%this.taille) * taillePixel;
		_id("joueur"+joueur.id).css({top:top+"px", left:left+"px"});
	}
});