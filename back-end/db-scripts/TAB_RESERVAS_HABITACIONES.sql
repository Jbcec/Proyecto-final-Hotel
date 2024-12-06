CREATE TABLE IF NOT EXISTS RESERVAS_HABITACIONES (
    rsv_hbt_reserva_ID INTEGER,
    rsv_hbt_habitacion_ID INTEGER,
    PRIMARY KEY (rsv_hbt_reserva_ID, rsv_hbt_habitacion_ID),
    FOREIGN KEY (rsv_hbt_reserva_ID) REFERENCES RESERVAS(rsv_ID),
    FOREIGN KEY (rsv_hbt_habitacion_ID) REFERENCES HABITACIONES(hbt_ID)
);

