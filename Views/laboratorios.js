$(document).ready(function(){
  bsCustomFileInput.init();//para que en el input de editar aparezca el nombre del archivo
  loader();
  //setTimeout(verificar_sesion, 2000);
  verificar_sesion();

  //para evitar que los mensajes toastr se acumulen en pantalla
  toastr.options={
    "preventDuplicates": true
  }

  async function obtener_laboratorios(){
    let funcion="obtener_laboratorios";
    let data=await fetch('/farmacia-V2/Controllers/laboratorioController.php',{
      method: 'POST',
      headers: {'Content-type': 'application/x-www-form-urlencoded'},
      body: 'funcion='+funcion
    })
    if(data.ok){
      //mejor usar data.text que data.json, pues si hay error, este se añade como cadena de texto a los datos
      let response=await data.text();
      try{
        //se descodifica el json
        let laboratorios=JSON.parse(response);
        console.log(laboratorios);
        $('#laboratorios').DataTable({
          data: laboratorios,
          "aaSorting":[],
          "searching": true,
          "scrollX": true,
          "autoWidth": false,
          columns: [
            //la variable datos es la variable laboratorios
            {"render": function(data, type, datos, meta){
              let template='';
              template+=`<div class="card card-widget widget-user-2">
              <div class="widget-user-header bg-success">
                <div class="widget-user-image">
                  <img class="img-circle elevation-2" src="/farmacia-V2/util/img/laboratorios/${datos.avatar}" alt="User Avatar">
                </div>
                <!-- /.widget-user-image -->
                <h3 class="widget-user-username">${datos.nombre}</h3>`;
                if(datos.estado=='A'){
                  template+=`<h5 class="widget-user-desc"><span class="badge badge-success">Activo</span></h5>`;
                }else{
                  template+=`<h5 class="widget-user-desc"><span class="badge badge-secondary">Inctivo</span></h5>`;
                }
              template+=`</div>
              <div class="card-footer p-0">
                <ul class="nav flex-column">
                  <li class="nav-item">
                    <a href="#" class="nav-link">`;
                      if(datos.estado=='A'){
                        template+=`<span><button id="${datos.id}" nombre="${datos.nombre}" avatar="${datos.avatar}" class="editar btn btn-primary btn-circle" data-toggle="modal" data-target="#editar_laboratorio"><i class="fas fa-pencil-alt" title="Editar"></i></button></span>
                        <span><button id="${datos.id}" nombre="${datos.nombre}" avatar="${datos.avatar}" class="editar_avatar btn btn-info btn-circle " data-toggle="modal" data-target="#editar_avatar"><i class="fas fa-image" title="Cambiar avatar"></i></button></span>
                        <span><button id="${datos.id}" nombre="${datos.nombre}" avatar="${datos.avatar}" class="eliminar_laboratorio btn btn-danger btn-circle" title="Eliminar"><i class="fas fa-trash"></i></button></span>
                        `;
                      }else{
                        template+=`<span><button id="${datos.id}" nombre="${datos.nombre}" avatar="${datos.avatar}" class="btn btn-success btn-circle"><i class="activar_laboratorio fas fa-plus" title="Reactivar"></i></button></span>`;
                      }
                    template+=`</a>
                  </li>
                </ul>
              </div>
            </div>`;
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


  $(document).on('click', '.editar', (e)=>{
    let elemento=$(this)[0].activeElement;
    let id=$(elemento).attr('id');
    let nombre=$(elemento).attr('nombre');
    let avatar=$(elemento).attr('avatar');

    $('#id_laboratorio').val(id);
    $('#nombre_card').text(nombre);
    $('#nombre_edit').val(nombre);
    $('#avatar_card').attr('src','/farmacia-V2/Util/img/laboratorios/'+avatar);
  });

  async function editar_laboratorio(datos) {
		let data = await fetch('/farmacia-V2/Controllers/laboratorioController.php', {
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
					toastr.success('Laboratorio editado.', 'Éxito');
					obtener_laboratorios();
					$('#editar_laboratorio').modal('hide');
          $('#form-editar_laboratorio').trigger('reset');
				}else{
					if(respuesta.mensaje=='error_laboratorio'){
						Swal.fire({
							position: 'center',
							icon: 'error',
							title: 'Ya existe el laboratorio.',
              text: 'El laboratorio ya está registrado en el sistema.'
						});
            $('#form-editar_laboratorio').trigger('reset');
					}
          if(respuesta.mensaje=='error_decrypt'){
						Swal.fire({
							position: 'center',
							icon: 'error',
							title: 'Datos vulnerados.',
              showConfirmButton:false,
              timer:1000
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

  $.validator.setDefaults({
    submitHandler: function () {
      let datos=new FormData($('#form-editar_laboratorio')[0]);
			let funcion = "editar_laboratorio";
			datos.append('funcion', funcion);
      editar_laboratorio(datos);
    }
  });

  $('#form-editar_laboratorio').validate({
    rules: {
      nombre_edit: {
        required: true,
				minlength: 3
      },
    },
    messages: {
      nombre_edit: {
        required: "Es necesario introducir un nombre.",
				minlength: "Debe contener 3 caracteres como mínimo."
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


  $(document).on('click', '.editar_avatar', (e)=>{
    let elemento=$(this)[0].activeElement;
    let id=$(elemento).attr('id');
    let nombre=$(elemento).attr('nombre');
    let avatar=$(elemento).attr('avatar');

    $('#id_laboratorio_avatar').val(id);
    $('#nombre_avatar').text(nombre);
    $('#avatar').attr('src','/farmacia-V2/Util/img/laboratorios/'+avatar);
  });

  async function editar_avatar(datos) {
		let data = await fetch('/farmacia-V2/Controllers/laboratorioController.php', {
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
					toastr.success('Avatar de laboratorio editado.', 'Éxito');
					obtener_laboratorios();
					$('#editar_avatar').modal('hide');
          $('#form-editar_avatar').trigger('reset');
				}else{
          if(respuesta.mensaje=='error_decrypt'){
						Swal.fire({
							position: 'center',
							icon: 'error',
							title: 'Datos vulnerados.',
              showConfirmButton:false,
              timer:1000
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

  $.validator.setDefaults({
    submitHandler: function () {
      let datos=new FormData($('#form-editar_avatar')[0]);
			let funcion = "editar_avatar";
			datos.append('funcion', funcion);
      editar_avatar(datos);
    }
  });

  $('#form-editar_avatar').validate({
    rules: {
      avatar_edit: {
        required: true,
        extension: 'png|jpg|jpeg|webp'
      },
    },
    messages: {
      avatar_edit: {
        required: "Es necesario introducir un nombre.",
				extension: "El formato debe ser png|jpg|jpeg|webp."
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


	async function crear_laboratorio(datos) {
		let data = await fetch('/farmacia-V2/Controllers/laboratorioController.php', {
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
					toastr.success('Laboratorio creado.', 'Éxito');
					obtener_laboratorios();
					$('#crear_laboratorio').modal('hide');
          $('#form-crear_laboratorio').trigger('reset');
				}else{
					if(respuesta.mensaje=='error_laboratorio'){
						Swal.fire({
							position: 'center',
							icon: 'error',
							title: 'Ya existe el laboratorio.',
              text: 'El laboratorio ya está registrado en el sistema.'
						});
            $('#form-crear_laboratorio').trigger('reset');
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
      let datos=new FormData($('#form-crear_laboratorio')[0]);
			let funcion = "crear_laboratorio";
			datos.append('funcion', funcion);
      crear_laboratorio(datos);
    }
  });

  $('#form-crear_laboratorio').validate({
    rules: {
      nombre: {
        required: true,
				minlength: 3
      },
    },
    messages: {
      nombre: {
        required: "Es necesario introducir un nombre.",
				minlength: "Debe contener 3 caracteres como mínimo."
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


  $(document).on('click', '.eliminar_laboratorio', (e)=>{
    let elemento=$(this)[0].activeElement;
    let id=$(elemento).attr('id');
    let nombre=$(elemento).attr('nombre');
    let avatar=$(elemento).attr('avatar');

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success ml-2",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: '¿Eliminar laboratorio'+nombre+'?',
      imageUrl:'/farmacia-V2/Util/img/laboratorios/'+avatar,
      imageWidth:200,
      imageHeight:200,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        eliminar_laboratorio(id).then(respuesta=>{
          if(respuesta.mensaje=='success'){
            swalWithBootstrapButtons.fire({
              title: "Eliminación realizada",
              text: 'El laboratorio '+nombre+' fue eliminado',
              icon: "success"
            });
            obtener_laboratorios();
          }else{
            if(respuesta.mensaje=='error_decrypt'){
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Datos vulnerados.',
                showConfirmButton:false,
                timer:1000
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
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Operación cancelada",
          text: "No se eliminó el laboratorio",
          icon: "error"
        });
      }

    });
  });

  async function eliminar_laboratorio(id) {
    let funcion="eliminar_laboratorio";
    let respuesta='';
		let data = await fetch('/farmacia-V2/Controllers/laboratorioController.php', {
			method: 'POST',      
      headers: {'Content-type': 'application/x-www-form-urlencoded'},
			body: 'funcion='+funcion+'&&id='+id
		})
		if (data.ok) {
			//mejor usar data.text que data.json, pues si hay error, este se añade como cadena de texto a los datos
			let response = await data.text();
			try {
				respuesta = JSON.parse(response);//se descodifica el json
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
    return respuesta;
	}

  $(document).on('click', '.activar_laboratorio', (e)=>{
    let elemento=$(this)[0].activeElement;
    let id=$(elemento).attr('id');
    let nombre=$(elemento).attr('nombre');
    let avatar=$(elemento).attr('avatar');

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success ml-2",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: 'Reactivar laboratorio'+nombre+'?',
      imageUrl:'/farmacia-V2/Util/img/laboratorios/'+avatar,
      imageWidth:200,
      imageHeight:200,
      showCancelButton: true,
      confirmButtonText: "Reactivar",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        reactivar_laboratorio(id).then(respuesta=>{
          if(respuesta.mensaje=='success'){
            swalWithBootstrapButtons.fire({
              title: "Reactivación realizada",
              text: 'El laboratorio '+nombre+' fue reactivado',
              icon: "success"
            });
            obtener_laboratorios();
          }else{
            if(respuesta.mensaje=='error_decrypt'){
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Datos vulnerados.',
                showConfirmButton:false,
                timer:1000
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
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Operación cancelada",
          text: "No se reactivó el laboratorio",
          icon: "error"
        });
      }

    });
  });

  async function reactivar_laboratorio(id) {
    let funcion="reactivar_laboratorio";
    let respuesta='';
		let data = await fetch('/farmacia-V2/Controllers/laboratorioController.php', {
			method: 'POST',      
      headers: {'Content-type': 'application/x-www-form-urlencoded'},
			body: 'funcion='+funcion+'&&id='+id
		})
		if (data.ok) {
			//mejor usar data.text que data.json, pues si hay error, este se añade como cadena de texto a los datos
			let response = await data.text();
			try {
				respuesta = JSON.parse(response);//se descodifica el json
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
    return respuesta;
	}


  function cargar_menu_superior(laboratorio) {
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
      <!-- información de laboratorio -->
      <li class="nav-item dropdown">
        <a class="nav-link" data-toggle="dropdown" href="#">
        <img src="/farmacia-V2/util/img/user/${laboratorio.avatar}" width="30" height="30" alt="Farmacia Logo">
          <span>${laboratorio.nombre+' '+laboratorio.apellidos}</span>
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

  function cargar_menu_lateral(laboratorio) {
    let template=`
    <!-- Sidebar user (optional) -->
    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
      <div class="image">
        <img src="/farmacia-V2/util/img/user/${laboratorio.avatar}" class="img-circle elevation-2" alt="User Image">
      </div>
      <div class="info">
        <a href="#" class="d-block">${laboratorio.nombre+' '+laboratorio.apellidos}</a>
      </div>
    </div>

    <!-- Sidebar Menu -->
    <nav class="mt-2">
      <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
        <!-- Add icons to the links using the .nav-icon class
            with font-awesome or any other icon font library -->
        <li class="nav-header">Laboratorio</li>
        <li class="nav-item">
          <a href="/farmacia-V2/Views/perfil.php" class="nav-link">
            <i class="nav-icon fas fa-user-cog"></i>
            <p>
              Perfil
            </p>
          </a>
        </li>
        <li id="gestion_laboratorio" class="nav-item">
          <a href="/farmacia-V2/Views/usuarios.php" class="nav-link">
            <i class="nav-icon fas fa-users"></i>
            <p>
              Gestión usuarios
            </p>
          </a>
        </li>
        <li id="gestion_laboratorio" class="nav-item">
          <a href="/farmacia-V2/Views/laboratorios.php" class="nav-link">
            <i class="nav-icon fas fa-user-friends"></i>
            <p>
              Gestión laboratorio
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
        <li class="nav-item">
          <a href="/farmacia-V2/Views/laboratorios.php" class="nav-link">
            <i class="nav-icon fas fa-flask"></i>
            <p>
              Laboratorios
            </p>
          </a>
        </li>
        <li class="nav-item">
          <a href="/farmacia-V2/Views/presentaciones.php" class="nav-link">
            <i class="nav-icon fas fa-tags"></i>
            <p>
              Presentaciones
            </p>
          </a>
        </li>
        <li class="nav-item">
          <a href="/farmacia-V2/Views/tipos.php" class="nav-link">
            <i class="nav-icon fas fa-vials"></i>
            <p>
              Tipos
            </p>
          </a>
        </li>
        <li id="gestion_producto" class="nav-item">
          <a href="adm_producto.php" class="nav-link">
            <i class="nav-icon fas fa-pills"></i>
            <p>
              Gestionar producto
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
        let laboratorio=JSON.parse(response);
        if(laboratorio.length!=0&&laboratorio.id_tipo!=3){
          cargar_menu_superior(laboratorio);
          cargar_menu_lateral(laboratorio);
          obtener_laboratorios();
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
		let data = await fetch('/farmacia-V2/Controllers/laboratorioController.php', {
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
          if(respuesta.funcion=="eliminar laboratorio"){
            toastr.success('Laboratorio eliminado.', 'Éxito');
            obtener_laboratorios();
            $('#confirmar').modal('hide');
            $('#form-confirmar').trigger('reset');
          }
          else if(respuesta.funcion=="reactivar laboratorio"){
            toastr.success('Laboratorio reactivado.', 'Éxito');
            obtener_laboratorios();
            $('#confirmar').modal('hide');
            $('#form-confirmar').trigger('reset');
          }
          else if(respuesta.funcion=="ascender laboratorio"){
            toastr.success('Laboratorio ascendido.', 'Éxito');
            obtener_laboratorios();
            $('#confirmar').modal('hide');
            $('#form-confirmar').trigger('reset');
          }
          else if(respuesta.funcion=="descender laboratorio"){
            toastr.success('Laboratorio descendido.', 'Éxito');
            obtener_laboratorios();
            $('#confirmar').modal('hide');
            $('#form-confirmar').trigger('reset');
          }
				}else{
					if(respuesta.mensaje=='error_laboratorio'){
						Swal.fire({
							position: 'center',
							icon: 'error',
							title: 'Ya existe el laboratorio.',
              text: 'El laboratorio ya está registrado en el sistema.'
						});
            $('#crear_laboratorio').modal('hide');
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