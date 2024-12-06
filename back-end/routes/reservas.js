const express = require('express');
const router = express.Router();
const db = require('../database');

// Crear una nueva reserva (POST)
router.post('/', (req, res) => {
  const { clt_ID, monto, estado, check_in, check_out } = req.body;

  if (!monto || !estado || !check_in || !check_out) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const query = `
        INSERT INTO RESERVAS (rsv_clt_ID, rsv_monto, rsv_estado, rsv_check_in, rsv_check_out) 
        VALUES (?, ?, ?, ?, ?)`;
  const params = [clt_ID, monto, estado, check_in, check_out];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: 'Reserva creada exitosamente' });
  });
});

// Obtener todas las reservas (GET)
router.get('/', (req, res) => {
  const query = `
    SELECT *
    FROM RESERVAS rsv
    LEFT JOIN CLIENTES clt
      ON clt.clt_ID = rsv.rsv_clt_ID 
    LEFT JOIN RESERVAS_HABITACIONES rh
      ON rh.rsv_hbt_reserva_ID = rsv.rsv_ID 
    LEFT JOIN HABITACIONES hbt
      ON hbt.hbt_ID = rh.rsv_hbt_habitacion_ID 
  `;

  const reservas_map = {};

  db.all(query, [], (err, reservas) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    reservas.forEach(reserva => {
      if (!reservas_map[reserva.rsv_ID]) {
        reservas_map[reserva.rsv_ID] = {
          rsv_ID: reserva.rsv_ID,
          rsv_monto: reserva.rsv_monto,
          rsv_estado: reserva.rsv_estado,
          rsv_check_in: reserva.rsv_check_in,
          rsv_check_out: reserva.rsv_check_out,
          cliente: {
            id: reserva.clt_ID,
            nombre: reserva.clt_nombre,
            apellido: reserva.clt_apellido,
            dni: reserva.clt_dni,
            telefono: reserva.clt_telefono,
          },
          habitaciones: [],
        }
      }

      if (!reservas_map[reserva.rsv_ID].habitaciones) reservas_map[reserva.rsv_ID].habitaciones = [];
      if (reserva.hbt_ID && reserva.hbt_numero) {
        reservas_map[reserva.rsv_ID].habitaciones.push({
          id: reserva.hbt_ID,
          numero: reserva.hbt_numero,
          capacidad: reserva.hbt_capacidad,
          precio: reserva.hbt_precio,
          estado: reserva.hbt_estado,
        });
      }

    });

    res.status(200).json(Object.values(reservas_map));
  });
});

// Obtener una reserva por ID (GET)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM RESERVAS WHERE rsv_ID = ?`;

  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.status(200).json(row);
  });
});

// Actualizar una reserva por ID (PUT)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { clt_ID, monto, estado, check_in, check_out } = req.body;

  if (!monto || !estado || !check_in || !check_out) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const query = `
        UPDATE RESERVAS SET 
            rsv_clt_ID = ?, 
            rsv_monto = ?, 
            rsv_estado = ?, 
            rsv_check_in = ?, 
            rsv_check_out = ? 
        WHERE rsv_ID = ?`;
  const params = [clt_ID, monto, estado, check_in, check_out, id];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.status(200).json({ message: 'Reserva actualizada exitosamente' });
  });
});

// Eliminar una reserva por ID (DELETE)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM RESERVAS WHERE rsv_ID = ?`;

  db.run(query, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.status(200).json({ message: 'Reserva eliminada exitosamente' });
  });
});

module.exports = router;

