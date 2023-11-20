<?php 
// $_SERVER["DOCUMENT_ROOT"] necesario para que las rutas absolutas funcionen desde el lado del servidor
include_once $_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Views/layouts/header.php';
session_start();
?>
<div class="modal fade" id="crear_usuario" tabindex="-1" aria-labelledby="crearUsuarioModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable modal-lg">
    <div class="modal-content card card-success">
      <div class="modal-header card-header">
        <h5 class="modal-title" id="cambiarPasswordModalLabel">Nuevo usuario</h5>
      </div>
      <div class="modal-body">
        <form id="form-crear_usuario" enctype="multipart/form-data">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="nombre">Nombre:</label>
                <input type="text" class="form-control" name="nombre" id="nombre" placeholder="Introduce nombre">
              </div>
              <div class="form-group">
                <label for="apellidos">Apellidos:</label>
                <input type="text" class="form-control" name="apellidos" id="apellidos" placeholder="Introduce apellidos">
              </div>
              <div class="form-group">
                <label for="nacimiento">Fecha de nacimiento:</label>
                <input type="date" class="form-control" name="nacimiento" id="nacimiento" placeholder="Introduce fecha de nacimiento">
              </div>
              <div class="form-group">
                <label for="dni">DNI:</label>
                <input type="text" class="form-control" name="dni" id="dni" placeholder="Introduce DNI">
              </div>
              <div class="form-group">
                <label for="password">Contraseña:</label>
                <input type="text" class="form-control" name="password" id="password" placeholder="Introduce contraseña">
              </div>
              <div class="form-group">
                <label for="telefono">Teléfono:</label>
                <input type="text" class="form-control" name="telefono" id="telefono" placeholder="Introduce teléfono">
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="residencia">Residencia:</label>
                <select class="form-control select2 select2-success" style="width:100%" data-dropdown-css-class="select2-success" name="residencia" id="residencia"></select>
              </div>
              <div class="form-group">
                <label for="direccion">Dirección:</label>
                <input type="text" class="form-control" name="direccion" id="direccion" placeholder="Introduce dirección">
              </div>
              <div class="form-group">
                <label for="correo">Correo:</label>
                <input type="text" class="form-control" name="correo" id="correo" placeholder="Introduce correo">
              </div>
              <div class="form-group">
                <label for="sexo">Sexo:</label>
                <input type="text" class="form-control" name="sexo" id="sexo" placeholder="Introduce sexo">
              </div>
              <div class="form-group">
                <label for="adicional">Información adicional:</label>
                <textarea type="text" class="form-control" name="adicional" id="adicional" style="height: 100px;" placeholder="Introduce información adicional"></textarea>
              </div>
            </div>
          </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fas fa-sign-out-alt"></i></button>
        <button type="submit" class="btn btn-success"><i class="fas fa-check"></i></button>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="confirmar" tabindex="-1" aria-labelledby="cambiarPasswordModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content card card-success">
      <div class="modal-header card-header">
        <h5 class="modal-title" id="confirmarModalLabel">Introduzca su contraseña</h5>
      </div>
      <div class="modal-body p-0">
        <!-- Widget: user widget style 1 -->
        <div class="card card-widget widget-user">
          <div class="widget-user-header bg-success">
            <h3 id="nombre_confirmar" class="widget-user-username"></h3>
            <h5 id="apellidos_confirmar" class="widget-user-desc"></h5>
          </div>
          <div class="widget-user-image">
            <img id="avatar_confirmar" class="img-circle elevation-2" src="" alt="User Avatar">
          </div>
          <div class="card-footer">
            <div class="row">
              <div class="col-md-12">
                <form id="form-confirmar" enctype="multipart/form-data">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text"><i class="fas fa-unlock-alt"></i></span>
                    </div>
                    <input type="hidden" id="funcion" name="funcion">
                    <input type="hidden" id="id_user" name="id_user">
                    <input id="pass" name="pass" type="password" class="form-control" placeholder="Introduce la contraseña.">
                  </div>
              </div>
            </div>
            <!-- /.row -->
          </div>
        </div>
        <!-- /.widget-user -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fas fa-sign-out-alt"></i></button>
        <button type="submit" class="btn btn-success"><i class="fas fa-check"></i></button>
        </form>
      </div>
    </div>
  </div>
</div>
  <title>Gestión usuario | Farmacia</title>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper" style="min-height: 540px;">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Gestión usuario <button id="btn_crear_usuario" class="btn bg-gradient-primary" data-toggle="modal" data-target="#crear_usuario">Nuevo usuario</button></h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="/farmacia-V2/Views/catalogo.php">Inicio</a></li>
              <li class="breadcrumb-item active">Gestión usuario</li>
            </ol>
          </div>
        </div>
      </div><!-- /.container-fluid -->
    </section>

    <!-- Main content -->
    <section class="content">
      <!-- Default box -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Usuarios</h3>

        </div>
        <div class="card-body">
          <table id="usuarios" class="table table-hover">
            <thead class="bg-primary">
              <tr>
                <th width="100%">Usuarios</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
        <!-- /.card-body -->
        <div class="card-footer">
          Footer
        </div>
        <!-- /.card-footer-->
      </div>
      <!-- /.card -->

    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
<?php include_once $_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Views/layouts/footer.php';?>

<script src="/farmacia-V2/Views/usuarios.js"></script>