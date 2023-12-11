<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Models/cliente.php';
include_once $_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Util/config/config.php';
$cliente = new Cliente();
session_start();
date_default_timezone_set('Europe/Madrid');
$fecha_actual=date('d-m-Y');

if ($_POST['funcion'] == 'obtener_clientes') {
	$json = array();
	$cliente->obtener_clientes();
	
	foreach ($cliente->objetos as $objeto) {
		$nacimiento = new DateTime($objeto->edad);
		$fecha=new DateTime($fecha_actual);
		$edad = $nacimiento->diff($fecha);
		$json[] = array(
			'id' => openssl_encrypt($objeto->id, CODE, KEY),
			'nombre' => $objeto->nombre,
			'apellidos' => $objeto->apellidos,
			'edad' => $edad->y,
			'dni' => $objeto->dni,
			'telefono' => $objeto->telefono,
			'correo' => $objeto->correo,
			'sexo' => $objeto->sexo,
			'adicional' => $objeto->adicional,
			'avatar' => $objeto->avatar,
			'estado' => $objeto->estado,
			'id_tipo_sesion'=>$_SESSION['id_tipo']
		);
	}
	$jsonstring = json_encode($json);
	echo $jsonstring;
}

//el else if es para mejorar el rendimiento al no comprobar todos los if

else if ($_POST['funcion'] == 'load_user') {
	$json = array();
	$id=$_SESSION['id'];
	$cliente->obtener_datos($id);
	if(!empty($cliente->objetos)){
		//solo hay un registro, se accede al registro 0 que es el primero y único
		$nacimiento = new DateTime($cliente->objetos[0]->edad);
		$fecha_actual=new DateTime($fecha_actual);
		$edad = $nacimiento->diff($fecha_actual);
		$json = array(
			'id' => openssl_encrypt($cliente->objetos[0]->id, CODE, KEY),
			'nombre' => $cliente->objetos[0]->nombre,
			'apellidos' => $cliente->objetos[0]->apellidos,
			'edad' => $edad->y,
			'dni' => $cliente->objetos[0]->dni,
			'tipo' => $cliente->objetos[0]->tipo,
			'id_tipo' => $cliente->objetos[0]->id_tipo,
			'telefono' => $cliente->objetos[0]->telefono,
			'residencia' => $cliente->objetos[0]->residencia,
			'id_residencia' => openssl_encrypt($cliente->objetos[0]->id_residencia, CODE, KEY),
			'direccion' => $cliente->objetos[0]->direccion,
			'correo' => $cliente->objetos[0]->correo,
			'sexo' => $cliente->objetos[0]->sexo,
			'adicional' => $cliente->objetos[0]->adicional,
			'avatar' => $cliente->objetos[0]->avatar
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
		$id_cliente = $_SESSION['id'];
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
			$cliente->editar_cliente($id_cliente, $telefono, $id_residencia, $direccion, $correo, $sexo, $adicional);
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

else if ($_POST['funcion'] == 'crear_cliente') {
	$mensaje='';
	if(!empty($_SESSION['id'])){
		$nombre=$_POST['nombre'];
		$apellidos=$_POST['apellidos'];
		$nacimiento=$_POST['nacimiento'];
		$dni=$_POST['dni'];
		$telefono=$_POST['telefono'];
		$correo=$_POST['correo'];
		$sexo=$_POST['sexo'];
		$adicional=$_POST['adicional'];

		$cliente->buscar_cliente($dni);
		if(empty($cliente->objetos)){
			$cliente->crear($nombre, $apellidos, $nacimiento, $dni, $telefono, $correo, $sexo, $adicional);
			$mensaje='success';
		}else{
			$mensaje='error_cliente';
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

else if ($_POST['funcion'] == 'eliminar_cliente') {
	$mensaje='';
	if(!empty($_SESSION['id'])){
		$id_session = $_SESSION['id'];
		$id_cliente_borrar = $_POST['id_user'];
		$pass=$_POST['pass'];
		
		//el id_session está encriptado, necesario desencriptarlo
		$formateado=str_replace(" ","+",$id_cliente_borrar);
		$id_cliente=openssl_decrypt($formateado,CODE,KEY);

		if(is_numeric($id_cliente)){
			$cliente->obtener_datos($id_session);
			$db_pass=openssl_decrypt($cliente->objetos[0]->contrasena, CODE, KEY);
			if($db_pass!=''){//la contraseña de la db está encriptada
				if($pass==$db_pass){
					//eliminar cliente
					$cliente->borrarCliente($id_cliente);
					$mensaje="success";
				}else{
					$mensaje="error_pass";
				}
			}else{//la contraseña de la db no está encriptada
				if($pass==$cliente->objetos[0]->contrasena){
					//eliminar cliente
					$cliente->borrarCliente($id_cliente);
					$mensaje="success";

				}else{
					$mensaje="error_pass";
				}
			}
		}else{
			$mensaje='error_decrypt';	
		}
	}else{
		$mensaje='error_session';
	}
	$json=array(
		'mensaje'=>$mensaje,
		'funcion'=>"eliminar cliente"
	);
	$jsonstring = json_encode($json);
	echo $jsonstring;
}

else if ($_POST['funcion'] == 'reactivar_cliente') {
	$mensaje='';
	if(!empty($_SESSION['id'])){
		$id_session = $_SESSION['id'];
		$id_cliente_reactivar = $_POST['id_user'];
		$pass=$_POST['pass'];
		
		//el id_session está encriptado, necesario desencriptarlo
		$formateado=str_replace(" ","+",$id_cliente_reactivar);
		$id_cliente=openssl_decrypt($formateado,CODE,KEY);

		if(is_numeric($id_cliente)){
			$cliente->obtener_datos($id_session);
			$db_pass=openssl_decrypt($cliente->objetos[0]->contrasena, CODE, KEY);
			if($db_pass!=''){//la contraseña de la db está encriptada
				if($pass==$db_pass){
					//eliminar cliente
					$cliente->reactivarCliente($id_cliente);
					$mensaje="success";
				}else{
					$mensaje="error_pass";
				}
			}else{//la contraseña de la db no está encriptada
				if($pass==$cliente->objetos[0]->contrasena){
					//eliminar cliente
					$cliente->reactivarCliente($id_cliente);
					$mensaje="success";

				}else{
					$mensaje="error_pass";
				}
			}
		}else{
			$mensaje='error_decrypt';	
		}
	}else{
		$mensaje='error_session';
	}
	$json=array(
		'mensaje'=>$mensaje,
		'funcion'=>"reactivar cliente"
	);
	$jsonstring = json_encode($json);
	echo $jsonstring;
}

?>