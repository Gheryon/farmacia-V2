$(document).ready(function(){

  verificar_sesion();

  $('#form-login').submit((e)=>{
    let dni=$('#dni').val();
    let pass=$('#pass').val();
    login(dni, pass);
    e.preventDefault();
  });

  async function login(dni, pass){
    let funcion="login";
    let data=await fetch('/farmacia-V2/Controllers/usuarioController.php',{
      method: 'POST',
      headers: {'Content-type': 'application/x-www-form-urlencoded'},
      body: 'funcion='+funcion+'&&dni='+dni+'&&pass='+pass
    })
    if(data.ok){
      //mejor usar data.text que data.json, pues si hay error, este se añade como cadena de texto a los datos
      let response=await data.text();
      try{
        //se descodifica el json
        let respuesta=JSON.parse(response);
        if(respuesta.mensaje=='success'){
          location.href="/farmacia-V2/Views/catalogo.php";
        }else if(respuesta.mensaje=='error'){
          toastr.error('Datos de sesión incorrectos.', 'Error!')
          $('#form-login').trigger('reset');
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
          location.href="/farmacia-V2/Views/catalogo.php";
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
});