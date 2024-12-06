const express = require('express');
const router = express.Router();
const db = require('../database');

// Crear un nuevo pago
router.post('/', (req, res) => {
  const { rsv_ID, monto, metodo, fecha } = req.body;

  const sql = `INSERT INTO PAGOS (pgo_rsv_ID, pgo_monto, pgo_metodo, pgo_fecha) VALUES (?, ?, ?, ?)`;
  const params = [rsv_ID, monto, metodo, fecha];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Error al insertar el pago:', err);
      res.status(500).json({ error: 'Error al insertar el pago' });
    } else {
      res.status(201).json({ id: this.lastID });
    }
  });
});

// Obtener todos los pagos
router.get('/', (req, res) => {
  const sql = `SELECT * FROM PAGOS`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error al obtener los pagos:', err);
      res.status(500).json({ error: 'Error al obtener los pagos' });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Obtener un pago por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const sql = `SELECT * FROM PAGOS WHERE pgo_ID = ?`;
  const params = [id];

  db.get(sql, params, (err, row) => {
    if (err) {
      console.error('Error al obtener el pago:', err);
      res.status(500).json({ error: 'Error al obtener el pago' });
    } else if (!row) {
      res.status(404).json({ error: 'Pago no encontrado' });
    } else {
      res.status(200).json(row);
    }
  });
});

// Actualizar un pago
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { rsv_ID, monto, metodo, fecha } = req.body;

  const sql = `UPDATE PAGOS SET pgo_rsv_ID = ?, pgo_monto = ?, pgo_metodo = ?, pgo_fecha = ? WHERE pgo_ID = ?`;
  const params = [rsv_ID, monto, metodo, fecha, id];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Error al actualizar el pago:', err);
      res.status(500).json({ error: 'Error al actualizar el pago' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Pago no encontrado' });
    } else {
      res.status(200).json({ message: 'Pago actualizado correctamente' });
    }
  });
});

// Eliminar un pago
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM PAGOS WHERE pgo_ID = ?`;
  const params = [id];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Error al eliminar el pago:', err);
      res.status(500).json({ error: 'Error al eliminar el pago' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Pago no encontrado' });
    } else {
      res.status(200).json({ message: 'Pago eliminado correctamente' });
    }
  });
});

module.exports = router;
