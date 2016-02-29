_id = function(id){return document.getElementById(id);}

/* création d'un objet global */
global = {
	map : null, //map google
	start : null, //string du point de départ
	end : null, //string du point d'arrivée
	waypoints : [], //array of string, for the different waypoints
	directionsService : null, //google's object
	directionsDisplay : null, //google's object
	totalDistance : 0, //distance totale;
	geocoder : null //google's object
}

/* fonction d'initialisation, lancée au chargement de la page */
init = function(event){
	/* création de la carte centrée sur Aix Marseille */
	global.map = new google.maps.Map(document.getElementById('map'), {
	    zoom: 7,
	    center: {lat: -24.345, lng: 134.46}  // Australia.
	  });

	/* création des objets de google */
	global.geocoder = new google.maps.Geocoder();
	global.directionsService = new google.maps.DirectionsService;
	global.directionsDisplay = new google.maps.DirectionsRenderer({
		map: global.map
	});

	global.directionsDisplay.addListener('directions_changed', function() {
		computeTotalDistance(global.directionsDisplay.getDirections());
	});

	/* création des event listener */
	_id("inputDepart").addEventListener("blur", function(event){
		global.start = this.value;
		if(global.start != null && global.end != null){
			displayRoute();
		}
		else{
			setCenter(this.value);
		}
	});

	_id("inputArrivee").addEventListener("blur", function(event){
		global.end = this.value;
		if(global.start != null && global.end != null){
			displayRoute();
		}
		else{
			setCenter(this.value);
		}
	});

	_id("boutonAjoutEtape").addEventListener("click", function(event){
		var divWaypoint = this.parentElement;
		var newWaypoint = document.createElement("div");
		newWaypoint.className = "waypoint";
		var inputWaypoint = document.createElement("input");
		inputWaypoint.type="text";
		inputWaypoint.className = "inputWaypoint";
		inputWaypoint.addEventListener("blur",function(event){
			setUpWaypoint();
		});
		newWaypoint.appendChild(inputWaypoint);
		var boutonSupprWaypoint = document.createElement("button");
		boutonSupprWaypoint.type="button";
		boutonSupprWaypoint.innerHTML = "X";
		boutonSupprWaypoint.addEventListener("click",function(event){
			var div = this.parentElement;
			div.parentElement.removeChild(div);
			setUpWaypoint();
		});
		newWaypoint.appendChild(boutonSupprWaypoint);
		divWaypoint.appendChild(newWaypoint);
	});

	setCenter("Gap, FR");
};

/* fonction d'affichage de la route allant de start à end, en passant par chaque waypoint */
displayRoute = function(){
	var options = {
		origin: global.start,
		destination: global.end,
		waypoints: global.waypoints,
		travelMode: google.maps.TravelMode.DRIVING,
		avoidTolls: true
	}

	global.directionsService.route(options, function(response, status) {
		if (status === google.maps.DirectionsStatus.OK) {
			global.directionsDisplay.setDirections(response);
		} else {
			var options = {
				origin: global.start,
				destination: global.end,
				travelMode: google.maps.TravelMode.DRIVING,
				avoidTolls: true
			}

			global.directionsService.route(options, function(response, status) {
				if (status === google.maps.DirectionsStatus.OK) {
					global.directionsDisplay.setDirections(response);
				} else {
					console.log('Could not display directions due to: ' + status);
				}
			});
		}
	});
};

/* remplit correctement le tableau global.waypoints avec les valeurs des inputs */
setUpWaypoint = function(){
	global.waypoints = [];
	var inputs = document.getElementsByClassName("inputWaypoint");
	for(var i = 0; i<inputs.length; i++){
		global.waypoints.push({location:inputs[i].value});
	}
	displayRoute();
};

/* calcul la distance totale */
computeTotalDistance = function(result){
	var total = 0;
	var myroute = result.routes[0];
	for (var i = 0; i < myroute.legs.length; i++) {
		total += myroute.legs[i].distance.value;
	}
	global.totalDistance = total / 1000;
	//document.getElementById('total').innerHTML = total + ' km';
	console.log(global.totalDistance);
}

/* met la map centré à l'adress passée en param*/
setCenter = function(centre){
	global.geocoder.geocode( { 'address': centre}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			global.map.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: global.map,
				position: results[0].geometry.location
			});
		} else {
			console.log("Geocode was not successful for the following reason: " + status);
		}
	});
}

window.addEventListener("load",init);