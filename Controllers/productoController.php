<?php
include_once $_SERVER["DOCUMENT_ROOT"] . '/farmacia-V2/Models/producto.php';
include_once $_SERVER["DOCUMENT_ROOT"] . '/farmacia-V2/Util/config/config.php';
require_once '../vendor/autoload.php';

$producto = new Producto();

if ($_POST['funcion'] == 'obtener_productos') {
	$producto->obtener_productos();
	$json = array();
	foreach ($producto->objetos as $objeto) {
		//obtenerStock devuelve el total de solo 1 producto, hay que recorrer el de todos
		$producto->obtenerStock($objeto->id);
		//obtenerStock solo devuelve un registro, solo hay que acceder al objeto[0] y su campo total
		$stock=$producto->objetos[0]->total;
		$json[] = array(
			'id' => openssl_encrypt($objeto->id, CODE, KEY),
			'nombre' => $objeto->nombre,
			'concentracion' => $objeto->concentracion,
			'adicional' => $objeto->adicional,
			'precio' => $objeto->precio,
			'stock' => $stock,
			'laboratorio' => $objeto->laboratorio,
			'tipo' => $objeto->tipo,
			'presentacion' => $objeto->presentacion,
			'fracciones' => $objeto->fracciones,
			'codigo' => $objeto->codigo,
			'registro_sanitario' => $objeto->registro_sanitario,
			'fecha_creacion' => $objeto->fecha_creacion,
			'fecha_edicion' => $objeto->fecha_edicion,
			'avatar' => $objeto->avatar
		);
	}
	$jsonstring = json_encode($json);
	echo $jsonstring;
}
/************Obsoleto**************/
if ($_POST['funcion'] == 'crear') {
	$nombre = $_POST['nombre'];
	$concentracion = $_POST['concentracion'];
	$adicional = $_POST['adicional'];
	$precio = $_POST['precio'];
	$laboratorio = $_POST['laboratorio'];
	$tipo = $_POST['tipo'];
	$presentacion = $_POST['presentacion'];
	$avatar = 'prod_default.png';
	$producto->crear($nombre, $concentracion, $adicional, $precio, $laboratorio, $tipo, $presentacion, $avatar);
}

if ($_POST['funcion'] == 'editar') {
	$id = $_POST['id'];
	$nombre = $_POST['nombre'];
	$concentracion = $_POST['concentracion'];
	$adicional = $_POST['adicional'];
	$precio = $_POST['precio'];
	$laboratorio = $_POST['laboratorio'];
	$tipo = $_POST['tipo'];
	$presentacion = $_POST['presentacion'];
	$producto->editar($id, $nombre, $concentracion, $adicional, $precio, $laboratorio, $tipo, $presentacion);
}

if ($_POST['funcion'] == 'buscar_id') {
	$id = $_POST['id_producto'];
	$producto->buscar_id($id);
	$json = array();
	foreach ($producto->objetos as $objeto) {
		//obtenerStock devuelve el total de solo 1 producto, hay que recorrer el de todos
		$producto->obtenerStock($objeto->id_producto);
		foreach ($producto->objetos as $obj) {
			$total = $obj->total;
		}
		$json[] = array(
			'id' => $objeto->id_producto,
			'nombre' => $objeto->nombre,
			'concentracion' => $objeto->concentracion,
			'adicional' => $objeto->adicional,
			'precio' => $objeto->precio,
			'stock' => $total,
			'laboratorio' => $objeto->laboratorio,
			'tipo' => $objeto->tipo,
			'presentacion' => $objeto->presentacion,
			'laboratorio_id' => $objeto->prod_lab,
			'tipo_id' => $objeto->prod_tip_prod,
			'presentacion_id' => $objeto->prod_present,
			'avatar' => '../img/prod/' . $objeto->avatar
		);
	}
	$jsonstring = json_encode($json[0]);
	echo $jsonstring;
}

if ($_POST['funcion'] == 'verificar_stock') {
	$error = 0;
	$productos = json_decode($_POST['productos']);
	foreach ($productos as $objeto) {
		$producto->obtenerStock($objeto->id);
		foreach ($producto->objetos as $obj) {
			$total = $obj->total;
		}
		if ($total >= $objeto->cantidad && $objeto->cantidad > 0) {
			$error = $error + 0;
		} else {
			$error = $error + 1;
		}
	}
	echo $error;
}

if ($_POST['funcion'] == 'cambiar_avatar') {
	$id = $_POST['id_logo_prod'];
	$avatar = $_POST['avatar'];
	if (($_FILES['avatar']['type'] == 'image/jpg') || ($_FILES['avatar']['type'] == 'image/jpeg') || ($_FILES['avatar']['type'] == 'image/png') || ($_FILES['avatar']['type'] == 'image/gif')) {
		$nombre = uniqid() . '-' . $_FILES['avatar']['name'];
		$ruta = '../img/prod/' . $nombre;
		move_uploaded_file($_FILES['avatar']['tmp_name'], $ruta);
		$producto->cambiar_logo($id, $nombre);
		//hay que evitar borrar el lab_default.png, se borran solo si se llaman distinto a este
		//foreach ($producto->objetos as $objeto) {
		if ($avatar != '../img/prod/prod_default.png') {
			unlink($avatar);
		}
		//}
		$json = array();
		$json[] = array(
			'ruta' => $ruta,
			'alert' => 'edit'
		);
		$jsonstring = json_encode($json[0]);
		echo $jsonstring;
	} else {
		$json = array();
		$json[] = array(
			'alert' => 'noedit'
		);
		$jsonstring = json_encode($json[0]);
		echo $jsonstring;
	}
}

if ($_POST['funcion'] == 'borrar') {
	$id = $_POST['id'];
	$producto->borrar($id);
}

if ($_POST['funcion'] == 'traer_productos') {
	$html = "";
	$productos = json_decode($_POST['productos']);
	foreach ($productos as $product) {
		$producto->buscar_id($product->id);
		var_dump($producto);
		foreach ($producto->objetos as $objeto) {
			//para asegurarse de que el precio se multiplica por un valor numérico
			if ($product->cantidad == '') {
				$resultadoCantidad = 0;
			} else {
				$resultadoCantidad = $product->cantidad;
			}
			$subtotal = $objeto->precio * $resultadoCantidad;
			$producto->obtenerStock($objeto->id_producto);
			foreach ($producto->objetos as $obj) {
				$stock = $obj->total;
			}
			$html .= "<tr prodId='$objeto->id_producto' prodPrecio='$objeto->precio'>
            <td>$objeto->nombre</td>
            <td>$stock</td>
            <td class='precio'>$objeto->precio</td>
            <td>$objeto->concentracion}</td>
            <td>$objeto->adicional</td>
            <td>$objeto->laboratorio</td>
            <td>$objeto->presentacion</td>
            <td>
                <input type='number' min='1' class='form-control cantidad_producto' value='$product->cantidad'>
            </td>
            <td class='subtotales'>
                <h5>$subtotal</h5>
            </td>
            <td><button class='borrar-producto btn btn-danger'><i class='fas fa-times-circle'></i></button></td>
        </tr>";
		}
	}
	echo $html;
}

if ($_POST['funcion'] == 'reporte_productos') {
	date_default_timezone_set('Europe/Madrid');
	$fecha = date('d-m-Y');
	$html = "<header><h1>Reporte de productos</h1>
    Fecha: " . $fecha . "</header>
    <table>
        <thead>
            <tr>
                <th>n</th>
                <th>Producto</th>
                <th>Concentracion</th>
                <th>Adicional</th>
                <th>Laboratorio</th>
                <th>Presentacion</th>
                <th>Tipo</th>
                <th>stock</th>
                <th>Precio</th>
            </tr>
        </thead>
        <tbody>
    ";
	$producto->reporte_productos();
	$contador = 0;
	foreach ($producto->objetos as $objeto) {
		$contador++;
		$producto->obtenerStock($objeto->id_producto);
		foreach ($producto->objetos as $obj) {
			$stock = $obj->total;
		}
		$html .= "
        <tr>
            <td>'$contador'</td>
            <td>'$objeto->nombre'</td>
            <td>'$objeto->concentracion'</td>
            <td>'$objeto->adicional'</td>
            <td>'$objeto->laboratorio'</td>
            <td>'$objeto->presentacion'</td>
            <td>'$objeto->tipo'</td>
            <td>'$stock'</td>
            <td>'$objeto->precio'</td>
        </tr>";
	}
	$html .= "
        
        </tbody>
    </table>
    ";
	$mpdf = new \Mpdf\Mpdf();
	$mpdf->WriteHTML($html, \Mpdf\HTMLParserMode::HTML_BODY);
	$mpdf->Output("../pdf/pdf-" . $_POST['funcion'] . ".pdf", "F");
}

if ($_POST['funcion'] == 'rellenar_productos') {
	$producto->rellenar_productos();
	$json = array();
	foreach ($producto->objetos as $objeto) {
		$json[] = array(
			'nombre' => $objeto->id_producto . ' | ' . $objeto->nombre . ' | ' . $objeto->concentracion . ' | ' . $objeto->adicional . ' | ' . $objeto->laboratorio . ' | ' . $objeto->presentacion
		);
	}
	$jsonstring = json_encode($json);
	echo $jsonstring;
}
