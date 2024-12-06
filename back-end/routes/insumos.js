const express = require('express');
const router = express.Router();
const db = require('../database');

// Crear un nuevo insumo (POST)
router.post('/', (req, res) => {
  const { nombre, cantidad, fecha } = req.body;

  if (!nombre || !cantidad || !fecha) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const query = `
        INSERT INTO INSUMOS (ins_nombre, ins_cantidad, ins_fecha) 
        VALUES (?, ?, ?)`;
  const params = [nombre, cantidad, fecha];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: 'Insumo creado exitosamente' });
  });
});

// Obtener todos los insumos (GET)
router.get('/', (req, res) => {
  const query = `SELECT * FROM INSUMOS`;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
});

// Obtener un insumo por ID (GET)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM INSUMOS WHERE ins_ID = ?`;

  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Insumo no encontrado' });
    }
    res.status(200).json(row);
  });
});

// Actualizar un insumo por ID (PUT)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, cantidad, fecha } = req.body;

  if (!nombre || !cantidad || !fecha) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const query = `
        UPDATE INSUMOS SET 
            ins_nombre = ?, 
            ins_cantidad = ?, 
            ins_fecha = ? 
        WHERE ins_ID = ?`;
  const params = [nombre, cantidad, fecha, id];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Insumo no encontrado' });
    }
    res.status(200).json({ message: 'Insumo actualizado exitosamente' });
  });
});

// Eliminar un insumo por ID (DELETE)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM INSUMOS WHERE ins_ID = ?`;

  db.run(query, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Insumo no encontrado' });
    }
    res.status(200).json({ message: 'Insumo eliminado exitosamente' });
  });
});

module.exports = router;

