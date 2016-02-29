/*****************************************************************************************************************/
/*                                                                                                               */
/*                                Bibliothèque  MIW   version miw V  21/01/2016.js                               */
/*                                Réalisée dans le cadre des cours Javascript                                    */
/*                                De la Licence Activités et Techniques de Communication                         */
/*                                Mention Multimédia Internet Webmaster   (MIW)                                  */
/*                                IUT d'Aix-en-Provence Département GEA GAP                                      */
/*                                Site internet de la licence :     www.gap.univ-mrs.fr/miw                      */
/*                                                                                                               */
/*****************************************************************************************************************/

(function(){  // ief  ou fie fonction immédiatement exécutée.

/******************************************************************************************************/
/***********************  Les expressions régulières    ***********************************************/
/******************************************************************************************************/ 
		Reg = {											               // objet contenant des expressions régulières
			required :  /[^.*]/,
			alpha :     /^[a-z ._-]+$/i,
			alphanum :  /^[a-z0-9 ._-]+$/i,
			digitSign : /^[-+]?[0-9]+$/,
			digit:/^[0-9]+$/,
			nodigit : /^[^0-9]+$/,
			number : /^[-+]?\d*\.?\d+$/,
			email : /^[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
			phone : /^[\d\s().-]+$/,
			url : /^(http|https):\/\/[a-z0-9\-\.\/_]+\.[a-z]{2,3}$/i,
			tag : /<[^<>]+>/g ,                                        // pour rechercher toutes les occurences d'une balise HTML ou XML
            script : /(<script).+(<\/script>)/gi,                      // pour rechercher toutes les occurences de script
			isbn : /^(978|979)-\d-\d{5}-\d{3}-\d$/					   // code pour identifier un livre
            			
		};
/********************************************************************************************************/
/****************************************** Gestion des évènements *****************************************/
/********************************************************************************************************/
// L'objet Event regroupe les méthodes:
//   -  addEvent(noeud,evenement,fonction,capture)  permettant d'ajouter un écouteur d'évènement sur un noeud
//         @param1    noeud: noeud sur lequel est positionné l'écouteur
//         @param2   evenement : type d'évènement que l'on veut détecter exemple: click, change, load ( remarque il ne faut pas mettre "on" devant le nom de l'évènement
//         @param3   fonction : nom de la fonction exécutée si l'évènement se produit
//         @param4   capture :  Booléen: Si la valeur true est transmise, l'évènement sera géré dans le mode "capturing "(Modèle de Netscape). Si false est tranmis, cas le plus courant, l'évènement est géré avec le système bubbling (modèle de Microsoft). 
//
//   -  delEvent(noeud,evenement,fonction,capture) permettant de retirer un écouteur d'évènement sur un noeud
//         @param1   noeud: noeud pour lequel on veut supprimer un écouteur
//         @param2  evenement : type d'évènement 
//         @param3  fonction : nom de la fonction
//         @param4  capture   : Booléen indique le sens de la capture
//
//   - posX()  permettant de retourner la position X (abscisse) de la souris après l'évènement click
//         @return    position de la souris en pixels par rapport au  bord gauche de la fenêtre
//
//   - posY() permettant de retourner la position Y (ordonnée) de la souris après l'évènement click
//          @return    position de la souris en pixels par rapport au  bord supérieur de la fenêtre
/*********************************************************************************************************/

Events = {
	addEvent : function(noeud,evenement,fonction,capture){
	 		      noeud.addEventListener?
			      noeud.addEventListener(evenement,fonction,capture):
	      	      noeud.attachEvent?
			      noeud.attachEvent("on"+evenement,fonction):
			      noeud["on"+evenement] = fonction;				
				},
	delEvent : function(noeud,evenement,fonction,capture){
			      noeud.removeEventListener?
			      noeud.removeEventListener(evenement,fonction,capture):
	      	      noeud.detachEvent?
			      noeud.detachEvent("on"+evenement,fonction):
			      noeud["on"+evenement] = "";	
				},
	posX: 	function(e){
		        var posx = 0;
				if (!e) var e = window.event;
				if (e.pageX ) posx = e.pageX;
				else if (e.clientX )posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				return posx;
			},
	posY: function(e){
				var posy = 0;
				if (!e) var e = window.event;
				if (e.pageY) posy = e.pageY;
				else if (e.clientY) posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
				return posy;
			}		
}
		
/******************************************************************************************************/
/***********************  déterminer la largeur et la hauteur de la fenêtre   *************************/
/******************************************************************************************************/
		 Window ={
			 width: function(){
					if (window.innerWidth) return window.innerWidth // tous les navigateurs sauf IE
						else if (document.documentElement.clientWidth)
							return document.documentElement.clientWidth; // IE Strict
								else if (document.body.clientWidth)
									return document.body.clientWidth; // IE non strict
										else retun -1; // anciens navigateurs
				},
			height: function (){
					if (window.innerHeight) return window.innerHeight; // tous les navigateurs sauf IE
						else if (document.documentElement.clientHeight)
							return document.documentElement.clientHeight; // IE Strict
								else if (document.body.clientHeight)
									return document.body.clientHeight; // IE non strict
										else return -1; // anciens navigateurs
				}
		}
		
		
/***********************************************************************************************************/
/****************************************** Gestion de l'AJAX **********************************************/
/***********************************************************************************************************/

	ajax= {
		xhr: function(){  // création d'un requete HTTP en fonction du navigateur
		   var obj = null;
		   try { obj = new ActiveXObject("Microsoft.XMLHTTP");}
			 catch(Error) { try { obj = new ActiveXObject("MSXML2.XMLHTTP");}
			   catch(Error) { try { obj = new XMLHttpRequest();}
				  catch(Error) { alert(' Impossible de créer l\'objet XMLHttpRequest')}
							}
						  }
		   return  obj;
		},

		_:function(obj){
			var url = obj.url, data=obj.data, method=obj.method,beforeSend=obj.beforeSend,error=obj.error,complete=obj.complete,cache=obj.cache,username=obj.username,password=obj.password;
	
			if (data==null)   data="";
			
			if (method==null) method="get";
			
			if (cache==null) cache="no";			
			
            cache=(cache=="no")? "cache="+new Date().getTime():"";

			var req = new ajax.xhr();
			if (req!= null){
			    if (beforeSend) beforeSend(req);
				req.onreadystatechange= function(){
					if (this.readyState==this.DONE ){
						if ((this.status == 200 || this.status == 0 ) && complete) complete(this)
							   else  if ((this.status != 200 && this.status != 0)  && error) error(this);
					}
				}

				if (typeof(data)=="object")   {var dataTemp=[];_each(data,function(p,v){dataTemp.push(p+"="+encodeURIComponent(v))}); data = dataTemp.join("&");}		
	
				if (data == null ) data = cache 
				            else  if (cache!="") data = data +"&" + cache;
				
				if (method=="get" || method=="GET" ) {data=(data=="")?"":"?"+data;req.open(method,url+data,true,username,password); req.send(null);}
					else  if (method=="post" || method=="POST" ){req.open(method,url,true,username,password);req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");req.send(data);}
			}
		}
	};		
/******************************************************************************************************/
/***********************  Les classes : Création & héritage  ******************************************/
/******************************************************************************************************/					
				
		Class={
				create: function(proto){                // proto objet contenant le prototype de la nouvelle classe
						var newClass =  function() {          // newClass représente la nouvelle classe à créer
							   this.init && this.init.apply(this, arguments);
							   //si le prototype de la nouvelle classe contient la méthode init, celle-ci sera exécutée
						}; 
						newClass.prototype=proto;             // le prototype de la nouvelle classe pointe sur proto
						return newClass;	                  // on retourne la nouvelle classe 
				},

				extend : function( Mother, proto ){        // Mother classe mère qui sera étendu , proto objet contenant les nouveaux attributs et nouvelles méthodes de la classe fille
						var Child =  function() {               // Child représente la nouvelle classe fille
							   this.init && this.init.apply(this, arguments); 
							   //si le prototype de la nouvelle classe contient la méthode init, celle-ci est exécutée
						}; 
						
						var Sub=function(){};                  // Sub classe temporaire 
						Sub.prototype = Mother.prototype;      // le prototype de Sub pointe sur le prototype de la classe mère
						Child.prototype=new Sub();	           // la prototype de la classe Child est un objet du même tyme que la classe Mère
						Child.prototype.super=Mother.prototype;		// on ajoute au prototype de la classe fille un objet super qui pointe vers le prototype de la classe child	
						for( var i in proto ) {Child.prototype[i]=proto[i]};    // recopie de l'objet proto dans le prototype de la classe Child
						return Child;                          // on retourne la classe fille
				}
			}
			// exemples :
			// var Personne = Class.create({init:function(n,p){this.nom=n;this.prenom=p},affiche:function(){alert("Bonjour "+this.nom+"  "+this.prenom)}})
			// var p1 = new Personne("Dupont","Léo");// p1 instance de Personne
			// p1.affiche(); // affiche: Bonjour Dupont Lèo
			// var Prof = Class.extend(Personne,{init:function(n,p,m){this.super.init(n,p),this.matiere=m},affiche:function(){alert(this.nom+"  "+this.prenom+" enseigne la matière :" + this.matiere  )}})
			// var p2 = new Prof("Dupont","Léo","Français");	// p2 instance de Prof
			// p2.affiche(); // affiche Dupont Léo enseigne la matière : Français
			// p2.super.affiche(); // affiche Bonjour Dupont Lèo  on utilise alors la méthode affiche de la classe mère			

/******************************************************************************************************/
/***********************  Les Raccourcis   pour le DOM  ***********************************************/
/******************************************************************************************************/

		_id = function(id)   {return document.getElementById(id);};
		
		_=function(sCss){
		             if (document.querySelectorAll(sCss).length==1) { return document.querySelector(sCss);}
			         else return document.querySelectorAll(sCss);
			};
		
		
		_tn = function(n)    {return document.getElementsByTagName(n);};
		_n  = function(n)    {return document.getElementsByName(n);} ;  
		_cf = function ()    {return document.createDocumentFragment()}		
		
		_ct =  function(tx,nodeInsert)  { var t=document.createTextNode(tx);
										  if (nodeInsert) nodeInsert.appendChild(t);
										  return t
										};

		_ce = function(el,nodeInsert)   { var e= document.createElement(el);
										  if (nodeInsert) nodeInsert.appendChild(e);
										  return e
										};

		_cn = function(node,attribut,style,nodeInsert){                                        // pour créer un noeud avec des attributs et des styles ( attributs et style sont des objets )
				var n = _ce(node);
				n.attrib(attribut);
				n.css(style);
				if (nodeInsert) nodeInsert.appendChild(n);
				return n;
			}
			
		_dn = function(node){                                                                    // pour supprimer un noeud
				node.parentNode.removeChild(node);
			}
			

/******************************************************************************************************/
/*************   Raccourci pour parcourir et traiter les propriétés d'un objet  ***********************/
/******************************************************************************************************/		
		_each = function(o,f){                            // f est une fonction Callback c a d une  fonction qui sera définie au moment de l'appel de la fonction _each
				for (var i in o){f(i,o[i])}
			}
		
/******************************************************************************************************/
/***********************  Extension de toutes les classes avec la methode extend  *********************/
/******************************************************************************************************/				
		Object.prototype.extend=function(obj){  
									for( var i in obj){this[i] =obj[i]};
								};
								
/******************************************************************************************************/
/***********************  Extension de la clase String  ***********************************************/
/******************************************************************************************************/			
		String.prototype.extend({
			left : function(n){return this.substring(0,n)},
			right : function(n){return this.substring(this.length-n)},
			convertCss: function(){	
					var ch =this, reg1=/-[a-z]/gi, reg2=/-/g;
					if (ch.match(reg1)){
						for (var i = 0 ; i< ch.match(reg1).length; i++){
							 ch = ch.replace(ch.match(reg1)[i],ch.match(reg1)[i].toUpperCase())
						}
						ch = ch.replace(reg2,"")
					}
					return ch;
			},
			capitalize: function(){
					return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
			},
			trim: function(){
			        return this.replace(/(^\s*|\s*$)/g,"")
			}
		});
/******************************************************************************************************/
/***********************  Extension de la clase Array   ***********************************************/
/******************************************************************************************************/		
		
		Array.prototype.extend({
			merge : function(t){ 
					for (var i =0; i< t.length;i++){
						 this.push(t[i]);
					}
					return this
			}			
		});
/******************************************************************************************************/
/***********************  Extension de la clase Number  ***********************************************/
/******************************************************************************************************/		
		Number.prototype.extend({
			p : function(n){ return Math.pow(this,n)}
		});		
/******************************************************************************************************/
/***********************  Extension de la clase Node    ***********************************************/
/******************************************************************************************************/		
		Node.prototype.extend({
			changeId : function(val){      // permet de changer l'identifiant du noeud
					this.id=val;
					return this;
			},
			css : function(obj) {          // permet d'affecter au noeud les propriétés de style contenues dans l'objet obj
					for( var i in obj){
						this.style[i.convertCss()]=obj[i];
					};
					return this;
			},
			attrib :function(obj){        // permet d'affecter au noeud les attributs contenus dans l'objet obj
			            var n=this;       // n représente le noeud courant
						_each(obj,function(a,b){if(a=="readonly") a="readOnly";n[a]=b});
						return this;
			},
            deleteNode: function(){       // permet de supprimer un noeud
					this.parentNode.removeChild(this);
            },
			append : function(objStr){                    //  permet d'ajouter un noeud element ou un noeud texte au noeud
					if (typeof(objStr)== "string") { this.innerHTML += objStr }
						else { this.appendChild(objStr)}
					return this;
			},
			empty : function(){ this.innerHTML="";return this}		//Permet de vider le contenu d'un noeud	
		});	

				
})();

 
