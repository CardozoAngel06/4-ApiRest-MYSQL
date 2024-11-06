const endpoint = '/productos'

// Event listener para el botón "Añadir Producto"
document.getElementById('añadir').addEventListener('click', function () {
  const formulario = document.getElementById('nuevoProd');
  formulario.classList.toggle('new');
});

fetch(endpoint)
  .then(respuesta => respuesta.json())
  .then(datos => mostrarProductos(datos))

// const mostrarProductos = (datos) => {
//   let productos = ''
//   const contenedor = document.querySelector('#contenedor')
//   datos.forEach(datos => {
//     productos +=
//       `<div class="card border border-1 border-dark d-flex flex-column align-items-center"
//             style="width: 100%; max-width: 300px; margin:30px">
//             <img src="${datos.imagen}" class="card-img-top" alt="...">
//             <div class="card-body ">
//                 <h4>${datos.titulo}</h4>
//                 <p class="card-text ">${datos.descripcion}</p>
//             </div>
//             <div class="d-flex justify-content-between align-items-center w-100 mb-2 px-2 fs-3">
//               <p class="card-text p-2 mb-0">
//                 <strong>$${datos.precio}</strong>
//               </p>
//             <div class="d-flex ms-auto">
//               <a href="#prodEditar" class="btn btn-outline-primary me-2 edit" onClick="editar(${datos.id})">
//                 <i class="bi bi-pencil"></i>
//               </a>
//               <a class="btn btn-outline-danger" type="submit" onClick="eliminar(${datos.id})">
//                 <i class="bi bi-trash"></i>
//               </a>
//             </div>
//           </div>
//       </div>`
//   })
//   contenedor.innerHTML = productos
 const contenedor = document.querySelector('#contenedor')
 let productos = ''
  const mostrarProductos = async() =>{
    try{
      const respuesta = await fetch(endpoint)
      prodRecibidos = await respuesta.json()
      prodRecibidos.forEach(prod => {
        productos +=
      `<div class="card border border-1 border-dark d-flex flex-column align-items-center"
            style="width: 100%; max-width: 300px; margin:30px">
            <img src="${prod.imagen}" class="card-img-top" alt="...">
            <div class="card-body ">
                <h4>${prod.titulo}</h4>
                <p class="card-text ">${prod.descripcion}</p>
            </div>
            <div class="d-flex justify-content-between align-items-center w-100 mb-2 px-2 fs-3">
              <p class="card-text p-2 mb-0">
                <strong>$${prod.precio}</strong>
              </p>
            <div class="d-flex ms-auto">
              <a class="btn btn-outline-primary me-2 " onClick="editar(${prod.id})">
                <i class="bi bi-pencil"></i>
              </a>
              <a class="btn btn-outline-danger" type="submit" onClick="eliminar(${prod.id})">
                <i class="bi bi-trash"></i>
              </a>
            </div>
          </div>
      </div>`
      })
      contenedor.innerHTML = productos
    }
    catch{
      mostrarMensaje('Error al cargar productos')
    }
  }
  

  // // Añadir event listeners a los botones "Editar"
  // const editButtons = document.querySelectorAll('.edit');
  // editButtons.forEach(button => {
  //   button.addEventListener('click', function () {
  //     const formulario = document.getElementById('editar');
  //     formulario.classList.toggle('newE');
  //   });
  // });
const añadir = () => {
document.querySelector("#nuevoProd").style.display='block'
const formulario = document.forms['formCrear']
console.log(formulario)
formulario.addEventListener('submit', (event) => {
  event.preventDefault();

  let titulo = formulario.titulo.value
  let descripcion = formulario.desc.value
  let precio = formulario.precio.value
  let imagen = "imagenes/" + formulario.titulo.value + ".jpg"
  // console.log(titulo,descripcion,precio);

  // Objetos con los datos obtenidos en el formulario
  let newDatos = { titulo: titulo, imagen: imagen, descripcion: descripcion, precio: precio }


  if (!newDatos.titulo || !newDatos.descripcion || !newDatos.precio) {
    document.querySelector('#mensaje').innerHTML = 'Complete todos los campos'
    return
  }
    document.querySelector('#mensaje').innerHTML = ''
    // return

  let nuevosDatosJson = JSON.stringify(newDatos)
  console.log(nuevosDatosJson)
  const enviarNewProducto = async() =>{ //enviar datos al back
    try{
      const enviarDatos = await fetch(endpoint, {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: nuevosDatosJson
      })
      //obtengo la respuesta del back
      const respuesta = await enviarDatos.json()
      console.log(respuesta)
      document.querySelector('#formCrear').style.display='none'
      mostrarMensaje(respuesta.mensaje) // Muestra el mensaje
      setTimeout(()=> {location.reload();},1000) // Refrescar la pagina
    }
    catch(error){
      console.log(error)
    }
  }
  enviarNewProducto()
})
}
mostrarMensaje = (mensaje) => {
  document.querySelector('#mensajeBack').innerHTML = mensaje
}


//Eliminar Producto
const eliminar = (id) => {
  if(confirm('¿Seguro que desea eliminar el producto?')){
  //console.log(id)
  console.log(endpoint + '/' + id)
  const eliminarProd = async() => {
    try{
      const res = await fetch(endpoint + '/' + id, {
        method : 'delete'
      })
      const respuesta = await res.json()
      console.log(respuesta)
      mostrarMensaje(respuesta.mensaje)
    }
  catch{
    mostrarMensaje('Error al eliminar producto :(')
  }
  setTimeout(() => {location.reload();}, 1000)
  }
  eliminarProd()
}
}
// Editar Producto
const formEditar = document.forms['form-editar']
const editar = (id) => {
  // console.log(id)
  document.querySelector("#editar").style.display='block'
  let prodEditar = {}
  prodRecibidos.filter(prod => {
    if(prod.id == id){
      prodEditar = prod
    }
  })
  // console.log(prodEditar)

  //asignar valores obtenidos al formulario
  formEditar.idEditar.value = prodEditar.id
  formEditar.titulo.value = prodEditar.titulo
  formEditar.desc.value = prodEditar.descripcion
  formEditar.precio.value = prodEditar.precio
}  //Enviar datos al back
  formEditar.addEventListener('submit', (event) => {
    event.preventDefault();
    //creo objeto con datos nuevos
    const nuevosDatos = {
      id: formEditar.idEditar.value,
      titulo: formEditar.titulo.value,
      descripcion: formEditar.desc.value,
      precio: formEditar.precio.value
    }
    //validacion de campos vacios
    if (!nuevosDatos.titulo || !nuevosDatos.descripcion|| !nuevosDatos.precio) {
    document.querySelector('#mensajeEditar').innerHTML = 'Complete todos los campos';
    return
    }
    document.querySelector('#mensajeEditar').innerHTML = ''
    // return

    let nuevosDatosJson = JSON.stringify(nuevosDatos)
    console.log(nuevosDatosJson)

    const enviarNuevosDatos = async() => {
      try{
        const enviarDatos = await fetch(endpoint + '/' + nuevosDatos.id, {
          method: 'put',
          headers: {
            'content-type': 'application/json'
          },
          body: nuevosDatosJson
        })
        const respuesta = await enviarDatos.json()
        mostrarMensaje(respuesta.mensaje)
      }
      catch(error){
        mostrarMensaje('Error al modificar datos')
      }
      setTimeout(() => {location.reload();}, 1000)
    }
    enviarNuevosDatos()
  })