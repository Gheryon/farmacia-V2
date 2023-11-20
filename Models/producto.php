<?php
include_once $_SERVER["DOCUMENT_ROOT"] . '/farmacia-V2/Models/conexion.php';

class Producto
{
	var $objetos;

	public function __construct()
	{
		$db = new Conexion();
		$this->acceso = $db->pdo;
	}

	function obtener_productos(){
		$sql = "SELECT 
		p.id as id, p.nombre as nombre, p.concentracion, p.adicional, p.precio, p.codigo, p.fracciones, p.registro_sanitario,
		l.nombre as laboratorio, t.nombre as tipo, pre.nombre as presentacion, p.avatar as avatar,
		p.fecha_creacion as fecha_creacion, p.fecha_edicion as fecha_edicion
		FROM producto p
		JOIN laboratorio l ON p.id_laboratorio=l.id
		JOIN tipo_producto t ON p.id_tipo_producto=t.id
		JOIN presentacion pre ON p.id_presentacion=pre.id
		WHERE p.estado='A' ORDER BY p.nombre;";
		//$variables=array(':dni' => $dni);
		$query = $this->acceso->prepare($sql);
		$query->execute();
		$this->objetos = $query->fetchAll();
		return $this->objetos;		
	}

	function obtenerStock($id){
		//SUM(stock) as total, suma todos los campos de stock en la variable total
		$sql = "SELECT SUM(cantidad_lote) as total FROM lote WHERE id_producto=:id AND estado='A'";
		$query = $this->acceso->prepare($sql);
		$query->execute(array(':id' => $id));
		$this->objetos = $query->fetchAll();
		return $this->objetos;
	}

	/********obsoleto */
	function crear($nombre, $concentracion, $adicional, $precio, $laboratorio, $tipo, $presentacion, $avatar)
	{
		//se busca si ya existe algún producto que tenga exactamente los mismos campos, 
		//si se diferencia en al menos un campo, se crea uno nuevo, el precio no cuenta en esto
		$sql = "SELECT id_producto,estado FROM producto WHERE nombre=:nombre and concentracion=:concentracion and adicional=:adicional and prod_lab=:laboratorio and prod_tip_prod=:tipo and prod_present=:presentacion";
		$query = $this->acceso->prepare($sql);
		$query->execute(array(':nombre' => $nombre, ':concentracion' => $concentracion, ':adicional' => $adicional, ':laboratorio' => $laboratorio, ':tipo' => $tipo, ':presentacion' => $presentacion));
		$this->objetos = $query->fetchAll();
		//si ya existe el nombre del laboratorio, no se añade
		if (!empty($this->objetos)) {
			foreach ($this->objetos as $prod) {
				$prod_id_producto = $prod->id_producto;
				$prod_estado = $prod->estado;
			}
			if ($prod_estado == 'A') {
				echo 'noadd';
			} else {
				$sql = "UPDATE producto SET estado='A' WHERE id_producto=:id";
				$query = $this->acceso->prepare($sql);
				$query->execute(array(':id' => $prod_id_producto));
				echo 'add';
			}
		} else {
			$sql = "INSERT INTO producto(nombre, concentracion, adicional, precio, prod_lab, prod_tip_prod, prod_present, avatar) VALUES (:nombre, :concentracion, :adicional, :precio, :laboratorio, :tipo, :presentacion, :avatar);";
			$query = $this->acceso->prepare($sql);
			$query->execute(array(':nombre' => $nombre, ':concentracion' => $concentracion, ':adicional' => $adicional, ':laboratorio' => $laboratorio, ':tipo' => $tipo, ':presentacion' => $presentacion, ':precio' => $precio, ':avatar' => $avatar));
			echo 'add';
		}
	}

	function editar($id, $nombre, $concentracion, $adicional, $precio, $laboratorio, $tipo, $presentacion)
	{
		//se busca si ya existe algún producto que tenga exactamente los mismos campos
		$sql = "SELECT id_producto FROM producto WHERE id_producto!=:id AND nombre=:nombre and concentracion=:concentracion and adicional=:adicional and prod_lab=:laboratorio and prod_tip_prod=:tipo and prod_present=:presentacion";
		$query = $this->acceso->prepare($sql);
		$query->execute(array(':id' => $id, ':nombre' => $nombre, ':concentracion' => $concentracion, ':adicional' => $adicional, ':laboratorio' => $laboratorio, ':tipo' => $tipo, ':presentacion' => $presentacion));
		$this->objetos = $query->fetchAll();

		if (!empty($this->objetos)) {
			echo 'noedit';
		} else {
			$sql = "UPDATE producto SET nombre=:nombre, concentracion=:concentracion, adicional=:adicional, prod_lab=:laboratorio, prod_tip_prod=:tipo, prod_present=:presentacion, precio=:precio WHERE id_producto=:id";
			$query = $this->acceso->prepare($sql);
			$query->execute(array(':id' => $id, ':nombre' => $nombre, ':concentracion' => $concentracion, ':adicional' => $adicional, ':laboratorio' => $laboratorio, ':tipo' => $tipo, ':presentacion' => $presentacion, ':precio' => $precio));
			echo 'edit';
		}
	}

	function buscar_id($id){
		$sql = "SELECT id_producto, producto.nombre AS nombre, concentracion, adicional, precio, laboratorio.nombre AS laboratorio, tipo_producto.nombre AS tipo, presentacion.nombre AS presentacion, producto.avatar AS avatar, prod_lab, prod_tip_prod, prod_present
			FROM `producto` 
			JOIN laboratorio ON prod_lab=id_laboratorio
			JOIN tipo_producto ON prod_tip_prod=id_tip_prod
			JOIN presentacion ON prod_present=id_presentacion WHERE id_producto=:id;";
		$query = $this->acceso->prepare($sql);
		$query->execute(array(':id' => $id));
		$this->objetos = $query->fetchAll();
		return $this->objetos;
	}

	function cambiar_logo($id, $nombre){
		$sql = "UPDATE producto SET avatar=:nombre WHERE id_producto=:id";
		$query = $this->acceso->prepare($sql);
		$query->execute(array(':id' => $id, ':nombre' => $nombre));
	}

	function borrar($id){
		//se busca si hay un lote asociado al producto, si lo hay, no se puede borrar
		$sql = "SELECT * FROM lote WHERE id_producto=:id AND estado='A'";
		$query = $this->acceso->prepare($sql);
		$query->execute(array(':id' => $id));
		$lote = $query->fetchAll();
		if (!empty($lote)) {
			echo 'no borrado';
		} else {
			//se realiza eliminación lógica en lugar de la física, se cambia el estado de A(activo) a I (inactivo)
			$sql = "UPDATE producto SET estado='I' WHERE id_producto=:id";
			$query = $this->acceso->prepare($sql);
			$query->execute(array(':id' => $id));
			if (!empty($query->execute(array(':id' => $id)))) {
				echo 'borrado';
			} else {
				echo 'noborrado';
			}
		}
	}

	function reporte_productos()
	{
		$sql = "SELECT id_producto, producto.nombre AS nombre, concentracion, adicional, precio, laboratorio.nombre AS laboratorio, tipo_producto.nombre AS tipo, presentacion.nombre AS presentacion, producto.avatar AS avatar, prod_lab, prod_tip_prod, prod_present
		FROM `producto` 
		JOIN laboratorio ON prod_lab=id_laboratorio
		JOIN tipo_producto ON prod_tip_prod=id_tip_prod
		JOIN presentacion ON prod_present=id_presentacion AND producto.nombre NOT LIKE '' ORDER BY producto.nombre;";
		$query = $this->acceso->prepare($sql);
		$query->execute();
		$this->objetos = $query->fetchAll();
		return $this->objetos;
	}

	function rellenar_productos()
	{
		$sql = "SELECT id_producto, producto.nombre AS nombre, concentracion, adicional, precio, laboratorio.nombre AS laboratorio, tipo_producto.nombre AS tipo, presentacion.nombre AS presentacion
		FROM `producto` 
		JOIN laboratorio ON prod_lab=id_laboratorio AND producto.estado='A'
		JOIN tipo_producto ON prod_tip_prod=id_tip_prod
		JOIN presentacion ON prod_present=id_presentacion ORDER BY producto.nombre;";
		$query = $this->acceso->prepare($sql);
		$query->execute();
		$this->objetos = $query->fetchAll();
		return $this->objetos;
	}
}
