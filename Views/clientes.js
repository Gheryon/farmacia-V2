$(document).ready(function(){
  loader();
  //setTimeout(verificar_sesion, 2000);
  verificar_sesion();

  //para evitar que los mensajes toastr se acumulen en pantalla
  toastr.options={
    "preventDuplicates": true
  }

  async function obtener_clientes(){
    let funcion="obtener_clientes";
    let data=await fetch('/farmacia-V2/Controllers/clienteController.php',{
      method: 'POST',
      headers: {'Content-type': 'application/x-www-form-urlencoded'},
      body: 'funcion='+funcion
    })
    if(data.ok){
      //mejor usar data.text que data.json, pues si hay error, este se añade como cadena de texto a los datos
      let response=await data.text();
      try{
        //se descodifica el json
        let clientes=JSON.parse(response);
        console.log(clientes);
        $('#clientes').DataTable({
          data: clientes,
          "aaSorting":[],
          "searching": true,
          "scrollX": true,
          "autoWidth": false,
          columns: [
            //la variable datos es la variable clientes
            {"render": function(data, type, datos, meta){
              let template='';
              template+=`
              <div class="card bg-light">
                <div class="h5 card-header text-muted border-bottom-0">`
                if(datos.estado=='A'){
                  template+=`<span class="badge badge-success">Activo</span>`;
                }else{
                  template+=`<span class="badge badge-secondary">Inactivo</span>`;
                }
              template+=`</div>
                <div class="card-body pt-0">
                  <div class="row">
                    <div class="col-md-4">
                      <h4 class=""><b>${datos.nombre} ${datos.apellidos}</b></h4>
                      <ul class="ml-4 mb-0 fa-ul text-muted">
                        <li class="h8"><span class="fa-li"><i class="fas fa-lg fa-angle-double-right"></i></span> DNI: ${datos.dni}</li>
                        <li class="h8"><span class="fa-li"><i class="fas fa-lg fa-angle-double-right"></i></span> Edad: ${datos.edad}</li>
                        <li class="h8"><span class="fa-li"><i class="fas fa-lg fa-angle-double-right"></i></span> Teléfono: ${datos.telefono}</li>
                      </ul>
                    </div>
                    <div class="col-md-4">
                      <ul class="ml-4 mb-0 fa-ul text-muted">
                        <li class="h8"><span class="fa-li"><i class="fas fa-lg fa-angle-double-right"></i></span> Correo: ${datos.correo}</li>
                        <li class="h8"><span class="fa-li"><i class="fas fa-lg fa-angle-double-right"></i></span> Sexo: ${datos.sexo}</li>
                        <li class="h8"><span class="fa-li"><i class="fas fa-lg fa-angle-double-right"></i></span> Adicional: ${datos.adicional}</li>
                      </ul>
                    </div>
                    <div class="col-md-4 text-center">
                      <img src="/farmacia-V2/util/img/${datos.avatar}" alt="user-avatar" width="150px" class="img-circle img-fluid">
                    </div>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="text-right">`;
                  //id_tipo_sesion es distinto de id_tipo, el primero es el del cliente que ha iniciado sesion, el otro es el de cada cliente
                  if(datos.estado=='A'){
                    template+=`<button id="${datos.id}" avatar="${datos.avatar}" nombre="${datos.nombre}" apellidos="${datos.apellidos}" class="eliminar_cliente btn bg-gradient-danger btn-circle btn-lg" title="Borrar">
                      <i class="far fa-trash-alt mr-1"></i>
                    </button>
                    <button id="${datos.id}" avatar="${datos.avatar}" nombre="${datos.nombre}" apellidos="${datos.apellidos}" class="editar_cliente btn bg-gradient-success btn-circle btn-lg" title="Editar">
                      <i class="fas fa-pencil-alt mr-1"></i>
                    </button>`;
                  }else if(datos.estado=='I'){
                    template+=`<button id="${datos.id}" avatar="${datos.avatar}" nombre="${datos.nombre}" apellidos="${datos.apellidos}" funcion="reactivar_cliente" class="reactivar btn bg-gradient-primary btn-circle btn-lg" title="Reactivar">
                      <i class="fas fa-plus mr-1"></i>
                    </button>
                    <button id="${datos.id}" avatar="${datos.avatar}" nombre="${datos.nombre}" apellidos="${datos.apellidos}" class="editar_cliente btn bg-gradient-success btn-circle btn-lg" title="Editar">
                      <i class="fas fa-pencil-alt mr-1"></i>
                    </button>`;
                  }
                  template+=`
                  </div>
                </div>
              </div>`
            return template;
            }}
          ],
          "language":espannol,
          "destroy": true
        });
      } catch (error) {
        console.error(error);
        console.log(response);
        Swal.fire({
          icon:'error',
          title: 'Error',
          text: 'Hubo conflicto en el sistema, póngase en contacto con el administrador.'
        })
      }
    }else{
      Swal.fire({
        icon:'error',
        title: data.statusText,
        text: 'Hubo conflicto de código: '+data.status
      })
    }
  }

  $(document).on('click', '.confirmar', (e)=>{
    let elemento=$(this)[0].activeElement;
    let id=$(elemento).attr('id');
    let nombre=$(elemento).attr('nombre');
    let avatar=$(elemento).attr('avatar');
    let apellidos=$(elemento).attr('apellidos');
    let funcion=$(elemento).attr('funcion');
    $('#nombre_confirmar').text(nombre);
    $('#apellidos_confirmar').text(apellidos);
    $('#funcion').val(funcion);
    $('#id_user').val(id);
    $('#avatar_confirmar').attr('src','/farmacia-V2/Util/img/user/'+avatar);

  });

	async function crear_cliente(datos) {
		let data = await fetch('/farmacia-V2/Controllers/clienteController.php', {
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
					toastr.success('Cliente creado.', 'Éxito');
					obtener_clientes();
					$('#crear_cliente').modal('hide');
          $('#form-crear_cliente').trigger('reset');
				}else{
					if(respuesta.mensaje=='error_cliente'){
						Swal.fire({
							position: 'center',
							icon: 'error',
							title: 'Ya existe el cliente.',
              text: 'El cliente ya está registrado en el sistema.'
						});
            $('#crear_cliente').modal('hide');
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

  $.validator.setDefaults({
    submitHandler: function () {
      let datos=new FormData($('#form-crear_cliente')[0]);
			let funcion = "crear_cliente";
			datos.append('funcion', funcion);
			crear_cliente(datos);
    }
  });

  /*jQuery.validator.addMethod("no_numbers", function(value){
    //se eliminan los espacios en blanco reemplazandolos con valor vacío
    let campo=value.replace(/ /g,"");
    //comprueba que campo esté formado por letras mayus o minus
    let estado=/^[A-Za-z]+$/.test(campo);
    return estado;
  },"*No se permiten números.");*/
  //no hace falta incluir el mensaje no_numbers, ya aparece en el addMethod anterior
  $('#form-crear_cliente').validate({
    rules: {
      nombre: {
        required: true,
				minlength: 3
      },
      apellidos: {
        required: true,
				minlength: 3
      },
      nacimiento: {
        required: true
      },
      dni: {
        required: true,
        number: true,
				minlength: 8,
				maxlength: 8
      },
      telefono: {
        required: true,
        number: true,
				minlength: 9,
				maxlength: 9
      },
      correo: {
        required: true,
        email: true,
      },
      sexo: {
        required: true
      },
			adicional: {
        required: true,
				minlength: 2,
				maxlength: 100
      },
    },
    messages: {
      nombre: {
        required: "Es necesario introducir un nombre.",
				minlength: "Debe contener 3 caracteres como mínimo."
      },
      apellidos: {
        required: "Es necesario introducir apellidos.",
				minlength: "Debe contener 3 caracteres como mínimo."
      },
      nacimiento: {
        required: "Se necesita una fecha de nacimiento.",
				minlength: "Debe contener 3 caracteres como mínimo."
      },
      dni: {
        required: "Introduce un dni válido",
        number: "Debe contener números",
				minlength: "Debe contener 8 caracteres.",
				maxlength: "Debe contener 8 caracteres."
      },
      telefono: {
        required: "Introduce un número de teléfono",
        number: "Debe contener números",
				minlength: "Debe contener 9 caracteres.",
				maxlength: "Debe contener 9 caracteres."
      },
      correo: {
        required: "Introduce una dirección de correo.",
        email: "Introduce una dirección de correo válida."
      },
      sexo: {
        required: "Dato requerido"
      },
			adicional: {
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

  function cargar_menu_superior(cliente) {
    let template=`
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
      <!-- información de cliente -->
      <li class="nav-item dropdown">
        <a class="nav-link" data-toggle="dropdown" href="#">
        <img src="/farmacia-V2/util/img/user/${cliente.avatar}" width="30" height="30" alt="Farmacia Logo">
          <span>${cliente.nombre+' '+cliente.apellidos}</span>
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

  function cargar_menu_lateral(cliente) {
    let template=`
    <!-- Sidebar user (optional) -->
    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
      <div class="image">
        <img src="/farmacia-V2/util/img/user/${cliente.avatar}" class="img-circle elevation-2" alt="User Image">
      </div>
      <div class="info">
        <a href="#" class="d-block">${cliente.nombre+' '+cliente.apellidos}</a>
      </div>
    </div>

    <!-- Sidebar Menu -->
    <nav class="mt-2">
      <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
        <!-- Add icons to the links using the .nav-icon class
            with font-awesome or any other icon font library -->
        <li class="nav-header">Cliente</li>
        <li class="nav-item">
          <a href="/farmacia-V2/Views/perfil.php" class="nav-link">
            <i class="nav-icon fas fa-user-cog"></i>
            <p>
              Perfil
            </p>
          </a>
        </li>
        <li id="gestion_cliente" class="nav-item">
          <a href="/farmacia-V2/Views/usuarios.php" class="nav-link">
            <i class="nav-icon fas fa-users"></i>
            <p>
              Gestión usuarios
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

  async function verificar_sesion(){
    let funcion="verificar_sesion";
    let data=await fetch('/farmacia-V2/Controllers/usuarioController.php',{
      method: 'POST',
      headers: {'Content-type': 'application/x-www-form-urlencoded'},
      body: 'funcion='+funcion
    })
    if(data.ok){
      //mejor usar data.text que data.json, pues si hay error, este se añade como cadena de texto a los datos
      let response=await data.text();
      try{
        //se descodifica el json
        let cliente=JSON.parse(response);
        if(cliente.length!=0&&cliente.id_tipo!=3){
          cargar_menu_superior(cliente);
          cargar_menu_lateral(cliente);
          obtener_clientes();
          closeLoader();
        }else{
          location.href="/farmacia-V2/";
        }
      } catch (error) {
        console.error(error);
        console.log(response);
        Swal.fire({
          icon:'error',
          title: 'Error',
          text: 'Hubo conflicto en el sistema, póngase en contacto con el administrador.'
        })
      }
    }else{
      Swal.fire({
        icon:'error',
        title: data.statusText,
        text: 'Hubo conflicto de código: '+data.status
      })
    }
  }

  async function confirmar(datos) {
		let data = await fetch('/farmacia-V2/Controllers/clienteController.php', {
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
          if(respuesta.funcion=="eliminar cliente"){
            toastr.success('Cliente eliminado.', 'Éxito');
            obtener_clientes();
            $('#confirmar').modal('hide');
            $('#form-confirmar').trigger('reset');
          }
          else if(respuesta.funcion=="reactivar cliente"){
            toastr.success('Cliente reactivado.', 'Éxito');
            obtener_clientes();
            $('#confirmar').modal('hide');
            $('#form-confirmar').trigger('reset');
          }
          else if(respuesta.funcion=="ascender cliente"){
            toastr.success('Cliente ascendido.', 'Éxito');
            obtener_clientes();
            $('#confirmar').modal('hide');
            $('#form-confirmar').trigger('reset');
          }
          else if(respuesta.funcion=="descender cliente"){
            toastr.success('Cliente descendido.', 'Éxito');
            obtener_clientes();
            $('#confirmar').modal('hide');
            $('#form-confirmar').trigger('reset');
          }
				}else{
					if(respuesta.mensaje=='error_cliente'){
						Swal.fire({
							position: 'center',
							icon: 'error',
							title: 'Ya existe el cliente.',
              text: 'El cliente ya está registrado en el sistema.'
						});
            $('#crear_cliente').modal('hide');
            $('#residencia').val('').trigger('change');
					}
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
          if(respuesta.mensaje=='error_pass'){
						toastr.error('No se pudo '+respuesta.funcion+', la contraseña no es correcta, vuelva a introducirla.', 'Error');
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

  $.validator.setDefaults({
    submitHandler: function () {
      let datos=new FormData($('#form-confirmar')[0]);
			confirmar(datos);
    }
  });

  $('#form-confirmar').validate({
    rules: {
      pass: {
        required: true,
      }
    },
    messages: {
      pass: {
        required: "Es necesario introducir una contraseña.",
      }
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
/*    var tipo_cliente= $('#tipo_cliente').val();
    //si el tipo de cliente==2, tecnico, no se muestra boton de crear cliente
    if(tipo_cliente==2){
      $('#button-crear-cliente').hide();
    }
    buscar_datos();
    var funcion;
    function buscar_datos(consulta) {
        funcion='buscar_clientes_adm';
        $.post('../controlador/clienteController.php', {consulta, funcion},(response)=>{
            const clientes= JSON.parse(response);
            let template='';
            console.log(tipo_cliente);
            clientes.forEach(cliente => {
                template+=`
                <div clienteId="${cliente.id}"class="col-12 col-sm6 col-md-4 d-flex align-items-stretch flex-column">
              <div class="card bg-light d-flex flex-fill">
              <div class="card-header text-muted border-bottom-0">`;
                if(cliente.tipo_cliente==3){
                  template+=`<h1 class="badge badge-danger">${cliente.tipo}</h1>`;
                }
                if(cliente.tipo_cliente==2){
                  template+=`<h1 class="badge badge-warning">${cliente.tipo}</h1>`;
                }
                if(cliente.tipo_cliente==1){
                  template+=`<h1 class="badge badge-info">${cliente.tipo}</h1>`;
                }
                template+=`
              </div>
              <div class="card-body pt-0">
                <div class="row">
                  <div class="col-7">
                    <h2 class="lead"><b>${cliente.nombre} ${cliente.apellidos}</b></h2>
                    <p class="text-muted text-sm"><b>Sobre mí: </b> ${cliente.adicional} </p>
                    <ul class="ml-4 mb-0 fa-ul text-muted">
                    <li class="small"><span class="fa-li"><i class="fas fa-lg fa-id-card"></i></span> DNI: + ${cliente.dni}</li>
                    <li class="small"><span class="fa-li"><i class="fas fa-lg fa-birthday-cake"></i></span> Edad #: + ${cliente.edad}</li>
                      <li class="small"><span class="fa-li"><i class="fas fa-lg fa-building"></i></span> Residencia: ${cliente.residencia}</li>
                      <li class="small"><span class="fa-li"><i class="fas fa-lg fa-phone"></i></span> Teléfono #: + ${cliente.telefono}</li>
                      <li class="small"><span class="fa-li"><i class="fas fa-lg fa-at"></i></span> Correo #: + ${cliente.correo}</li>
                      <li class="small"><span class="fa-li"><i class="fas fa-lg fa-smile-wink"></i></span> Sexo #: + ${cliente.sexo}</li>
                    </ul>
                  </div>
                  <div class="col-5 text-center">
                    <img src="${cliente.avatar}" alt="user-avatar" class="img-circle img-fluid">
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <div class="text-right">`;
                //comprobar si cliente logueado es root
                if(tipo_cliente==3){
                  //si es root, puede eliminar a todos menos a root
                  if(cliente.tipo_cliente!=3){
                    template+=`
                    <button class="borrar-cliente btn btn-danger mr-1  type="button" data-toggle="modal" data-target="#confirmar">
                      <i class="fas fa-window-close mr-1"></i>Eliminar
                  </button>
                    `;
                  }
                  //si el cliente es un técnico, root puede ascenderlo
                  if(cliente.tipo_cliente==2){
                    template+=`
                    <button class="ascender btn btn-primary ml-1" type="button" data-toggle="modal" data-target="#confirmar">
                      <i class="fas fa-sort-amount-up mr-1"></i>Ascender
                  </button>
                    `;
                  }
                  if(cliente.tipo_cliente==1){
                    template+=`
                    <button class="descender btn btn-secondary ml-1" type="button" data-toggle="modal" data-target="#confirmar">
                      <i class="fas fa-sort-amount-down mr-1"></i>Descender
                  </button>
                    `;
                  }
                }else{
                  //cliente logueado no es root.
                  //si es 1=>administrador, solo muestra boton borrar a tecnicos, no a administradores o root
                  if(tipo_cliente==1 && cliente.tipo_cliente!=1 && cliente.tipo_cliente!=3){
                    template+=`
                    <button class="borrar-cliente btn btn-danger  type="button" data-toggle="modal" data-target="#confirmar">
                      <i class="fas fa-window-close mr-1"></i>Eliminar
                  </button>
                    `;
                  }
                }
                 template+=`
                </div>
              </div>
            </div>
            </div>
                `;
            });
            $('#clientes').html(template);
        });
    }
    $(document).on('keyup','#buscar',function(){
        let valor = $(this).val();
        if(valor!=""){
            buscar_datos(valor);
        }else{
            buscar_datos();
        }
    });

    $('#form-crear-cliente').submit(e=>{
      let nombre= $('#nombre').val();
      let apellidos= $('#apellidos').val();
      let edad= $('#edad').val();
      let dni= $('#dni').val();
      let pass= $('#pass').val();
      funcion='crear_nuevo_cliente';
      $.post('../controlador/clienteController.php',{nombre, apellidos, edad, dni, pass, funcion},(response)=>{
        if(response=='add'){
          //mostrar el alert de éxito
          $('#add').hide('slow');
          $('#add').show(1000);
          $('#add').hide(3000);
          //resetea los campos de la card
          $('#form-crear-cliente').trigger('reset');
          buscar_datos();
        }else{
          //mostrar el alert de error
          $('#noadd').hide('slow');
          $('#noadd').show(1000);
          $('#noadd').hide(3000);
          //resetea los campos de la card
          $('#form-crear-cliente').trigger('reset');
        }
      });
      //para prevenir la actualización por defecto de la página
      e.preventDefault();
    });

    $(document).on('click', '.ascender',(e)=>{
      //se quiere acceder al elemento clienteid de la card y guardarlo en elemento, para ello hay que subir 4 veces desde donde está el boton ascender
      const elemento=$(this)[0].activeElement.parentElement.parentElement.parentElement.parentElement;
      //console.log(elemento);
      const id=$(elemento).attr('clienteId');
      //console.log(id);
      funcion='ascender';
      $('#id_user').val(id);
      $('#funcion').val(funcion);
    });

    $(document).on('click', '.descender',(e)=>{
      //se quiere acceder al elemento clienteid de la card y guardarlo en elemento, para ello hay que subir 4 veces desde donde está el boton ascender
      const elemento=$(this)[0].activeElement.parentElement.parentElement.parentElement.parentElement;
      //console.log(elemento);
      const id=$(elemento).attr('clienteId');
      //console.log(id);
      funcion='descender';
      $('#id_user').val(id);
      $('#funcion').val(funcion);
    });

    $(document).on('click', '.borrar-cliente',(e)=>{
      //se quiere acceder al elemento clienteid de la card y guardarlo en elemento, para ello hay que subir 4 veces desde donde está el boton ascender
      const elemento=$(this)[0].activeElement.parentElement.parentElement.parentElement.parentElement;
      //console.log(elemento);
      const id=$(elemento).attr('clienteId');
      //console.log(id);
      funcion='borrar_cliente';
      $('#id_user').val(id);
      $('#funcion').val(funcion);
    });

    $('#form-confirmar').submit(e=>{
      let pass=$('#pass').val();
      let id_cliente=$('#id_user').val();
      funcion=$('#funcion').val();
      $.post('../controlador/clienteController.php', {pass, id_cliente, funcion}, (response)=>{
        if(response=='ascendido'|| response=='descendido'|| response=='borrado')
        {
          $('#confirmado').hide('slow');
          $('#confirmado').show(1000);
          $('#confirmado').hide(3000);
          //resetea los campos de la card
          $('#form-confirmar').trigger('reset');
          buscar_datos();
        }else{
          $('#rechazado').hide('slow');
          $('#rechazado').show(1000);
          $('#rechazado').hide(3000);
          //resetea los campos de la card
          $('#form-confirmar').trigger('reset');
        }
      });
      e.preventDefault();
    });*/
})

let espannol={
      "processing": "Procesando...",
      "lengthMenu": "Mostrar _MENU_ registros",
      "zeroRecords": "No se encontraron resultados",
      "emptyTable": "Ningún dato disponible en esta tabla",
      "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
      "infoFiltered": "(filtrado de un total de _MAX_ registros)",
      "search": "Buscar:",
      "infoThousands": ",",
      "loadingRecords": "Cargando...",
      "paginate": {
          "first": "Primero",
          "last": "Último",
          "next": "Siguiente",
          "previous": "Anterior"
      },
      "aria": {
          "sortAscending": ": Activar para ordenar la columna de manera ascendente",
          "sortDescending": ": Activar para ordenar la columna de manera descendente"
      },
      "buttons": {
          "copy": "Copiar",
          "colvis": "Visibilidad",
          "collection": "Colección",
          "colvisRestore": "Restaurar visibilidad",
          "copyKeys": "Presione ctrl o u2318 + C para copiar los datos de la tabla al portapapeles del sistema. <br \/> <br \/> Para cancelar, haga clic en este mensaje o presione escape.",
          "copySuccess": {
              "1": "Copiada 1 fila al portapapeles",
              "_": "Copiadas %ds fila al portapapeles"
          },
          "copyTitle": "Copiar al portapapeles",
          "csv": "CSV",
          "excel": "Excel",
          "pageLength": {
              "-1": "Mostrar todas las filas",
              "_": "Mostrar %d filas"
          },
          "pdf": "PDF",
          "print": "Imprimir",
          "renameState": "Cambiar nombre",
          "updateState": "Actualizar",
          "createState": "Crear Estado",
          "removeAllStates": "Remover Estados",
          "removeState": "Remover",
          "savedStates": "Estados Guardados",
          "stateRestore": "Estado %d"
      },
      "autoFill": {
          "cancel": "Cancelar",
          "fill": "Rellene todas las celdas con <i>%d<\/i>",
          "fillHorizontal": "Rellenar celdas horizontalmente",
          "fillVertical": "Rellenar celdas verticalmentemente"
      },
      "decimal": ",",
      "searchBuilder": {
          "add": "Añadir condición",
          "button": {
              "0": "Constructor de búsqueda",
              "_": "Constructor de búsqueda (%d)"
          },
          "clearAll": "Borrar todo",
          "condition": "Condición",
          "conditions": {
              "date": {
                  "after": "Despues",
                  "before": "Antes",
                  "between": "Entre",
                  "empty": "Vacío",
                  "equals": "Igual a",
                  "notBetween": "No entre",
                  "notEmpty": "No Vacio",
                  "not": "Diferente de"
              },
              "number": {
                  "between": "Entre",
                  "empty": "Vacio",
                  "equals": "Igual a",
                  "gt": "Mayor a",
                  "gte": "Mayor o igual a",
                  "lt": "Menor que",
                  "lte": "Menor o igual que",
                  "notBetween": "No entre",
                  "notEmpty": "No vacío",
                  "not": "Diferente de"
              },
              "string": {
                  "contains": "Contiene",
                  "empty": "Vacío",
                  "endsWith": "Termina en",
                  "equals": "Igual a",
                  "notEmpty": "No Vacio",
                  "startsWith": "Empieza con",
                  "not": "Diferente de",
                  "notContains": "No Contiene",
                  "notStartsWith": "No empieza con",
                  "notEndsWith": "No termina con"
              },
              "array": {
                  "not": "Diferente de",
                  "equals": "Igual",
                  "empty": "Vacío",
                  "contains": "Contiene",
                  "notEmpty": "No Vacío",
                  "without": "Sin"
              }
          },
          "data": "Data",
          "deleteTitle": "Eliminar regla de filtrado",
          "leftTitle": "Criterios anulados",
          "logicAnd": "Y",
          "logicOr": "O",
          "rightTitle": "Criterios de sangría",
          "title": {
              "0": "Constructor de búsqueda",
              "_": "Constructor de búsqueda (%d)"
          },
          "value": "Valor"
      },
      "searchPanes": {
          "clearMessage": "Borrar todo",
          "collapse": {
              "0": "Paneles de búsqueda",
              "_": "Paneles de búsqueda (%d)"
          },
          "count": "{total}",
          "countFiltered": "{shown} ({total})",
          "emptyPanes": "Sin paneles de búsqueda",
          "loadMessage": "Cargando paneles de búsqueda",
          "title": "Filtros Activos - %d",
          "showMessage": "Mostrar Todo",
          "collapseMessage": "Colapsar Todo"
      },
      "select": {
          "cells": {
              "1": "1 celda seleccionada",
              "_": "%d celdas seleccionadas"
          },
          "columns": {
              "1": "1 columna seleccionada",
              "_": "%d columnas seleccionadas"
          },
          "rows": {
              "1": "1 fila seleccionada",
              "_": "%d filas seleccionadas"
          }
      },
      "thousands": ".",
      "datetime": {
          "previous": "Anterior",
          "next": "Proximo",
          "hours": "Horas",
          "minutes": "Minutos",
          "seconds": "Segundos",
          "unknown": "-",
          "amPm": [
              "AM",
              "PM"
          ],
          "months": {
              "0": "Enero",
              "1": "Febrero",
              "10": "Noviembre",
              "11": "Diciembre",
              "2": "Marzo",
              "3": "Abril",
              "4": "Mayo",
              "5": "Junio",
              "6": "Julio",
              "7": "Agosto",
              "8": "Septiembre",
              "9": "Octubre"
          },
          "weekdays": [
              "Dom",
              "Lun",
              "Mar",
              "Mie",
              "Jue",
              "Vie",
              "Sab"
          ]
      },
      "editor": {
          "close": "Cerrar",
          "create": {
              "button": "Nuevo",
              "title": "Crear Nuevo Registro",
              "submit": "Crear"
          },
          "edit": {
              "button": "Editar",
              "title": "Editar Registro",
              "submit": "Actualizar"
          },
          "remove": {
              "button": "Eliminar",
              "title": "Eliminar Registro",
              "submit": "Eliminar",
              "confirm": {
                  "_": "¿Está seguro que desea eliminar %d filas?",
                  "1": "¿Está seguro que desea eliminar 1 fila?"
              }
          },
          "error": {
              "system": "Ha ocurrido un error en el sistema (<a target=\"\\\" rel=\"\\ nofollow\" href=\"\\\">Más información&lt;\\\/a&gt;).<\/a>"
          },
          "multi": {
              "title": "Múltiples Valores",
              "info": "Los elementos seleccionados contienen diferentes valores para este registro. Para editar y establecer todos los elementos de este registro con el mismo valor, hacer click o tap aquí, de lo contrario conservarán sus valores individuales.",
              "restore": "Deshacer Cambios",
              "noMulti": "Este registro puede ser editado individualmente, pero no como parte de un grupo."
          }
      },
      "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
      "stateRestore": {
          "creationModal": {
              "button": "Crear",
              "name": "Nombre:",
              "order": "Clasificación",
              "paging": "Paginación",
              "search": "Busqueda",
              "select": "Seleccionar",
              "columns": {
                  "search": "Búsqueda de Columna",
                  "visible": "Visibilidad de Columna"
              },
              "title": "Crear Nuevo Estado",
              "toggleLabel": "Incluir:"
          },
          "emptyError": "El nombre no puede estar vacio",
          "removeConfirm": "¿Seguro que quiere eliminar este %s?",
          "removeError": "Error al eliminar el registro",
          "removeJoiner": "y",
          "removeSubmit": "Eliminar",
          "renameButton": "Cambiar Nombre",
          "renameLabel": "Nuevo nombre para %s",
          "duplicateError": "Ya existe un Estado con este nombre.",
          "emptyStates": "No hay Estados guardados",
          "removeTitle": "Remover Estado",
          "renameTitle": "Cambiar Nombre Estado"
      }
  }