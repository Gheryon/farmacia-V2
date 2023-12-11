<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Models/conexion.php';
//cada vez que se instancia una variable Cliente, se hace conexion pdo automaticamente
class Cliente{
	var $objetos;
	public function __construct()
	{
		$db = new Conexion();
		$this->acceso = $db->pdo;
	}

	function obtener_clientes(){
		$sql = "SELECT id, nombre, apellidos, edad, dni, telefono, correo, sexo, adicional, avatar, estado
		FROM cliente 
				
		ORDER BY id";
		$query = $this->acceso->prepare($sql);
		$query->execute();
		$this->objetos = $query->fetchAll();
		return $this->objetos;
	}

	function buscar_cliente($dni){
		$sql = "SELECT * FROM cliente WHERE dni=:dni";
		$query = $this->acceso->prepare($sql);
		$variables=array(':dni' => $dni);
		$query->execute($variables);
		$this->objetos = $query->fetchAll();
		return $this->objetos;
	}

	function editar_cliente($id_cliente, $telefono, $residencia, $direccion, $correo, $sexo, $adicional){
		$sql = "UPDATE cliente SET telefono=:telefono, id_municipio=:residencia, direccion=:direccion, correo=:correo, sexo=:sexo, adicional=:adicional WHERE id=:id";
		$query = $this->acceso->prepare($sql);
		$variables=array(':id' => $id_cliente, ':telefono' => $telefono, ':residencia' => $residencia, ':direccion' => $direccion, ':correo' => $correo, ':sexo' => $sexo, ':adicional' => $adicional);
		$query->execute($variables);
	}

	function crear($nombre, $apellidos, $nacimiento, $dni, $telefono, $correo, $sexo, $adicional){
		$sql = "INSERT INTO cliente(nombre, apellidos, dni, edad, telefono, correo, sexo, adicional, avatar) VALUES (:nombre, :apellidos, :dni, :edad, :telefono, :correo, :sexo, :adicional, :avatar);";
		$query = $this->acceso->prepare($sql);
		$variables=array(':nombre' => $nombre, ':apellidos' => $apellidos, ':edad' => $nacimiento, ':dni' => $dni, ':telefono' => $telefono, ':correo' => $correo, ':sexo' => $sexo, ':adicional' => $adicional, ':avatar' => 'default_avatar.png');
		$query->execute($variables);
	}

	function borrarCliente($id_borrado)	{
		$sql = "UPDATE cliente SET estado=:estado WHERE id=:id";
		$query = $this->acceso->prepare($sql);
		$variables=array(':id' => $id_borrado, ':estado' => 'I');
		$query->execute($variables);
	}

	function reactivarCliente($id_borrado)	{
		$sql = "UPDATE cliente SET estado=:estado WHERE id=:id";
		$query = $this->acceso->prepare($sql);
		$variables=array(':id' => $id_borrado, ':estado' => 'A');
		$query->execute($variables);
	}
}
