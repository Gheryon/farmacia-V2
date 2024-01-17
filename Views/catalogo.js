$(document).ready(function(){
  loader();
  //setTimeout(verificar_sesion, 2000);
  verificar_sesion();

  //para evitar que los mensajes toastr se acumulen en pantalla
  toastr.options={
    "preventDuplicates": true
  }

  async function obtener_productos(){
    let funcion="obtener_productos";
    let data=await fetch('/farmacia-V2/Controllers/productoController.php',{
      method: 'POST',
      headers: {'Content-type': 'application/x-www-form-urlencoded'},
      body: 'funcion='+funcion
    })
    if(data.ok){
      //mejor usar data.text que data.json, pues si hay error, este se añade como cadena de texto a los datos
      let response=await data.text();
      try{
        //se descodifica el json
        let productos=JSON.parse(response);
        $('#productos').DataTable({
          data: productos,
          "aaSorting":[],
          "searching": true,
          "scrollX": true,
          "autoWidth": false,
          columns: [
            //la variable datos es la variable productos
            {"render": function(data, type, datos, meta){
              let stock='';
              if(datos.stock==null||datos.stock==''){
                stock='Sin stock';
              }else{
                stock=datos.stock;
              }
              let reg_sanitario='';
              if(datos.registro_sanitario==null||datos.registro_sanitario==''){
                reg_sanitario='Sin registro sanitario';
              }else{
                reg_sanitario=datos.registro_sanitario;
              }
              return `
            <div class="">
              <div class="card bg-light d-flex flex-fill">
                <div class="h5 card-header text-muted border-bottom-0">
                  <i class="fas fa-lg fa-cubes mr-1"></i>${stock}
                </div>
                <div class="card-body pt-0">
                  <div class="row">
                    <div class="col-md-4">
                      <h4 class=""><b>${datos.nombre}</b></h4>
                      <h4 class="lead"><b><i class="fas fa-lg fa-dollar-sign mr-1"></i>${datos.precio}</b></h4>
                      <ul class="ml-4 mb-0 fa-ul text-muted">
                        <li class="h8"><span class="fa-li"><i class="fas fa-lg fa-barcode"></i></span> Código: ${datos.codigo}</li>
                        <li class="h8"><span class="fa-li"><i class="fas fa-lg fa-coins"></i></span> Precio: ${datos.precio}</li>
                        <li class="h8"><span class="fa-li"><i class="fas fa-lg fa-mortar-pestle"></i></span> Concentración: ${datos.concentracion}</li>
                        <li class="h8"><span class="fa-li"><i class="fas fa-lg fa-prescription-bottle-alt"></i></span> Adicional: ${datos.adicional}</li>
                        
                      </ul>
                    </div>
                    <div class="col-md-4">
                      <ul class="ml-4 mb-0 fa-ul text-muted">
                        <li class="h8"><span class="fa-li"><i class="fas fa-lg fa-flask"></i></span> Laboratorio: ${datos.laboratorio}</li>
                        <li class="h8"><span class="fa-li"><i class="fas fa-lg fa-copyright"></i></span> Tipo: ${datos.tipo}</li>
                        <li class="h8"><span class="fa-li"><i class="fas fa-lg fa-pills"></i></span> Presentación: ${datos.presentacion}</li>
                        <li class="h8"><span class="fa-li"><i class="fas fa-lg fa-angle-double-right"></i></span> Fracciones: ${datos.fracciones}</li>
                        <li class="h8"><span class="fa-li"><i class="fas fa-lg fa-angle-double-right"></i></span> Registro sanitario: ${reg_sanitario}</li>
                      </ul>
                    </div>
                    <div class="col-md-4 text-center">
                      <img src="/farmacia-V2/util/img/productos/${datos.avatar}" alt="user-avatar" width="150px" class="img-circle img-fluid">
                    </div>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="text-right">
                    <button id="${datos.id}" nombre="${datos.nombre}" codigo="${datos.codigo}" concentracion="${datos.concentracion}" adicional="${datos.adicional}" laboratorio="${datos.laboratorio}" presentacion="${datos.presentacion}" tipo="${datos.tipo}" stock="${datos.stock}" precio="${datos.precio}" class="agregar-carrito btn btn-sm bg-gradient-primary" title="Agregar al carrito">
                      <i class="fas fa-plus mr-1"></i>Agregar al carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>`
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

  $(document).on('click', '.agregar-carrito', (e)=>{
    let elemento=$(this)[0].activeElement;
    let id=$(elemento).attr('id');
    let codigo=$(elemento).attr('codigo');
    let nombre=$(elemento).attr('nombre');
    let concentracion=$(elemento).attr('concentracion');
    let adicional=$(elemento).attr('adicional');
    let laboratorio=$(elemento).attr('laboratorio');
    let presentacion=$(elemento).attr('presentacion');
    let tipo=$(elemento).attr('tipo');
    let precio=$(elemento).attr('precio');
    let stock=$(elemento).attr('stock');

    if(stock!="null"){
      let producto={
        id: id,
        nombre: nombre,
        concentracion: concentracion,
        adicional: adicional,
        precio: precio,
        laboratorio: laboratorio,
        tipo: tipo,
        presentacion: presentacion,
        stock: stock,
        cantidad: 1
      }
      //para asegurar que no se añade mas de una vez un producto al carrito y al localStorage
      let bandera=false;
      let productos=recuperarLS();
      productos.forEach(productoLS => {
        if(productoLS.id===producto.id){
            bandera=true;
        }
      });
      if(bandera==true){
        toastr.error('El producto '+nombre+' #'+codigo+' ya estaba agregado al carrito.', 'Error!');
      }else{
        //guarda información en localstorage del producto, así no se pierde si se actualiza la página
        agregarLS(producto);
        contar_productos();
        toastr.success('Producto '+nombre+' #'+codigo+' ya se agregó al carrito.', 'Éxito');
      }
    }else{
      toastr.warning('No hay stock del producto '+nombre+' #'+codigo+'.', 'No se pudo agregar!');
    }
    
  })

  function abrir_carrito(){
    let productos=recuperarLS();
    if(productos.length!=0){
      $('#abrir_carrito').modal('show');
      $('#carrito_compras').DataTable({
        data: productos,
        "aaSorting":[],
        "searching": true,
        "scrollX": false,
        "autoWidth": false,
        paging: false,
        "bInfo": false,
        columns: [
          //la variable datos es la variable productos
          {"render": function(data, type, datos, meta){
            let template=`
            <div class="card bg-light d-flex flex-fill">
              <div class="card-body">
                <div class="row">
                  <div class="col-md-5">
                    <ul class="ml-4 mb-0 fa-ul">
                      <li class="small"><span class="fa-li"><i class="fas fa-lg fa-heading"></i></span> Nombre: ${datos.nombre}</li>
                      <li class="small"><span class="fa-li"><i class="fas fa-lg fa-mortar-pestle"></i></span> Concentración: ${datos.concentracion}</li>
                      <li class="small"><span class="fa-li"><i class="fas fa-lg fa-prescription-bottle-alt"></i></span> Adicional: ${datos.adicional}</li>
                    </ul>
                  </div>
                  <div class="col-md-5 mt-1">
                    <ul class="ml-4 mb-0 fa-ul">
                      <li class="small"><span class="fa-li"><i class="fas fa-lg fa-flask"></i></span> Laboratorio: ${datos.laboratorio}</li>
                      <li class="small"><span class="fa-li"><i class="fas fa-lg fa-copyright"></i></span> Tipo: ${datos.tipo}</li>
                      <li class="small"><span class="fa-li"><i class="fas fa-lg fa-pills"></i></span> Presentacion: ${datos.presentacion}</li>
                    </ul>
                  </div>
                  <div class="col-md-2 mt-1 text-center">
                  <button type="button" id="${datos.id}" nombre="${datos.nombre}" class="borrar_producto_carrito btn btn-danger"><i class="far fa-trash-alt"></i></button>
                  </div>
                </div>
              </div>
            </div>`;
            return template;
          }}
        ],
        "language":espannol,
        "destroy": true
      });
    }else{
      toastr.warning('El carrito está vacío.', 'No se pudo abrir.');
      $('#abrir_carrito').modal('hide');
    }
  }

  $(document).on('click', '#carrito', (e)=>{
    abrir_carrito();
  })

  function eliminar_producto_LS(id){
    let productos;
    productos=recuperarLS();
    productos.forEach(function(producto, indice) {
      if(producto.id===id){
        //borra el producto con indice=indice, y borra sólo 1 elemento
        productos.splice(indice, 1);
      }
    });
    localStorage.setItem('productos', JSON.stringify(productos));
  }

  $(document).on('click', '.vaciar_carrito', (e)=>{
   //$('#lista').empty();
    vaciarLS();
    toastr.success('Carrito vaciado.', 'Éxito');
    contar_productos();
    $('#abrir_carrito').modal('hide');
  });

  $(document).on('click', '.borrar_producto_carrito', (e)=>{
    let elemento=$(this)[0].activeElement;
    let id=$(elemento).attr('id');
    let nombre=$(elemento).attr('nombre');
    toastr.success('El producto '+nombre+' ha sido eliminado del carrito.', 'Éxito');
    eliminar_producto_LS(id);
    contar_productos();
    abrir_carrito();
  });
  function vaciarLS(){
    localStorage.clear();
  }
  //para determinar si hay productos almacenados con anterioridad, si los hay, hay que recuperarlos
	function recuperarLS(){
    let productos;
    /// triple === es para comparacion estricta, considera el tipo de dato además del valor
    if(localStorage.getItem('productos')===null){
        productos=[];
    }else{
        productos=JSON.parse(localStorage.getItem('productos'))
    }
    return productos;
  }

  function agregarLS(producto){
      let productos;
      productos=recuperarLS();
      productos.push(producto);
      //localStorage no guarda objetos, se tiene que convertir la información a string json
      localStorage.setItem('productos', JSON.stringify(productos));
  }

  function contar_productos(){
    let productos;
    let contador=0;
    productos=recuperarLS();
    productos.forEach(producto=>{
        contador++;
    });
    $('#contador').html(contador);
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
        let respuesta=JSON.parse(response);
        if(respuesta.length!=0){
          cargar_menu_superior(respuesta);
          cargar_menu_lateral(respuesta);
          $('#carrito').show();
          obtener_productos()
          contar_productos();
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
  
  function cargar_menu_superior(usuario) {
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
      <!-- información de usuario -->
      <li class="nav-item dropdown">
        <a class="nav-link" data-toggle="dropdown" href="#">
        <img src="/farmacia-V2/util/img/user/${usuario.avatar}" width="30" height="30" alt="Farmacia Logo">
          <span>${usuario.nombre+' '+usuario.apellidos}</span>
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
});

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