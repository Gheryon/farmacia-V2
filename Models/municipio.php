<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Models/conexion.php';
//cada vez que se instancia una variable Usuario, se hace conexion pdo automaticamente
class Municipio{
	var $objetos;
	public function __construct()
	{
		$db = new Conexion();
		$this->acceso = $db->pdo;
	}

	function obtener_residencias(){
		$sql = "SELECT m.id, CONCAT(m.nombre,' | ',p.nombre,' | ',a.nombre) AS residencia
		FROM municipio m
		JOIN provincia p ON p.id=m.id_provincia
		JOIN autonomia a ON a.id=p.id_autonomia";
		$query = $this->acceso->prepare($sql);
		$query->execute();
		$this->objetos = $query->fetchAll();
		return $this->objetos;		
	}
}
