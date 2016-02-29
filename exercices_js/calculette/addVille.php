<?php

if(isset($_GET['cp']) && !empty($_GET['cp']) && isset($_GET['ville']) && !empty($_GET['ville'])){
	$pdo = new PDO("mysql:host=localhost;dbname=test", "root");
	$req = $pdo->prepare("INSERT INTO Villes(CP,Ville) VALUES ('".$_GET['cp']."','".$_GET['ville']."')");
	$req->execute(array());
}