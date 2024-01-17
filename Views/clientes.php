<?php 
// $_SERVER["DOCUMENT_ROOT"] necesario para que las rutas absolutas funcionen desde el lado del servidor
include_once $_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Views/layouts/header.php';
session_start();
?>
<div class="modal fade" id="crear_cliente" tabindex="-1" aria-labelledby="crearClienteModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable modal-lg">
    <div class="modal-content card card-success">
      <div class="modal-header card-header">
        <h5 class="modal-title" id="cambiarPasswordModalLabel">Nuevo cliente</h5>
      </div>
      <div class="modal-body">
        <form id="form-crear_cliente" enctype="multipart/form-data">
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
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="telefono">Teléfono:</label>
                <input type="text" class="form-control" name="telefono" id="telefono" placeholder="Introduce teléfono">
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

<div class="modal fade" id="editar_cliente" tabindex="-1" aria-labelledby="editarClienteModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable modal-lg">
    <div class="modal-content card card-success">
      <div class="modal-header card-header">
        <h5 class="modal-title" id="cambiarPasswordModalLabel">Editar cliente</h5>
      </div>
      <div class="modal-body">
        <form id="form-editar_cliente" enctype="multipart/form-data">
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
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="telefono">Teléfono:</label>
                <input type="text" class="form-control" name="telefono" id="telefono" placeholder="Introduce teléfono">
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

  <title>Gestión clientes | Farmacia</title>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper" style="min-height: 540px;">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Gestión clientes <button id="btn_crear_cliente" class="btn bg-gradient-primary" data-toggle="modal" data-target="#crear_cliente">Nuevo cliente</button></h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="/farmacia-V2/Views/catalogo.php">Inicio</a></li>
              <li class="breadcrumb-item active">Gestión cliente</li>
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
          <h3 class="card-title">Clientes</h3>

        </div>
        <div class="card-body">
          <table id="clientes" class="table table-hover">
            <thead class="bg-primary">
              <tr>
                <th width="100%">Clientes</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
        <!-- /.card-body -->
        <div class="card-footer">
          
        </div>
        <!-- /.card-footer-->
      </div>
      <!-- /.card -->

    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
<?php include_once $_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Views/layouts/footer.php';?>

<script src="/farmacia-V2/Views/clientes.js"></script>