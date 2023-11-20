<?php
//para evitar la posibilidad de volver a index.php a través del botón retroceder
session_start();
?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
	<title>Login | Farmacia</title>
	<link rel="icon" href="/farmaciaV2/util/img/logo.png">
	<link rel="stylesheet" type="text/css" href="/farmaciaV2/util/css/login.css">
	<link rel="stylesheet" type="text/css" href="/farmaciaV2/util/css/sweetalert2.min.css">
	<link rel="stylesheet" type="text/css" href="/farmaciaV2/util/css/toastr.min.css">
	<link rel="stylesheet" type="text/css" href="/farmaciaV2/util/css/css/all.min.css">
</head>

<body>
	<img class="wave" src="/farmaciaV2/util/img/login/wave.png">
	<div class="contenedor">
		<div class="img">
			<img src="/farmaciaV2/util/img/login/bg.svg">
		</div>
		<div class="contenido-login">
			<form id="form-login">
				<img src="/farmaciaV2/util/img/logo.png">
				<h2>Farmacia</h2>
				<div class="input-div dni">
					<div class="i">
						<i class="fas fa-user"></i>
					</div>
					<div class="div">
						<h5>DNI</h5>
						<input type="text" name="dni" id="dni" class="input" required>
					</div>
				</div>
				<div class="input-div pass">
					<div class="i">
						<i class="fas fa-lock"></i>
					</div>
					<div class="div">
						<h5>Contraseña</h5>
						<input type="password" name="pass" id="pass" class="input" required>
					</div>
				</div>
				<a href="vista/recuperar.php">Recuperar contraseña</a>
				<a href="">Created Fco</a>
				<input type="submit" class="btn" value="Iniciar sesión">
			</form>
		</div>
	</div>
</body>
<!-- jQuery -->
<script src="/farmaciaV2/util/js/jquery.min.js"></script>
<!-- sweetalert2 -->
<script src="/farmaciaV2/util/js/sweetalert2.min.js"></script>
<!-- toastr -->
<script src="/farmaciaV2/util/js/toastr.min.js"></script>
<!--js-->
<script src="/farmaciaV2/util/js/login.js"></script>
<script src="/farmaciaV2/index.js"></script>
</html>