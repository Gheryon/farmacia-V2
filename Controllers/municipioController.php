<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Models/municipio.php';
include_once $_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Util/config/config.php';
$municipio = new Municipio();
session_start();
date_default_timezone_set('Europe/Madrid');
$fecha_actual=date('d-m-Y');

if ($_POST['funcion'] == 'fill_residencias') {
	$municipio->obtener_residencias();
	$json=array();
	foreach ($municipio->objetos as $objeto) {
		$json[]=array(
			'id'=>openssl_encrypt($objeto->id, CODE, KEY),
			'residencia'=>$objeto->residencia
		);
	}
	$jsonstring=json_encode($json);
	echo $jsonstring;
}


