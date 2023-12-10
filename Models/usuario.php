<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Models/conexion.php';
//cada vez que se instancia una variable Usuario, se hace conexion pdo automaticamente
class Usuario
{
	var $objetos;
	public function __construct()
	{
		$db = new Conexion();
		$this->acceso = $db->pdo;
	}

	function login($dni){
		$sql = "SELECT u.id as id, u.nombre as nombre, u.apellidos as apellidos, u.dni as dni, u.avatar as avatar, u.id_tipo as id_tipo, t.nombre as tipo, u.contrasena as contrasena, u.estado FROM usuario u
		JOIN tipo t on u.id_tipo=t.id WHERE u.dni=:dni AND u.estado='A'";
		$variables=array(':dni' => $dni);
		$query = $this->acceso->prepare($sql);
		$query->execute($variables);
		$this->objetos = $query->fetchAll();
		return $this->objetos;		
	}

	function obtener_datos($id){
		$sql = "SELECT u.id, u.nombre, u.apellidos, u.edad, u.dni, u.telefono, u.direccion, u.correo, u.sexo, u.adicional, u.avatar, u.id_tipo, t.nombre as tipo,
		CONCAT(m.nombre,' | ',p.nombre,' | ',a.nombre) AS residencia, m.id as id_residencia, u.contrasena
		FROM usuario u 
		JOIN tipo t ON u.id_tipo=t.id 
		JOIN municipio m ON m.id=u.id_municipio 
		JOIN provincia p ON p.id=m.id_provincia
		JOIN autonomia a ON a.id=p.id_autonomia		
		WHERE u.id=:id";
		$variables=array(':id' => $id);
		$query = $this->acceso->prepare($sql);
		$query->execute($variables);
		$this->objetos = $query->fetchAll();
		return $this->objetos;
	}

	function obtener_usuarios(){
		$sql = "SELECT u.id, u.nombre, u.apellidos, u.edad, u.dni, u.telefono, u.direccion, u.correo, u.sexo, u.adicional, u.avatar, u.id_tipo, t.nombre as tipo,
		CONCAT(m.nombre,' | ',p.nombre,' | ',a.nombre) AS residencia, m.id as id_residencia, u.contrasena, u.estado
		FROM usuario u 
		JOIN tipo t ON u.id_tipo=t.id 
		JOIN municipio m ON m.id=u.id_municipio 
		JOIN provincia p ON p.id=m.id_provincia
		JOIN autonomia a ON a.id=p.id_autonomia	
		
		ORDER BY u.id";
		$query = $this->acceso->prepare($sql);
		$query->execute();
		$this->objetos = $query->fetchAll();
		return $this->objetos;
	}

	function editar_usuario($id_usuario, $telefono, $residencia, $direccion, $correo, $sexo, $adicional){
		$sql = "UPDATE usuario SET telefono=:telefono, id_municipio=:residencia, direccion=:direccion, correo=:correo, sexo=:sexo, adicional=:adicional WHERE id=:id";
		$query = $this->acceso->prepare($sql);
		$variables=array(':id' => $id_usuario, ':telefono' => $telefono, ':residencia' => $residencia, ':direccion' => $direccion, ':correo' => $correo, ':sexo' => $sexo, ':adicional' => $adicional);
		$query->execute($variables);
	}

	function cambiar_avatar($id_usuario, $nombre){
		$sql = "UPDATE usuario SET avatar=:nombre WHERE id=:id";
		$query = $this->acceso->prepare($sql);
		$variables=array(':id' => $id_usuario, ':nombre' => $nombre);
		$query->execute($variables);
	}

	function cambiar_password($id_usuario, $newpass){
		$sql = "UPDATE usuario SET contrasena=:newpass WHERE id=:id";
		$query = $this->acceso->prepare($sql);
		$variables=array(':id' => $id_usuario, ':newpass' => $newpass);
		$query->execute($variables);
	}

	function crear($nombre, $apellidos, $nacimiento, $dni, $password, $telefono, $id_residencia, $direccion, $correo, $sexo, $adicional){
		$sql = "INSERT INTO usuario(nombre, apellidos, edad, dni, contrasena, telefono, direccion, correo, sexo, adicional, avatar, id_tipo, id_municipio) VALUES (:nombre, :apellidos, :edad, :dni, :contrasena, :telefono, :direccion, :correo, :sexo, :adicional, :avatar, :id_tipo, :id_municipio);";
		$query = $this->acceso->prepare($sql);
		$variables=array(':nombre' => $nombre, ':apellidos' => $apellidos, ':edad' => $nacimiento, ':dni' => $dni, ':contrasena' => $password, ':telefono' => $telefono, ':direccion' => $direccion, ':correo' => $correo, ':sexo' => $sexo, ':adicional' => $adicional, ':avatar' => 'default.jpg', ':id_tipo' => '3', ':id_municipio' => $id_residencia);
		$query->execute($variables);
	}

	function borrarUsuario($id_borrado)	{
		$sql = "UPDATE usuario SET estado=:estado WHERE id=:id";
		$query = $this->acceso->prepare($sql);
		$variables=array(':id' => $id_borrado, ':estado' => 'I');
		$query->execute($variables);
	}

	function reactivarUsuario($id_borrado)	{
		$sql = "UPDATE usuario SET estado=:estado WHERE id=:id";
		$query = $this->acceso->prepare($sql);
		$variables=array(':id' => $id_borrado, ':estado' => 'A');
		$query->execute($variables);
	}

	function actualizarTipoUsuario($id, $tipo_usuario){
		$sql = "UPDATE usuario SET id_tipo=:id_tipo WHERE id=:id";
		$query = $this->acceso->prepare($sql);
		$variables=array(':id' => $id, ':id_tipo' => $tipo_usuario);
		$query->execute($variables);
	}
}
