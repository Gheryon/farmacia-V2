<?php 
// $_SERVER["DOCUMENT_ROOT"] necesario para que las rutas absolutas funcionen desde el lado del servidor
include_once $_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Views/layouts/header.php';
session_start();
?>
<div class="modal fade" id="crear_laboratorio" tabindex="-1" aria-labelledby="crearLaboratorioModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content card card-success">
      <div class="modal-header card-header">
        <h5 class="modal-title" id="cambiarPasswordModalLabel">Nuevo laboratorio</h5>
      </div>
      <div class="modal-body">
        <form id="form-crear_laboratorio" enctype="multipart/form-data">
          <div class="form-group">
            <label for="nombre">Nombre:</label>
            <input type="text" class="form-control" name="nombre" id="nombre" placeholder="Introduce nombre">
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

<div class="modal fade" id="editar_laboratorio" tabindex="-1" aria-labelledby="editarLaboratorioModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable modal-lg">
    <div class="modal-content card card-success">
      <div class="modal-header card-header">
        <h5 class="modal-title" id="cambiarPasswordModalLabel">Editar laboratorio</h5>
      </div>
      <div class="modal-body p-0">
        <form id="form-editar_laboratorio" enctype="multipart/form-data">
        <div class="card card-widget widget-user">
          <div class="widget-user-header bg-success">
            <h3 id="nombre_card" class="widget-user-username"></h3>
          </div>
          <div class="widget-user-image">
            <img class="img-circle elevation-2" id="avatar_card" alt="User Avatar">
          </div>
          <div class="card-footer">
            <div class="row">
              <input type="hidden" id="id_laboratorio" name="id_laboratorio">
              <div class="col-md-12">
                <div class="form-group">
                  <label for="">Nombre</label>
                  <input type="text" class="form-control" id="nombre_edit" name="nombre_edit" placeholder="Nombre">
                </div>
              </div>
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

<div class="modal fade" id="editar_avatar" tabindex="-1" aria-labelledby="editarAvatarModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable modal-lg">
    <div class="modal-content card card-success">
      <div class="modal-header card-header">
        <h5 class="modal-title" id="cambiarPasswordModalLabel">Editar avatar laboratorio</h5>
      </div>
      <div class="modal-body p-0">
        <form id="form-editar_avatar" enctype="multipart/form-data">
        <div class="card card-widget widget-user">
          <div class="widget-user-header bg-success">
            <h3 id="nombre_avatar" class="widget-user-username"></h3>
          </div>
          <div class="widget-user-image">
            <img class="img-circle elevation-2" id="avatar" alt="User Avatar">
          </div>
          <div class="card-footer">
            <div class="row">
              <input type="hidden" id="id_laboratorio_avatar" name="id_laboratorio_avatar">
              <div class="col-md-12">
                <div class="form-group">
                  <label for="">Avatar</label>
                  <div class="input-group">
                    <div class="custom-file">
                      <input type="file" class="custom-file-input" id="avatar_edit" name="avatar_edit">
                      <label for="" class="custom-file-label">Seleccione una imagen</label>
                    </div>
                  </div>
                </div>
              </div>
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

  <title>Gestión laboratorios | Farmacia</title>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper" style="min-height: 540px;">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Gestión laboratorios <button id="btn_crear_laboratorio" class="btn bg-gradient-primary" data-toggle="modal" data-target="#crear_laboratorio">Nuevo laboratorio</button></h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="/farmacia-V2/Views/catalogo.php">Inicio</a></li>
              <li class="breadcrumb-item active">Gestión laboratorio</li>
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
          <h3 class="card-title">Laboratorios</h3>

        </div>
        <div class="card-body">
          <table id="laboratorios" class="table table-hover">
            <thead class="bg-primary">
              <tr>
                <th width="100%">Laboratorios</th>
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

<script src="/farmacia-V2/Views/laboratorios.js"></script>