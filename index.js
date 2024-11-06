//modulos
const express = require('express');
const db = require('./db/conexion') // requiere la funcion conexion, no es el archivo js
const fs = require('fs') //Permite trabajar con archivos (file system) incluida con node, no se instala
const cors = require('cors')
const app = express();
const port = 2006;

//Middleware
app.use(express.json())
app.use(express.static('./public')) //Ejecuta directamente el front al correr el servidor
app.use(cors())

app.get('/productos', (req, res) => {
   // res.send('Listado de productos')
   const sql = "SELECT * FROM productos"
   db.query(sql, (err, result) => {
    if(err){
        console.error('Error de lectura de productos')
        return;
    }
    console.log(result)
    res.json(result)
   })
})

app.get('/productos/:id', (req, res) => {
    //res.send('Buscar producto por ID')
    const datos = leerDatos();
    const prodEncontrado= datos.productos.find ((p) => p.id == req.params.id)
    if (!prodEncontrado) { // ! (no) o diferente
        return res.status(404).json(`No se encuentra el producto`)
    }
    res.json({
        mensaje: "producto encontrado",
        producto: prodEncontrado
    })
})
app.post('/productos', (req, res) => {
    //res.send('Guardando nuevo producto')
    console.log(Object.values(req.body))
    const values = Object.values(req.body)
    const sql = "INSERT INTO productos (titulo, imagen, descripcion, precio) values (?,?,?,?)"
    db.query(sql, values, (err, result) => {
        if(err){
            console.error("Error al guardar")
        }
        console.log(result)
        res.json({mensaje:"Producto agregado correctamente"})
    })
})


app.put('/productos/:id', (req, res) => {
    // res.send('Actualizar producto por id')
     console.log(req.body)
     console.log(req.params.id)
     const id= req.params.id;
    const nuevosDatos= req.body;
   

    const datos = leerDatos()
    const prodEncontrado=datos.productos.find((p)=>p.id ==req.params.id)
    //console.log(prodEncontrado)
    if (!prodEncontrado) {
        return res.status(404).json('No se encontró el producto')
    }
    datos.productos = datos.productos.map(p => p.id == req.params.id ? { ...p, ...nuevosDatos } : p)
    escribirDatos(datos)
    res.json({mensaje:'Producto actualizado correctamente'})
})

app.delete('/productos/:id', (req, res) => {
    // res.send('Eliminando Producto')
    const id=req.params.id;
    const sql = "DELETE FROM ptoductos WHERE id=?"
    db.query(sql, [id], (err, result) => {
        if(err){
            console.error("Error al eliminar")
        }
        console.log(result)
        res.json({mensaje:"Producto eliminado correctamente"})
    })
})

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`)
});