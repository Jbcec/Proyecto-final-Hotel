const express = require('express');
const router = express.Router();
const db = require('../database');

// Alta: Crear un nuevo cliente
router.post('/', (req, res) => {
  const { nombre, apellido, dni, telefono } = req.body;

  if (!nombre || !apellido || !dni) {
    return res.status(400).json({ error: 'Nombre, apellido y DNI son requeridos' });
  }

  const query = `
        INSERT INTO CLIENTES (clt_nombre, clt_apellido, clt_dni, clt_telefono)
        VALUES (?, ?, ?, ?)
    `;
  const params = [nombre, apellido, dni, telefono];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: 'Cliente creado con éxito' });
  });
});

// Baja: Eliminar un cliente por ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM CLIENTES WHERE clt_ID = ?`;

  db.run(query, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado con éxito' });
  });
});

// Modificación: Actualizar los datos de un cliente
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, dni, telefono } = req.body;

  if (!nombre || !apellido || !dni) {
    return res.status(400).json({ error: 'Nombre, apellido y DNI son requeridos' });
  }

  const query = `
        UPDATE CLIENTES 
        SET clt_nombre = ?, clt_apellido = ?, clt_dni = ?, clt_telefono = ?
        WHERE clt_ID = ?
    `;
  const params = [nombre, apellido, dni, telefono, id];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente actualizado con éxito' });
  });
});

// Lectura: Obtener todos los clientes
router.get('/', (req, res) => {
  const query = `SELECT * FROM CLIENTES`;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Lectura: Obtener un cliente por ID
router.get('/search', (req, res) => {
  const { term } = req.query;

  let query = `
    SELECT * FROM CLIENTES
    WHERE clt_dni LIKE ?
    OR clt_nombre LIKE ?
    OR clt_apellido LIKE ?
  `;

  let params = [`%${term}%`, `%${term}%`, `%${term}%`];

  if (!term) {
    query = `SELECT * FROM CLIENTES`;
    params = [];
  }


  db.all(query, params, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(row);
  });
});

// Lectura: Obtener un cliente por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const query = `SELECT * FROM CLIENTES WHERE clt_ID = ?`;

  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(row);
  });
});

module.exports = router;
