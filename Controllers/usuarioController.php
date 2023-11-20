<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Models/usuario.php';
include_once $_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Util/config/config.php';
$usuario = new Usuario();
session_start();
date_default_timezone_set('Europe/Madrid');
$fecha_actual=date('d-m-Y');

if ($_POST['funcion'] == 'login') {
	$dni = $_POST['dni'];
	$pass = $_POST['pass'];
	$usuario->login($dni);
	$mensaje='';
	if(!empty($usuario->objetos)){
		$db_pass=openssl_decrypt($usuario->objetos[0]->contrasena, CODE, KEY);
		if($db_pass!=''){//la contraseña de la db está encriptada
			if($pass==$db_pass){
				$mensaje='success';
				$_SESSION['id']=$usuario->objetos[0]->id;
				$_SESSION['nombre']=$usuario->objetos[0]->nombre;
				$_SESSION['apellidos']=$usuario->objetos[0]->apellidos;
				$_SESSION['dni']=$usuario->objetos[0]->dni;
				$_SESSION['avatar']=$usuario->objetos[0]->avatar;
				$_SESSION['id_tipo']=$usuario->objetos[0]->id_tipo;
				$_SESSION['tipo']=$usuario->objetos[0]->tipo;
			}else{
				$mensaje="error_pass";
			}
		}else{//la contraseña de la db no está encriptada
			if($pass==$usuario->objetos[0]->contrasena){
				$mensaje='success';
				$_SESSION['id']=$usuario->objetos[0]->id;
				$_SESSION['nombre']=$usuario->objetos[0]->nombre;
				$_SESSION['apellidos']=$usuario->objetos[0]->apellidos;
				$_SESSION['dni']=$usuario->objetos[0]->dni;
				$_SESSION['avatar']=$usuario->objetos[0]->avatar;
				$_SESSION['id_tipo']=$usuario->objetos[0]->id_tipo;
				$_SESSION['tipo']=$usuario->objetos[0]->tipo;
			}else{
				$mensaje="error_pass";
			}
		}
	}else{
		$mensaje='error';
	}
	$json = array(
		'mensaje' => $mensaje
	);
	$jsonstring = json_encode($json);
	echo $jsonstring;
}
//el else if es para mejorar el rendimiento al no comprobar todos los if
else if ($_POST['funcion'] == 'verificar_sesion') {
	if(!empty($_SESSION['id'])){
		$json=array(
			'id'=>$_SESSION['id'],
			'nombre'=>$_SESSION['nombre'],
			'apellidos'=>$_SESSION['apellidos'],
			'dni'=>$_SESSION['dni'],
			'avatar'=>$_SESSION['avatar'],
			'id_tipo'=>$_SESSION['id_tipo'],
			'tipo'=>$_SESSION['tipo']
		);
	}else{//no hay sesión iniciada, se manda json vacío
		$json=array();
	}
	$jsonstring = json_encode($json);
	echo $jsonstring;
}

else if ($_POST['funcion'] == 'load_user') {
	$json = array();
	$id=$_SESSION['id'];
	$usuario->obtener_datos($id);
	if(!empty($usuario->objetos)){
		//solo hay un registro, se accede al registro 0 que es el primero y único
		$nacimiento = new DateTime($usuario->objetos[0]->edad);
		$fecha_actual=new DateTime($fecha_actual);
		$edad = $nacimiento->diff($fecha_actual);
		$json = array(
			'id' => openssl_encrypt($usuario->objetos[0]->id, CODE, KEY),
			'nombre' => $usuario->objetos[0]->nombre,
			'apellidos' => $usuario->objetos[0]->apellidos,
			'edad' => $edad->y,
			'dni' => $usuario->objetos[0]->dni,
			'tipo' => $usuario->objetos[0]->tipo,
			'id_tipo' => $usuario->objetos[0]->id_tipo,
			'telefono' => $usuario->objetos[0]->telefono,
			'residencia' => $usuario->objetos[0]->residencia,
			'id_residencia' => openssl_encrypt($usuario->objetos[0]->id_residencia, CODE, KEY),
			'direccion' => $usuario->objetos[0]->direccion,
			'correo' => $usuario->objetos[0]->correo,
			'sexo' => $usuario->objetos[0]->sexo,
			'adicional' => $usuario->objetos[0]->adicional,
			'avatar' => $usuario->objetos[0]->avatar
		);
		$jsonstring = json_encode($json);
		echo $jsonstring;
	}else{
		echo 'error';
	}
}

else if ($_POST['funcion'] == 'editar_datos') {
	$mensaje='';
	if(!empty($_SESSION['id'])){
		$id_usuario = $_SESSION['id'];
		$telefono = $_POST['editar_telefono'];
		$residencia = $_POST['editar_residencia'];
		$direccion = $_POST['editar_direccion'];
		$correo = $_POST['editar_correo'];
		$sexo = $_POST['editar_sexo'];
		$adicional = $_POST['editar_adicional'];
		//formatea el contenido de residencia sustituyendo los espacios en blanco por +, si no se hace, habría errores al desencriptar
		$formateado = str_replace(" ","+",$residencia);
		$id_residencia=openssl_decrypt($formateado, CODE, KEY);
		if(is_numeric($id_residencia)){
			$usuario->editar_usuario($id_usuario, $telefono, $id_residencia, $direccion, $correo, $sexo, $adicional);
			$mensaje='success';
		}else{
			$mensaje='error_decrypt';
		}
	}else{
		$mensaje='error_session';
	}
	$json=array(
		'mensaje'=>$mensaje,
	);
	$jsonstring=json_encode($json);
	echo $jsonstring;
}

else if ($_POST['funcion'] == 'cambiar_avatar') {
	$mensaje='';
	if(!empty($_SESSION['id'])){
		$id_usuario = $_SESSION['id'];
		$nombre = uniqid() . '-' . $_FILES['avatar_mod']['name'];
		$ruta = $_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Util/img/user/' . $nombre;
		move_uploaded_file($_FILES['avatar_mod']['tmp_name'], $ruta);
		$avatar=$_SESSION['avatar'];
		if($avatar!='default.jpg'){
			unlink($_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Util/img/user/' . $avatar);
		}
		$_SESSION['avatar']=$nombre;
		$usuario->cambiar_avatar($id_usuario, $nombre);
		$mensaje='success';
	}else{
		$mensaje='error_session';
	}
	$json=array(
		'mensaje'=>$mensaje,
		'img'=>$nombre,
	);
	$jsonstring = json_encode($json);
	echo $jsonstring;
}

else if ($_POST['funcion'] == 'cambiar_password') {
	$mensaje='';
	if(!empty($_SESSION['id'])){
		$id_usuario = $_SESSION['id'];
		$oldpass=$_POST['oldpass'];
		$newpass=$_POST['newpass'];
		$usuario->obtener_datos($id_usuario);
		$db_pass=openssl_decrypt($usuario->objetos[0]->contrasena, CODE, KEY);
		if($db_pass!=''){//la contraseña de la db está encriptada
			if($oldpass==$db_pass){
				$nueva_pass=openssl_encrypt($newpass, CODE, KEY);
				$usuario->cambiar_password($id_usuario, $nueva_pass);
			}else{
				$mensaje="error_pass";
			}
		}else{//la contraseña de la db no está encriptada
			if($oldpass==$usuario->objetos[0]->contrasena){
				$nueva_pass=openssl_encrypt($newpass, CODE, KEY);
				$usuario->cambiar_password($id_usuario, $nueva_pass);

			}else{
				$mensaje="error_pass";
			}
		}
		//$mensaje='success';
	}else{
		$mensaje='error_session';
	}
	$json=array(
		'mensaje'=>$mensaje,
	);
	$jsonstring = json_encode($json);
	echo $jsonstring;
}

else if ($_POST['funcion'] == 'obtener_usuarios') {
	$json = array();
	$usuario->obtener_usuarios();
	foreach ($usuario->objetos as $objeto) {
		$nacimiento = new DateTime($objeto->edad);
		$fecha=new DateTime($fecha_actual);
		$edad = $nacimiento->diff($fecha);
		$json[] = array(
			'id' => openssl_encrypt($objeto->id, CODE, KEY),
			'nombre' => $objeto->nombre,
			'apellidos' => $objeto->apellidos,
			'edad' => $edad->y,
			'dni' => $objeto->dni,
			'tipo' => $objeto->tipo,
			'id_tipo' => $objeto->id_tipo,
			'telefono' => $objeto->telefono,
			'residencia' => $objeto->residencia,
			'id_residencia' => openssl_encrypt($objeto->id_residencia, CODE, KEY),
			'direccion' => $objeto->direccion,
			'correo' => $objeto->correo,
			'sexo' => $objeto->sexo,
			'adicional' => $objeto->adicional,
			'avatar' => $objeto->avatar,
			'id_tipo_sesion'=>$_SESSION['id_tipo']
		);
	}
	$jsonstring = json_encode($json);
	echo $jsonstring;
}

else if ($_POST['funcion'] == 'crear_usuario') {
	$mensaje='';
	if(!empty($_SESSION['id'])){
		$id_usuario = $_SESSION['id'];
		$nombre=$_POST['nombre'];
		$apellidos=$_POST['apellidos'];
		$nacimiento=$_POST['nacimiento'];
		$dni=$_POST['dni'];
		$password=$_POST['password'];
		$telefono=$_POST['telefono'];
		$residencia=$_POST['residencia'];
		$direccion=$_POST['direccion'];
		$correo=$_POST['correo'];
		$sexo=$_POST['sexo'];
		$adicional=$_POST['adicional'];

		$formateado=str_replace(" ","+",$residencia);
		$id_residencia=openssl_decrypt($formateado,CODE,KEY);
		if(is_numeric($id_residencia)){
			$usuario->login($dni);
			if(empty($usuario->objetos)){
				$usuario->crear($nombre, $apellidos, $nacimiento, $dni, $password, $telefono, $id_residencia, $direccion, $correo, $sexo, $adicional);
				$mensaje='success';
			}else{
				$mensaje='error_usuario';
			}
		}else{
			$mensaje='error_decrypt';	
		}
	}else{
		$mensaje='error_session';
	}
	$json=array(
		'mensaje'=>$mensaje,
	);
	$jsonstring = json_encode($json);
	echo $jsonstring;
}
/**************obsoleto*************** */

if ($_POST['funcion'] == 'ascender') {
	$pass = $_POST['pass'];
	$id_ascendido = $_POST['id_usuario'];
	$usuario->ascender($pass, $id_ascendido, $id_usuario);
}

if ($_POST['funcion'] == 'descender') {
	$pass = $_POST['pass'];
	$id_descendido = $_POST['id_usuario'];
	$usuario->descender($pass, $id_descendido, $id_usuario);
}

if ($_POST['funcion'] == 'borrar_usuario') {
	$pass = $_POST['pass'];
	$id_borrado = $_POST['id_usuario'];
	$usuario->borrarUsuario($pass, $id_borrado, $id_usuario);
}

if ($_POST['funcion'] == 'mostrar_avatar') {
	$usuario->mostrar_avatar_nav($id_usuario);
	$json = array();
	foreach ($usuario->objetos as $objeto) {
		$json = $objeto;
	}
	$jsonstring = json_encode($json);
	echo $jsonstring;
}

if ($_POST['funcion'] == 'tipo_usuario') {
	echo $tipo_usuario;
}
