<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Models/laboratorio.php';
include_once $_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Util/config/config.php';
$laboratorio = new Laboratorio();
session_start();
date_default_timezone_set('Europe/Madrid');
$fecha_actual=date('d-m-Y');

if ($_POST['funcion'] == 'obtener_laboratorios') {
	$json = array();
	$laboratorio->obtener_laboratorios();
	foreach ($laboratorio->objetos as $objeto) {
		$json[] = array(
			'id' => openssl_encrypt($objeto->id, CODE, KEY),
			'nombre' => $objeto->nombre,
			'avatar' => $objeto->avatar,
			'estado' => $objeto->estado
		);
	}
	$jsonstring = json_encode($json);
	echo $jsonstring;
}

else if ($_POST['funcion'] == 'crear_laboratorio') {
	$mensaje='';
	if(!empty($_SESSION['id'])){
		$nombre=$_POST['nombre'];

		$laboratorio->buscar_laboratorio($nombre);
		if(empty($laboratorio->objetos)){
			$laboratorio->crear($nombre);
			$mensaje='success';
		}else{
			$mensaje='error_laboratorio';
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

else if ($_POST['funcion'] == 'editar_laboratorio') {
	$mensaje='';
	if(!empty($_SESSION['id'])){
		$nombre=$_POST['nombre_edit'];
		$id=$_POST['id_laboratorio'];
		$formateado = str_replace(" ","+",$id);
		$id_lab=openssl_decrypt($formateado, CODE, KEY);

		if(is_numeric($id_lab)){
			$laboratorio->buscar_laboratorio($nombre);
			if(empty($laboratorio->objetos)){
				$laboratorio->editar($nombre, $id_lab);
				$mensaje='success';
			}else{
				$mensaje='error_laboratorio';
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

else if ($_POST['funcion'] == 'editar_avatar') {
	$mensaje='';
	if(!empty($_SESSION['id'])){
		$id=$_POST['id_laboratorio_avatar'];
		$formateado = str_replace(" ","+",$id);
		$id_lab=openssl_decrypt($formateado, CODE, KEY);

		if(is_numeric($id_lab)){
			$nombre=uniqid().'-'.$_FILES['avatar_edit']['name'];
			$ruta=$_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Util/img/laboratorios/'.$nombre;
			move_uploaded_file($_FILES['avatar_edit']['tmp_name'], $ruta);

			$laboratorio->buscar_laboratorio_id($id_lab);
			$avatar=$laboratorio->objetos[0]->avatar;

			if($avatar!='lab_default.png'){
				unlink($_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Util/img/laboratorios/'.$avatar);
			}

			$laboratorio->editar_avatar($id_lab, $nombre);
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
	$jsonstring = json_encode($json);
	echo $jsonstring;
}

else if ($_POST['funcion'] == 'eliminar_laboratorio') {
	$mensaje='';
	if(!empty($_SESSION['id'])){
		$id_session = $_SESSION['id'];
		$id_laboratorio_borrar = $_POST['id'];
		
		//el id_session está encriptado, necesario desencriptarlo
		$formateado=str_replace(" ","+",$id_laboratorio_borrar);
		$id_laboratorio=openssl_decrypt($formateado,CODE,KEY);

		if(is_numeric($id_laboratorio)){
			//eliminar laboratorio
			$laboratorio->borrarLaboratorio($id_laboratorio);
			$mensaje="success";
			
		}else{
			$mensaje='error_decrypt';	
		}
	}else{
		$mensaje='error_session';
	}
	$json=array(
		'mensaje'=>$mensaje
	);
	$jsonstring = json_encode($json);
	echo $jsonstring;
}

else if ($_POST['funcion'] == 'reactivar_laboratorio') {
	$mensaje='';
	if(!empty($_SESSION['id'])){
		$id_session = $_SESSION['id'];
		$id_laboratorio_reactivar = $_POST['id'];
		
		//el id_session está encriptado, necesario desencriptarlo
		$formateado=str_replace(" ","+",$id_laboratorio_reactivar);
		$id_laboratorio=openssl_decrypt($formateado,CODE,KEY);

		if(is_numeric($id_laboratorio)){
			//eliminar laboratorio
			$laboratorio->reactivarLaboratorio($id_laboratorio);
			$mensaje="success";
			
		}else{
			$mensaje='error_decrypt';	
		}
	}else{
		$mensaje='error_session';
	}
	$json=array(
		'mensaje'=>$mensaje
	);
	$jsonstring = json_encode($json);
	echo $jsonstring;
}

?>