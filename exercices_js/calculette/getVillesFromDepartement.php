<?php

if(isset($_GET['cp']) && !empty($_GET['cp'])){
	$pdo = new PDO("mysql:host=localhost;dbname=test", "root");
	$req = $pdo->prepare("SELECT CP, Ville FROM villes WHERE CP LIKE '".$_GET["cp"]."%'");
	$req->execute(array());
	$res = $req->fetchAll();
	echo json_encode($res);
}