CREATE TABLE IF NOT EXISTS PAGOS (
    pgo_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    pgo_rsv_ID INTEGER,
    pgo_monto REAL NOT NULL,
    pgo_metodo TEXT NOT NULL,
    pgo_fecha TEXT NOT NULL,
    FOREIGN KEY (pgo_rsv_ID) REFERENCES RESERVAS(rsv_ID)
);
