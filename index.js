//modulos
const express = require('express');
const env = require('dotenv/config')
const db = require('./db/conexion') // requiere la funcion conexion, no es el archivo js
const fs = require('fs') //Permite trabajar con archivos (file system) incluida con node, no se instala
const cors = require('cors')
const app = express();
const port = process.env.MYSQL_ADDON_PORT || 2006;

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

app.put('/productos', (req, res) => {
    // res.send('Actualizar producto por id')
    const valores = Object.values(req.body)
    console.log(valores)
    const sql = "UPDATE productos SET  titulo=?, imagen=?, descripcion=?, precio=? WHERE id=?"
    db.query(sql, valores, (err, result) => {
        if(err){
            console.error('Error al modificar el producto')
            return;
        }
        res.json({mensaje:'Producto actualizado correctamente', data: result})
    })
})
app.delete('/productos/:id', (req, res) => {
    // res.send('Eliminando Producto')
    const id=req.params.id;
    const sql = "DELETE FROM productos WHERE id=?"
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