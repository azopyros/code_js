<?php

if(isset($_GET['cp']) && !empty($_GET['cp']) && isset($_GET['ville']) && !empty($_GET['ville'])){
	$pdo = new PDO("mysql:host=localhost;dbname=test", "root");
	$req = null;
	if($_GET["modifByCP"] === "true"){
		$req = $pdo->prepare("UPDATE villes SET CP='".$_GET['cp']."' WHERE Ville ='".$_GET['ville']."'");
	}
	else{
		$req = $pdo->prepare("UPDATE villes SET Ville='".$_GET['ville']."' WHERE CP ='".$_GET['cp']."'");
	}
	$req->execute(array());
	var_dump($req);
}