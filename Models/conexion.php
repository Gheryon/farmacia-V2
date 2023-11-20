<?php
class Conexion{
    private $servidor = "localhost";
    private $dbname = "farmaciaV2";
    private $puerto = 3306;
    private $charset = "utf8";
    private $usuario = "Gheryon";
    private $contrasena = "zewion";
    public $pdo = null;
    //Para el significado de los atributos: https://www.php.net/manual/es/pdo.setattribute.php
    private $atributos=[PDO::ATTR_CASE=>PDO::CASE_LOWER, PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_ORACLE_NULLS=>PDO::NULL_EMPTY_STRING, PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_OBJ];

    function __construct()
    {
        $this->pdo = new PDO("mysql:dbname={$this->dbname};host={$this->servidor};port=};charset={$this->charset}", $this->usuario, $this->contrasena, $this->atributos);
    }
}
?>