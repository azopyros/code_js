<?php
//header('Content-type: text/text');
if(isset($_GET['dep']) && !empty($_GET['dep'])){
	$db = new PDO("mysql:host=localhost;dbname=meteo", "root");
	$sql = $db->prepare("SELECT idVille, nomVille FROM villes WHERE numeroDep = ?");
	$sql->execute(array($_GET['dep']));
	$res = $sql->fetchall(PDO::FETCH_ASSOC);
	$temp = array();
	foreach ($res as $value) {
		$temp[]=$value;
	}
	echo json_encode($res);

}
else{
	$db = new PDO("mysql:host=localhost;dbname=meteo", "root");
	$sql = $db->prepare("SELECT numeroDep, nomDep FROM departements");
	$sql->execute(array());
	$res = $sql->fetchall(PDO::FETCH_ASSOC);
	$temp = array();
	foreach ($res as $value) {
		$temp[]=$value;
	}
	echo json_encode($res);
}