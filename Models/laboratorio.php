<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Models/conexion.php';
//cada vez que se instancia una variable Laboratorio, se hace conexion pdo automaticamente
class Laboratorio{
	var $objetos;
	public function __construct()
	{
		$db = new Conexion();
		$this->acceso = $db->pdo;
	}

	function obtener_laboratorios(){
		$sql = "SELECT * FROM laboratorio ORDER BY nombre";
		$query = $this->acceso->prepare($sql);
		$query->execute();
		$this->objetos = $query->fetchAll();
		return $this->objetos;
	}

	function buscar_laboratorio($nombre){
		$sql = "SELECT * FROM laboratorio WHERE nombre=:nombre";
		$query = $this->acceso->prepare($sql);
		$variables=array(':nombre' => $nombre);
		$query->execute($variables);
		$this->objetos = $query->fetchAll();
		return $this->objetos;
	}

	function crear($nombre){
		$sql = "INSERT INTO laboratorio(nombre) VALUES (:nombre);";
		$query = $this->acceso->prepare($sql);
		$variables=array(':nombre' => $nombre);
		$query->execute($variables);
	}

	function editar($nombre, $id){
		$sql = "UPDATE laboratorio SET nombre=:nombre WHERE id=:id;";
		$query = $this->acceso->prepare($sql);
		$variables=array(':nombre' => $nombre, ':id'=>$id);
		$query->execute($variables);
	}

	function buscar_laboratorio_id($id){
		$sql = "SELECT * FROM laboratorio WHERE id=:id";
		$query = $this->acceso->prepare($sql);
		$variables=array(':id' => $id);
		$query->execute($variables);
		$this->objetos = $query->fetchAll();
		return $this->objetos;
	}

	function editar_avatar($id, $nombre){
		$sql = "UPDATE laboratorio SET avatar=:nombre WHERE id=:id;";
		$query = $this->acceso->prepare($sql);
		$variables=array(':nombre' => $nombre, ':id'=>$id);
		$query->execute($variables);
	}

	function borrarLaboratorio($id_borrado)	{
		$sql = "UPDATE laboratorio SET estado=:estado WHERE id=:id";
		$query = $this->acceso->prepare($sql);
		$variables=array(':id' => $id_borrado, ':estado' => 'I');
		$query->execute($variables);
	}

	function reactivarLaboratorio($id_borrado)	{
		$sql = "UPDATE laboratorio SET estado=:estado WHERE id=:id";
		$query = $this->acceso->prepare($sql);
		$variables=array(':id' => $id_borrado, ':estado' => 'A');
		$query->execute($variables);
	}
}
