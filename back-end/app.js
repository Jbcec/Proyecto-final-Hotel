const express = require('express');
const db = require('./database');
const CONFIG = require('./config');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("APP FUNCANDO");
});

const clientesRouter = require('./routes/clientes');
app.use('/api/clientes', clientesRouter);

const habitacionesRouter = require('./routes/habitaciones');
app.use('/api/habitaciones', habitacionesRouter);

const reservasRouter = require('./routes/reservas');
app.use('/api/reservas', reservasRouter);

const insumosRouter = require('./routes/insumos');
app.use('/api/insumos', insumosRouter);

const pagosRouter = require('./routes/pagos');
app.use('/api/pagos', pagosRouter);

app.listen(CONFIG.SERVER_PORT, () => {
  console.log(`Servidor ON: http://localhost:${CONFIG.SERVER_PORT}`);
});
