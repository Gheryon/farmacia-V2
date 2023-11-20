<?php 
// $_SERVER["DOCUMENT_ROOT"] necesario para que las rutas absolutas funcionen desde el lado del servidor
include_once $_SERVER["DOCUMENT_ROOT"].'/farmacia-V2/Views/layouts/header.php';
session_start();
?>
<style>
.table_scroll{
  overflow: scroll;
  height: 400px;
  overflow-x: hidden;
}
#carrito_compras td{
  padding: 5px !important;
  margin: 5px !important;
}
</style>
<!-- Modal -->
<div class="modal fade" id="abrir_carrito" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Carrito de compra</h5>
      </div>
      <div class="modal-body p-0 table_scroll">
        <table id="carrito_compras" class="table table-borderless table-secondary">
          <thead class="bg-success">
            <tr>
              <th>Productos</th>
            </tr>
          </thead>
          <tbody>

          </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fas fa-sign-out-alt"></i></button>
        <button type="button" class="vaciar_carrito btn btn-danger"><i class="far fa-trash-alt"></i></button>
        <button type="button" class="btn btn-success"><i class="fas fa-check"></i></button>
      </div>
    </div>
  </div>
</div>

  <title>Catálogo | Farmacia</title>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper" style="min-height: 540px;">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Catálogo</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="/farmacia-V2/Views/catalogo.php">Inicio</a></li>
              <li class="breadcrumb-item active">Catálogo</li>
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
          <h3 class="card-title">Productos</h3>

        </div>
        <div class="card-body">
          <table id="productos" class="table table-hover">
            <thead class="table-success">
              <tr>
                <th width="100%">Productos</th>
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

<script src="/farmacia-V2/Views/catalogo.js"></script>