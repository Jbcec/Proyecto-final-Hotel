const express = require('express');
const router = express.Router();
const db = require('../database');

// Crear una nueva habitación (POST)
router.post('/', (req, res) => {
  const { numero, capacidad, precio, estado } = req.body;

  if (!numero || !capacidad || !precio || !estado) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const query = `INSERT INTO HABITACIONES (hbt_numero, hbt_capacidad, hbt_precio, hbt_estado) 
                   VALUES (?, ?, ?, ?)`;
  const params = [numero, capacidad, precio, estado];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ id: this.lastID, message: 'Habitación creada exitosamente' });
  });
});

// Obtener todas las habitaciones disponibles (GET)
router.get('/disponibilidad', (req, res) => {
  const { check_in, check_out } = req.query;

  if (!check_in || !check_out) res.status(500).json({ error: 'Es necesario proporcionar la fecha de checkin  y checkout' })

  const query_hbt = `
      SELECT 
        *
      FROM HABITACIONES hbt
      LEFT JOIN RESERVAS_HABITACIONES rh 
        ON rh.rsv_hbt_habitacion_ID = hbt.hbt_ID
      WHERE rh.rsv_hbt_reserva_ID IS NULL
      OR
      rh.rsv_hbt_reserva_ID NOT IN (
        SELECT rsv.rsv_ID 
          FROM RESERVAS rsv
          WHERE 
            (DATE(rsv.rsv_check_in) BETWEEN DATE(?) AND DATE(?))
            OR
            (DATE(rsv.rsv_check_out) BETWEEN DATE(?) AND DATE(?))
            OR
            (
              DATE(rsv.rsv_check_in) <= DATE(?)
              AND
              DATE(rsv.rsv_check_out) >= DATE(?)
            )
      )
      GROUP BY hbt.hbt_ID 
  `;

  const res_body = [];

  db.all(query_hbt, [check_in, check_out, check_in, check_out, check_in, check_out], (err, habitaciones) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    let index = 0;
    habitaciones.forEach(habitacion => {

      let habitacion_obj = {
        id: habitacion.hbt_ID,
        numero: habitacion.hbt_numero,
        capacidad: habitacion.hbt_capacidad,
        precio: habitacion.hbt_precio,
        estado: habitacion.hbt_estado,
        reserva: null,
      };

      res_body.push(habitacion_obj);

      index++;
      if (index == habitaciones.length) res.status(200).json(res_body);
    });
  });
});

// Obtener todas las habitaciones (GET)
router.get('/', (req, res) => {
  const query_hbt = `SELECT * FROM HABITACIONES`;
  const query_reservas = `
    SELECT *
    FROM RESERVAS_HABITACIONES rh
    LEFT JOIN RESERVAS rsv
      ON rsv.rsv_ID = rh.rsv_hbt_reserva_ID
    LEFT JOIN CLIENTES clt
      ON clt.clt_ID = rsv.rsv_clt_ID
    WHERE
      (
        rh.rsv_hbt_habitacion_ID = ?
      )
    AND
      (
        rsv.rsv_estado = 'OCUPANDO'
        OR DATE(rsv.rsv_check_in) >= DATE('now')
      )
    ORDER BY rsv.rsv_check_in ASC
  `;

  const res_body = [];

  db.all(query_hbt, [], (err, habitaciones) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    let index = 0;
    habitaciones.forEach(habitacion => {
      db.get(query_reservas, [habitacion.hbt_ID], (err, reserva) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        let habitacion_obj = {
          id: habitacion.hbt_ID,
          numero: habitacion.hbt_numero,
          capacidad: habitacion.hbt_capacidad,
          precio: habitacion.hbt_precio,
          estado: habitacion.hbt_estado,
          reserva: null,
        };

        if (reserva) {
          habitacion_obj.reserva = {
            id: reserva.rsv_ID,
            monto: reserva.rsv_monto,
            estado: reserva.rsv_estado,
            check_in: reserva.rsv_check_in,
            check_out: reserva.rsv_check_out,
            cliente: {
              id: reserva.clt_ID,
              nombre: reserva.clt_nombre,
              apellido: reserva.clt_apellido,
              dni: reserva.clt_dni,
              telefono: reserva.clt_telefono,
            }
          };
        }

        res_body.push(habitacion_obj);

        index++;
        if (index == habitaciones.length) res.status(200).json(res_body);

      });
    });
  });
});

// Obtener habitación por ID (GET)
router.get(['/:id', '/byNumber/:number'], (req, res) => {
  let query_habitacion = '';
  let id;

  if (req.params.id) {
    query_habitacion = `SELECT * FROM HABITACIONES WHERE hbt_ID = ?`;
    id = req.params.id;
  }
  else if (req.params.number) {
    query_habitacion = `SELECT * FROM HABITACIONES WHERE hbt_numero = ?`;
    id = req.params.number;
  }
  else {
    return res.status(500).json({ error: 'Se requiere pasar el id o el número de habitación.' });
  }

  const query_reservas = `
    SELECT *
    FROM RESERVAS_HABITACIONES rh
    LEFT JOIN RESERVAS rsv
      ON rsv.rsv_ID = rh.rsv_hbt_reserva_ID
    LEFT JOIN CLIENTES clt
      ON clt.clt_ID = rsv.rsv_clt_ID
    WHERE
      (
        rh.rsv_hbt_habitacion_ID = ?
      )
    AND
      (
        rsv.rsv_estado = 'OCUPANDO'
        OR DATE(rsv.rsv_check_in) >= DATE('now')
      )
    ORDER BY rsv.rsv_check_in ASC
  `;

  db.get(query_habitacion, [id], (err, habitacion) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!habitacion) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }

    db.all(query_reservas, [habitacion.hbt_ID], (err, reservas) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      let habitacion_obj = {
        id: habitacion.hbt_ID,
        numero: habitacion.hbt_numero,
        capacidad: habitacion.hbt_capacidad,
        precio: habitacion.hbt_precio,
        estado: habitacion.hbt_estado,
        reservas: [],
      };

      reservas.forEach((reserva) => {
        habitacion_obj.reservas.push({
          id: reserva.rsv_ID,
          monto: reserva.rsv_monto,
          estado: reserva.rsv_estado,
          check_in: reserva.rsv_check_in,
          check_out: reserva.rsv_check_out,
          cliente: {
            id: reserva.clt_ID,
            nombre: reserva.clt_nombre,
            apellido: reserva.clt_apellido,
            dni: reserva.clt_dni,
            telefono: reserva.clt_telefono,
          }
        });
      });

      res.status(200).json(habitacion_obj);
    });
  });
});

// Actualizar habitación por ID (PUT)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { numero, capacidad, precio, estado } = req.body;

  if (!numero || !capacidad || !precio || !estado) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const query = `UPDATE HABITACIONES SET hbt_numero = ?, hbt_capacidad = ?, hbt_precio = ?, hbt_estado = ? 
                   WHERE hbt_ID = ?`;
  const params = [numero, capacidad, precio, estado, id];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }
    res.status(200).json({ message: 'Habitación actualizada exitosamente' });
  });
});

// Actualizar parcial habitación por ID (PATCH)
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!updates || Object.keys(updates).length === 0) return res.status(404).json({ error: 'No se proporcionaron campos a modificar.' });

  let query = `UPDATE HABITACIONES SET`;
  let params = [];

  if (updates.numero) {
    query += ' hbt_numero = ? ';
    params.push(updates.numero);
  }
  if (updates.capacidad) {
    query += ' hbt_capacidad = ? ';
    params.push(updates.capacidad);
  }
  if (updates.precio) {
    query += ' hbt_precio = ? ';
    params.push(updates.precio);
  }
  if (updates.estado) {
    query += ' hbt_estado = ? ';
    params.push(updates.estado);
  }

  query += ' WHERE hbt_ID = ?';

  db.run(query, [...params, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }
    res.status(200).json({ message: 'Habitación actualizada exitosamente' });
  });
});

// Eliminar habitación por ID (DELETE)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM HABITACIONES WHERE hbt_ID = ?`;

  db.run(query, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }
    res.status(200).json({ message: 'Habitación eliminada exitosamente' });
  });
});

module.exports = router;

