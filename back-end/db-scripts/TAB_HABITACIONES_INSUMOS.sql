CREATE TABLE IF NOT EXISTS HABITACIONES_INSUMOS (
    hbt_ins_habitacion_ID INTEGER,
    hbt_ins_insumo_ID INTEGER,
    PRIMARY KEY (hbt_ins_habitacion_ID, hbt_ins_insumo_ID),
    FOREIGN KEY (hbt_ins_habitacion_ID) REFERENCES HABITACIONES(hbt_ID),
    FOREIGN KEY (hbt_ins_insumo_ID) REFERENCES INSUMOS(ins_ID)
);

