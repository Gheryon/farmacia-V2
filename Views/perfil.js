$(document).ready(function () {
  loader();
  bsCustomFileInput.init();
  verificar_sesion();

  //para evitar que los mensajes toastr se acumulen en pantalla
  toastr.options={
    "preventDuplicates": true
  }

	$('#editar_residencia').select2({
		placeholder: 'Seleccione una residencia',
		language:{
			noResult: function(){
				return "No hay resultados."},
			searching: function(){
				return "Buscando..."},
		}
	});

	async function fill_residencias() {
		let funcion = "fill_residencias";
		let data = await fetch('/farmacia-V2/Controllers/municipioController.php', {
			method: 'POST',
			headers: { 'Content-type': 'application/x-www-form-urlencoded' },
			body: 'funcion=' + funcion
		})
		if (data.ok) {
			//mejor usar data.text que data.json, pues si hay error, este se añade como cadena de texto a los datos
			let response = await data.text();
			try {
				//se descodifica el json
				let residencias = JSON.parse(response);
				let template=``;
				residencias.forEach(residencia => {
					template+=`
					<option value="${residencia.id}">${residencia.residencia}</option> `;
				});
				$('#editar_residencia').html(template);
				$('#editar_residencia').val('').trigger('change');
			} catch (error) {
				console.error(error);
				console.log(response);
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Hubo conflicto en el sistema, póngase en contacto con el administrador.'
				})
			}
		} else {
			Swal.fire({
				icon: 'error',
				title: data.statusText,
				text: 'Hubo conflicto de código: ' + data.status
			})
		}
	}

	async function verificar_sesion() {
		let funcion = "verificar_sesion";
		let data = await fetch('/farmacia-V2/Controllers/usuarioController.php', {
			method: 'POST',
			headers: { 'Content-type': 'application/x-www-form-urlencoded' },
			body: 'funcion=' + funcion
		})
		if (data.ok) {
			//mejor usar data.text que data.json, pues si hay error, este se añade como cadena de texto a los datos
			let response = await data.text();
			try {
				//se descodifica el json
				let respuesta = JSON.parse(response);
				if (respuesta.length != 0) {
					cargar_menu_superior(respuesta);
					cargar_menu_lateral(respuesta);
					fill_residencias();
					load_user();
					closeLoader();
				} else {
					location.href = "/farmacia-V2/";
				}
			} catch (error) {
				console.error(error);
				console.log(response);
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Hubo conflicto en el sistema, póngase en contacto con el administrador.'
				})
			}
		} else {
			Swal.fire({
				icon: 'error',
				title: data.statusText,
				text: 'Hubo conflicto de código: ' + data.status
			})
		}
	}

	function cargar_menu_superior(usuario) {
		let template = `
        <!-- Left navbar links -->
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
          </li>
          <li class="nav-item d-none d-sm-inline-block">
            <a href="../../index3.html" class="nav-link">Home</a>
          </li>
          <li class="nav-item d-none d-sm-inline-block">
            <a href="#" class="nav-link">Contact</a>
          </li>
          <li class="nav-item dropdown" id="carrito" style="display:none" role="button">
            <img src="/farmacia-V2/util/img/carrito.png" class="imagen-carrito nav-link">
              <span id="contador" class="contador badge badge-danger"></span>
            </img>
          </li>
        </ul>
    
        <!-- Right navbar links -->
        <ul class="navbar-nav ml-auto">
          <!-- Messages Dropdown Menu -->
          <li class="nav-item dropdown">
            <a class="nav-link" data-toggle="dropdown" href="#">
              <i class="far fa-comments"></i>
              <span class="badge badge-danger navbar-badge">3</span>
            </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <a href="#" class="dropdown-item">
                <!-- Message Start -->
                <div class="media">
                  <img src="../../dist/img/user1-128x128.jpg" alt="User Avatar" class="img-size-50 mr-3 img-circle">
                  <div class="media-body">
                    <h3 class="dropdown-item-title">
                      Brad Diesel
                      <span class="float-right text-sm text-danger"><i class="fas fa-star"></i></span>
                    </h3>
                    <p class="text-sm">Call me whenever you can...</p>
                    <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>
                  </div>
                </div>
                <!-- Message End -->
              </a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item">
                <!-- Message Start -->
                <div class="media">
                  <img src="../../dist/img/user8-128x128.jpg" alt="User Avatar" class="img-size-50 img-circle mr-3">
                  <div class="media-body">
                    <h3 class="dropdown-item-title">
                      John Pierce
                      <span class="float-right text-sm text-muted"><i class="fas fa-star"></i></span>
                    </h3>
                    <p class="text-sm">I got your message bro</p>
                    <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>
                  </div>
                </div>
                <!-- Message End -->
              </a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item">
                <!-- Message Start -->
                <div class="media">
                  <img src="../../dist/img/user3-128x128.jpg" alt="User Avatar" class="img-size-50 img-circle mr-3">
                  <div class="media-body">
                    <h3 class="dropdown-item-title">
                      Nora Silvester
                      <span class="float-right text-sm text-warning"><i class="fas fa-star"></i></span>
                    </h3>
                    <p class="text-sm">The subject goes here</p>
                    <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>
                  </div>
                </div>
                <!-- Message End -->
              </a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item dropdown-footer">See All Messages</a>
            </div>
          </li>
          <!-- Notifications Dropdown Menu -->
          <li class="nav-item dropdown">
            <a class="nav-link" data-toggle="dropdown" href="#">
              <i class="far fa-bell"></i>
              <span class="badge badge-warning navbar-badge">15</span>
            </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <span class="dropdown-item dropdown-header">15 Notifications</span>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item">
                <i class="fas fa-envelope mr-2"></i> 4 new messages
                <span class="float-right text-muted text-sm">3 mins</span>
              </a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item">
                <i class="fas fa-users mr-2"></i> 8 friend requests
                <span class="float-right text-muted text-sm">12 hours</span>
              </a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item">
                <i class="fas fa-file mr-2"></i> 3 new reports
                <span class="float-right text-muted text-sm">2 days</span>
              </a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item dropdown-footer">See All Notifications</a>
            </div>
          </li>
          <!-- información de usuario -->
          <li class="nav-item dropdown">
            <a class="nav-link" data-toggle="dropdown" href="#">
            <img id="avatar_1" src="/farmacia-V2/util/img/user/${usuario.avatar}" width="30" height="30" alt="Farmacia Logo">
              <span>${usuario.nombre + ' ' + usuario.apellidos}</span>
            </a>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item" href="/farmacia-V2/Controllers/logout.php"><i class="fas fa-user-times mr-2"></i>Cerrar sesión</a>
              </li>
            </ul>
          </li>
        </ul>`;
		$('#menu_superior').html(template);
	}

	function cargar_menu_lateral(usuario) {
    let template=`
    <!-- Sidebar user (optional) -->
    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
      <div class="image">
        <img src="/farmacia-V2/util/img/user/${usuario.avatar}" class="img-circle elevation-2" alt="User Image">
      </div>
      <div class="info">
        <a href="#" class="d-block">${usuario.nombre+' '+usuario.apellidos}</a>
      </div>
    </div>

    <!-- Sidebar Menu -->
    <nav class="mt-2">
      <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
        <!-- Add icons to the links using the .nav-icon class
            with font-awesome or any other icon font library -->
        <li class="nav-header">Usuario</li>
        <li class="nav-item">
          <a href="/farmacia-V2/Views/perfil.php" class="nav-link">
            <i class="nav-icon fas fa-user-cog"></i>
            <p>
              Perfil
            </p>
          </a>
        </li>
        <li id="gestion_usuario" class="nav-item">
          <a href="/farmacia-V2/Views/usuarios.php" class="nav-link">
            <i class="nav-icon fas fa-users"></i>
            <p>
              Gestión usuario
            </p>
          </a>
        </li>
        <li id="gestion_cliente" class="nav-item">
          <a href="/farmacia-V2/Views/clientes.php" class="nav-link">
            <i class="nav-icon fas fa-user-friends"></i>
            <p>
              Gestión cliente
            </p>
          </a>
        </li>
        <li class="nav-header">Ventas</li>
        <li class="nav-item">
          <a href="adm_venta.php" class="nav-link">
            <i class="nav-icon fas fa-notes-medical"></i>
            <p>
              Listar ventas
            </p>
          </a>
        </li>
        <li class="nav-header">Almacén</li>
        <li id="gestion_producto" class="nav-item">
          <a href="adm_producto.php" class="nav-link">
            <i class="nav-icon fas fa-pills"></i>
            <p>
              Gestionar producto
            </p>
          </a>
        </li>
        <li id="gestion_atributo" class="nav-item">
          <a href="adm_atributo.php" class="nav-link">
            <i class="nav-icon fas fa-vials"></i>
            <p>
              Gestión atributo
            </p>
          </a>
        </li>
        <li id="gestion_lote" class="nav-item">
          <a href="adm_lote.php" class="nav-link">
            <i class="nav-icon fas fa-cubes"></i>
            <p>
              Gestión lote
            </p>
          </a>
        </li>
        <li class="nav-header">Compras</li>
        <li id="gestion_proveedor" class="nav-item">
          <a href="adm_proveedor.php" class="nav-link">
            <i class="nav-icon fas fa-truck"></i>
            <p>
              Gestión proveedor
            </p>
          </a>
        </li>
        <li id="gestion_compra" class="nav-item">
          <a href="adm_compras.php" class="nav-link">
            <i class="nav-icon fas fa-people-carry"></i>
            <p>
              Gestión compras
            </p>
          </a>
        </li>
      </ul>
    </nav>
    <!-- /.sidebar-menu -->
    `;
    $('#menu_lateral').html(template);

  }

	function loader(mensaje){
    if(mensaje==''||mensaje==null){
      mensaje="Cargando...";
    }
    Swal.fire({
      position: 'center',
      html: '<i class="fas fa-2x fa-sync-alt fa-spin"></i>',
      title: mensaje,
      showConfirmButton: false
    })
  }

  function closeLoader(mensaje, tipo){
    if(mensaje==''||mensaje==null){
      Swal.close();
    }else{
      Swal.fire({
        position: 'center',
        icon: tipo,
        title: mensaje,
        showConfirmButton: false
      })
    }
  }

	async function load_user() {
		let funcion = "load_user";
		let data = await fetch('/farmacia-V2/Controllers/usuarioController.php', {
			method: 'POST',
			headers: { 'Content-type': 'application/x-www-form-urlencoded' },
			body: 'funcion=' + funcion
		})
		if (data.ok) {
			//mejor usar data.text que data.json, pues si hay error, este se añade como cadena de texto a los datos
			let response = await data.text();
			try {
				let usuario = JSON.parse(response);
				console.log(usuario);
				template=`
					<div class="text-center">
						<img data-nombre="${usuario.nombre}" data-apellidos="${usuario.apellidos}" data-avatar="${usuario.avatar}"role="button" src="/farmacia-V2/util/img/user/${usuario.avatar}" class="editar_avatar profile-user-img img-fluid img-circle" data-toggle="modal" data-target="#cambiar_avatar">
					</div>
					<h3 class="profile-username text-center text-success">${usuario.nombre}</h3>
						<p class="text-muted text-center">${usuario.apellidos}</p>
						<ul class="list-group list-group-unbordered mb-3">
							<li class="list-group-item"><b style="color:#0B7300">Edad</b><a class="float-right">${usuario.edad}</a>
							</li>
							<li class="list-group-item"><b style="color:#0B7300">DNI</b><a class="float-right">${usuario.dni}</a>
							</li>
							<li class="list-group-item"><b style="color:#0B7300">Tipo usuario</b>
								<span class="float-right">
					`;
					if(usuario.id_tipo==1){
						template+=`<h1 class="badge badge-danger">${usuario.tipo}</h1>`;
					}
					else if(usuario.id_tipo==2){
						template+=`<h1 class="badge badge-warning">${usuario.tipo}</h1>`;
					}
					else if(usuario.id_tipo==3){
						template+=`<h1 class="badge badge-info">${usuario.tipo}</h1>`;
					}
					template+=`</span>    
							</li>
							<button data-nombre="${usuario.nombre}" data-apellidos="${usuario.apellidos}" data-avatar="${usuario.avatar}" data-toggle="modal" data-target="#cambiar_password" type="button" class="cambiar_password btn btn-block btn-outline-warning btn-sm">Cambiar contraseña</button>
						</ul>`;
				$('#card_1').html(template);
				let template2=`
				<div class="card-header">
					<h3 class="card-title">Sobre mí</h3>
					<div class="card-tools">
						<button id="${usuario.id}" telefono="${usuario.telefono}" id_residencia="${usuario.id_residencia}" direccion="${usuario.direccion}" correo="${usuario.correo}" sexo="${usuario.sexo}" adicional="${usuario.adicional}" class="editar_datos btn btn-tool" data-toggle="modal" data-target="#editar_perfil">
						<i class="fas fa-pencil-alt"></i></button>
					</div>
				</div>
				<div class="card-body">
					<strong>
						<i class="fas fa-phone mr-1"></i>Teléfono
					</strong>
					<p class="text-muted">${usuario.telefono}</p>
					<strong>
						<i class="fas fa-map-marker-alt mr-1"></i>Residencia
					</strong>
					<p class="text-muted">${usuario.residencia}</p>
					<strong>
						<i class="fas fa-map-marker-alt mr-1"></i>Dirección
					</strong>
					<p class="text-muted">${usuario.direccion}</p>
					<strong>
						<i class="fas fa-at mr-1"></i>Correo
					</strong>
					<p class="text-muted">${usuario.correo}</p>
					<strong>
						<i class="fas fa-smile-wink mr-1"></i>Sexo
					</strong>
					<p class="text-muted">${usuario.sexo}</p>
					<strong>
						<i class="fas fa-pencil-alt mr-1"></i>Información adicional
					</strong>
					<p class="text-muted">${usuario.adicional}</p>
				</div>`;
				$('#card_2').html(template2);
			} catch (error) {
				console.error(error);
				console.log(response);
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Hubo conflicto en el sistema, póngase en contacto con el administrador.'
				})
			}
		} else {
			Swal.fire({
				icon: 'error',
				title: data.statusText,
				text: 'Hubo conflicto de código: ' + data.status
			})
		}
	}

	async function editar_datos(datos) {
		let data = await fetch('/farmacia-V2/Controllers/usuarioController.php', {
			method: 'POST',
			body: datos
		})
		if (data.ok) {
			//mejor usar data.text que data.json, pues si hay error, este se añade como cadena de texto a los datos
			let response = await data.text();
			try {
				//se descodifica el json
				let respuesta = JSON.parse(response);
				if(respuesta.mensaje=='success'){
					toastr.success('Datos de usuario editados.', 'Éxito');
					load_user();
					$('#editar_perfil').modal('hide');
				}else{
					if(respuesta.mensaje=='error_decrypt'){
						Swal.fire({
							position: 'center',
							icon: 'error',
							title: 'No vulnere los datos',
							showConfirmButton: true,
							timer: 1000,
						}).then(function(){
							location.reload();
						});
					}
					if(respuesta.mensaje=='error_session'){
						Swal.fire({
							position: 'center',
							icon: 'error',
							title: 'Sesión finalizada',
							showConfirmButton: true,
							timer: 1000,
						}).then(function(){
							location.href("/farmacia-V2/index.php");
						});
					}
				}
			} catch (error) {
				console.error(error);
				console.log(response);
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Hubo conflicto en el sistema, póngase en contacto con el administrador.'
				})
			}
		} else {
			Swal.fire({
				icon: 'error',
				title: data.statusText,
				text: 'Hubo conflicto de código: ' + data.status
			})
		}
	}

	$(document).on('click', '.editar_datos', (e)=>{
		let elemento=$(this)[0].activeElement;
		let id=$(elemento).attr('id');
		let telefono=$(elemento).attr('telefono');
		let id_residencia=$(elemento).attr('id_residencia');
		let direccion=$(elemento).attr('direccion');
		let correo=$(elemento).attr('correo');
		let sexo=$(elemento).attr('sexo');
		let adicional=$(elemento).attr('adicional');
		$('#editar_telefono').val(telefono);
		$('#editar_residencia').val(id_residencia).trigger('change');
		$('#editar_direccion').val(direccion);
		$('#editar_correo').val(correo);
		$('#editar_sexo').val(sexo);
		$('#editar_adicional').val(adicional);
	})

	$.validator.setDefaults({
    submitHandler: function () {
      let datos=new FormData($('#form-editar_perfil')[0]);
			let funcion = "editar_datos";
			datos.append('funcion', funcion);
			editar_datos(datos);
    }
  });
  $('#form-editar_perfil').validate({
    rules: {
      editar_telefono: {
        required: true,
				number: true,
				minlength: 8,
				maxlength: 8
      },
			editar_direccion: {
        required: true,
				minlength: 2,
				maxlength: 100
      },
      editar_correo: {
        required: true,
        email: true,
      },
      editar_residencia: {
        required: true
      },
      editar_sexo: {
        required: true
      },
			editar_adicional: {
        required: true,
				minlength: 2,
				maxlength: 100
      },
    },
    messages: {
      editar_telefono: {
        required: "Introduce un número de teléfono",
        number: "Debe contener números",
				minlength: "Debe contener 8 caracteres.",
				maxlength: "Debe contener 8 caracteres."
      },
			editar_direccion: {
        required: "Dato requerido",
				minlength: "Debe contener 2 caracteres mínimo.",
				maxlength: "Debe contener 100 caracteres máximo."
      },
      editar_correo: {
        required: "Introduce una dirección de correo.",
        email: "Introduce una dirección de correo válida."
      },
      editar_residencia: {
        required: "Dato requerido"
      },
      editar_sexo: {
        required: "Dato requerido"
      },
			editar_direccion: {
        required: "Dato requerido",
				minlength: "Debe contener 2 caracteres mínimo.",
				maxlength: "Debe contener 100 caracteres máximo."
      },
    },
    errorElement: 'span',
    errorPlacement: function (error, element) {
      error.addClass('invalid-feedback');
      element.closest('.form-group').append(error);
    },
    highlight: function (element, errorClass, validClass) {
      $(element).addClass('is-invalid');
			$(element).removeClass('is-valid');
    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).removeClass('is-invalid');
			$(element).addClass('is-valid');
    }
  });

	$(document).on('click', '.editar_avatar', function(){
		let elemento=$(this);
		let nombre=$(elemento).data('nombre');
		let apellidos=$(elemento).data('apellidos');
		let avatar=$(elemento).data('avatar');
		$('#nombre_avatar').text(nombre);
		$('#apellidos_avatar').text(apellidos);
		$('#avatar').attr('src', '/farmacia-V2/util/img/user/'+avatar);
	});

	async function editar_avatar(datos) {
		let data = await fetch('/farmacia-V2/Controllers/usuarioController.php', {
			method: 'POST',
			body: datos
		})
		if (data.ok) {
			//mejor usar data.text que data.json, pues si hay error, este se añade como cadena de texto a los datos
			let response = await data.text();
			try {
				//se descodifica el json
				let respuesta = JSON.parse(response);
				if(respuesta.mensaje=='success'){
					toastr.success('Avatar cambiado.', 'Éxito');
					load_user();
					$('#avatar_1').attr('src', '/farmacia-V2/Util/img/user/'+respuesta.img);
					$('#avatar_2').attr('src', '/farmacia-V2/Util/img/user/'+respuesta.img);
					$('#cambiar_avatar').modal('hide');
					$('#form-cambiar_avatar').trigger('reset');
				}else{
					if(respuesta.mensaje=='error_session'){
						Swal.fire({
							position: 'center',
							icon: 'error',
							title: 'Sesión finalizada',
							showConfirmButton: true,
							timer: 1000,
						}).then(function(){
							location.href("/farmacia-V2/index.php");
						});
					}
				}
			} catch (error) {
				console.error(error);
				console.log(response);
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Hubo conflicto en el sistema, póngase en contacto con el administrador.'
				})
			}
		} else {
			Swal.fire({
				icon: 'error',
				title: data.statusText,
				text: 'Hubo conflicto de código: ' + data.status
			})
		}
	}
	$.validator.setDefaults({
    submitHandler: function () {
      let datos=new FormData($('#form-cambiar_avatar')[0]);
			let funcion = "cambiar_avatar";
			datos.append('funcion', funcion);
			editar_avatar(datos);
    }
  });
  $('#form-cambiar_avatar').validate({
    rules: {
      avatar_mod: {
        required: true,
				extension: "png|jpg|jpeg|webp"
      },
    },
    messages: {
      avatar_mod: {
        required: "Se requiere escoger un archivo",
				extension: "El archivo debe ser de formato png | jpg | jpeg | webp."
      },
    },
    errorElement: 'span',
    errorPlacement: function (error, element) {
      error.addClass('invalid-feedback');
      element.closest('.form-group').append(error);
    },
    highlight: function (element, errorClass, validClass) {
      $(element).addClass('is-invalid');
			$(element).removeClass('is-valid');
    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).removeClass('is-invalid');
			$(element).addClass('is-valid');
    }
  });

	$(document).on('click', '.cambiar_password', function(){
		let elemento=$(this);
		let nombre=$(elemento).data('nombre');
		let apellidos=$(elemento).data('apellidos');
		let avatar=$(elemento).data('avatar');
		$('#nombre_password').text(nombre);
		$('#apellidos_password').text(apellidos);
		$('#avatar_password').attr('src', '/farmacia-V2/util/img/user/'+avatar);
	});

$.validator.setDefaults({
    submitHandler: function () {
      let datos=new FormData($('#form-cambiar_password')[0]);
			let funcion = "cambiar_password";
			datos.append('funcion', funcion);
			editar_password(datos);
    }
  });
  $('#form-cambiar_password').validate({
    rules: {
      oldpass: {
        required: true,
      },
      newpass: {
        required: true,
      },
    },
    messages: {
      oldpass: {
        required: "Dato necesario",
      },
      newpass: {
        required: "Se requiere escoger un archivo",
      },
    },
    errorElement: 'span',
    errorPlacement: function (error, element) {
      error.addClass('invalid-feedback');
      element.closest('.form-group').append(error);
    },
    highlight: function (element, errorClass, validClass) {
      $(element).addClass('is-invalid');
			$(element).removeClass('is-valid');
    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).removeClass('is-invalid');
			$(element).addClass('is-valid');
    }
  });
	async function editar_password(datos) {
		let data = await fetch('/farmacia-V2/Controllers/usuarioController.php', {
			method: 'POST',
			body: datos
		})
		if (data.ok) {
			//mejor usar data.text que data.json, pues si hay error, este se añade como cadena de texto a los datos
			let response = await data.text();
			try {
				//se descodifica el json
				let respuesta = JSON.parse(response);
				console.log(respuesta);
				if(respuesta.mensaje=='success'){
					toastr.success('La contraseña ha sido actualizada.', 'Éxito');
					$('#cambiar_password').modal('hide');
					$('#form-cambiar_password').trigger('reset');
				}else{
					if(respuesta.mensaje=='error_pass'){
						toastr.error('La contraseña no es correcta, vuelva a introducirla.', 'Error');
					}
					if(respuesta.mensaje=='error_session'){
						Swal.fire({
							position: 'center',
							icon: 'error',
							title: 'Sesión finalizada',
							showConfirmButton: true,
							timer: 1000,
						}).then(function(){
							location.href("/farmacia-V2/index.php");
						});
					}
				}
			} catch (error) {
				console.error(error);
				console.log(response);
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Hubo conflicto en el sistema, póngase en contacto con el administrador.'
				})
			}
		} else {
			Swal.fire({
				icon: 'error',
				title: data.statusText,
				text: 'Hubo conflicto de código: ' + data.status
			})
		}
	}

	/*var funcion='';
	var id_usuario = $('#id_usuario').val();
	var edit=false;
	//console.log(id_usuario);
	buscar_usuario(id_usuario);
	function buscar_usuario(dato) {
			funcion='buscar_usuario';
			$.post('../controlador/usuarioController.php',{dato, funcion}, (response)=>{
					//console.log(response);
					let nombre='';
					let apellidos='';
					let edad='';
					let dni='';
					let tipo='';
					let telefono='';
					let residencia='';
					let correo='';
					let sexo='';
					let adicional='';
					//parse decodifica el json de string a los valores
					const usuario = JSON.parse(response);
					nombre+=`${usuario.nombre}`;
					apellidos+=`${usuario.apellidos}`;
					edad+=`${usuario.edad}`;
					dni+=`${usuario.dni}`;
					if(usuario.tipo=='Root'){
							tipo+=`<h1 class="badge badge-danger">${usuario.tipo}</h1>`;
						}
						if(usuario.tipo=='Administrador'){
							tipo+=`<h1 class="badge badge-warning">${usuario.tipo}</h1>`;
						}
						if(usuario.tipo=='Tecnico'){
							tipo+=`<h1 class="badge badge-info">${usuario.tipo}</h1>`;
						}
					telefono+=`${usuario.telefono}`;
					residencia+=`${usuario.residencia}`;
					correo+=`${usuario.correo}`;
					sexo+=`${usuario.sexo}`;
					adicional+=`${usuario.adicional}`;
					$('#nombre_us').html(nombre);
					$('#apellidos_us').html(apellidos);
					$('#edad').html(edad);
					$('#dni_us').html(dni);
					$('#us_tipo').html(tipo);
					$('#telefono_us').html(telefono);
					$('#residencia_us').html(residencia);
					$('#correo_us').html(correo);
					$('#sexo_us').html(sexo);
					$('#adicional_us').html(adicional);
					$('#avatar-content').attr('src',usuario.avatar);
					$('#avatar-modal-pass').attr('src',usuario.avatar);
					$('#avatar-modal-avatar').attr('src',usuario.avatar);
					$('#avatar-nav').attr('src',usuario.avatar);
			})
	}
	//con $(algo)--> se analiza ese algo, si es document, se analiza todo el documento
	$(document).on('click','.edit', (e)=>{
			funcion='capturar_datos';
			edit=true;
			$.post('../controlador/usuarioController.php',{funcion, id_usuario}, (response)=>{
					//console.log(response);
					const usuario = JSON.parse(response);
					$('#telefono').val(usuario.telefono);
					$('#residencia').val(usuario.residencia);
					$('#correo').val(usuario.correo);
					$('#sexo').val(usuario.sexo);
					$('#adicional').val(usuario.adicional);
			})
	});

	//solo se analiza el #form-usuario cuando se hace submit
	$('#form-usuario').submit(e=>{
			if(edit==true){
					//el id #telefono es el del formulario
					let telefono=$('#telefono').val();
					let residencia=$('#residencia').val();
					let correo=$('#correo').val();
					let sexo=$('#sexo').val();
					let adicional=$('#adicional').val();
					funcion='editar_usuario';
					$.post('../controlador/usuarioController.php', {id_usuario, funcion, telefono, residencia, correo, sexo, adicional},(response)=>{
					if(response=='editado'){
							//mostrar el alert de editado
							$('#editado').hide('slow');
							$('#editado').show(1000);
							$('#editado').hide(3000);
							//resetea los campos de la card
							$('#form-usuario').trigger('reset');
					}
					edit=false;
					//para actualizar el card "sobre mi"
					buscar_usuario(id_usuario);
					})
			}else{
					//mostrar el alert de no editado
					$('#no-editado').hide('slow');
					$('#no-editado').show(1000);
					$('#no-editado').hide(3000);
					//resetea los campos de la card
					$('#form-usuario').trigger('reset');
			}
			e.preventDefault();
	});

	$('#form-pass').submit(e=>{
			let oldpass=$('#oldpass').val();
			let newpass=$('#newpass').val();
			funcion='cambiar_contra';
			e.preventDefault();
			$.post('../controlador/usuarioController.php', {id_usuario, funcion, oldpass, newpass},(response)=>{
					if(response=='update'){
							//mostrar el alert de editado
							$('#update').hide('slow');
							$('#update').show(1000);
							$('#update').hide(3000);
							//resetea los campos de la card
							$('#form-pass').trigger('reset');
					}else{
							//mostrar el alert de editado
							$('#noupdate').hide('slow');
							$('#noupdate').show(1000);
							$('#noupdate').hide(3000);
							//resetea los campos de la card
							$('#form-pass').trigger('reset');
					}
			})
	})

	$('#form-avatar').submit(e=>{
			let formData = new FormData($('#form-avatar')[0]);
			$.ajax({
					url:'../controlador/usuarioController.php',
					type:'POST',
					data:formData,
					cache:false,
					processData:false,
					contentType:false
			}).done(function(response){
					//console.log(response);
					//se reemplazan los avatares del modal y del content
					const json=JSON.parse(response);
					if(json.alert=='edit'){

							$('#avatar-modal').attr('src',json.ruta);
							$('#edit').hide('slow');
							$('#edit').show(1000);
							$('#edit').hide(3000);
							$('#form-avatar').trigger('reset');
							$('#avatar-modal-avatar').attr('src',json.ruta);
							buscar_usuario(id_usuario);
					}else{
							$('#noedit').hide('slow');
							$('#noedit').show(1000);
							$('#noedit').hide(3000);
							$('#form-avatar').trigger('reset');
					}
			});
			e.preventDefault();
	})*/
})