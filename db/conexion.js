const mysql = require('mysql2')
const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tienda"
})
conexion.connect((err) =>{
    if(err){
        console.error("Error de conexion")
        return;
    }
    console.log("Conectado exitosamente")
})
module.exports = conexion;