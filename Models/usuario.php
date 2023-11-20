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
		$sql = "SELECT u.id as id, u.nombre as nombre, u.apellidos as apellidos, u.dni as dni, u.avatar as avatar, u.id_tipo as id_tipo, t.nombre as tipo, u.contrasena as contrasena FROM usuario u
		JOIN tipo t on u.id_tipo=t.id WHERE u.dni=:dni";
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
		CONCAT(m.nombre,' | ',p.nombre,' | ',a.nombre) AS residencia, m.id as id_residencia, u.contrasena
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

	/************Obsoleto*****************/
	function obtener_datos_login($dni){
		$sql = "SELECT * FROM usuario join tipo_us on us_tipo=id_tipo_us and dni_us=:dni";
		$query = $this->acceso->prepare($sql);
		$query->execute(array(':dni' => $dni));
		$this->objetos = $query->fetchAll();
		return $this->objetos;
	}

	function ascender($pass, $id_ascendido, $id_usuario)
	{
		//se comprueba que el id_usuario es correcto
		$sql = "SELECT * FROM usuario WHERE id_usuario=:id_usuario";
		$query = $this->acceso->prepare($sql);
		$query->execute(array(':id_usuario' => $id_usuario));
		$this->objetos = $query->fetchAll();

		foreach ($this->objetos as $objeto) {
			$contrasena_actual = $objeto->contrasena_us;
		}
		//se comprueba si la contraseña de la base de datos está encriptada
		//si está encriptada, tendrá '$2y$10$' en la posición 0, por eso el triple =
		if (strpos($contrasena_actual, '$2y$10$') === 0) {
			//se compara la contraseña de la base de datos con la introducida
			if (password_verify($pass, $contrasena_actual)) {
				$tipo = 1; //1-->administrador
				$sql = "UPDATE usuario SET us_tipo=:tipo WHERE id_usuario=:id";
				$query = $this->acceso->prepare($sql);
				$query->execute(array(':id' => $id_ascendido, ':tipo' => $tipo));
				echo 'ascendido';
			} else {
				echo 'noascendido';
			}
		} else {
			//la contraseña no está encriptada
			if ($pass == $contrasena_actual) {
				$tipo = 1; //1-->administrador
				$sql = "UPDATE usuario SET us_tipo=:tipo WHERE id_usuario=:id";
				$query = $this->acceso->prepare($sql);
				$query->execute(array(':id' => $id_ascendido, ':tipo' => $tipo));
				echo 'ascendido';
			} else {
				echo 'noascendido';
			}
		}
	}

	function descender($pass, $id_descendido, $id_usuario)
	{
		//se comprueba que el id_usuario es correcto
		$sql = "SELECT * FROM usuario WHERE id_usuario=:id_usuario";
		$query = $this->acceso->prepare($sql);
		$query->execute(array(':id_usuario' => $id_usuario));
		$this->objetos = $query->fetchAll();

		foreach ($this->objetos as $objeto) {
			$contrasena_actual = $objeto->contrasena_us;
		}
		//se comprueba si la contraseña de la base de datos está encriptada
		//si está encriptada, tendrá '$2y$10$' en la posición 0, por eso el triple =
		if (strpos($contrasena_actual, '$2y$10$') === 0) {
			//se compara la contraseña de la base de datos con la introducida
			if (password_verify($pass, $contrasena_actual)) {
				$tipo = 2; //2-->tecnico
				$sql = "UPDATE usuario SET us_tipo=:tipo WHERE id_usuario=:id";
				$query = $this->acceso->prepare($sql);
				$query->execute(array(':id' => $id_descendido, ':tipo' => $tipo));
				echo 'descendido';
			} else {
				echo 'nodescendido';
			}
		} else {
			//la contraseña no está encriptada
			if ($pass == $contrasena_actual) {
				$tipo = 2; //2-->tecnico
				$sql = "UPDATE usuario SET us_tipo=:tipo WHERE id_usuario=:id";
				$query = $this->acceso->prepare($sql);
				$query->execute(array(':id' => $id_descendido, ':tipo' => $tipo));
				echo 'descendido';
			} else {
				echo 'nodescendido';
			}
		}
	}

	function borrarUsuario($pass, $id_borrado, $id_usuario)
	{
		//se comprueba que el id_usuario es correcto
		$sql = "SELECT * FROM usuario WHERE id_usuario=:id_usuario";
		$query = $this->acceso->prepare($sql);
		$query->execute(array(':id_usuario' => $id_usuario));
		$this->objetos = $query->fetchAll();

		foreach ($this->objetos as $objeto) {
			$contrasena_actual = $objeto->contrasena_us;
		}
		//se comprueba si la contraseña de la base de datos está encriptada
		//si está encriptada, tendrá '$2y$10$' en la posición 0, por eso el triple =
		if (strpos($contrasena_actual, '$2y$10$') === 0) {
			//se compara la contraseña de la base de datos con la introducida
			if (password_verify($pass, $contrasena_actual)) {
				$sql = "DELETE FROM usuario WHERE id_usuario=:id";
				$query = $this->acceso->prepare($sql);
				$query->execute(array(':id' => $id_borrado));
				echo 'borrado';
			} else {
				//el usuario no existe
				echo 'noborrado';
			}
		} else {
			//la contraseña no está encriptada
			if ($pass == $contrasena_actual) {
				$sql = "DELETE FROM usuario WHERE id_usuario=:id";
				$query = $this->acceso->prepare($sql);
				$query->execute(array(':id' => $id_borrado));
				echo 'borrado';
			} else {
				//el usuario no existe
				echo 'noborrado';
			}
		}
	}

	function mostrar_avatar_nav($id_usuario)
	{
		$sql = "SELECT avatar FROM usuario WHERE id_usuario=:id_usuario";
		$query = $this->acceso->prepare($sql);
		$query->execute(array(':id_usuario' => $id_usuario));
		$this->objetos = $query->fetchAll();
		return $this->objetos;
	}

	function verificar($email, $dni)
	{
		$sql = "SELECT * FROM usuario WHERE correo_us=:email AND dni_us=:dni";
		$query = $this->acceso->prepare($sql);
		$query->execute(array(':email' => $email, ':dni' => $dni));
		$this->objetos = $query->fetchAll();
		if (!empty($this->objetos)) {
			//query->rowCount cuenta el número de filas encontradas. Si se encontro 1, el usuario se verifica, si son 2 o más, error
			if ($query->rowCount() == 1) {
				echo 'encontrado';
			} else {
				echo 'no-encontrado';
			}
		} else {
			echo 'no-encontrado';
		}
	}

	function reemplazar($email, $dni, $codigo)
	{
		$sql = "UPDATE usuario SET contrasena_us=:codigo WHERE correo_us=:email AND dni_us=:dni";
		$query = $this->acceso->prepare($sql);
		$query->execute(array(':codigo' => $codigo, ':email' => $email, ':dni' => $dni));
		//echo 'reemplazado';
	}
}
