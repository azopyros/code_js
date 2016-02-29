/* ******************************* */
/* Creation d'une application test */
/* ******************************* */

var verbose = true;

var log = function(n){
	if(verbose)
		console.log(n);
}

var app = require('express')(),

    server = require('http').createServer(app),

    io = require('socket.io').listen(server),

    UUID =  require('node-uuid'),

    fs = require('fs');

var balles = {};

// Chargement de la page index.html

app.get('/', function (req, res) {

  res.sendfile(__dirname + '/index.html');

});

app.get('/public/*',
	function(req, res){
		var file = req.params[0];
		res.sendfile(__dirname + '/public/' + file);
	}
	);

io.sockets.on('connection', function (client, pseudo) {
	log("connection d'un client");

	client.userid = UUID();
	log(client.userid);

	client.emit('onconnected', { id: client.userid, balles: balles } );

	client.on('disconnect', function(){
		log("un client s'est déconnecté : " + client.userid);
		delete balles[client.userid];
		client.broadcast.emit('disconnection', { id : client.userid});
	});

	client.on('maBalle', function(data){
		log("un client nous envoie sa balle");
		log(data);
		balles[data.id] = data;
		log("il est ajouté aux balles");
		log(balles);
		client.broadcast.emit('nouveauJoueur', data);
	});

	client.on('move', function(data){
		log("un client viens de bouger !");
		balles[data.id] = data;
		client.broadcast.emit('update', data);
	});

    

});


server.listen(8080);