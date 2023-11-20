<?php
session_start();
include_once $_SERVER["DOCUMENT_ROOT"] . '/farmacia-V2/Views/layouts/header.php';
?>

<!-- Modal -->
<div class="modal fade" id="editar_perfil" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content card card-success">
      <div class="modal-header card-header">
        <h5 class="modal-title" id="exampleModalLabel">Editar perfil</h5>
      </div>
      <div class="modal-body">
        <form id="form-editar_perfil" enctype="multipart/form-data">
          <div class="form-group">
            <label for="editar_telefono">Teléfono</label>
            <input type="text" class="form-control" id="editar_telefono" name="editar_telefono" placeholder="Introduzca teléfono">
          </div>
          <div class="form-group">
            <label for="editar_direccion">Dirección</label>
            <input type="text" class="form-control" id="editar_direccion" name="editar_direccion" placeholder="Introduzca una dirección">
          </div>
          <div class="form-group">
            <label for="editar_residencia">Residencia</label>
            <select class="form-control select2-success" data-dropdown-css-class="select2-success" style="width:100%" id="editar_residencia" name="editar_residencia"></select>
          </div>
          <div class="form-group">
            <label for="editar_correo">Correo</label>
            <input type="text" class="form-control" id="editar_correo" name="editar_correo" placeholder="Introduzca un correo electrónico">
          </div>
          <div class="form-group">
            <label for="editar_sexo">Sexo</label>
            <input type="text" class="form-control" id="editar_sexo" name="editar_sexo" placeholder="Introduzca sexo">
          </div>
          <div class="form-group">
            <label for="editar_adicional">Información adicional</label>
            <textarea type="text" style="height: 100px" class="form-control" id="editar_adicional" name="editar_adicional" placeholder="Introduzca información adicinal"></textarea>
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

<div class="modal fade" id="cambiar_avatar" tabindex="-1" aria-labelledby="cambiarAvatarModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content card card-success">
      <div class="modal-header card-header">
        <h5 class="modal-title" id="cambiarAvatarModalLabel">Cambiar avatar</h5>
      </div>
      <div class="modal-body p-0">
        <!-- Widget: user widget style 1 -->
        <div class="card card-widget widget-user">
          <!-- Add the bg color to the header using any of the bg-* classes -->
          <div class="widget-user-header bg-success">
            <h3 id="nombre_avatar" class="widget-user-username"></h3>
            <h5 id="apellidos_avatar" class="widget-user-desc"></h5>
          </div>
          <div class="widget-user-image">
            <img id="avatar" class="img-circle elevation-2" src="" alt="User Avatar">
          </div>
          <div class="card-footer">
            <div class="row">
              <div class="col-md-12">
                <form id="form-cambiar_avatar" enctype="multipart/form-data">
                  <div class="form-group">
                  <label for="exampleInputFile">Avatar: </label>
                    <div class="input-group">
                      <div class="custom-file">
                        <input type="file" class="custom-file-input" id="avatar_mod" name="avatar_mod">
                        <label class="custom-file-label" for="avatar_mod">Selecciona una imagen</label>
                      </div>
                    </div>
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

<div class="modal fade" id="cambiar_password" tabindex="-1" aria-labelledby="cambiarPasswordModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content card card-success">
      <div class="modal-header card-header">
        <h5 class="modal-title" id="cambiarPasswordModalLabel">Cambiar avatar</h5>
      </div>
      <div class="modal-body p-0">
        <!-- Widget: user widget style 1 -->
        <div class="card card-widget widget-user">
          <!-- Add the bg color to the header using any of the bg-* classes -->
          <div class="widget-user-header bg-success">
            <h3 id="nombre_password" class="widget-user-username"></h3>
            <h5 id="apellidos_password" class="widget-user-desc"></h5>
          </div>
          <div class="widget-user-image">
            <img id="avatar_password" class="img-circle elevation-2" src="" alt="User Avatar">
          </div>
          <div class="card-footer">
            <div class="row">
              <div class="col-md-12">
                <form id="form-cambiar_password" enctype="multipart/form-data">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text"><i class="fas fa-unlock-alt"></i></span>
                    </div>
                    <input id="oldpass" name="oldpass" type="password" class="form-control" placeholder="Introduce la contraseña antigua.">
                  </div>
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text"><i class="fas fa-lock"></i></span>
                    </div>
                    <input id="newpass" name="newpass" type="password" class="form-control" placeholder="Introduce la nueva contraseña.">
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
<title>Perfil | Gheryon</title>

<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <div class="container-fluid">
      <div class="row mb-2">
        <div class="col-sm-6">
          <h1>Datos personales</h1>
        </div>
        <div class="col-sm-6">
          <ol class="breadcrumb float-sm-right">
            <li class="breadcrumb-item"><a href="/farmacia-V2/Views/catalogo.php">Home</a></li>
            <li class="breadcrumb-item active">Datos personales</li>
          </ol>
        </div>
      </div>
    </div><!-- /.container-fluid -->
  </section>

  <section>
    <div class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-3">
            <div class="card card-success card-outline">
              <div id="card_1" class="card-body box-profile">

              </div>
            </div>
            <div id="card_2" class="card card-success">

            </div>
          </div>
          <div class="col-md-9">
            <div class="card card-success">
              <div class="card-header">
                <div class="card-title">Editar datos personales</div>
              </div>
              <div class="card-body">

              </div>
              <div class="card-footer">
                <p class="text-muted">Cuidado con introducir datos erróneos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
<!-- /.content-wrapper -->

<?php
include_once $_SERVER["DOCUMENT_ROOT"] . '/farmacia-V2/Views/layouts/footer.php';
?>
<script src="/farmacia-V2/Views/perfil.js"></script>