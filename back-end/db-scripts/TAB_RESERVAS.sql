CREATE TABLE IF NOT EXISTS RESERVAS (
    rsv_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    rsv_clt_ID INTEGER,
    rsv_monto REAL NOT NULL,
    rsv_estado TEXT NOT NULL,
    rsv_check_in TEXT NOT NULL,
    rsv_check_out TEXT NOT NULL,
    FOREIGN KEY (rsv_clt_ID) REFERENCES CLIENTES(clt_ID)
);

