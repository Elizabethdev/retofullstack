const express = require('express');

const conectarDB = require('./config/db')
const cors = require('cors');
//crear el servidor
const app = express();

//conectar la BD
conectarDB();

//habilitar cors
app.use(cors());

//habilitar express.json
app.use(express.json({extended: true}));

//puerto de la app
const PORT = process.env.PORT || 4000;

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/libros', require('./routes/libros'));

app.listen(PORT, () => {
  console.log(`el servidor esta funcionando en el puerto ${PORT}`);
})